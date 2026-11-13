import type { Env } from "./env.ts";

export type RateWindow = {
  name: string;
  limit: number;
  windowSec: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

const memoryStore = new Map<string, { count: number; expiresAtMs: number }>();

export function resetMemoryRateLimits() {
  memoryStore.clear();
}

function pruneMemory(nowMs: number) {
  if (memoryStore.size <= 2000) return;
  for (const [k, v] of memoryStore.entries()) {
    if (v.expiresAtMs <= nowMs) memoryStore.delete(k);
  }
}

async function hashIp(ip: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${ip}:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let hex = "";
  for (let i = 0; i < 8; i++) {
    hex += bytes[i]!.toString(16).padStart(2, "0");
  }
  return hex;
}

export async function checkRateLimit(opts: {
  env: Env;
  ip: string;
  scope: "chat" | "lead";
  windows: readonly RateWindow[];
  nowMs?: number;
}): Promise<RateLimitResult> {
  const nowMs = opts.nowMs ?? Date.now();
  const nowSec = Math.floor(nowMs / 1000);
  pruneMemory(nowMs);

  const ipHash = await hashIp(opts.ip, opts.env.SESSION_SECRET ?? "default-salt");

  for (const w of opts.windows) {
    const windowIndex = Math.floor(nowSec / w.windowSec);
    const key = `rl:${opts.scope}:${w.name}:${ipHash}:${windowIndex}`;
    const windowEndSec = (windowIndex + 1) * w.windowSec;
    const retryAfterSec = Math.max(1, windowEndSec - nowSec);

    const existingMem = memoryStore.get(key);
    const memCount = existingMem && existingMem.expiresAtMs > nowMs ? existingMem.count : 0;

    let kvCount = 0;
    if (opts.env.RATE_KV) {
      try {
        const raw = await opts.env.RATE_KV.get(key);
        if (raw) {
          const n = Number(raw);
          if (Number.isFinite(n) && n > 0) kvCount = n;
        }
      } catch (err) {
        console.warn("[ratelimit] KV get failed, using memory:", err instanceof Error ? err.message : "unknown");
      }
    }

    const current = Math.max(memCount, kvCount);
    if (current >= w.limit) {
      return { allowed: false, retryAfterSec };
    }
  }

  // Increment all windows after all passed
  for (const w of opts.windows) {
    const windowIndex = Math.floor(nowSec / w.windowSec);
    const key = `rl:${opts.scope}:${w.name}:${ipHash}:${windowIndex}`;
    const windowEndMs = (windowIndex + 1) * w.windowSec * 1000;

    const existingMem = memoryStore.get(key);
    const memCount = existingMem && existingMem.expiresAtMs > nowMs ? existingMem.count : 0;
    const nextCount = memCount + 1;
    memoryStore.set(key, { count: nextCount, expiresAtMs: windowEndMs });

    if (opts.env.RATE_KV) {
      try {
        await opts.env.RATE_KV.put(key, String(nextCount), {
          expirationTtl: w.windowSec + 60,
        });
      } catch (err) {
        console.warn("[ratelimit] KV put failed, using memory:", err instanceof Error ? err.message : "unknown");
      }
    }
  }

  return { allowed: true };
}
