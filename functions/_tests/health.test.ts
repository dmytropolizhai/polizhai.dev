import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet } from "../api/health";

test("GET /api/health returns ok:true with no-store cache", async () => {
  const response = await onRequestGet({} as any);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("Content-Type"), "application/json");

  const body = (await response.json()) as { ok: boolean };
  assert.deepEqual(body, { ok: true });
});
