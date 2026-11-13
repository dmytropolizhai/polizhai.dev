import type { Env } from "./env.ts";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://polizhai.dev",
  "https://www.polizhai.dev",
  "http://localhost:8788",
  "http://127.0.0.1:8788",
];

function matchOriginPattern(origin: string, pattern: string): boolean {
  if (!pattern.includes("*")) {
    return origin === pattern;
  }
  // Support patterns like https://*.example.pages.dev
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^./]+");
  return new RegExp(`^${escaped}$`).test(origin);
}

export function isOriginAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return false;

  const extra = (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const allowed = [...DEFAULT_ALLOWED_ORIGINS, ...extra];
  return allowed.some((pattern) => matchOriginPattern(origin, pattern));
}

export function getClientIp(request: Request): string {
  const cfIp = request.headers.get("CF-Connecting-IP")?.trim();
  if (cfIp) return cfIp;
  const forwarded = request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return "127.0.0.1";
}

export function json(data: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(data), { status, headers });
}

export function errorJson(code: string, status: number, extraHeaders?: HeadersInit): Response {
  return json({ error: code }, status, extraHeaders);
}

export function methodNotAllowed(allowed: readonly string[] = ["POST"]): Response {
  return errorJson("method_not_allowed", 405, { Allow: allowed.join(", ") });
}

export async function readJsonBody(
  request: Request,
  maxBytes = 32_768,
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  const contentLength = request.headers.get("Content-Length");
  if (contentLength) {
    const len = Number(contentLength);
    if (Number.isFinite(len) && len > maxBytes) {
      return { ok: false, status: 400, error: "too_long" };
    }
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return { ok: false, status: 400, error: "bad_request" };
  }

  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return { ok: false, status: 400, error: "too_long" };
  }

  try {
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400, error: "bad_request" };
  }
}
