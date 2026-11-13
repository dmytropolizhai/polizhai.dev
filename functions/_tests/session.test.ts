import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSessionCookieHeader,
  createSessionToken,
  parseCookie,
  SESSION_TTL_SECONDS,
  verifySessionToken,
} from "../_lib/session.ts";

test("session token sign, verify, expiry, and tamper detection", async () => {
  const secret = "super-secret-key-for-tests";
  const now = 1_700_000_000;
  const token = await createSessionToken(secret, now);

  assert.equal(await verifySessionToken(token, secret, now + 10), true);
  assert.equal(await verifySessionToken(token, secret, now + SESSION_TTL_SECONDS + 1), false);
  assert.equal(await verifySessionToken(token, "wrong-secret", now + 10), false);

  const tampered = token.slice(0, -2) + (token.endsWith("AA") ? "BB" : "AA");
  assert.equal(await verifySessionToken(tampered, secret, now + 10), false);
});

test("parseCookie and buildSessionCookieHeader", () => {
  const req = new Request("https://polizhai.dev/api/chat", {
    headers: { Cookie: "other=1; pa_sess=abc.def; x=2" },
  });
  assert.equal(parseCookie(req, "pa_sess"), "abc.def");
  assert.equal(parseCookie(req, "missing"), null);

  const httpsCookie = buildSessionCookieHeader("tok", req);
  assert.equal(httpsCookie.includes("HttpOnly; Secure; SameSite=Strict; Path=/api"), true);

  const httpReq = new Request("http://localhost:8788/api/chat");
  const httpCookie = buildSessionCookieHeader("tok", httpReq);
  assert.equal(httpCookie.includes("; Secure"), false);
});
