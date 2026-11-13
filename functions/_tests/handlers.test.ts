import assert from "node:assert/strict";
import test from "node:test";
import type { Env } from "../_lib/env.ts";
import { resetMemoryRateLimits } from "../_lib/ratelimit.ts";
import { onRequestPost as chatPost } from "../api/chat.ts";
import { onRequestPost as leadPost } from "../api/lead.ts";

function makeContext(request: Request, env: Env) {
  const waitUntilPromises: Promise<unknown>[] = [];
  return {
    request,
    env,
    params: {},
    waitUntil(p: Promise<unknown>) {
      waitUntilPromises.push(p);
    },
    passThroughOnException() {},
    next: async () => new Response(),
    data: {},
    _waitUntilPromises: waitUntilPromises,
  } as unknown as EventContext<Env, string, Record<string, unknown>> & {
    _waitUntilPromises: Promise<unknown>[];
  };
}

test("chat handler: origin, turnstile, session cookie reuse, too_long, streaming, rate limit", async () => {
  resetMemoryRateLimits();
  const originalFetch = globalThis.fetch;
  const enc = new TextEncoder();

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.includes("turnstile/v0/siteverify")) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    if (url.includes("chat/completions")) {
      const stream = new ReadableStream({
        start(c) {
          c.enqueue(enc.encode(`data: {"choices":[{"delta":{"content":"Hi from Groq"}}]}\n\n`));
          c.enqueue(enc.encode(`data: [DONE]\n\n`));
          c.close();
        },
      });
      return new Response(stream, { status: 200 });
    }
    return new Response("not found", { status: 404 });
  }) as typeof fetch;

  try {
    const env: Env = {
      GROQ_API_KEY: "k",
      TURNSTILE_SECRET_KEY: "t",
      SESSION_SECRET: "sess-secret",
    };

    // 1. Bad origin -> 403
    const badOriginReq = new Request("http://localhost:8788/api/chat", {
      method: "POST",
      headers: { Origin: "https://evil.example", "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    });
    const res403 = await chatPost(makeContext(badOriginReq, env));
    assert.equal(res403.status, 403);

    // 2. Missing turnstile & no cookie -> 401
    const noTokReq = new Request("http://localhost:8788/api/chat", {
      method: "POST",
      headers: { Origin: "http://localhost:8788", "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    });
    const res401 = await chatPost(makeContext(noTokReq, env));
    assert.equal(res401.status, 401);
    assert.deepEqual(await res401.json(), { error: "turnstile_required" });

    // 3. Valid turnstile -> 200 stream + Set-Cookie + X-Assistant-Provider
    const okReq = new Request("http://localhost:8788/api/chat", {
      method: "POST",
      headers: { Origin: "http://localhost:8788", "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "hi" }],
        turnstileToken: "valid-tok",
      }),
    });
    const res200 = await chatPost(makeContext(okReq, env));
    assert.equal(res200.status, 200);
    assert.equal(res200.headers.get("X-Assistant-Provider"), "groq");
    const setCookie = res200.headers.get("Set-Cookie");
    assert.ok(setCookie && setCookie.startsWith("pa_sess="));
    assert.equal(await res200.text(), "Hi from Groq");

    // 4. Reuse cookie without turnstileToken -> 200
    const cookieVal = setCookie.split(";")[0]!;
    const reuseReq = new Request("http://localhost:8788/api/chat", {
      method: "POST",
      headers: {
        Origin: "http://localhost:8788",
        "Content-Type": "application/json",
        Cookie: cookieVal,
      },
      body: JSON.stringify({ messages: [{ role: "user", content: "follow up" }] }),
    });
    const resReuse = await chatPost(makeContext(reuseReq, env));
    assert.equal(resReuse.status, 200);
    assert.equal(await resReuse.text(), "Hi from Groq");

    // 5. Too long -> 400
    const longReq = new Request("http://localhost:8788/api/chat", {
      method: "POST",
      headers: {
        Origin: "http://localhost:8788",
        "Content-Type": "application/json",
        Cookie: cookieVal,
      },
      body: JSON.stringify({ messages: [{ role: "user", content: "a".repeat(1001) }] }),
    });
    const res400 = await chatPost(makeContext(longReq, env));
    assert.equal(res400.status, 400);
    assert.deepEqual(await res400.json(), { error: "too_long" });

    // 6. Rate limit after 20 requests in 10 min -> 429
    for (let i = 0; i < 18; i++) {
      const r = await chatPost(
        makeContext(
          new Request("http://localhost:8788/api/chat", {
            method: "POST",
            headers: {
              Origin: "http://localhost:8788",
              "Content-Type": "application/json",
              Cookie: cookieVal,
            },
            body: JSON.stringify({ messages: [{ role: "user", content: "ping" }] }),
          }),
          env,
        ),
      );
      assert.equal(r.status, 200);
      await r.text();
    }
    const res429 = await chatPost(
      makeContext(
        new Request("http://localhost:8788/api/chat", {
          method: "POST",
          headers: {
            Origin: "http://localhost:8788",
            "Content-Type": "application/json",
            Cookie: cookieVal,
          },
          body: JSON.stringify({ messages: [{ role: "user", content: "21st" }] }),
        }),
        env,
      ),
    );
    assert.equal(res429.status, 429);
    assert.ok(res429.headers.get("Retry-After"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("lead handler: contact_invalid, escaped HTML sent to Telegram, Telegram failure -> 503", async () => {
  resetMemoryRateLimits();
  const originalFetch = globalThis.fetch;
  const captured: { telegramBody: { text?: string } | null } = { telegramBody: null };
  let telegramFail = false;

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.includes("turnstile/v0/siteverify")) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    if (url.includes("sendMessage")) {
      captured.telegramBody = JSON.parse(String(init?.body ?? "{}")) as { text?: string };
      if (telegramFail) {
        return new Response("bad gateway", { status: 502 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  }) as typeof fetch;

  try {
    const env: Env = {
      TURNSTILE_SECRET_KEY: "t",
      TELEGRAM_BOT_TOKEN: "bot-tok",
      TELEGRAM_CHAT_ID: "123",
      SESSION_SECRET: "s",
    };

    const badReq = new Request("http://localhost:8788/api/lead", {
      method: "POST",
      headers: { Origin: "http://localhost:8788", "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: "invalid",
        message: "hi",
        turnstileToken: "tok",
      }),
    });
    const res400 = await leadPost(makeContext(badReq, env));
    assert.equal(res400.status, 400);
    assert.deepEqual(await res400.json(), { error: "contact_invalid" });

    const okReq = new Request("http://localhost:8788/api/lead", {
      method: "POST",
      headers: { Origin: "http://localhost:8788", "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "<b>x</b>",
        contact: "user@example.com",
        message: "Need a website",
        transcript: [{ role: "user", content: "Hello" }],
        lang: "en",
        provider: "groq",
        turnstileToken: "tok",
      }),
    });
    const res200 = await leadPost(makeContext(okReq, env));
    assert.equal(res200.status, 200);
    assert.ok(captured.telegramBody?.text?.includes("&lt;b&gt;x&lt;/b&gt;"));

    telegramFail = true;
    const failReq = new Request("http://localhost:8788/api/lead", {
      method: "POST",
      headers: { Origin: "http://localhost:8788", "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: "user@example.com",
        message: "Need a website",
        turnstileToken: "tok",
      }),
    });
    const res503 = await leadPost(makeContext(failReq, env));
    assert.equal(res503.status, 503);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
