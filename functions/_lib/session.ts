export const SESSION_COOKIE_NAME = "pa_sess";
export const SESSION_TTL_SECONDS = 1800; // 30 minutes

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(str)) return null;
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export function parseCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    if (key === name) {
      return part.slice(eq + 1).trim();
    }
  }
  return null;
}

export async function createSessionToken(
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
): Promise<string> {
  const payloadBytes = encoder.encode(JSON.stringify({ exp: nowSec + SESSION_TTL_SECONDS }));
  const payload = toBase64Url(payloadBytes);
  const key = await importHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sig = toBase64Url(new Uint8Array(sigBuffer));
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
): Promise<boolean> {
  if (!secret || !token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return false;

  const payload = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  const sigBytes = fromBase64Url(sigB64);
  if (!sigBytes) return false;

  try {
    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as BufferSource,
      encoder.encode(payload),
    );
    if (!valid) return false;

    const payloadBytes = fromBase64Url(payload);
    if (!payloadBytes) return false;
    const parsed = JSON.parse(decoder.decode(payloadBytes)) as { exp?: unknown };
    return typeof parsed.exp === "number" && parsed.exp > nowSec;
  } catch {
    return false;
  }
}

export function buildSessionCookieHeader(token: string, request: Request): string {
  const isHttps = new URL(request.url).protocol === "https:";
  const securePart = isHttps ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly${securePart}; SameSite=Strict; Path=/api; Max-Age=${SESSION_TTL_SECONDS}`;
}
