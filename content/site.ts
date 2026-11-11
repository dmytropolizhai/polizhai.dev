/**
 * polizhai.dev: all site content.
 *
 * Two layers:
 * - `facts`: names, URLs, numbers, dates, stack names and visibility. Never translated.
 * - `SiteCopy`: every string a translator touches. Lists are `Record<Id, ...>` keyed by the
 *   ids in `facts`, so a locale that misses an entry fails to compile.
 *
 * Add a locale: copy `en`, translate the strings, `export const lv = { ... } satisfies SiteCopy`,
 * then register it in `copy`.
 *
 * A `Tbd` value (`[TBD: ...]`) is a gap Dmytro must fill. Renderers skip it (`isTbd`) and skip
 * anything whose `status` is "hidden". The client quote also needs `approval: "approved"` before launch. Counts are as of `facts.asOf`; prose strings repeat
 * some of them (442/545, 830, 212, 113, 400+), so grep the copy when you refresh them.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const locales = ["en", "lv", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en" satisfies Locale;

export type Tbd = `[TBD: ${string}]`;
export const isTbd = (value: unknown): value is Tbd =>
  typeof value === "string" && value.startsWith("[TBD");

export type Href = `https://${string}` | `mailto:${string}` | `/${string}` | `#${string}`;
export type Visibility = "visible" | "hidden";
/** "2025" or "2026-09". Renderers format it per locale with `Intl.DateTimeFormat`. */
export type YearOrMonth = `${number}` | `${number}-${number}`;
export type LanguageCode = "uk" | "ru" | "lv" | "en";
export type LinkKind = "visit" | "app" | "site" | "caseStudy" | "source" | "contact";
export type Link = { kind: LinkKind; href: Href | Tbd };
export type StackGroup = "app" | "content" | "forms" | "delivery" | "data" | "platforms" | "quality";
export type CaseStudySlug = "prolifts" | "stundio";
export type ProjectStatus = "live" | "repo-only" | "hidden";
export type ContactId = "email" | "telegram" | "call";

// ---------------------------------------------------------------------------
// Facts (never translated)
// ---------------------------------------------------------------------------

const siteUrl = "https://polizhai.dev";
const email = "dmytropolizhai@gmail.com";

export const urls = {
  github: "https://github.com/dmytropolizhai",
  linkedin: "https://www.linkedin.com/in/dmytropolizhai",
  prolifts: "https://pro-lifts.lv",
  stundioApp: "https://app.stundio.lv",
  stundioSite: "https://stundio.lv",
  stundioRepo: "https://github.com/dmytropolizhai/stundio",
  curio: "https://curio.today",
  curioRepo: "https://github.com/curio-today/frontend",
  oneToOneRepo: "https://github.com/dmytropolizhai/one-to-one",
  dnfRepo: "https://github.com/dmytropolizhai/dnf",
  numerologgi: "https://shop.numerologgi.com",
  telegram: "https://t.me/dmytropolizhai",
} as const satisfies Record<string, Href>;

/** Numbers that count up. Labels live in `SiteCopy.stats`. */
export const stats = {
  stundioUsers: { value: 400, suffix: "+" },
  stundioCommits: { value: 442, suffix: "" },
  curioLoadTime: { value: 10, suffix: "%" },
} as const satisfies Record<string, { value: number; suffix: "" | "+" | "%" }>;
export type StatId = keyof typeof stats;

type ProjectFacts = {
  name: string;
  status: ProjectStatus;
  kind: "client" | "own" | "code" | "side";
  stack: readonly string[];
  stats: readonly StatId[];
  links: readonly Link[];
  caseStudy: CaseStudySlug | null;
};

type Facts = {
  asOf: string;
  siteUrl: string;
  email: string;
  copyrightYear: number;
  person: {
    name: string;
    givenName: string;
    familyName: string;
    ukrainian: string;
    ukrainianSyllables: string;
    phonetic: string;
    /** The stressed part of `phonetic`, set in white and bold while the rest is grey. */
    phoneticStress: string;
    jobTitle: string;
    city: string;
    country: string;
    school: { name: string; localName: string; short: string };
    portrait: { src: string | Tbd; aspectRatio: string };
    languages: readonly { code: LanguageCode; level: "native" | "B1" }[];
  };
  /** Contact section, in order. */
  contact: readonly { id: ContactId; display: string | Tbd; href: Href | Tbd }[];
  /** Footer and JSON-LD profiles. */
  profiles: readonly { label: string; href: Href }[];
  /** Hero logo strip. Clients only, never own products. Not the full list. */
  customers: readonly { name: string; href: Href | Tbd | null; logo: string | Tbd; status: Visibility }[];
  /** Section order. "client" shows only when `clientQuote.status` is "visible". */
  sections: readonly string[];
  /** Sections linked from the dock at the bottom of the screen, in order. */
  dock: readonly string[];
  /** Render order = key order. */
  projects: Record<string, ProjectFacts>;
  /** Render order = key order. `when: null` means no verified date. */
  journey: Record<string, { when: YearOrMonth | null; status: Visibility }>;
  certificates: readonly { title: string; issuer: string; href: Href | Tbd }[];
  clientQuote: {
    status: Visibility;
    /** The text is an edited translation of a private chat message. Publish only after sign-off. */
    approval: "pending-client-signoff" | "approved";
    name: string;
    role: string | Tbd;
    company: string;
    /** Source of the quote, for the record. Not rendered. */
    source: { date: string; channel: string; language: "ru" };
  };
  caseStudies: Record<
    CaseStudySlug,
    { stack: Partial<Record<StackGroup, readonly string[]>>; stats: readonly StatId[]; links: readonly Link[] }
  >;
};

export const facts = {
  asOf: "2026-11-09",
  siteUrl,
  email,
  copyrightYear: 2026,

  person: {
    name: "Dmytro Polizhai",
    givenName: "Dmytro",
    familyName: "Polizhai",
    ukrainian: "Дмитро Поліжай",
    ukrainianSyllables: "по-лі-ЖАЙ",
    phonetic: "poh-lee-ZHAI",
    phoneticStress: "ZHAI",
    jobTitle: "Full-Stack Developer",
    city: "Riga",
    country: "LV",
    school: { name: "Riga State Technical School", localName: "Rīgas Valsts tehnikums", short: "RVT" },
    portrait: { src: "[TBD: portrait file, e.g. /images/portrait.jpg]", aspectRatio: "3 / 4" },
    languages: [
      { code: "uk", level: "native" },
      { code: "ru", level: "native" },
      { code: "lv", level: "B1" },
      { code: "en", level: "B1" },
    ],
  },

  contact: [
    { id: "email", display: email, href: `mailto:${email}` },
    { id: "telegram", display: "@dmytropolizhai", href: urls.telegram },
    { id: "call", display: "[TBD: booking link]", href: "[TBD: booking link]" },
  ],

  profiles: [
    { label: "GitHub", href: urls.github },
    { label: "LinkedIn", href: urls.linkedin },
    { label: "Telegram", href: urls.telegram },
  ],

  // [TBD: more customers and their logos from Dmytro]
  customers: [
    { name: "Pro-lifts SIA", href: urls.prolifts, logo: "[TBD: Pro-lifts logo]", status: "visible" },
    { name: "Curio", href: urls.curio, logo: "[TBD: Curio logo]", status: "visible" },
    { name: "Numerologgi", href: urls.numerologgi, logo: "/logos/numerologgi.svg", status: "visible" },
  ],

  sections: ["top", "work", "how", "journey", "about", "client", "contact"],
  dock: ["work", "how", "journey", "about", "contact"],

  projects: {
    prolifts: {
      name: "Prolifts",
      status: "live",
      kind: "client",
      stack: ["Next.js 16", "Sanity", "next-intl", "GitHub Actions"],
      stats: [],
      links: [
        { kind: "visit", href: urls.prolifts },
        { kind: "caseStudy", href: "/work/prolifts" },
      ],
      caseStudy: "prolifts",
    },
    stundio: {
      name: "Stundio",
      status: "live",
      kind: "own",
      stack: ["React 19", "TypeScript", "Vite", "Capacitor", "Tauri"],
      stats: ["stundioUsers"],
      links: [
        { kind: "app", href: urls.stundioApp },
        { kind: "caseStudy", href: "/work/stundio" },
        { kind: "source", href: urls.stundioRepo },
      ],
      caseStudy: "stundio",
    },
    curio: {
      name: "Curio",
      status: "live",
      kind: "client",
      stack: ["Next.js 16", "React 19", "TypeScript", "next-intl", "TanStack Query"],
      stats: ["curioLoadTime"],
      links: [
        { kind: "visit", href: urls.curio },
        { kind: "source", href: urls.curioRepo },
      ],
      caseStudy: null,
    },
    numerologgi: {
      name: "Numerologgi",
      status: "live",
      kind: "client",
      stack: ["Next.js 16", "Payload", "Postgres", "Stripe", "three.js"],
      stats: [],
      links: [{ kind: "visit", href: urls.numerologgi }],
      caseStudy: null,
    },
    "one-to-one": {
      name: "one-to-one",
      status: "repo-only",
      kind: "code",
      stack: ["Next.js 16", "Socket.IO", "Redis 7", "Postgres 17", "Docker Compose", "GitHub Actions"],
      stats: [],
      links: [{ kind: "source", href: urls.oneToOneRepo }],
      caseStudy: null,
    },
    dnf: {
      name: "DNF",
      status: "repo-only",
      kind: "side",
      stack: ["Angular", "Tailwind"],
      stats: [],
      links: [{ kind: "source", href: urls.dnfRepo }],
      caseStudy: null,
    },
  },

  journey: {
    "first-script": { when: null, status: "visible" },
    curio: { when: "2025", status: "visible" },
    "one-to-one": { when: "2026", status: "visible" },
    stundio: { when: "2026", status: "visible" }, // year only: repo dates disagree
    freelance: { when: "2026", status: "visible" },
    prolifts: { when: "2026-09", status: "visible" }, // launch month, confirmed by Dmytro
    numerologgi: { when: "2026", status: "visible" }, // launched; repo created 2026-10-06
  },

  // Verified 2026-11-09: each share link resolves to this specialization on Coursera.
  certificates: [
    { title: "Google UX Design", issuer: "Google", href: "https://coursera.org/share/e8cdc0a9f1cd28a054c5ec2d00f42bc3" },
    { title: "Meta Front-End Developer", issuer: "Meta", href: "https://coursera.org/share/010471fbaa51fc77c3cbfbcf8ce2f235" },
    { title: "Google AI", issuer: "Google", href: "https://coursera.org/share/ac4663aa5e9f3e2247df940ee4920262" },
  ],

  clientQuote: {
    status: "visible",
    approval: "pending-client-signoff",
    name: "Dmitrijs Kuliks",
    role: "[TBD: role]",
    company: "Pro-lifts SIA",
    source: { date: "2026-08-10", channel: "Team chat, after seeing the design", language: "ru" },
  },

  caseStudies: {
    prolifts: {
      stack: {
        app: ["Next.js 16 (App Router)", "React 19", "TypeScript", "styled-components"],
        content: ["Sanity", "next-intl"],
        forms: ["Server Actions", "Nodemailer", "Cloudflare Turnstile"],
        delivery: ["GitHub Actions", "Self-hosted runner"],
      },
      stats: [],
      links: [
        { kind: "visit", href: urls.prolifts },
        { kind: "contact", href: `mailto:${email}` },
      ],
    },
    stundio: {
      stack: {
        app: ["React 19", "TypeScript", "Vite", "Tailwind 4", "Zustand", "Framer Motion"],
        data: ["EduPage", "IndexedDB", "Web Push"],
        platforms: ["PWA", "Capacitor 7", "Tauri 2", "Flatpak", "GitHub Releases"],
        quality: ["Vitest", "Testing Library"],
      },
      stats: ["stundioUsers", "stundioCommits"],
      links: [
        { kind: "app", href: urls.stundioApp },
        { kind: "site", href: urls.stundioSite },
        { kind: "source", href: urls.stundioRepo },
      ],
    },
  },
} as const satisfies Facts;

export type SectionId = (typeof facts.sections)[number];
facts.dock satisfies readonly SectionId[];
export type ProjectId = keyof typeof facts.projects;
export type JourneyId = keyof typeof facts.journey;

// ---------------------------------------------------------------------------
// Translatable copy
// ---------------------------------------------------------------------------

type CaseStudyCopy = {
  meta: { title: string; description: string };
  byline: string;
  intro: string;
  /** Small line under the intro. */
  note: string;
  problem: readonly string[];
  constraints: readonly string[];
  built: readonly string[];
  how: string;
  result: readonly string[];
};

export type SiteCopy = {
  meta: {
    title: string;
    description: string;
    og: { title: string; description: string; imageAlt: string };
  };
  common: {
    emailMe: string;
    copied: string;
    backToWork: string;
    linkLabels: Record<LinkKind, string>;
    statusLabels: Record<Exclude<ProjectStatus, "hidden">, string>;
    close: string;
  };
  nav: {
    label: string;
    sections: Record<SectionId, { label: string; short: string }>;
  };
  hero: {
    eyebrow: string;
    tagline: string;
    subline: string;
    seeWork: string;
    customers: { label: string; listIntro: string };
  };
  stats: Record<StatId, string>;
  work: {
    heading: string;
    intro: string;
    secondaryLine: string;
    sideProjectsHeading: string;
    /** Title of the draggable project canvas in the hero. */
    canvasTitle: string;
    /** Cursor pill over the canvas: on empty space, and over a card. */
    cursor: { drag: string; view: string };
    /** Label above each card's outcome line. NEW, needs Dmytro's OK. */
    outcomeLabel: string;
    /** `outcome`: what the project gives its client or users, one short line on the canvas card. NEW, needs Dmytro's OK. */
    projects: Record<ProjectId, { kindLabel: string; oneLiner: string; role: string; outcome: string; note?: string }>;
  };
  how: {
    heading: string;
    intro: string;
    rows: readonly { title: string; body: string }[];
    languagesLine: string;
  };
  journey: {
    heading: string;
    intro: string;
    entries: Record<JourneyId, { title: string; body: string }>;
  };
  about: {
    heading: string;
    nameLabel: string;
    bio: readonly string[];
    ageLine: string;
    originLine: string;
    schoolLine: string;
    languages: { heading: string; names: Record<LanguageCode, string>; native: string };
    certificates: { heading: string; note: string };
  };
  client: {
    heading: string;
    /** Translated quote text. Name, role and company live in `facts.clientQuote`. */
    quote: string;
  };
  contact: {
    heading: string;
    body: string;
    labels: Record<ContactId, string>;
    localTimeLabel: string;
  };
  footer: { credit: string; backToTop: string };
  notFound: { title: string; heading: string; body: string; cta: string };
  caseStudy: {
    headings: Record<"problem" | "constraints" | "built" | "how" | "result" | "links", string>;
    stackGroups: Record<StackGroup, string>;
  };
  caseStudies: Record<CaseStudySlug, CaseStudyCopy>;
  a11y: {
    skipLink: string;
    currentSection: string;
    externalLink: string;
    copy: { button: string; copied: string; failed: string };
    customersList: string;
    timeline: string;
    portraitAlt: string;
  };
};

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

export const en = {
  meta: {
    title: "Dmytro Polizhai · Full-Stack Developer in Riga",
    description:
      "Dmytro Polizhai is a full-stack developer in Riga, Latvia. He designs, builds and launches web apps such as Stundio, Prolifts and Curio.",
    og: {
      title: "Dmytro Polizhai · Full-Stack Developer in Riga",
      description: "Make it run, make it right. Web apps from the first commit to the live site.",
      imageAlt: "Dmytro Polizhai, full-stack developer in Riga",
    },
  },

  common: {
    emailMe: "Email me",
    copied: "Copied",
    backToWork: "Back to selected work",
    linkLabels: {
      visit: "Visit the live site",
      app: "Open the app",
      site: "Project site",
      caseStudy: "Read the case study",
      source: "Source on GitHub",
      contact: "Email me about a project",
    },
    statusLabels: { live: "Live", "repo-only": "Code only" },
    close: "Close",
  },

  nav: {
    label: "Sections",
    sections: {
      top: { label: "Top", short: "Top" },
      work: { label: "Selected work", short: "Work" },
      how: { label: "How I work", short: "How" },
      journey: { label: "Journey", short: "Journey" },
      about: { label: "About", short: "About" },
      client: { label: "Client words", short: "Client" },
      contact: { label: "Contact", short: "Contact" },
    },
  },

  hero: {
    eyebrow: "Full-stack developer · Riga",
    tagline: "Make it run, make it right.",
    subline: "I design, build and launch web apps, from the first commit to the live site.",
    seeWork: "See the work",
    customers: {
      label: "More than 5 happy customers",
      listIntro: "Some of them",
    },
  },

  stats: {
    stundioUsers: "students every school day",
    stundioCommits: "of 545 commits are mine",
    curioLoadTime: "lower page load time",
  },

  work: {
    heading: "Selected work",
    intro: "Live products first. Every card links to the site or the code.",
    secondaryLine: "Live first. Motion only where it helps.",
    sideProjectsHeading: "Side projects",
    canvasTitle: "Explore the projects",
    cursor: { drag: "Drag", view: "View" },
    outcomeLabel: "Outcome",
    projects: {
      prolifts: {
        kindLabel: "Client site",
        oneLiner:
          "The website of Pro-lifts SIA, an elevator company in Riga. In Latvian, Russian and English, with a video hero that plays as you scroll.",
        role: "I designed and built it, set up the CMS and run the deploys.",
        outcome: "One site in three languages, and a CMS the team updates without a developer.",
      },
      stundio: {
        kindLabel: "Open source",
        oneLiner:
          "An unofficial timetable app for students at Riga State Technical School. On web, Android and Linux.",
        role: "I wrote 442 of its 545 commits.",
        outcome: "400+ students check their timetable on it every school day.",
      },
      curio: {
        kindLabel: "Built for Curio's founder",
        oneLiner: "A feed of short news stories. I rebuilt its frontend in Next.js, with support for several languages.",
        role: "I wrote 830 of 830 commits in the frontend repository. Page load time went down 10% (site analytics).",
        outcome: "Pages load 10% faster, in several languages.",
      },
      numerologgi: {
        kindLabel: "Client shop",
        oneLiner: "An online shop for planners, with a CMS catalogue and card payments.",
        role: "I wrote all 113 commits.",
        outcome: "Planners sell online, with card payments and a catalogue the owner edits.",
      },
      "one-to-one": {
        kindLabel: "Code",
        oneLiner:
          "A private one-to-one chat in real time, with email code sign-in. It runs on Socket.IO, Redis, Postgres and Docker.",
        role: "I wrote all 212 commits, across frontend, backend and CI.",
        outcome: "A full real-time stack in one repo: sign-in, chat, data and CI.",
        note: "Archived. There is no live site, but the code is public.",
      },
      dnf: {
        kindLabel: "Side project",
        oneLiner: "A timer app for Rubik's cube speedsolvers.",
        role: "My own side project, built with Angular.",
        outcome: "A focused practice timer for speedsolvers.",
      },
    },
  },

  how: {
    heading: "How I work",
    intro: "What you can expect when we work together.",
    rows: [
      {
        title: "One person, the whole build",
        body: "I do the design, frontend, backend and deploy myself. You talk to the person who writes the code.",
      },
      {
        title: "Fast and easy to use",
        body: "I set a speed budget before I build. This site aims to show its main content in under 1.8 seconds, with under 160 kB of JavaScript. It works with a keyboard and with reduced motion.",
      },
      {
        title: "You edit the content",
        body: "When a site needs it, I add a CMS, such as Sanity or Payload. Your team can then change text and images without me.",
      },
      {
        title: "Checked before every deploy",
        body: "On Prolifts, GitHub Actions runs lint, type checks and a build before each deploy. The site is live and still gets updates.",
      },
    ],
    languagesLine: "I can talk to your team in Latvian, English, Ukrainian or Russian.",
  },

  journey: {
    heading: "Journey",
    intro: "The path, one project at a time.",
    entries: {
      "first-script": { title: "First script", body: "A Google Maps scraper. I taught myself the rest." },
      curio: {
        title: "Curio frontend",
        body: "I rebuilt the frontend of a news feed in Next.js, for its founder. Page load time went down 10%.",
      },
      "one-to-one": { title: "one-to-one", body: "A real-time chat app. I built the frontend, the backend and the deploy." },
      stundio: {
        title: "Stundio",
        body: "An open-source timetable app for students at Riga State Technical School. Over 400 of them use it every school day.",
      },
      freelance: { title: "Client work", body: "I build sites and apps for clients on my own, from design to deploy." },
      prolifts: {
        title: "Prolifts goes live",
        body: "The site for Pro-lifts SIA, an elevator company in Riga, in three languages.",
      },
      numerologgi: {
        title: "Numerologgi goes live",
        body: "An online shop for a Riga business, with a CMS catalogue and payments through Stripe.",
      },
    },
  },

  about: {
    heading: "About",
    nameLabel: "How to say my name",
    bio: [
      "I am a full-stack developer in Riga, Latvia. I build web apps and take them all the way to launch.",
      "My open-source app Stundio is a timetable for students at Riga State Technical School. Over 400 of them use it every school day. I built the live sites for Pro-lifts SIA and Numerologgi, and the frontend of Curio for its founder.",
    ],
    ageLine: "I'm 18.",
    originLine: "Self-taught. I started with a Google Maps scraper. Now I build live products for clients and for myself.",
    schoolLine: "I study programming at Riga State Technical School (RVT).",
    languages: {
      heading: "Languages",
      names: { uk: "Ukrainian", ru: "Russian", lv: "Latvian", en: "English" },
      native: "Native",
    },
    certificates: { heading: "Certificates", note: "Professional certificates on Coursera." },
  },

  client: {
    heading: "What a client says",
    quote: "This is fire. I really like it. Everyone is going to ask me who made it. I'll build your price and reputation.",
  },

  contact: {
    heading: "Tell me what you want to launch",
    body: "Write to me by email or on Telegram, or book a call. Tell me what you want to build and when it should go live.",
    labels: { email: "Email", telegram: "Telegram", call: "Book a call" },
    localTimeLabel: "Time in Riga",
  },

  footer: { credit: "Built by Dmytro Polizhai in Riga.", backToTop: "Back to top" },

  notFound: {
    title: "Page not found · Dmytro Polizhai",
    heading: "Page not found",
    body: "This page does not exist, or it moved.",
    cta: "Back to the home page",
  },

  caseStudy: {
    headings: {
      problem: "The problem",
      constraints: "Constraints",
      built: "What I built",
      how: "How",
      result: "Result",
      links: "Links",
    },
    stackGroups: {
      app: "App",
      content: "Content and languages",
      forms: "Forms and spam",
      delivery: "Delivery",
      data: "Data and notifications",
      platforms: "Platforms",
      quality: "Tests",
    },
  },

  caseStudies: {
    prolifts: {
      meta: {
        title: "Prolifts: website for Pro-lifts SIA · Dmytro Polizhai",
        description:
          "How I built pro-lifts.lv, a Next.js and Sanity site in three languages, with a scroll-scrubbed hero made from AI video.",
      },
      byline: "A website for Pro-lifts SIA, by Dmytro Polizhai",
      intro:
        "Pro-lifts SIA is an elevator contractor in Riga. I built its site in three languages, with a CMS and a video hero that plays as you scroll.",
      note: "Delivered under my studio name, Multilance.",
      problem: [
        "Pro-lifts SIA installs and services elevators of many brands. Its site had to explain six services, show the company's experience and help visitors get in touch.",
        "It had to work in Latvian, Russian and English. The client also had to edit the content without a developer.",
      ],
      constraints: [
        "Three languages. Latvian is the main one. Russian and English follow.",
        "A video hero that still runs well on a phone.",
        "Content in a CMS, not in code.",
      ],
      built: [
        "The hero plays as you scroll. I cut an AI video into frames, so your scroll controls the time. Portrait and landscape screens get their own frame sets.",
        "Six service sections, a manufacturer selector, a process, a works list and an FAQ.",
        "A contact form that sends email and blocks spam.",
        "Sanity Studio inside the site, for editing and publishing content.",
        "A sitemap, structured data and a social image for each language.",
      ],
      how: "I made the hero clips with Google Flow (Veo 3.1) from keyframe images. Then I cut them into frames and wrote the scroll code myself, with no animation library. Before each deploy, GitHub Actions runs lint, type checks and a build. The main branch goes to production, and the dev branch goes to a preview.",
      result: [
        "The site went live at pro-lifts.lv in September 2026, in Latvian, Russian and English. It still gets updates.",
        "The client edits the page content in Sanity without me.",
      ],
    },
    stundio: {
      meta: {
        title: "Stundio: timetable app for RVT students · Dmytro Polizhai",
        description:
          "How I built Stundio, an open-source timetable app on web, Android and Linux. 400+ students use it every school day.",
      },
      byline: "An open-source timetable app, by Dmytro Polizhai",
      intro:
        "Built in Riga. Used every day. Stundio shows the timetable of Riga State Technical School on your phone, with every change.",
      note: "Unofficial. Not affiliated with RVT, EduPage or aSc.",
      problem: [
        "A school timetable changes all the time. Lessons move, get cancelled, or get a new teacher.",
        "Students need to see the next room and the changes fast, on their phone.",
      ],
      constraints: [
        "The data comes from the school's public EduPage timetable. I do not control it.",
        "No accounts, and no personal data on a server.",
        "Three platforms: web, Android and Linux. I am the main developer.",
        "Free and open source.",
      ],
      built: [
        "The next room, and cancelled, moved or substituted lessons shown inline.",
        "Fast loading from the browser cache after the first visit, with a note on how fresh the data is.",
        "No sign-up. You pick your group or teacher once.",
        "Student mode with a route between buildings, and a Teacher mode.",
        "Web Push and local notifications.",
        "Three Android home-screen widgets.",
        "An installable web app, an Android app with automatic updates, and a Linux desktop app.",
        "Latvian, English and Ukrainian.",
      ],
      how: "The app reads the school's public EduPage timetable. After the first visit, the browser keeps it in its cache, so the app opens fast.",
      result: [
        "Over 400 students open Stundio every school day. It is live at app.stundio.lv.",
        "The code is public under the MIT license. I wrote 442 of its 545 commits (as of 9 November 2026).",
      ],
    },
  },

  a11y: {
    skipLink: "Skip to main content",
    currentSection: "current section",
    externalLink: "opens in a new tab",
    copy: {
      button: "Copy email address",
      copied: "Email copied",
      failed: "Could not copy. Use the email link instead.",
    },
    customersList: "Some of my customers",
    timeline: "Journey timeline",
    portraitAlt: "Portrait of Dmytro Polizhai",
  },
} satisfies SiteCopy;

// ---------------------------------------------------------------------------
// Registry. Add `lv`, `ru`, `uk` here when translated.
// ---------------------------------------------------------------------------

export const copy = { en } satisfies Partial<Record<Locale, SiteCopy>>;

// ---------------------------------------------------------------------------
// JSON-LD for `/`. Render with `JSON.stringify` inside `<script type="application/ld+json">`.
// ---------------------------------------------------------------------------

type Ref = { "@id": string };

export type JsonLd = {
  "@context": "https://schema.org";
  "@graph": readonly [
    {
      "@type": "Person";
      "@id": string;
      name: string;
      givenName: string;
      familyName: string;
      alternateName: string;
      jobTitle: string;
      url: string;
      image: string;
      sameAs: readonly string[];
      knowsLanguage: readonly LanguageCode[];
      address: { "@type": "PostalAddress"; addressLocality: string; addressCountry: string };
      alumniOf: { "@type": "EducationalOrganization"; name: string; alternateName: readonly string[] };
    },
    { "@type": "WebSite"; "@id": string; url: string; name: string; inLanguage: Locale; publisher: Ref },
    {
      "@type": "ProfilePage";
      "@id": string;
      url: string;
      name: string;
      inLanguage: Locale;
      isPartOf: Ref;
      mainEntity: Ref;
    },
  ];
};

const ids = {
  person: `${siteUrl}/#person`,
  website: `${siteUrl}/#website`,
  page: `${siteUrl}/#profile`,
} as const;

const { person } = facts;

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": ids.person,
      name: person.name,
      givenName: person.givenName,
      familyName: person.familyName,
      alternateName: person.ukrainian,
      jobTitle: person.jobTitle,
      url: siteUrl,
      // [TBD: portrait] Placeholder path. Swap for the real file before launch.
      image: `${siteUrl}/images/portrait.jpg`,
      sameAs: facts.profiles.map((p) => p.href),
      knowsLanguage: person.languages.map((l) => l.code),
      address: { "@type": "PostalAddress", addressLocality: person.city, addressCountry: person.country },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: person.school.name,
        alternateName: [person.school.localName, person.school.short],
      },
    },
    { "@type": "WebSite", "@id": ids.website, url: siteUrl, name: person.name, inLanguage: "en", publisher: { "@id": ids.person } },
    {
      "@type": "ProfilePage",
      "@id": ids.page,
      url: siteUrl,
      name: en.meta.title,
      inLanguage: "en",
      isPartOf: { "@id": ids.website },
      mainEntity: { "@id": ids.person },
    },
  ],
} as const satisfies JsonLd;
