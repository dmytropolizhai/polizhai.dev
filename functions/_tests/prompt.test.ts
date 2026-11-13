import test from "node:test";
import assert from "node:assert/strict";
import { buildSystemPrompt, NO_ANSWER_MARKER } from "../_lib/prompt";

test("prompt exports correct NO_ANSWER_MARKER", () => {
  assert.equal(NO_ANSWER_MARKER, "[[NO_ANSWER]]");
});

test("buildSystemPrompt is deterministic", () => {
  const knowledge = "Sample knowledge block for determinism test.";
  const prompt1 = buildSystemPrompt(knowledge);
  const prompt2 = buildSystemPrompt(knowledge);
  assert.equal(prompt1, prompt2);
});

test("prompt includes knowledge block and delimitation", () => {
  const customKnowledge = "SPECIFIC_KNOWLEDGE_UNIQUE_STRING_778899";
  const prompt = buildSystemPrompt(customKnowledge);

  assert.ok(prompt.includes(customKnowledge), "must include the provided knowledge verbatim");
  assert.ok(prompt.includes("<knowledge>"), "must have opening <knowledge> tag");
  assert.ok(prompt.includes("</knowledge>"), "must have closing </knowledge> tag");
  assert.ok(
    prompt.includes("data") && prompt.includes("instructions"),
    "must declare knowledge as data and not instructions"
  );
});

test("prompt encodes identity as AI assistant and third-person reference", () => {
  const prompt = buildSystemPrompt("");
  assert.ok(prompt.includes("AI assistant"), "must state it is an AI assistant");
  assert.ok(prompt.includes("polizhai.dev"), "must reference polizhai.dev");
  assert.ok(prompt.includes("never Dmytro") || prompt.includes("never claims to be Dmytro"), "must not claim to be Dmytro");
  assert.ok(prompt.includes("third person"), "must mandate third person reference to Dmytro");
});

test("prompt includes NO_ANSWER_MARKER and hand-off instructions", () => {
  const prompt = buildSystemPrompt("");
  assert.ok(prompt.includes(NO_ANSWER_MARKER), "must include NO_ANSWER_MARKER in rules");
  assert.ok(prompt.includes("Send to Dmytro"), "must suggest Send to Dmytro hand-off");
  assert.ok(prompt.includes("Cal.com"), "must mention booking a call via Cal.com");
  assert.ok(prompt.includes("Telegram"), "must mention messaging on Telegram");
});

test("prompt encodes all hard ban terms and topic constraints", () => {
  const prompt = buildSystemPrompt("");

  // Game development ban
  assert.ok(prompt.includes("game development"), "must ban game development");
  assert.ok(/video games|games/i.test(prompt), "must ban games");
  assert.ok(prompt.includes("Unreal Engine"), "must mention Unreal Engine");
  assert.ok(prompt.includes("UE5"), "must mention UE5");
  assert.ok(prompt.includes("NN Game Studio"), "must mention NN Game Studio");

  // Metaphor ban
  assert.ok(/lift|elevator/i.test(prompt), "must mention lift/elevator ban");
  assert.ok(prompt.includes("shaft"), "must mention shaft ban");
  assert.ok(prompt.includes("floor"), "must mention floor ban");
  assert.ok(prompt.includes("Pro-lifts SIA") || prompt.includes("Prolifts"), "must clarify Prolifts client name is allowed factually");

  // Inventions ban (prices, timelines, availability, numbers)
  assert.ok(prompt.includes("prices"), "must constrain prices");
  assert.ok(prompt.includes("timelines") || prompt.includes("schedules"), "must constrain timelines");
  assert.ok(prompt.includes("available next month"), "must explicitly forbid 'available next month' claims");

  // Curio founder rule
  assert.ok(prompt.includes("Curio"), "must reference Curio");
  assert.ok(prompt.includes("built for Curio's founder"), "must use 'built for Curio's founder'");

  // Education: RVT, never RTU
  assert.ok(prompt.includes("RVT"), "must reference RVT");
  assert.ok(prompt.includes("RTU"), "must forbid RTU");
  assert.ok(prompt.includes("Riga State Technical School"), "must include Riga State Technical School");
});

test("prompt encodes language and formal address rules", () => {
  const prompt = buildSystemPrompt("");

  // Target languages
  assert.ok(prompt.includes("English"), "must support English");
  assert.ok(prompt.includes("Latvian"), "must support Latvian");
  assert.ok(prompt.includes("Russian"), "must support Russian");
  assert.ok(prompt.includes("Ukrainian"), "must support Ukrainian");

  // Proper name spellings
  assert.ok(prompt.includes("«Дмитрий»"), "must mandate Russian «Дмитрий»");
  assert.ok(prompt.includes("«Дмитро»"), "must mandate Ukrainian «Дмитро»");
  assert.ok(prompt.includes("Dmytro"), "must mandate English/Latvian Dmytro");

  // Formal address
  assert.ok(prompt.includes("«вы»") || prompt.includes('"вы"'), "must mandate Russian formal вы");
  assert.ok(prompt.includes("«ви»") || prompt.includes('"ви"'), "must mandate Ukrainian formal ви");
  assert.ok(prompt.includes("«jūs»") || prompt.includes('"jūs"'), "must mandate Latvian formal jūs");
});

test("prompt encodes prompt-injection, off-topic and voice guidelines", () => {
  const prompt = buildSystemPrompt("");

  assert.ok(prompt.includes("code blocks"), "must forbid code blocks");
  assert.ok(prompt.includes("competitors"), "must ban competitor discussion");
  assert.ok(prompt.includes("politics"), "must ban political discussion");
  assert.ok(prompt.includes("legal") || prompt.includes("financial"), "must ban legal/financial advice");
  assert.ok(/forget (previous )?instructions/i.test(prompt), "must guard against forget instructions");
});

test("prompt satisfies the static token budget (approx length / 4 <= 900 tokens)", () => {
  const staticPrompt = buildSystemPrompt("");
  const estimatedTokens = Math.ceil(staticPrompt.length / 4);

  // Target is <= 900 tokens
  assert.ok(
    estimatedTokens <= 900,
    `Static prompt size ${staticPrompt.length} chars (~${estimatedTokens} tokens) exceeds 900 token budget`
  );
  assert.ok(
    estimatedTokens >= 400,
    `Static prompt size ${staticPrompt.length} chars (~${estimatedTokens} tokens) is unexpectedly short`
  );
});
