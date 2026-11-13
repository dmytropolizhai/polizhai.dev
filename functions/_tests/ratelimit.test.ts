import assert from "node:assert/strict";
import test from "node:test";
import type { Env } from "../_lib/env.ts";
import { checkRateLimit, resetMemoryRateLimits } from "../_lib/ratelimit.ts";

test("checkRateLimit enforces window limits in memory", async () => {
  resetMemoryRateLimits();
  const env: Env = { SESSION_SECRET: "s" };
  const windows = [{ name: "10m", limit: 2, windowSec: 600 }];

  const r1 = await checkRateLimit({ env, ip: "1.2.3.4", scope: "chat", windows, nowMs: 600_000 });
  const r2 = await checkRateLimit({ env, ip: "1.2.3.4", scope: "chat", windows, nowMs: 600_500 });
  const r3 = await checkRateLimit({ env, ip: "1.2.3.4", scope: "chat", windows, nowMs: 601_000 });

  assert.equal(r1.allowed, true);
  assert.equal(r2.allowed, true);
  assert.equal(r3.allowed, false);
  if (!r3.allowed) {
    assert.ok(r3.retryAfterSec > 0 && r3.retryAfterSec <= 600);
  }
});

test("checkRateLimit uses KV when available and degrades gracefully if KV throws", async () => {
  resetMemoryRateLimits();
  const kvStore = new Map<string, string>();
  const fakeKv = {
    async get(k: string) {
      return kvStore.get(k) ?? null;
    },
    async put(k: string, v: string) {
      kvStore.set(k, v);
    },
  } as unknown as KVNamespace;

  const env: Env = { SESSION_SECRET: "s", RATE_KV: fakeKv };
  const windows = [{ name: "1h", limit: 1, windowSec: 3600 }];

  const ok = await checkRateLimit({ env, ip: "5.6.7.8", scope: "lead", windows, nowMs: 1_000_000 });
  assert.equal(ok.allowed, true);
  assert.equal(kvStore.size, 1);

  const throwingKv = {
    async get() {
      throw new Error("KV quota exceeded");
    },
    async put() {
      throw new Error("KV quota exceeded");
    },
  } as unknown as KVNamespace;

  const envBrokenKv: Env = { SESSION_SECRET: "s", RATE_KV: throwingKv };
  const ok2 = await checkRateLimit({
    env: envBrokenKv,
    ip: "9.9.9.9",
    scope: "lead",
    windows,
    nowMs: 1_000_000,
  });
  assert.equal(ok2.allowed, true);
});
