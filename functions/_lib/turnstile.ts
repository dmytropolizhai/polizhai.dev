import type { Env } from "./env.ts";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  ip: string,
  env: Env,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.error("[turnstile] missing TURNSTILE_SECRET_KEY");
    return false;
  }
  if (!token.trim()) {
    console.error("[turnstile] empty turnstile token");
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token.trim(),
    remoteip: ip,
  });

  try {
    const res = await fetchFn(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!res.ok) {
      console.error("[turnstile] siteverify HTTP error:", res.status);
      return false;
    }
    const data = (await res.json()) as { success?: unknown; "error-codes"?: unknown };
    if (data?.success !== true) {
      console.error("[turnstile] siteverify failed:", Array.isArray(data?.["error-codes"]) ? data["error-codes"].join(",") : "unknown");
      return false;
    }
    return true;
  } catch (err) {
    console.error("[turnstile] siteverify error:", err instanceof Error ? err.message : "unknown");
    return false;
  }
}
