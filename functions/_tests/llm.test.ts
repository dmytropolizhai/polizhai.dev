import assert from "node:assert/strict";
import test from "node:test";
import type { Env } from "../_lib/env.ts";
import { createNormalizedSseStream, streamChat } from "../_lib/llm.ts";

function streamFromChunks(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const c of chunks) controller.enqueue(c);
      controller.close();
    },
  });
}

async function readStreamText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const dec = new TextDecoder();
  let out = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    out += dec.decode(value, { stream: true });
  }
  out += dec.decode();
  return out;
}

test("createNormalizedSseStream handles split lines, split UTF-8 Cyrillic, reasoning, and [DONE]", async () => {
  const enc = new TextEncoder();
  const fullSse = [
    `data: {"choices":[{"delta":{"reasoning":"thinking..."}}]}\n\n`,
    `data: {"choices":[{"delta":{"content":"Привет"}}]}\n\n`,
    `data: {"choices":[{"delta":{"content":" мир"}}]}\n\n`,
    `data: [DONE]\n\n`,
    `data: {"choices":[{"delta":{"content":"ignored"}}]}\n\n`,
  ].join("");

  const bytes = enc.encode(fullSse);
  // Split right inside multi-byte Cyrillic character
  const splitAt = fullSse.indexOf("Привет") + 1;
  const part1 = bytes.slice(0, splitAt);
  const part2 = bytes.slice(splitAt, splitAt + 15);
  const part3 = bytes.slice(splitAt + 15);

  const normalized = createNormalizedSseStream(streamFromChunks([part1, part2, part3]));
  const text = await readStreamText(normalized);
  assert.equal(text, "Привет мир");
});

test("createNormalizedSseStream handles Workers AI classic {response} shape", async () => {
  const enc = new TextEncoder();
  const sse = `data: {"response":"Hello "}\n\ndata: {"response":"world"}\n\ndata: [DONE]\n\n`;
  const normalized = createNormalizedSseStream(streamFromChunks([enc.encode(sse)]));
  assert.equal(await readStreamText(normalized), "Hello world");
});

test("streamChat falls back to Workers AI when Groq returns 429 or key missing", async () => {
  const enc = new TextEncoder();
  let aiCalled = 0;

  const env: Env = {
    GROQ_API_KEY: "test-key",
    AI_GATEWAY_ID: "gw-1",
    AI: {
      async run() {
        aiCalled++;
        return streamFromChunks([enc.encode(`data: {"response":"Fallback OK"}\n\ndata: [DONE]\n\n`)]);
      },
    } as unknown as Ai,
  };

  const fetch429 = (async () => new Response("rate limit", { status: 429 })) as unknown as typeof fetch;
  const res = await streamChat(env, "sys", [{ role: "user", content: "hi" }], {
    fetchFn: fetch429,
  });

  assert.equal(res.provider, "workers-ai");
  assert.equal(aiCalled, 1);
  assert.equal(await readStreamText(res.stream), "Fallback OK");
});

test("streamChat throws when both Groq and Workers AI are unavailable", async () => {
  const env: Env = {};
  await assert.rejects(
    () => streamChat(env, "sys", [{ role: "user", content: "hi" }]),
    /All LLM providers unavailable/,
  );
});
