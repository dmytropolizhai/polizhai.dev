const FORBIDDEN_GAMEDEV_RE = /\bgames?\b|game ?dev|gamedev|\bUE5\b|unreal|NN Game/i;
const FORBIDDEN_METAPHOR_RE = /lift shaft|elevator shaft|\bfloors?\b/i;

export const MAX_KNOWLEDGE_TOKENS = 8000;
export const WARN_KNOWLEDGE_TOKENS = 6000;

export function isTbdValue(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("[TBD: ") && value.endsWith("]");
}

/** Structural subset of `ResolvedSiteContent` needed to build the assistant knowledge base. */
export type KnowledgeInput = {
  t: {
    hero: {
      headline: string;
      subline: string;
      customers: { label: string };
    };
    about: {
      bio: readonly string[];
      originLine: string;
      languages: {
        names: Record<string, string>;
        native: string;
      };
    };
    how: {
      cells: {
        launch: { title: string; body: string };
        cms: { title: string; body: string };
        speed: { title: string; body: string };
        support: { title: string; body: string };
        languages: { title: string; body: string };
      };
    };
    services: {
      intro: string;
      price: {
        from: string;
        tier: string;
        custom: string;
        units: { month: string };
      };
    };
  };
  facts: {
    siteUrl: string;
    email: string;
    person: {
      name: string;
      jobTitle: string;
      city: string;
      country: string;
      school: { name: string; localName: string; short: string };
      languages: readonly { code: string; level: string }[];
    };
    contact: readonly { id: string; display: string; href: string }[];
    profiles: readonly { label: string; href: string }[];
    certificates: readonly { title: string; issuer: string; href: string }[];
    clientQuote: {
      status: "visible" | "hidden";
      approval: "pending-client-signoff" | "approved";
    };
  };
  projects: readonly {
    id: string;
    name: string;
    status: "live" | "repo-only" | "hidden";
    kindLabel: string;
    oneLiner: string;
    role: string;
    outcome: string;
    note?: string;
    stack: readonly string[];
    stats: readonly { value: number; suffix: string; label: string }[];
    links: readonly { kind: string; href: string }[];
  }[];
  journey: readonly {
    id: string;
    title: string;
    body: string;
    when: string | null;
    status: "visible" | "hidden";
  }[];
  testimonials: readonly {
    id: string;
    name: string;
    role: string;
    company: string;
    quote: string;
  }[];
  services: {
    show: boolean;
    items: readonly {
      id: string;
      name: string;
      outcome: string;
      price: number | null;
      priceUnit: "once" | "month";
    }[];
    supportTiers: readonly {
      id: string;
      name: string;
      includes: string;
      price: number;
    }[];
  };
  pendingCopy: {
    budgetFigures: {
      show: boolean;
      items: readonly { value: string; label: string }[];
    };
    projectOutcome: { show: boolean };
    services: { show: boolean };
  };
};

/**
 * Recursively strips any `[TBD: ...]` values from strings, arrays, and plain objects.
 */
export function stripTbd<T>(value: T): T {
  if (typeof value === "string") {
    return (isTbdValue(value) ? "" : value) as T;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => stripTbd(item))
      .filter((item) => {
        if (typeof item === "string") return item.trim().length > 0;
        return item !== null && item !== undefined;
      }) as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === "string" && isTbdValue(v)) continue;
      out[k] = stripTbd(v);
    }
    return out as T;
  }
  return value;
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function assertSafeKnowledge(text: string): { approxTokens: number; warning?: string } {
  const gamedevMatch = text.match(FORBIDDEN_GAMEDEV_RE);
  if (gamedevMatch) {
    throw new Error(`Forbidden game-dev term found in generated knowledge: "${gamedevMatch[0]}"`);
  }
  const metaphorMatch = text.match(FORBIDDEN_METAPHOR_RE);
  if (metaphorMatch) {
    throw new Error(`Forbidden metaphor term found in generated knowledge: "${metaphorMatch[0]}"`);
  }
  const approxTokens = estimateTokens(text);
  if (approxTokens > MAX_KNOWLEDGE_TOKENS) {
    throw new Error(
      `Generated knowledge exceeds ${MAX_KNOWLEDGE_TOKENS} approx tokens (${approxTokens}).`,
    );
  }
  if (approxTokens > WARN_KNOWLEDGE_TOKENS) {
    return {
      approxTokens,
      warning: `Generated knowledge is ${approxTokens} approx tokens (above ${WARN_KNOWLEDGE_TOKENS} warning threshold).`,
    };
  }
  return { approxTokens };
}

function formatPrice(
  price: number | null,
  unit: "once" | "month",
  t: KnowledgeInput["t"]["services"]["price"],
): string {
  if (price === null) return t.custom;
  const formatted = new Intl.NumberFormat("en").format(price);
  const base = t.from.replace("{price}", formatted);
  return unit === "month" ? `${base} ${t.units.month}` : base;
}

export type BuildKnowledgeOptions = {
  telegramUrl?: string;
  caseStudyPagesLive?: boolean;
  asOf?: string;
};

export function buildKnowledgeMarkdown(
  rawContent: KnowledgeInput,
  opts: BuildKnowledgeOptions = {},
): string {
  const content = stripTbd(rawContent);
  const { t, facts } = content;
  const caseStudyPagesLive = opts.caseStudyPagesLive ?? false;
  const lines: string[] = [];

  lines.push(`# ${facts.person.name} — ${facts.person.jobTitle}`);
  lines.push(`Location: ${facts.person.city}, ${facts.person.country}`);
  lines.push(`Website: ${facts.siteUrl}`);
  if (opts.asOf) lines.push(`Facts as of: ${opts.asOf}`);
  lines.push("");
  lines.push(`## Positioning`);
  if (t.hero.headline) lines.push(`- Motto: ${t.hero.headline}`);
  if (t.hero.subline) lines.push(`- Summary: ${t.hero.subline}`);
  if (t.hero.customers.label) lines.push(`- Clients: ${t.hero.customers.label}`);

  lines.push("");
  lines.push("## About & Background");
  for (const para of t.about.bio) {
    if (para) lines.push(`- ${para}`);
  }
  if (t.about.originLine) lines.push(`- Origin: ${t.about.originLine}`);
  lines.push(
    `- Education: ${facts.person.school.name} (${facts.person.school.localName}, ${facts.person.school.short}) — NOT RTU.`,
  );
  const langParts = facts.person.languages.map((l) => {
    const label = t.about.languages.names[l.code] ?? l.code;
    const lvl = l.level === "native" ? t.about.languages.native : l.level;
    return `${label} (${lvl})`;
  });
  if (langParts.length > 0) {
    lines.push(`- Languages: ${langParts.join(", ")}`);
  }
  if (facts.certificates.length > 0) {
    const certs = facts.certificates
      .filter((c) => c.title && c.href)
      .map((c) => `${c.title} (${c.issuer})`);
    if (certs.length > 0) lines.push(`- Certificates: ${certs.join("; ")}`);
  }

  const visibleProjects = content.projects.filter((p) => p.status !== "hidden");
  if (visibleProjects.length > 0) {
    lines.push("");
    lines.push("## Projects");
    for (const p of visibleProjects) {
      const header = [`### ${p.name}`];
      if (p.kindLabel) header.push(`(${p.kindLabel}, ${p.status})`);
      lines.push(header.join(" "));
      if (p.oneLiner) lines.push(`- Summary: ${p.oneLiner}`);
      if (p.role) lines.push(`- Role: ${p.role}`);
      if (content.pendingCopy.projectOutcome.show && p.outcome) {
        lines.push(`- Outcome: ${p.outcome}`);
      }
      if (p.id === "curio") {
        lines.push(`- Client note: Built for Curio's founder (owner is not named publicly).`);
      }
      if (p.note) lines.push(`- Note: ${p.note}`);
      if (p.stack.length > 0) lines.push(`- Stack: ${p.stack.join(", ")}`);
      if (p.stats.length > 0) {
        const statText = p.stats.map((s) => `${s.value}${s.suffix} ${s.label}`).join("; ");
        lines.push(`- Metrics: ${statText}`);
      }
      const publicLinks = p.links.filter((l) => {
        if (!l.href || isTbdValue(l.href)) return false;
        if (l.kind === "caseStudy" && !caseStudyPagesLive) return false;
        return true;
      });
      if (publicLinks.length > 0) {
        const linkText = publicLinks.map((l) => `${l.kind}: ${l.href}`).join(" | ");
        lines.push(`- Links: ${linkText}`);
      }
    }
  }

  if (content.services.show && content.pendingCopy.services.show) {
    lines.push("");
    lines.push("## Services & Pricing");
    if (t.services.intro) lines.push(t.services.intro);
    for (const s of content.services.items) {
      const price = formatPrice(s.price, s.priceUnit, t.services.price);
      lines.push(`- ${s.name} — ${price}: ${s.outcome}`);
    }
    if (content.services.supportTiers.length > 0) {
      lines.push("### Monthly Support Tiers");
      for (const tier of content.services.supportTiers) {
        const price = t.services.price.tier.replace(
          "{price}",
          new Intl.NumberFormat("en").format(tier.price),
        );
        lines.push(`- ${tier.name} (${price}): ${tier.includes}`);
      }
    }
  }

  lines.push("");
  lines.push("## How Dmytro Works");
  const cells = t.how.cells;
  lines.push(`- ${cells.launch.title}: ${cells.launch.body}`);
  lines.push(`- ${cells.cms.title}: ${cells.cms.body}`);
  let speedLine = `- ${cells.speed.title}: ${cells.speed.body}`;
  if (content.pendingCopy.budgetFigures.show && content.pendingCopy.budgetFigures.items.length > 0) {
    const figs = content.pendingCopy.budgetFigures.items
      .map((f) => `${f.value} (${f.label})`)
      .join(", ");
    speedLine += ` Performance budgets: ${figs}.`;
  }
  lines.push(speedLine);
  lines.push(`- ${cells.support.title}: ${cells.support.body}`);
  lines.push(`- ${cells.languages.title}: ${cells.languages.body}`);

  const visibleJourney = content.journey.filter((j) => j.status !== "hidden");
  if (visibleJourney.length > 0) {
    lines.push("");
    lines.push("## Journey");
    for (const j of visibleJourney) {
      const when = j.when ? ` (${j.when})` : "";
      lines.push(`- ${j.title}${when}: ${j.body}`);
    }
  }

  const showQuotes =
    facts.clientQuote.status === "visible" && facts.clientQuote.approval === "approved";
  if (showQuotes && content.testimonials.length > 0) {
    lines.push("");
    lines.push("## Client & Co-founder Feedback");
    for (const item of content.testimonials) {
      if (!item.quote) continue;
      const who = [item.name, item.role, item.company].filter(Boolean).join(", ");
      lines.push(`- ${who}: "${item.quote}"`);
    }
  }

  lines.push("");
  lines.push("## Contact");
  if (facts.email) lines.push(`- Email: ${facts.email}`);
  if (opts.telegramUrl) lines.push(`- Telegram: ${opts.telegramUrl}`);
  for (const c of facts.contact) {
    if (c.href) lines.push(`- ${c.id === "call" ? "Book a 40-min briefing call (Cal.com)" : c.id}: ${c.href}`);
  }
  for (const p of facts.profiles) {
    if (p.href) lines.push(`- ${p.label}: ${p.href}`);
  }

  return lines.join("\n").trim() + "\n";
}
