import assert from "node:assert/strict";
import test from "node:test";
import {
  assertSafeKnowledge,
  buildKnowledgeMarkdown,
  stripTbd,
  type KnowledgeInput,
} from "../../scripts/knowledge-lib.ts";

function makeFixture(): KnowledgeInput {
  return {
    t: {
      hero: {
        headline: "Ship and polish.",
        subline: "Web apps from first commit to live site.",
        customers: { label: "5+ happy clients" },
      },
      about: {
        bio: ["Full-stack developer in Riga."],
        originLine: "Self-taught.",
        languages: {
          names: { uk: "Ukrainian", ru: "Russian", lv: "Latvian", en: "English" },
          native: "Native",
        },
      },
      how: {
        cells: {
          launch: { title: "Live in weeks", body: "2-4 weeks." },
          cms: { title: "CMS", body: "Sanity or Payload." },
          speed: { title: "Speed", body: "Fast load." },
          support: { title: "Support", body: "2 weeks free." },
          languages: { title: "4 languages", body: "Included." },
        },
      },
      services: {
        intro: "Clear pricing.",
        price: { from: "From €{price}", tier: "€{price}/mo", custom: "Custom quote", units: { month: "/ month" } },
      },
    },
    facts: {
      siteUrl: "https://polizhai.dev",
      email: "dmytropolizhai@gmail.com",
      person: {
        name: "Dmytro Polizhai",
        jobTitle: "Full-Stack Developer",
        city: "Riga",
        country: "LV",
        school: { name: "Riga State Technical School", localName: "Rīgas Valsts tehnikums", short: "RVT" },
        languages: [{ code: "en", level: "B1" }],
      },
      contact: [{ id: "call", display: "cal.com", href: "https://cal.com/dmytropolizhai/briefing" }],
      profiles: [{ label: "GitHub", href: "https://github.com/dmytropolizhai" }],
      certificates: [{ title: "Google UX Design", issuer: "Google", href: "https://coursera.org/x" }],
      clientQuote: { status: "visible", approval: "approved" },
    },
    projects: [
      {
        id: "prolifts",
        name: "PRO-LIFTS",
        status: "live",
        kindLabel: "Client",
        oneLiner: "Corporate site",
        role: "Full-stack",
        outcome: "Live in 2026",
        stack: ["Next.js 16"],
        stats: [],
        links: [{ kind: "visit", href: "https://pro-lifts.lv" }],
      },
      {
        id: "secret",
        name: "Secret",
        status: "hidden",
        kindLabel: "Client",
        oneLiner: "Hidden",
        role: "Dev",
        outcome: "None",
        stack: [],
        stats: [],
        links: [],
      },
    ],
    journey: [
      { id: "j1", title: "RVT", body: "Studying", when: "2024", status: "visible" },
      { id: "j2", title: "Hidden", body: "Nope", when: null, status: "hidden" },
    ],
    testimonials: [
      { id: "prolifts", name: "Dmitrijs", role: "Client", company: "Pro-lifts SIA", quote: "Great!" },
    ],
    services: {
      show: true,
      items: [{ id: "landing", name: "Landing", outcome: "Fast site", price: 600, priceUnit: "once" }],
      supportTiers: [{ id: "basic", name: "Basic", includes: "Updates", price: 100 }],
    },
    pendingCopy: {
      budgetFigures: { show: true, items: [{ value: "< 1.8 s", label: "LCP" }] },
      projectOutcome: { show: true },
      services: { show: true },
    },
  };
}

test("stripTbd removes [TBD: ...] strings from objects and arrays", () => {
  const cleaned = stripTbd({
    ok: "hello",
    bad: "[TBD: missing]",
    nested: { a: "[TBD: x]", b: "keep" },
    arr: ["one", "[TBD: two]", "three"],
  });
  assert.equal(cleaned.ok, "hello");
  assert.equal("bad" in cleaned, false);
  assert.equal("a" in cleaned.nested, false);
  assert.equal(cleaned.nested.b, "keep");
  assert.deepEqual(cleaned.arr, ["one", "three"]);
});

test("buildKnowledgeMarkdown skips hidden projects, hidden journey, and unapproved testimonials", () => {
  const fixture = makeFixture();
  fixture.facts.clientQuote.approval = "pending-client-signoff";
  const md = buildKnowledgeMarkdown(fixture);
  assert.equal(md.includes("### PRO-LIFTS"), true);
  assert.equal(md.includes("### Secret"), false);
  assert.equal(md.includes("Hidden: Nope"), false);
  assert.equal(md.includes("Client & Co-founder Feedback"), false);
});

test("buildKnowledgeMarkdown omits services when pendingCopy.services.show is false", () => {
  const fixture = makeFixture();
  fixture.pendingCopy.services.show = false;
  const md = buildKnowledgeMarkdown(fixture);
  assert.equal(md.includes("## Services & Pricing"), false);
});

test("assertSafeKnowledge rejects forbidden game-dev or metaphor terms", () => {
  assert.throws(() => assertSafeKnowledge("Built with UE5 engine"), /Forbidden game-dev/);
  assert.throws(() => assertSafeKnowledge("Walk down the lift shaft"), /Forbidden metaphor/);
  assert.doesNotThrow(() => assertSafeKnowledge("Built Pro-lifts SIA corporate site in Riga."));
});
