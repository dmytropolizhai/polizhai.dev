import type { Env } from "../_lib/env.ts";
import {
  errorJson,
  getClientIp,
  isOriginAllowed,
  json,
  methodNotAllowed,
  readJsonBody,
} from "../_lib/http.ts";
import { checkRateLimit, type RateWindow } from "../_lib/ratelimit.ts";
import { formatLeadMessage, sendTelegramMessage } from "../_lib/telegram.ts";
import { verifyTurnstile } from "../_lib/turnstile.ts";
import { validateLeadBody } from "../_lib/validate.ts";

const LEAD_WINDOWS: readonly RateWindow[] = [{ name: "1h", limit: 3, windowSec: 3600 }];

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!isOriginAllowed(request, env)) {
    return errorJson("forbidden", 403);
  }

  const parsedBody = await readJsonBody(request, 32_768);
  if (!parsedBody.ok) {
    return errorJson(parsedBody.error, parsedBody.status);
  }

  const validated = validateLeadBody(parsedBody.data);
  if (!validated.ok) {
    return errorJson(validated.error, validated.status);
  }

  const ip = getClientIp(request);
  const turnstileOk = await verifyTurnstile(validated.data.turnstileToken, ip, env);
  if (!turnstileOk) {
    return errorJson("turnstile_failed", 403);
  }

  const rl = await checkRateLimit({
    env,
    ip,
    scope: "lead",
    windows: LEAD_WINDOWS,
  });
  if (!rl.allowed) {
    return errorJson("rate_limited", 429, {
      "Retry-After": String(rl.retryAfterSec),
    });
  }

  const text = formatLeadMessage({
    name: validated.data.name,
    contact: validated.data.contact,
    message: validated.data.message,
    transcript: validated.data.transcript,
    lang: validated.data.lang,
    provider: validated.data.provider,
  });

  const sent = await sendTelegramMessage(env, text);
  if (!sent) {
    return errorJson("unavailable", 503);
  }

  return json({ ok: true }, 200);
};

export const onRequest: PagesFunction<Env> = async () => {
  return methodNotAllowed(["POST"]);
};
