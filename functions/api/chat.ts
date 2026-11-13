import { knowledge } from "../_generated/knowledge.ts";
import type { Env } from "../_lib/env.ts";
import {
  errorJson,
  getClientIp,
  isOriginAllowed,
  methodNotAllowed,
  readJsonBody,
} from "../_lib/http.ts";
import { streamChat } from "../_lib/llm.ts";
import { buildSystemPrompt, NO_ANSWER_MARKER } from "../_lib/prompt.ts";
import { checkRateLimit, type RateWindow } from "../_lib/ratelimit.ts";
import {
  buildSessionCookieHeader,
  createSessionToken,
  parseCookie,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "../_lib/session.ts";
import { escapeHtml, sendTelegramMessage } from "../_lib/telegram.ts";
import { verifyTurnstile } from "../_lib/turnstile.ts";
import { validateChatBody } from "../_lib/validate.ts";

const CHAT_WINDOWS: readonly RateWindow[] = [
  { name: "10m", limit: 20, windowSec: 600 },
  { name: "1d", limit: 60, windowSec: 86_400 },
];

async function inspectForUnansweredPing(
  branch: ReadableStream<Uint8Array>,
  question: string,
  env: Env,
): Promise<void> {
  try {
    const reader = branch.getReader();
    const decoder = new TextDecoder();
    let text = "";
    while (text.length < 8192) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    await reader.cancel();

    if (text.trimEnd().endsWith(NO_ANSWER_MARKER)) {
      const msg = `❓ <b>Вопрос без ответа на polizhai.dev</b>\n${escapeHtml(question.slice(0, 500))}`;
      await sendTelegramMessage(env, msg);
    }
  } catch (err) {
    console.warn(
      "[chat] unanswered inspect failed:",
      err instanceof Error ? err.message : "unknown",
    );
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!isOriginAllowed(request, env)) {
    return errorJson("forbidden", 403);
  }

  const parsedBody = await readJsonBody(request, 32_768);
  if (!parsedBody.ok) {
    return errorJson(parsedBody.error, parsedBody.status);
  }

  const validated = validateChatBody(parsedBody.data);
  if (!validated.ok) {
    return errorJson(validated.error, validated.status);
  }

  const ip = getClientIp(request);
  const sessionSecret = env.SESSION_SECRET?.trim() ?? "";
  const cookieToken = parseCookie(request, SESSION_COOKIE_NAME);
  const hasValidSession =
    cookieToken && sessionSecret ? await verifySessionToken(cookieToken, sessionSecret) : false;

  let setCookieHeader: string | undefined;
  if (!hasValidSession) {
    const turnstileToken = validated.data.turnstileToken;
    if (!turnstileToken) {
      return errorJson("turnstile_required", 401);
    }
    const ok = await verifyTurnstile(turnstileToken, ip, env);
    if (!ok) {
      return errorJson("turnstile_failed", 403);
    }
    if (sessionSecret) {
      const newToken = await createSessionToken(sessionSecret);
      setCookieHeader = buildSessionCookieHeader(newToken, request);
    }
  }

  const rl = await checkRateLimit({
    env,
    ip,
    scope: "chat",
    windows: CHAT_WINDOWS,
  });
  if (!rl.allowed) {
    return errorJson("rate_limited", 429, {
      "Retry-After": String(rl.retryAfterSec),
    });
  }

  const system = buildSystemPrompt(knowledge);

  let stream: ReadableStream<Uint8Array>;
  let provider: "groq" | "workers-ai";
  try {
    const result = await streamChat(env, system, validated.data.messages);
    stream = result.stream;
    provider = result.provider;
  } catch (err) {
    console.error("[chat] LLM unavailable:", err instanceof Error ? err.message : "unknown");
    return errorJson("unavailable", 503);
  }

  if (env.NOTIFY_UNANSWERED === "on") {
    const [clientStream, inspectStream] = stream.tee();
    stream = clientStream;
    const lastUserMessage = validated.data.messages[validated.data.messages.length - 1]?.content ?? "";
    context.waitUntil(inspectForUnansweredPing(inspectStream, lastUserMessage, env));
  }

  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "X-Assistant-Provider": provider,
    "Cache-Control": "no-store",
  });
  if (setCookieHeader) {
    headers.set("Set-Cookie", setCookieHeader);
  }

  return new Response(stream, { status: 200, headers });
};

export const onRequest: PagesFunction<Env> = async () => {
  return methodNotAllowed(["POST"]);
};
