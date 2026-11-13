import type { Env } from "./env.ts";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  ip: string,
  env: Env,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret || !token.trim()) {
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
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: unknown };
    return data?.success === true;
  } catch (err) {
    console.error("[turnstile] siteverify error:", err instanceof Error ? err.message : "unknown");
    return false;
  }
}
