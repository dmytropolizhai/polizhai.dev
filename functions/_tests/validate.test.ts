import assert from "node:assert/strict";
import test from "node:test";
import { isValidContact, validateChatBody, validateLeadBody } from "../_lib/validate.ts";

test("validateChatBody accepts valid payload and defaults locale", () => {
  const res = validateChatBody({
    messages: [{ role: "user", content: "  Hello  " }],
    turnstileToken: "tok",
  });
  assert.equal(res.ok, true);
  if (res.ok) {
    assert.equal(res.data.messages[0]?.content, "Hello");
    assert.equal(res.data.locale, "en");
  }
});

test("validateChatBody rejects > 10 messages, > 1000 chars, or assistant last message", () => {
  const tooMany = Array.from({ length: 11 }, () => ({ role: "user", content: "hi" }));
  assert.deepEqual(validateChatBody({ messages: tooMany }), {
    ok: false,
    status: 400,
    error: "too_long",
  });

  assert.deepEqual(
    validateChatBody({ messages: [{ role: "user", content: "x".repeat(1001) }] }),
    { ok: false, status: 400, error: "too_long" },
  );

  assert.deepEqual(
    validateChatBody({ messages: [{ role: "assistant", content: "hi" }] }),
    { ok: false, status: 400, error: "bad_request" },
  );

  assert.deepEqual(
    validateChatBody({ messages: [{ role: "system", content: "hi" }] }),
    { ok: false, status: 400, error: "bad_request" },
  );
});

test("isValidContact validates email, telegram, and phone", () => {
  assert.equal(isValidContact("user@example.com"), true);
  assert.equal(isValidContact("@dmytro_dev"), true);
  assert.equal(isValidContact("https://t.me/dmytro_dev"), true);
  assert.equal(isValidContact("+371 2000 0000"), true);
  assert.equal(isValidContact("not a contact!"), false);
  assert.equal(isValidContact("123"), false);
});

test("validateLeadBody requires turnstileToken and valid contact", () => {
  const badContact = validateLeadBody({
    contact: "bad",
    message: "Hello",
    turnstileToken: "tok",
  });
  assert.deepEqual(badContact, { ok: false, status: 400, error: "contact_invalid" });

  const noTok = validateLeadBody({
    contact: "a@b.lv",
    message: "Hello",
  });
  assert.deepEqual(noTok, { ok: false, status: 401, error: "turnstile_required" });

  const ok = validateLeadBody({
    name: "Anna",
    contact: "a@b.lv",
    message: "Need a site",
    transcript: [{ role: "user", content: "Hi" }],
    lang: "ru",
    provider: "groq",
    turnstileToken: "tok",
  });
  assert.equal(ok.ok, true);
});
