import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml, formatLeadMessage } from "../_lib/telegram.ts";

test("escapeHtml escapes HTML special characters", () => {
  assert.equal(
    escapeHtml(`<b>Hi</b> & <a href="x">click</a>`),
    `&lt;b&gt;Hi&lt;/b&gt; &amp; &lt;a href=&quot;x&quot;&gt;click&lt;/a&gt;`,
  );
});

test("formatLeadMessage escapes all user fields and formats Russian template", () => {
  const text = formatLeadMessage({
    name: `<b>Evil</b>`,
    contact: `<a href="https://evil.com">@user</a>`,
    message: `Need <script>alert(1)</script>`,
    transcript: [
      { role: "user", content: "What do you do?" },
      { role: "assistant", content: "Dmytro builds web apps." },
    ],
    lang: "ru",
    provider: "groq",
    now: new Date("2026-11-13T12:02:00Z"),
  });

  assert.equal(text.includes("🆕 <b>Заявка с polizhai.dev</b>"), true);
  assert.equal(text.includes("&lt;b&gt;Evil&lt;/b&gt;"), true);
  assert.equal(text.includes("&lt;a href=&quot;https://evil.com&quot;&gt;@user&lt;/a&gt;"), true);
  assert.equal(text.includes("&lt;script&gt;alert(1)&lt;/script&gt;"), true);
  assert.equal(text.includes("— переписка (последние 2 реплик) —"), true);
  assert.equal(text.includes("Язык: ru · Модель: groq · 2026-11-13 14:02 EET"), true);
});

test("formatLeadMessage trims oldest transcript turns to stay <= 4096 chars", () => {
  const transcript = Array.from({ length: 6 }, (_, i) => ({
    role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
    content: `Turn ${i}: ` + "a".repeat(800),
  }));
  const text = formatLeadMessage({
    name: "Test",
    contact: "test@example.com",
    message: "Please contact me",
    transcript,
    lang: "en",
    provider: "groq",
  });

  assert.equal(text.length <= 4096, true);
  assert.equal(text.includes("Turn 0:"), false);
  assert.equal(text.includes("Turn 5:"), true);
});
