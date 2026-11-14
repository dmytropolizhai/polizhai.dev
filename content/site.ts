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
export type ServiceId = "landing" | "ecommerce" | "webapp" | "support";
export type TierId = "basic" | "standard" | "premium";
export type PriceUnit = "once" | "month";

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
  zinly: "https://zinly.polizhai.dev",
  telegram: "https://t.me/dmytropolizhai",
  cal: "https://cal.com/dmytropolizhai/briefing",
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
  /** Host shown on the project card. */
  display: string;
};

type Facts = {
  asOf: string;
  siteUrl: string;
  email: string;
  helloEmail: string;
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
  testimonials: readonly {
    id: string;
    name: string;
    role: string;
    company: string;
    project: string;
    kind: "client" | "venture";
    photo: string | null;
  }[];
  /**
   * Services picker. `price` is EUR, `null` = custom quote. `proof` = project ids shown as "See it live"
   * (empty: the row links to the How I work support cell). Tiers are the monthly support plans.
   */
  services: {
    items: Record<ServiceId, { price: number | null; priceUnit: PriceUnit; proof: readonly string[] }>;
    supportTiers: Record<TierId, { price: number; priceUnit: "month" }>;
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
  helloEmail: "hello@polizhai.dev",
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
    portrait: { src: "/images/portrait.webp", aspectRatio: "3 / 4" },
    languages: [
      { code: "uk", level: "native" },
      { code: "ru", level: "native" },
      { code: "lv", level: "B1" },
      { code: "en", level: "B1" },
    ],
  },

  contact: [
    { id: "call", display: "cal.com/dmytropolizhai/briefing", href: urls.cal },
  ],

  profiles: [
    { label: "GitHub", href: urls.github },
    { label: "LinkedIn", href: urls.linkedin },
  ],

  // [TBD: more customers and their logos from Dmytro]
  customers: [
    { name: "Pro-lifts SIA", href: urls.prolifts, logo: "[TBD: Pro-lifts logo]", status: "visible" },
    { name: "Curio", href: urls.curio, logo: "[TBD: Curio logo]", status: "visible" },
    { name: "Numerologgi", href: urls.numerologgi, logo: "/logos/numerologgi.svg", status: "visible" },
  ],

  sections: ["top", "work", "how", "journey", "about", "reviews", "contact"],
  dock: ["how", "journey", "about", "reviews", "contact"],

  projects: {
    prolifts: {
      name: "PRO-LIFTS",
      status: "live",
      kind: "client",
      stack: ["Next.js 16", "Sanity", "next-intl", "GitHub Actions"],
      stats: [],
      links: [
        { kind: "visit", href: urls.prolifts },
        { kind: "caseStudy", href: "/work/prolifts" },
      ],
      caseStudy: "prolifts",
      display: "pro-lifts.lv",
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
      display: "stundio.lv",
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
      display: "curio.today",
    },
    numerologgi: {
      name: "Numerologgi",
      status: "live",
      kind: "client",
      stack: ["Next.js 16", "Payload", "Postgres", "Stripe", "three.js"],
      stats: [],
      links: [{ kind: "visit", href: urls.numerologgi }],
      caseStudy: null,
      display: "shop.numerologgi.com",
    },
    zinly: {
      name: "Zinly",
      status: "live",
      kind: "own",
      stack: [], // pending from Dmytro: the stack is not known yet
      stats: [],
      links: [{ kind: "visit", href: urls.zinly }],
      caseStudy: null,
      display: "zinly.polizhai.dev",
    },
    "one-to-one": {
      name: "one-to-one",
      status: "hidden",
      kind: "code",
      stack: ["Next.js 16", "Socket.IO", "Redis 7", "Postgres 17", "Docker Compose", "GitHub Actions"],
      stats: [],
      links: [{ kind: "source", href: urls.oneToOneRepo }],
      caseStudy: null,
      display: "github.com/dmytropolizhai/one-to-one",
    },
    dnf: {
      name: "DNF",
      status: "hidden",
      kind: "side",
      stack: ["Angular", "Tailwind"],
      stats: [],
      links: [{ kind: "source", href: urls.dnfRepo }],
      caseStudy: null,
      display: "github.com/dmytropolizhai/dnf",
    },
  },

  journey: {
    "data-pipeline": { when: null, status: "visible" },
    systems: { when: "2024", status: "visible" },
    curio: { when: "2025", status: "visible" },
    stundio: { when: "2026", status: "visible" },
    prolifts: { when: "2026", status: "visible" },
    numerologgi: { when: "2026", status: "visible" },
    freelance: { when: "2026", status: "visible" },
  },

  // Verified 2026-11-09: each share link resolves to this specialization on Coursera.
  certificates: [
    { title: "Google UX Design", issuer: "Google", href: "https://coursera.org/share/e8cdc0a9f1cd28a054c5ec2d00f42bc3" },
    { title: "Meta Front-End Developer", issuer: "Meta", href: "https://coursera.org/share/010471fbaa51fc77c3cbfbcf8ce2f235" },
    { title: "Google AI", issuer: "Google", href: "https://coursera.org/share/ac4663aa5e9f3e2247df940ee4920262" },
  ],

  clientQuote: {
    status: "visible",
    approval: "approved",
    name: "Dmitrijs Kuliks",
    role: "[TBD: role]",
    company: "Pro-lifts SIA",
    source: { date: "2026-08-10", channel: "Team chat, after seeing the design", language: "ru" },
  },

  testimonials: [
    {
      id: "prolifts",
      name: "Dmitrijs Kuliks",
      role: "Client",
      company: "Pro-lifts SIA",
      project: "prolifts",
      kind: "client",
      photo: "/images/testimonials/dmitrijs.webp",
    },
    {
      id: "zinly",
      name: "Iryna Kovalenko",
      role: "Co-founder",
      company: "Zinly",
      project: "zinly",
      kind: "venture",
      photo: "/images/testimonials/iryna.webp",
    },
  ],

  services: {
    items: {
      landing: { price: 600, priceUnit: "once", proof: ["prolifts", "curio"] },
      ecommerce: { price: 1000, priceUnit: "once", proof: ["numerologgi"] },
      webapp: { price: null, priceUnit: "once", proof: ["stundio"] },
      support: { price: 100, priceUnit: "month", proof: [] },
    },
    supportTiers: {
      basic: { price: 100, priceUnit: "month" },
      standard: { price: 200, priceUnit: "month" },
      premium: { price: 600, priceUnit: "month" },
    },
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
facts.services.items.landing.proof satisfies readonly ProjectId[];
facts.services.items.ecommerce.proof satisfies readonly ProjectId[];
facts.services.items.webapp.proof satisfies readonly ProjectId[];
facts.services.items.support.proof satisfies readonly ProjectId[];

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

/** NEW copy, needs Dmytro's OK (`pendingCopy.services`). Every locale is checked against this type. */
export type ServicesCopy = {
  heading: string;
  intro: string;
  /** Short prompt above the picker. */
  pickPrompt: string;
  items: Record<ServiceId, { name: string; outcome: string }>;
  price: {
    /** Contains `{price}`. */
    from: string;
    custom: string;
    units: { month: string };
    tier: string;
  };
  cta: string;
  proofLabel: string;
  support: {
    tiers: Record<TierId, { name: string; includes: string }>;
    /** Reuses the "2 weeks free support after launch" claim from How I work. */
    freeNote: string;
  };
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
    /** The motto, the page's only H1. */
    headline: string;
    identity: string;
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
    /** Accessible name of the draggable project canvas in the hero (a visually hidden heading). */
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
    cells: {
      launch: {
        title: string;
        body: string;
        figures: readonly { value: string; label: string }[];
        stages: readonly string[];
      };
      cms: {
        title: string;
        body: string;
        figure: { value: string; label: string };
        tools: readonly string[];
      };
      speed: {
        title: string;
        body: string;
        stack: readonly string[];
      };
      support: {
        title: string;
        body: string;
        phases: readonly { value: string; label: string }[];
        tags: readonly string[];
      };
      languages: {
        title: string;
        body: string;
        figures: readonly { value: string; label: string }[];
      };
    };
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
  testimonials: {
    heading: string;
    subheading: string;
    kinds: {
      client: string;
      venture: string;
    };
    items: Record<string, {
      quote: string;
      context: string;
    }>;
  };
  services: ServicesCopy;
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
  assistant: {
    navButton: string;
    contactLine: string;
    title: string;
    greeting: string;
    languagesHint: string;
    disclaimer: string;
    placeholder: string;
    send: string;
    stop: string;
    reset: string;
    prompts: readonly [string, string, string, string];
    handoff: {
      button: string;
      title: string;
      name: string;
      contact: string;
      message: string;
      privacy: string;
      submit: string;
      sent: string;
      contactInvalid: string;
    };
    error: {
      offline: string;
      limit: string;
      tooLong: string;
      sendFailed: string;
    };
  };
  a11y: {
    skipLink: string;
    currentSection: string;
    externalLink: string;
    copy: { button: string; copied: string; failed: string };
    customersList: string;
    timeline: string;
    portraitAlt: string;
    assistant: {
      open: string;
      log: string;
      thinking: string;
    };
  };
};

// ---------------------------------------------------------------------------
// Services copy (NEW, pending Dmytro's OK). All four locales; the registry below checks them.
// ---------------------------------------------------------------------------

const servicesEn = {
  heading: 'Services',
  intro: 'Four ways to start working together. Pick the closest one and we will adjust the details.',
  pickPrompt: 'Pick one to start',
  items: {
    landing: { name: 'Landing page', outcome: 'One focused page that turns visitors into enquiries.' },
    ecommerce: { name: 'Online shop', outcome: 'A catalogue and checkout your team can update itself.' },
    webapp: { name: 'Web app', outcome: 'A custom tool or product built around your workflow.' },
    support: { name: 'Monthly support', outcome: 'Updates, monitoring and fixes after launch.' },
  },
  price: { from: 'from {price} €', custom: 'Custom quote', units: { month: '/ month' }, tier: '{price} € / month' },
  cta: 'Start with this',
  proofLabel: 'See it live',
  support: {
    tiers: {
      basic: { name: 'Basic', includes: 'Bug fixes and dependency updates.' },
      standard: { name: 'Standard', includes: 'Fixes, updates and uptime monitoring.' },
      premium: { name: 'Premium', includes: 'Everything in Standard, plus new features each month.' },
    },
    freeNote: 'Every launch includes 2 weeks of free support.',
  },
} satisfies ServicesCopy;

const servicesLv = {
  heading: 'Pakalpojumi',
  intro: 'Četri veidi, kā sākt sadarbību. Izvēlieties tuvāko, un detaļas precizēsim.',
  pickPrompt: 'Izvēlieties vienu, lai sāktu',
  items: {
    landing: { name: 'Vienas lapas vietne', outcome: 'Viena mērķtiecīga lapa, kas apmeklētājus pārvērš pieprasījumos.' },
    ecommerce: { name: 'Interneta veikals', outcome: 'Katalogs un norēķini, ko jūsu komanda var atjaunināt pati.' },
    webapp: { name: 'Tīmekļa lietotne', outcome: 'Individuāls rīks vai produkts, veidots ap jūsu darbplūsmu.' },
    support: { name: 'Ikmēneša atbalsts', outcome: 'Atjauninājumi, uzraudzība un labojumi pēc palaišanas.' },
  },
  price: { from: 'no {price} €', custom: 'Cena pēc pieprasījuma', units: { month: '/ mēnesī' }, tier: '{price} € / mēnesī' },
  cta: 'Sākt ar šo',
  proofLabel: 'Skatīt darbībā',
  support: {
    tiers: {
      basic: { name: 'Pamata', includes: 'Kļūdu labojumi un atkarību atjauninājumi.' },
      standard: { name: 'Standarta', includes: 'Labojumi, atjauninājumi un pieejamības uzraudzība.' },
      premium: { name: 'Premium', includes: 'Viss no Standarta plāna, plus jaunas funkcijas katru mēnesi.' },
    },
    freeNote: 'Katra palaišana ietver 2 nedēļas bezmaksas atbalsta.',
  },
} satisfies ServicesCopy;

const servicesRu = {
  heading: 'Услуги',
  intro: 'Четыре способа начать работу. Выберите ближайший, а детали мы уточним.',
  pickPrompt: 'Выберите один, чтобы начать',
  items: {
    landing: { name: 'Лендинг', outcome: 'Одна сфокусированная страница, которая превращает посетителей в заявки.' },
    ecommerce: { name: 'Интернет-магазин', outcome: 'Каталог и оформление заказа, которые ваша команда обновляет сама.' },
    webapp: { name: 'Веб-приложение', outcome: 'Индивидуальный инструмент или продукт под ваши процессы.' },
    support: { name: 'Ежемесячная поддержка', outcome: 'Обновления, мониторинг и исправления после запуска.' },
  },
  price: { from: 'от {price} €', custom: 'Цена по запросу', units: { month: '/ месяц' }, tier: '{price} € / месяц' },
  cta: 'Начать с этого',
  proofLabel: 'Посмотреть вживую',
  support: {
    tiers: {
      basic: { name: 'Базовый', includes: 'Исправление ошибок и обновление зависимостей.' },
      standard: { name: 'Стандарт', includes: 'Исправления, обновления и мониторинг доступности.' },
      premium: { name: 'Премиум', includes: 'Всё из тарифа Стандарт и новые функции каждый месяц.' },
    },
    freeNote: 'Каждый запуск включает 2 недели бесплатной поддержки.',
  },
} satisfies ServicesCopy;

const servicesUk = {
  heading: 'Послуги',
  intro: 'Чотири способи почати роботу. Оберіть найближчий, а деталі ми уточнимо.',
  pickPrompt: 'Оберіть один, щоб почати',
  items: {
    landing: { name: 'Лендінг', outcome: 'Одна сфокусована сторінка, що перетворює відвідувачів на заявки.' },
    ecommerce: { name: 'Інтернет-магазин', outcome: 'Каталог і оформлення замовлення, які ваша команда оновлює сама.' },
    webapp: { name: 'Вебзастосунок', outcome: 'Індивідуальний інструмент або продукт під ваші процеси.' },
    support: { name: 'Щомісячна підтримка', outcome: 'Оновлення, моніторинг і виправлення після запуску.' },
  },
  price: { from: 'від {price} €', custom: 'Ціна за запитом', units: { month: '/ місяць' }, tier: '{price} € / місяць' },
  cta: 'Почати з цього',
  proofLabel: 'Подивитися наживо',
  support: {
    tiers: {
      basic: { name: 'Базовий', includes: 'Виправлення помилок і оновлення залежностей.' },
      standard: { name: 'Стандарт', includes: 'Виправлення, оновлення та моніторинг доступності.' },
      premium: { name: 'Преміум', includes: 'Усе з тарифу Стандарт і нові функції щомісяця.' },
    },
    freeNote: 'Кожен запуск включає 2 тижні безкоштовної підтримки.',
  },
} satisfies ServicesCopy;

export const servicesCopy = {
  en: servicesEn,
  lv: servicesLv,
  ru: servicesRu,
  uk: servicesUk,
} satisfies Record<Locale, ServicesCopy>;

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
      reviews: { label: "What they say", short: "Reviews" },
      contact: { label: "Contact", short: "Contact" },
    },
  },

  hero: {
    headline: "Make it run, make it right.",
    identity: "Dmytro Polizhai · Full-Stack Developer in Riga",
    subline: "I design, build and launch web apps — from the first commit to the live site.",
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
      // NEW, needs Dmytro's OK: the whole zinly entry.
      zinly: {
        kindLabel: "Co-founded app",
        oneLiner: "An AI learning app that reads a student's calendar and fills every free gap with a short lesson.",
        role: "I co-founded it with Iryna Kovalenko and built the website.",
        outcome: "Short text, audio and video lessons that fit the minutes a student already has free.",
        note: "Early access opens in summer 2027.",
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
    cells: {
      launch: {
        title: "Live in weeks, not agency months",
        body: "I handle design, frontend, backend and deploy myself. You don't pay for project managers or handoff delays—your product goes from start to live customers in 2–4 weeks.",
        figures: [
          { value: "2–4 wks", label: "from start to live" },
          { value: "0", label: "agency middlemen" },
        ],
        stages: ["Design", "Frontend", "Backend", "Deploy"],
      },
      cms: {
        title: "Stop paying developers for text edits",
        body: "I set up a modern CMS (Sanity or Payload) around your workflow. Your team changes text, photos, prices and catalogue items in minutes—without paying a developer invoice.",
        figure: { value: "0 €", label: "per content or price update" },
        tools: ["Sanity", "Payload CMS"],
      },
      speed: {
        title: "Modern tech that turns clicks into leads",
        body: "Slow sites burn ad spend before visitors even see your offer. I use a modern stack (Next.js, React, TypeScript) built to load under 1.8 seconds, rank in search, and convert traffic into sales.",
        stack: ["Next.js", "React", "TypeScript"],
      },
      support: {
        title: "2 weeks free support, then monthly care",
        body: "Every launch includes two weeks of free support to make sure everything runs smoothly. Need ongoing updates, monitoring and new features after that? Stay covered on a predictable monthly subscription.",
        phases: [
          { value: "2 wks", label: "free after launch" },
          { value: "Monthly", label: "optional care plan" },
        ],
        tags: ["Updates", "Monitoring", "Fixes"],
      },
      languages: {
        title: "Four languages, zero extra cost",
        body: "I talk directly with your team in Latvian, English, Ukrainian or Russian—and include full support for all four languages in your project for free.",
        figures: [
          { value: "4", label: "languages supported" },
          { value: "0 €", label: "multilingual setup" },
        ],
      },
    },
  },

  journey: {
    heading: "Journey",
    intro: "The path, one project at a time.",
    entries: {
      "data-pipeline": {
        title: "Google Maps data pipeline",
        body: "My first commercial code: scraping every coffee shop across major Canadian cities for an Upwork client, syncing massive datasets into Google Drive and Google Sheets.",
      },
      systems: {
        title: "C++ and C# before AI",
        body: "Writing low-level code in C++ and C# before LLMs existed. It built my understanding of memory, data structures, and how software actually executes under the hood.",
      },
      curio: {
        title: "Curio: turnkey frontend",
        body: "Took a news platform from custom UI to Shadcn in Next.js. Delivered the entire frontend under key with multi-language support, cutting page load time by 10%.",
      },
      stundio: {
        title: "Stundio: replacing Edupage",
        body: "The technical school's official timetable was unusable on phones. I built a fast open-source client—it spread through student chats with zero marketing and became a daily habit for hundreds of students.",
      },
      prolifts: {
        title: "Pro-lifts goes live",
        body: "Turnkey corporate website for an elevator company in Riga. Delivered full Latvian legal compliance, 3 languages, and a Sanity CMS setup so their team updates content without touching code.",
      },
      numerologgi: {
        title: "Numerologgi: shipped early",
        body: "E-commerce store with Stripe payments and a CMS catalogue. The client needed it live before November; I finished the architecture, integrations, and launch by mid-October.",
      },
      freelance: {
        title: "Full-stack for founders",
        body: "One person covering product vision, design, architecture, and production deploy. Fast delivery, direct communication, and zero agency overhead.",
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

  testimonials: {
    heading: "What they say",
    subheading: "Feedback from clients and co-founders on execution, speed and craft.",
    kinds: {
      client: "Client",
      venture: "Co-founder",
    },
    items: {
      prolifts: {
        quote: "This is fire. I really like it. Everyone is going to ask me who made it. I'll build your price and reputation.",
        context: "Three-language company site & CMS",
      },
      zinly: {
        quote: "Dmytro turns complex engineering concepts into high-speed, intuitive interfaces in days. His reliability and craft make him an incredible product builder.",
        context: "AI learning app for students",
      },
    },
  },

  services: servicesEn,

  contact: {
    heading: "Tell me what you want to launch",
    body: "Book a 40-minute briefing to walk through your product goals, scope and launch timeline.",
    labels: { email: "", telegram: "", call: "Book a briefing call" },
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

  assistant: {
    navButton: "Ask AI",
    contactLine: "Quick question? Ask the assistant.",
    title: "Assistant",
    greeting:
      "Hi. I'm an AI assistant. I answer from what's on this site: projects, services and how Dmytro works. If I don't know, I'll pass your question to him.",
    languagesHint: "Write in English, Latvian, Russian or Ukrainian.",
    disclaimer: "AI answers can be wrong. The site is the source of truth.",
    placeholder: "Type your question",
    send: "Send",
    stop: "Stop",
    reset: "New chat",
    prompts: [
      "What do you build?",
      "Show me a live project",
      "How does a project start?",
      "How can I reach Dmytro?",
    ],
    handoff: {
      button: "Send to Dmytro",
      title: "Message Dmytro",
      name: "Name (optional)",
      contact: "Email or Telegram",
      message: "Your message",
      privacy: "Your message and this chat go to Dmytro on Telegram. Nothing else is stored.",
      submit: "Send",
      sent: "Sent. Dmytro will reply to the contact you left.",
      contactInvalid: "Add an email or a Telegram username.",
    },
    error: {
      offline: "The assistant is offline. Write on Telegram or book a call.",
      limit: "That's the limit for now. Try again later or write on Telegram.",
      tooLong: "That message is too long. Keep it under 1000 characters.",
      sendFailed: "Couldn't send. Try again or write on Telegram.",
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
    assistant: {
      open: "Open the AI assistant",
      log: "Conversation",
      thinking: "The assistant is writing",
    },
  },
} satisfies SiteCopy;

// ---------------------------------------------------------------------------
// Registry. Add `lv`, `ru`, `uk` here when translated.
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Latvian
// ---------------------------------------------------------------------------

export const lv = {
  meta: {
    title: "Dmytro Polizhai · Full-Stack izstrādātājs Rīgā",
    description:
      "Dmytro Polizhai ir full-stack izstrādātājs Rīgā, Latvijā. Viņš projektē, izstrādā un palaiž tīmekļa lietotnes, piemēram, Stundio, Prolifts un Curio.",
    og: {
      title: "Dmytro Polizhai · Full-Stack izstrādātājs Rīgā",
      description: "Palaist un noslīpēt. Tīmekļa lietotnes no pirmā komita līdz strādājošai vietnei.",
      imageAlt: "Dmytro Polizhai, full-stack izstrādātājs Rīgā",
    },
  },

  common: {
    emailMe: "Rakstīt man",
    copied: "Nokopēts",
    backToWork: "Atpakaļ pie izvēlētajiem darbiem",
    linkLabels: {
      visit: "Apmeklēt vietni",
      app: "Atvērt lietotni",
      site: "Projekta vietne",
      caseStudy: "Lasīt gadījuma izpēti",
      source: "Pirmkods vietnē GitHub",
      contact: "Rakstīt man par projektu",
    },
    statusLabels: { live: "Darbībā", "repo-only": "Tikai kods" },
    close: "Aizvērt",
  },

  nav: {
    label: "Sadaļas",
    sections: {
      top: { label: "Sākums", short: "Sākums" },
      work: { label: "Izvēlētie darbi", short: "Darbi" },
      how: { label: "Kā es strādāju", short: "Process" },
      journey: { label: "Ceļš", short: "Ceļš" },
      about: { label: "Par mani", short: "Par mani" },
      reviews: { label: "Atsauksmes", short: "Atsauksmes" },
      contact: { label: "Kontakti", short: "Kontakti" },
    },
  },

  hero: {
    headline: "Palaist un noslīpēt.",
    identity: "Dmytro Polizhai · Full-Stack izstrādātājs Rīgā",
    subline: "Projektēju, izstrādāju un palaižu tīmekļa lietotnes — no pirmā komita līdz strādājošai vietnei.",
    seeWork: "Skatīt darbus",
    customers: {
      label: "Vairāk nekā 5 apmierināti klienti",
      listIntro: "Daži no tiem",
    },
  },

  stats: {
    stundioUsers: "audzēkņu katru mācību dienu",
    stundioCommits: "no 545 komitiem ir mani",
    curioLoadTime: "ātrāks lapas ielādes laiks",
  },

  work: {
    heading: "Izvēlētie darbi",
    intro: "Vispirms strādājoši produkti. Katra kartīte ved uz vietni vai kodu.",
    secondaryLine: "Vispirms darbībā. Kustība tikai tur, kur tā palīdz.",
    sideProjectsHeading: "Papildu projekti",
    canvasTitle: "Izpētīt projektus",
    cursor: { drag: "Vilkt", view: "Skatīt" },
    outcomeLabel: "Rezultāts",
    projects: {
      prolifts: {
        kindLabel: "Klienta vietne",
        oneLiner:
          "Pro-lifts SIA, liftu uzņēmuma Rīgā, tīmekļa vietne. Latviešu, krievu un angļu valodā, ar video galveni, kas atskaņojas ritinot.",
        role: "Izstrādāju dizainu un kodu, iestatīju CMS un pārvaldu izvietošanu.",
        outcome: "Viena vietne trīs valodās un CMS, ko komanda atjaunina bez programmētāja.",
      },
      stundio: {
        kindLabel: "Atvērtais pirmkods",
        oneLiner:
          "Neoficiāla stundu saraksta lietotne Rīgas Valsts tehnikuma audzēkņiem. Tīmeklī, Android un Linux.",
        role: "Esmu uzrakstījis 442 no tās 545 komitiem.",
        outcome: "400+ audzēkņu pārbauda savu stundu sarakstu katru mācību dienu.",
      },
      curio: {
        kindLabel: "Izstrādāts Curio dibinātājam",
        oneLiner: "Īso ziņu lente. Pārrakstīju tās priekšgalu Next.js ar vairāku valodu atbalstu.",
        role: "Uzrakstīju 830 no 830 komitiem priekšgala repozitorijā. Lapas ielādes laiks samazinājās par 10% (vietnes analītika).",
        outcome: "Lapas ielādējas par 10% ātrāk, vairākās valodās.",
      },
      numerologgi: {
        kindLabel: "Klienta veikals",
        oneLiner: "Plānotāju interneta veikals ar CMS katalogu un karšu maksājumiem.",
        role: "Uzrakstīju visus 113 komitus.",
        outcome: "Plānotāji tiek pārdoti tiešsaistē, ar karšu maksājumiem un katalogu, ko īpašnieks rediģē pats.",
      },
      zinly: {
        kindLabel: "Līdzdibināta lietotne",
        oneLiner: "Mākslīgā intelekta mācību lietotne, kas nolasa studenta kalendāru un aizpilda katru brīvo brīdi ar īsu nodarbību.",
        role: "Līdzdibināju kopā ar Irinu Kovaļenko un izveidoju tīmekļa vietni.",
        outcome: "Īsas teksta, audio un video nodarbības, kas iekļaujas studenta brīvajās minūtēs.",
        note: "Agrīnā piekļuve tiks atvērta 2027. gada vasarā.",
      },
      "one-to-one": {
        kindLabel: "Kods",
        oneLiner:
          "Privāta reāllaika tērzēšana ar e-pasta koda autorizāciju. Darbojas uz Socket.IO, Redis, Postgres un Docker.",
        role: "Uzrakstīju visus 212 komitus visā sistēmā: priekšgals, aizmugursistēma un CI.",
        outcome: "Pilns reāllaika steks vienā repozitorijā: autorizācija, čats, dati un CI.",
        note: "Arhivēts. Vietne nav palaista, bet kods ir publisks.",
      },
      dnf: {
        kindLabel: "Papildu projekts",
        oneLiner: "Taimera lietotne Rubika kuba ātrsalikšanas meistariem.",
        role: "Mans personīgais papildu projekts, veidots ar Angular.",
        outcome: "Ērts treniņu taimeris ātrsalicējiem.",
      },
    },
  },

  how: {
    heading: "Kā es strādāju",
    intro: "Ko jūs varat sagaidīt, sadarbojoties ar mani.",
    cells: {
      launch: {
        title: "Darbībā nedēļās, nevis aģentūras mēnešos",
        body: "Dizainu, priekšgalu, aizmugursistēmu un izvietošanu veicu pats. Jums nav jāmaksā par projektu vadītājiem vai nodošanas aizkavēšanos — jūsu produkts nonāk pie reāliem lietotājiem 2–4 nedēļu laikā.",
        figures: [
          { value: "2–4 ned.", label: "no sākuma līdz palaišanai" },
          { value: "0", label: "aģentūras starpnieku" },
        ],
        stages: ["Dizains", "Priekšgals", "Aizmugure", "Izvietošana"],
      },
      cms: {
        title: "Pārtrauciet maksāt programmētājiem par teksta labojumiem",
        body: "Iestatu modernu CMS (Sanity vai Payload) atbilstoši jūsu procesiem. Jūsu komanda maina tekstus, fotoattēlus, cenas un kataloga vienumus dažu minūšu laikā — bez rēķiniem programmētājam.",
        figure: { value: "0 €", label: "par satura vai cenu atjauninājumu" },
        tools: ["Sanity", "Payload CMS"],
      },
      speed: {
        title: "Modernas tehnoloģijas, kas pārvērš klikšķus pieteikumos",
        body: "Lēnas vietnes iztērē reklāmas budžetu, pirms apmeklētājs vispār ierauga piedāvājumu. Izmantoju modernu steku (Next.js, React, TypeScript), kas nodrošina ielādi zem 1,8 sekundēm, labu vietu meklētājos un reklāmas konversiju.",
        stack: ["Next.js", "React", "TypeScript"],
      },
      support: {
        title: "2 nedēļas bezmaksas atbalsta, pēc tam ikmēneša uzturēšana",
        body: "Katra palaišana ietver divas nedēļas bezmaksas atbalsta, lai pārliecinātos, ka viss darbojas nevainojami. Vajadzīgi regulāri atjauninājumi, uzraudzība un jaunas funkcijas? Turpiniet ar prognozējamu ikmēneša abonementu.",
        phases: [
          { value: "2 ned.", label: "bez maksas pēc palaišanas" },
          { value: "Ikmēneša", label: "izvēles uzturēšanas plāns" },
        ],
        tags: ["Atjauninājumi", "Uzraudzība", "Labojumi"],
      },
      languages: {
        title: "Četras valodas, bez papildu maksas",
        body: "Saziņa ar jūsu komandu latviešu, angļu, ukraiņu vai krievu valodā — un pilns visu četru valodu atbalsts jūsu projektā bez maksas.",
        figures: [
          { value: "4", label: "atbalstītās valodas" },
          { value: "0 €", label: "vairākvalodu iestatīšana" },
        ],
      },
    },
  },

  journey: {
    heading: "Ceļš",
    intro: "Attīstības ceļš, projekts pēc projekta.",
    entries: {
      "data-pipeline": {
        title: "Google Maps datu apstrāde",
        body: "Mans pirmais komerciālais kods: visu kafejnīcu datu iegūšana lielākajās Kanādas pilsētās Upwork klientam, sinhronizējot milzīgas datu kopas ar Google Drive un Google Sheets.",
      },
      systems: {
        title: "C++ un C# pirms MI ēras",
        body: "Zema līmeņa koda rakstīšana C++ un C# vēl pirms LLM parādīšanās. Tas veidoja manu izpratni par atmiņu, datu struktūrām un to, kā programmatūra patiesībā darbojas zem pārsega.",
      },
      curio: {
        title: "Curio: priekšgals 'zem atslēgas'",
        body: "Ziņu platformas pāreja no pielāgota UI uz Shadcn iekš Next.js. Piegādāts pilns priekšgals ar vairāku valodu atbalstu, samazinot lapas ielādes laiku par 10%.",
      },
      stundio: {
        title: "Stundio: EduPage aizstājējs",
        body: "Tehnikuma oficiālais stundu saraksts telefonos nebija lietojams. Izveidoju ātru atvērtā pirmkoda klientu — tas izplatījās audzēkņu čatos bez mārketinga un kļuva par ikdienas rīku simtiem audzēkņu.",
      },
      prolifts: {
        title: "Pro-lifts nonāk darbībā",
        body: "Pilna cikla korporatīvā vietne liftu uzņēmumam Rīgā. Pilnīga atbilstība Latvijas likumdošanai, 3 valodas un Sanity CMS, lai komanda atjauninātu saturu bez koda aiztikšanas.",
      },
      numerologgi: {
        title: "Numerologgi: piegādāts pirms termiņa",
        body: "E-komercijas veikals ar Stripe maksājumiem un CMS katalogu. Klientam tas bija nepieciešams pirms novembra; pabeidzu arhitektūru, integrācijas un palaišanu jau oktobra vidū.",
      },
      freelance: {
        title: "Full-stack dibinātājiem",
        body: "Viens cilvēks, kurš aptver produkta vīziju, dizainu, arhitektūru un izvietošanu produkcijā. Ātra piegāde, tieša saziņa un nulle aģentūras virsizdevumu.",
      },
    },
  },

  about: {
    heading: "Par mani",
    nameLabel: "Kā izrunāt manu vārdu",
    bio: [
      "Esmu full-stack izstrādātājs Rīgā, Latvijā. Es veidoju tīmekļa lietotnes un aizvedu tās līdz pat palaišanai.",
      "Mana atvērtā pirmkoda lietotne Stundio ir stundu saraksts Rīgas Valsts tehnikuma audzēkņiem. Vairāk nekā 400 no viņiem to izmanto katru mācību dienu. Esmu izveidojis strādājošas vietnes uzņēmumiem Pro-lifts SIA un Numerologgi, kā arī Curio priekšgalu tā dibinātājam.",
    ],
    originLine: "Pašmācīts. Sāku ar Google Maps datu ieguvi. Tagad veidoju reālus produktus klientiem un sev.",
    schoolLine: "Mācos programmēšanu Rīgas Valsts tehnikumā (RVT).",
    languages: {
      heading: "Valodas",
      names: { uk: "Ukraiņu", ru: "Krievu", lv: "Latviešu", en: "Angļu" },
      native: "Dzimtā",
    },
    certificates: { heading: "Sertifikāti", note: "Profesionālie sertifikāti vietnē Coursera." },
  },

  client: {
    heading: "Klienta vārdi",
    quote: "Tas ir spridzeklis. Man ļoti patīk. Visi man prasīs, kurš to taisīja. Es celšu tavu cenu un reputāciju.",
  },

  testimonials: {
    heading: "Atsauksmes",
    subheading: "Klientu un līdzdibinātāju atsauksmes par izpildi, ātrumu un meistarību.",
    kinds: {
      client: "Klients",
      venture: "Līdzdibinātājs",
    },
    items: {
      prolifts: {
        quote: "Tas ir spridzeklis. Man ļoti patīk. Visi man prasīs, kurš to taisīja. Es celšu tavu cenu un reputāciju.",
        context: "Uzņēmuma vietne trijās valodās un CMS",
      },
      zinly: {
        quote: "Dmitrijs sarežģītas inženiertehniskās koncepcijas dažu dienu laikā pārvērš ātrās un intuitīvās saskarnēs. Viņa uzticamība un meistarība padara viņu par lielisku produktu veidotāju.",
        context: "MI mācību lietotne studentiem",
      },
    },
  },

  services: servicesLv,

  contact: {
    heading: "Pastāstiet, ko vēlaties palaist",
    body: "Rezervējiet 40 minūšu ievadsarunu, lai pārrunātu produkta mērķus, apjomu un palaišanas grafiku.",
    labels: { email: "", telegram: "", call: "Pieteikt ievadzvanu" },
    localTimeLabel: "Laiks Rīgā",
  },

  footer: { credit: "Izstrādājis Dmytro Polizhai Rīgā.", backToTop: "Uz augšu" },

  notFound: {
    title: "Lapa nav atrasta · Dmytro Polizhai",
    heading: "Lapa nav atrasta",
    body: "Šī lapa nepastāv vai ir pārvietota.",
    cta: "Atpakaļ uz sākumlapu",
  },

  caseStudy: {
    headings: {
      problem: "Problēma",
      constraints: "Ierobežojumi",
      built: "Ko es uzbūvēju",
      how: "Kā tas tika paveikts",
      result: "Rezultāts",
      links: "Saites",
    },
    stackGroups: {
      app: "Lietotne",
      content: "Saturs un valodas",
      forms: "Veidlapas un mēstules",
      delivery: "Piegāde",
      data: "Dati un paziņojumi",
      platforms: "Platformas",
      quality: "Testi",
    },
  },

  caseStudies: {
    prolifts: {
      meta: {
        title: "Prolifts: vietne uzņēmumam Pro-lifts SIA · Dmytro Polizhai",
        description:
          "Kā es izveidoju pro-lifts.lv — Next.js un Sanity vietni trīs valodās ar ritinot vadāmu video galveni.",
      },
      byline: "Tīmekļa vietne uzņēmumam Pro-lifts SIA, autors Dmytro Polizhai",
      intro:
        "Pro-lifts SIA ir liftu servisa uzņēmums Rīgā. Izveidoju uzņēmuma vietni trīs valodās ar CMS un video galveni, kas atskaņojas ritinot.",
      note: "Piegādāts ar manas studijas nosaukumu Multilance.",
      problem: [
        "Pro-lifts SIA uzstāda un apkalpo daudzu zīmolu liftus. Vietnei bija jāizskaidro seši pakalpojumi, jāparāda uzņēmuma pieredze un jāpalīdz apmeklētājiem sazināties.",
        "Tai bija jādarbojas latviešu, krievu un angļu valodā. Klientam bija arī jāspēj rediģēt saturu bez programmētāja iesaistes.",
      ],
      constraints: [
        "Trīs valodas. Latviešu valoda ir galvenā, krievu un angļu seko.",
        "Video galvene, kas nevainojami darbojas arī telefonā.",
        "Saturs CMS sistēmā, nevis kodā.",
      ],
      built: [
        "Galvene tiek atskaņota ritinot. Sagriezu MI video kadros, lai ritināšana kontrolētu laiku. Vertikālajiem un horizontālajiem ekrāniem ir savi kadru komplekti.",
        "Sešas pakalpojumu sadaļas, ražotāju izvēle, darba process, veikto darbu saraksts un BUJ.",
        "Saziņas veidlapa, kas nosūta e-pastu un bloķē mēstules.",
        "Sanity Studio vietnes iekšienē satura rediģēšanai un publicēšanai.",
        "Vietnes karte, strukturētie dati un sociālo tīklu attēls katrai valodai.",
      ],
      how: "Izveidoju video klipus ar Google Flow (Veo 3.1) no atslēgkadru attēliem. Pēc tam sagriezu tos kadros un uzrakstīju ritināšanas kodu pats, bez animācijas bibliotēkām. Pirms katras izvietošanas GitHub Actions veic pārbaudes, tipu pārbaudi un būvēšanu. Galvenais zars nonāk produkcijā, bet izstrādes zars — priekšskatījumā.",
      result: [
        "Vietne sāka darboties adresē pro-lifts.lv 2026. gada septembrī latviešu, krievu un angļu valodā. Tā joprojām tiek atjaunināta.",
        "Klients pats rediģē lapas saturu Sanity bez manis.",
      ],
    },
    stundio: {
      meta: {
        title: "Stundio: stundu saraksta lietotne RVT audzēkņiem · Dmytro Polizhai",
        description:
          "Kā es izveidoju Stundio — atvērtā pirmkoda stundu saraksta lietotni tīmeklim, Android un Linux. 400+ audzēkņu to lieto katru mācību dienu.",
      },
      byline: "Atvērtā pirmkoda stundu saraksta lietotne, autors Dmytro Polizhai",
      intro:
        "Radīts Rīgā. Lietots katru dienu. Stundio parāda Rīgas Valsts tehnikuma stundu sarakstu tavā tālrunī ar visām izmaiņām.",
      note: "Neoficiāla. Nav saistīta ar RVT, EduPage vai aSc.",
      problem: [
        "Mācību saraksts nepārtraukti mainās. Nodarbības tiek pārceltas, atceltas vai mainās skolotāji.",
        "Audzēkņiem ātri savā tālrunī jāredz nākamā kabineta numurs un izmaiņas.",
      ],
      constraints: [
        "Dati nāk no skolas publiskā EduPage saraksta. Es tos nekontrolēju.",
        "Nav lietotāju kontu un nav personas datu uz servera.",
        "Trīs platformas: tīmeklis, Android un Linux. Esmu galvenais izstrādātājs.",
        "Bezmaksas un ar atvērto pirmkodu.",
      ],
      built: [
        "Nākamais kabinets, kā arī atceltās, pārceltās un aizvietotās stundas tieši sarakstā.",
        "Ātra ielāde no pārlūka kešatmiņas pēc pirmā apmeklējuma ar norādi par datu svaigumu.",
        "Nav reģistrācijas. Grupu vai skolotāju izvēlas tikai vienreiz.",
        "Audzēkņa režīms ar maršrutu starp korpusiem un Skolotāja režīms.",
        "Web Push un vietējie paziņojumi.",
        "Trīs Android sākuma ekrāna logrīki.",
        "Instalējama tīmekļa lietotne, Android lietotne ar automātiskiem atjauninājumiem un Linux darbvirsmas lietotne.",
        "Latviešu, angļu un ukraiņu valoda.",
      ],
      how: "Lietotne nolasa skolas publisko EduPage stundu sarakstu. Pēc pirmā apmeklējuma pārlūks to saglabā kešatmiņā, tāpēc lietotne atveras acumirklī.",
      result: [
        "Vairāk nekā 400 audzēkņu atver Stundio katru mācību dienu. Tā ir pieejama adresē app.stundio.lv.",
        "Kods ir publisks saskaņā ar MIT licenci. Esmu uzrakstījis 442 no tās 545 komitiem (uz 2026. gada 9. novembri).",
      ],
    },
  },

  assistant: {
    navButton: "Jautāt AI",
    contactLine: "Ātrs jautājums? Jautājiet asistentam.",
    title: "Asistents",
    greeting:
      "Sveiki! Esmu AI asistents. Atbildu pēc šīs lapas satura: projekti, pakalpojumi un Dmytro darba process. Ja nezināšu atbildi, nodošu jautājumu viņam.",
    languagesHint: "Rakstiet angliski, latviski, krieviski vai ukrainiski.",
    disclaimer: "AI atbildes var būt kļūdainas. Noteicošais ir lapas saturs.",
    placeholder: "Ierakstiet jautājumu",
    send: "Sūtīt",
    stop: "Apturēt",
    reset: "Jauna saruna",
    prompts: [
      "Ko jūs izstrādājat?",
      "Parādiet strādājošu projektu",
      "Kā sākas projekts?",
      "Kā sazināties ar Dmytro?",
    ],
    handoff: {
      button: "Nosūtīt Dmytro",
      title: "Ziņa Dmytro",
      name: "Vārds (nav obligāts)",
      contact: "E-pasts vai Telegram",
      message: "Jūsu ziņa",
      privacy: "Jūsu ziņa un šī saruna tiks nosūtīta Dmytro Telegram. Nekas cits netiek saglabāts.",
      submit: "Sūtīt",
      sent: "Nosūtīts. Dmytro atbildēs uz norādīto kontaktu.",
      contactInvalid: "Norādiet e-pastu vai Telegram lietotājvārdu.",
    },
    error: {
      offline: "Asistents nav pieejams. Rakstiet Telegram vai piesakiet zvanu.",
      limit: "Pagaidām limits ir sasniegts. Mēģiniet vēlāk vai rakstiet Telegram.",
      tooLong: "Ziņa ir par garu. Līdz 1000 rakstzīmēm.",
      sendFailed: "Neizdevās nosūtīt. Mēģiniet vēlreiz vai rakstiet Telegram.",
    },
  },

  a11y: {
    skipLink: "Pāriet uz galveno saturu",
    currentSection: "pašreizējā sadaļa",
    externalLink: "atveras jaunā cilnē",
    copy: {
      button: "Kopēt e-pasta adresi",
      copied: "E-pasts nokopēts",
      failed: "Neizdevās nokopēt. Lūdzu, izmantojiet e-pasta saiti.",
    },
    customersList: "Daži no maniem klientiem",
    timeline: "Gaitas laika josla",
    portraitAlt: "Dmytro Polizhai portrets",
    assistant: {
      open: "Atvērt AI asistentu",
      log: "Saruna",
      thinking: "Asistents raksta",
    },
  },
} satisfies SiteCopy;

// ---------------------------------------------------------------------------
// Russian
// ---------------------------------------------------------------------------

export const ru = {
  meta: {
    title: "Dmytro Polizhai · Full-Stack разработчик в Риге",
    description:
      "Dmytro Polizhai — full-stack разработчик в Риге (Латвия). Проектирует, создает и запускает веб-приложения: Stundio, Prolifts, Curio.",
    og: {
      title: "Dmytro Polizhai · Full-Stack разработчик в Риге",
      description: "Запустить. Довести до идеала. Веб-приложения от первого коммита до запуска.",
      imageAlt: "Dmytro Polizhai, full-stack разработчик в Риге",
    },
  },

  common: {
    emailMe: "Написать мне",
    copied: "Скопировано",
    backToWork: "Назад к проектам",
    linkLabels: {
      visit: "Открыть сайт",
      app: "Открыть приложение",
      site: "Сайт проекта",
      caseStudy: "Читать кейс",
      source: "Исходный код на GitHub",
      contact: "Написать о проекте",
    },
    statusLabels: { live: "Работает", "repo-only": "Только код" },
    close: "Закрыть",
  },

  nav: {
    label: "Разделы",
    sections: {
      top: { label: "В начало", short: "Вверх" },
      work: { label: "Проекты", short: "Проекты" },
      how: { label: "Как я работаю", short: "Процесс" },
      journey: { label: "Опыт", short: "Опыт" },
      about: { label: "Обо мне", short: "Обо мне" },
      reviews: { label: "Отзывы", short: "Отзывы" },
      contact: { label: "Контакты", short: "Контакты" },
    },
  },

  hero: {
    headline: "Запустить. Довести до идеала.",
    identity: "Dmytro Polizhai · Full-Stack разработчик в Риге",
    subline: "Проектирую, создаю и запускаю веб-приложения — от первого коммита до работающего сайта.",
    seeWork: "Смотреть проекты",
    customers: {
      label: "Более 5 довольных клиентов",
      listIntro: "Некоторые из них",
    },
  },

  stats: {
    stundioUsers: "студентов каждый учебный день",
    stundioCommits: "из 545 коммитов написаны мной",
    curioLoadTime: "быстрее загрузка страниц",
  },

  work: {
    heading: "Проекты",
    intro: "Сначала работающие продукты. Каждая карточка ведет на сайт или исходный код.",
    secondaryLine: "Сначала результат. Движение только там, где уместно.",
    sideProjectsHeading: "Сайд-проекты",
    canvasTitle: "Исследовать проекты",
    cursor: { drag: "Тянуть", view: "Смотреть" },
    outcomeLabel: "Результат",
    projects: {
      prolifts: {
        kindLabel: "Сайт клиента",
        oneLiner:
          "Сайт компании Pro-lifts SIA, поставщика лифтов в Риге. На латышском, русском и английском, с видео в шапке при скролле.",
        role: "Разработал дизайн и код, настроил CMS и процесс деплоя.",
        outcome: "Один сайт на трех языках и CMS, которую команда обновляет без разработчика.",
      },
      stundio: {
        kindLabel: "Open source",
        oneLiner:
          "Неофициальное расписание для студентов Рижского государственного техникума. В вебе, на Android и Linux.",
        role: "Я написал 442 из 545 коммитов.",
        outcome: "Более 400 студентов проверяют расписание каждый учебный день.",
      },
      curio: {
        kindLabel: "Разработано для основателя Curio",
        oneLiner: "Лента коротких новостей. Переписал фронтенд на Next.js с поддержкой нескольких языков.",
        role: "Написал 830 из 830 коммитов во фронтенд-репозитории. Время загрузки страниц снизилось на 10% (по аналитике).",
        outcome: "Страницы загружаются на 10% быстрее, на нескольких языках.",
      },
      numerologgi: {
        kindLabel: "Магазин клиента",
        oneLiner: "Интернет-магазин планеров с каталогом в CMS и оплатой картой.",
        role: "Написал все 113 коммитов.",
        outcome: "Продажи планеров онлайн, прием карт и каталог, который владелец редактирует сам.",
      },
      zinly: {
        kindLabel: "Сооснованный продукт",
        oneLiner: "ИИ-приложение для обучения, которое анализирует календарь студента и заполняет свободные окна короткими уроками.",
        role: "Соосновал вместе с Ириной Коваленко и создал сайт.",
        outcome: "Короткие текстовые, аудио- и видеоуроки, которые помещаются в свободные минуты студента.",
        note: "Ранний доступ откроется летом 2027 года.",
      },
      "one-to-one": {
        kindLabel: "Код",
        oneLiner:
          "Приватный чат один на один в реальном времени со входом по коду из почты. Работает на Socket.IO, Redis, Postgres и Docker.",
        role: "Написал все 212 коммитов: фронтенд, бэкенд и CI.",
        outcome: "Полноценный стек реального времени в одном репозитории: авторизация, чат, данные и CI.",
        note: "Архивный проект. Сайта нет, но код открыт.",
      },
      dnf: {
        kindLabel: "Сайд-проект",
        oneLiner: "Таймер для спидкуберов, собирающих кубик Рубика на скорость.",
        role: "Мой личный сайд-проект на Angular.",
        outcome: "Сфокусированный таймер для тренировок спидкуберов.",
      },
    },
  },

  how: {
    heading: "Как я работаю",
    intro: "Чего ожидать от совместной работы со мной.",
    cells: {
      launch: {
        title: "Запуск за недели, а не месяцы агентств",
        body: "Я сам отвечаю за дизайн, фронтенд, бэкенд и деплой. Вы не платите проектным менеджерам и не теряете время на передачу задач — продукт готов к реальным клиентам за 2–4 недели.",
        figures: [
          { value: "2–4 нед.", label: "от старта до запуска" },
          { value: "0", label: "посредников" },
        ],
        stages: ["Дизайн", "Фронтенд", "Бэкенд", "Деплой"],
      },
      cms: {
        title: "Хватит платить разработчикам за правки текста",
        body: "Я настраиваю современную CMS (Sanity или Payload) под ваши процессы. Ваша команда меняет тексты, фото, цены и товары за минуты — без счетов за работу программиста.",
        figure: { value: "0 €", label: "за обновление контента или цен" },
        tools: ["Sanity", "Payload CMS"],
      },
      speed: {
        title: "Современный стек, превращающий клики в заявки",
        body: "Медленные сайты сливают рекламный бюджет до того, как клиент увидит предложение. Я использую современный стек (Next.js, React, TypeScript), обеспечивающий загрузку быстрее 1,8 секунд, позиции в поиске и конверсию.",
        stack: ["Next.js", "React", "TypeScript"],
      },
      support: {
        title: "2 недели бесплатной поддержки, затем ежемесячно",
        body: "Каждый запуск включает две недели бесплатной поддержки, чтобы убедиться в стабильной работе. Нужны регулярные обновления, мониторинг и новые функции? Продолжайте по прозрачной месячной подписке.",
        phases: [
          { value: "2 нед.", label: "бесплатно после запуска" },
          { value: "В месяц", label: "план поддержки на выбор" },
        ],
        tags: ["Обновления", "Мониторинг", "Правки"],
      },
      languages: {
        title: "Четыре языка без доплат",
        body: "Прямое общение с вашей командой на латышском, английском, украинском или русском — и полная поддержка всех четырех языков в вашем проекте бесплатно.",
        figures: [
          { value: "4", label: "языка на выбор" },
          { value: "0 €", label: "настройка мультиязычности" },
        ],
      },
    },
  },

  journey: {
    heading: "Опыт",
    intro: "Мой путь от проекта к проекту.",
    entries: {
      "data-pipeline": {
        title: "Пайплайн данных Google Maps",
        body: "Мой первый коммерческий код: сбор данных по всем кофейням в крупных городах Канады для клиента с Upwork с выгрузкой массивов в Google Drive и Google Таблицы.",
      },
      systems: {
        title: "C++ и C# до эпохи ИИ",
        body: "Низкоуровневое программирование на C++ и C# еще до появления LLM. Это сформировало глубокое понимание работы памяти, структур данных и того, как софт исполняется «под капотом».",
      },
      curio: {
        title: "Curio: фронтенд под ключ",
        body: "Перевод новостной платформы с кастомного UI на Shadcn в Next.js. Сдал полностью готовый фронтенд с мультиязычностью, снизив время загрузки страниц на 10%.",
      },
      stundio: {
        title: "Stundio: замена EduPage",
        body: "Официальное расписание техникума было непригодно для телефонов. Я создал быстрый open-source клиент — он разошелся по чатам студентов без маркетинга и стал ежедневным инструментом сотен учащихся.",
      },
      prolifts: {
        title: "Запуск Pro-lifts",
        body: "Корпоративный сайт под ключ для лифтовой компании в Риге. Полное соответствие законам Латвии, 3 языка и Sanity CMS, чтобы команда меняла контент без вмешательства в код.",
      },
      numerologgi: {
        title: "Numerologgi: сдан раньше срока",
        body: "Интернет-магазин с оплатой через Stripe и каталогом в CMS. Клиенту нужно было запуститься до ноября; я завершил архитектуру, интеграции и запуск к середине октября.",
      },
      freelance: {
        title: "Full-stack для основателей",
        body: "Один человек закрывает продуктовое видение, дизайн, архитектуру и деплой в продакшен. Быстрый результат, прямое общение и никаких накладных расходов агентств.",
      },
    },
  },

  about: {
    heading: "Обо мне",
    nameLabel: "Как произносится мое имя",
    bio: [
      "Я full-stack разработчик в Риге (Латвия). Создаю веб-приложения и довожу их до полноценного запуска.",
      "Мое open-source приложение Stundio — это расписание для студентов Рижского государственного техникума. Более 400 из них используют его каждый учебный день. Я создал работающие сайты для Pro-lifts SIA и Numerologgi, а также фронтенд Curio для его основателя.",
    ],
    originLine: "Самоучка. Начал со скрапера Google Maps. Сейчас создаю работающие продукты для клиентов и для себя.",
    schoolLine: "Изучаю программирование в Рижском государственном техникуме (RVT).",
    languages: {
      heading: "Языки",
      names: { uk: "Украинский", ru: "Русский", lv: "Латышский", en: "Английский" },
      native: "Родной",
    },
    certificates: { heading: "Сертификаты", note: "Профессиональные сертификаты на Coursera." },
  },

  client: {
    heading: "Слова клиента",
    quote: "Это пушка. Мне очень нравится. Все будут спрашивать меня, кто это делал. Буду растить тебе цену и репутацию.",
  },

  testimonials: {
    heading: "Отзывы",
    subheading: "Оценка клиентов и кофаундеров за качество, скорость и профессионализм.",
    kinds: {
      client: "Клиент",
      venture: "Сооснователь",
    },
    items: {
      prolifts: {
        quote: "Это пушка. Мне очень нравится. Все будут спрашивать меня, кто это делал. Буду растить тебе цену и репутацию.",
        context: "Сайт компании на трех языках и CMS",
      },
      zinly: {
        quote: "Дмитрий превращает сложные инженерные концепции в быстрые и интуитивные интерфейсы за считанные дни. Его надежность и мастерство делают его выдающимся создателем продуктов.",
        context: "ИИ-приложение для учебы студентов",
      },
    },
  },

  services: servicesRu,

  contact: {
    heading: "Расскажите, что вы хотите запустить",
    body: "Запланируйте 40-минутный бриф-звонок, чтобы обсудить цели вашего продукта, объем задач и сроки запуска.",
    labels: { email: "", telegram: "", call: "Запланировать звонок" },
    localTimeLabel: "Время в Риге",
  },

  footer: { credit: "Создано Dmytro Polizhai в Риге.", backToTop: "Наверх" },

  notFound: {
    title: "Страница не найдена · Dmytro Polizhai",
    heading: "Страница не найдена",
    body: "Этой страницы не существует или она была перемещена.",
    cta: "На главную страницу",
  },

  caseStudy: {
    headings: {
      problem: "Проблема",
      constraints: "Ограничения",
      built: "Что сделано",
      how: "Реализация",
      result: "Результат",
      links: "Ссылки",
    },
    stackGroups: {
      app: "Приложение",
      content: "Контент и языки",
      forms: "Формы и защита от спама",
      delivery: "Деплой",
      data: "Данные и уведомления",
      platforms: "Платформы",
      quality: "Тестирование",
    },
  },

  caseStudies: {
    prolifts: {
      meta: {
        title: "Prolifts: сайт для Pro-lifts SIA · Dmytro Polizhai",
        description:
          "Как я создал pro-lifts.lv — сайт на Next.js и Sanity на трех языках с интерактивным видео в шапке при скролле.",
      },
      byline: "Сайт для Pro-lifts SIA, разработчик Dmytro Polizhai",
      intro:
        "Pro-lifts SIA — компания по обслуживанию лифтов в Риге. Я создал сайт на трех языках с CMS и видео в шапке, управляемым скроллом.",
      note: "Сдано под брендом моей студии Multilance.",
      problem: [
        "Pro-lifts SIA монтирует и обслуживает лифты десятков брендов. Сайту требовалось наглядно описать шесть услуг, продемонстрировать опыт и упростить связь с компанией.",
        "Он должен был работать на латышском, русском и английском языках, а клиент должен был иметь возможность редактировать контент без разработчика.",
      ],
      constraints: [
        "Три языка. Латышский — основной, русский и английский — дополнительные.",
        "Видео в шапке, которое быстро и плавно работает даже на мобильных телефонах.",
        "Управление контентом через CMS, без правок в коде.",
      ],
      built: [
        "Интерактивное видео в шапке. Я разбил сгенерированное ИИ видео на кадры, привязав воспроизведение к скроллу. Для вертикальных и горизонтальных экранов используются отдельные наборы кадров.",
        "Шесть разделов услуг, выбор производителей, схема работы, галерея проектов и частые вопросы.",
        "Форма обратной связи с отправкой на почту и защитой от спама.",
        "Встроенная панель Sanity Studio для редактирования и публикации контента.",
        "Карта сайта, микроразметка и изображения для соцсетей для каждого языка.",
      ],
      how: "Видеоклипы для шапки я сгенерировал в Google Flow (Veo 3.1) на основе ключевых кадров. Затем нарезал их на секвенцию и написал логику скролла без тяжелых библиотек анимации. Перед каждым деплоем GitHub Actions запускает линтер, проверку типов и сборку. Ветка main уходит в прод, ветка dev — на превью.",
      result: [
        "Сайт запущен на pro-lifts.lv в сентябре 2026 года на латышском, русском и английском. Проект продолжает обновляться.",
        "Клиент самостоятельно редактирует содержимое страниц в Sanity без моей помощи.",
      ],
    },
    stundio: {
      meta: {
        title: "Stundio: расписание для студентов RVT · Dmytro Polizhai",
        description:
          "Как я создал Stundio — open-source приложение расписания для веба, Android и Linux. Более 400 студентов используют его каждый учебный день.",
      },
      byline: "Open-source приложение расписания, разработчик Dmytro Polizhai",
      intro:
        "Сделано в Риге. Используется каждый день. Stundio показывает расписание Рижского государственного техникума в телефоне с учетом всех замен.",
      note: "Неофициальное приложение. Не связано с RVT, EduPage или aSc.",
      problem: [
        "Расписание в техникуме постоянно меняется: уроки переносят, отменяют или назначают других преподавателей.",
        "Студентам нужно быстро со смартфона узнать номер следующего кабинета и актуальные замены.",
      ],
      constraints: [
        "Данные берутся из открытого школьного расписания EduPage, над которым у меня нет контроля.",
        "Никаких аккаунтов и хранения персональных данных на сервере.",
        "Три платформы: веб, Android и Linux. Я единственный ведущий разработчик.",
        "Бесплатно и с открытым исходным кодом.",
      ],
      built: [
        "Номер следующего кабинета, а также отмененные, перенесенные и замененные пары прямо в расписании.",
        "Мгновенная загрузка из кэша браузера после первого визита с индикатором актуальности данных.",
        "Никакой регистрации. Группа или преподаватель выбираются один раз.",
        "Режим студента с маршрутами между корпусами и режим преподавателя.",
        "Web Push и локальные уведомления.",
        "Три виджета для рабочего стола Android.",
        "Устанавливаемое веб-приложение, Android-приложение с автообновлением и десктопное приложение для Linux.",
        "Латышский, английский и украинский языки.",
      ],
      how: "Приложение считывает данные из открытого расписания EduPage техникума. После первого посещения браузер сохраняет расписание в кэше, поэтому приложение открывается мгновенно.",
      result: [
        "Более 400 студентов открывают Stundio каждый учебный день. Проект доступен по адресу app.stundio.lv.",
        "Код открыт под лицензией MIT. Я написал 442 из 545 коммитов (по состоянию на 9 ноября 2026 года).",
      ],
    },
  },

  assistant: {
    navButton: "Спросить AI",
    contactLine: "Короткий вопрос? Спросите ассистента.",
    title: "Ассистент",
    greeting:
      "Здравствуйте. Я AI-ассистент. Отвечаю по материалам этого сайта: проекты, услуги, как работает Дмитрий. Если не знаю ответа, передам вопрос ему.",
    languagesHint: "Можно писать на английском, латышском, русском или украинском.",
    disclaimer: "AI может ошибаться. Главный источник — сам сайт.",
    placeholder: "Напишите вопрос",
    send: "Отправить",
    stop: "Стоп",
    reset: "Новый чат",
    prompts: [
      "Что вы разрабатываете?",
      "Покажите живой проект",
      "С чего начинается проект?",
      "Как связаться с Дмитрием?",
    ],
    handoff: {
      button: "Передать Дмитрию",
      title: "Сообщение Дмитрию",
      name: "Имя (необязательно)",
      contact: "Email или Telegram",
      message: "Ваше сообщение",
      privacy: "Сообщение и этот чат уйдут Дмитрию в Telegram. Больше ничего не сохраняется.",
      submit: "Отправить",
      sent: "Отправлено. Дмитрий ответит на указанный контакт.",
      contactInvalid: "Укажите email или ник в Telegram.",
    },
    error: {
      offline: "Ассистент недоступен. Напишите в Telegram или запишитесь на звонок.",
      limit: "Лимит пока исчерпан. Попробуйте позже или напишите в Telegram.",
      tooLong: "Слишком длинное сообщение. До 1000 символов.",
      sendFailed: "Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.",
    },
  },

  a11y: {
    skipLink: "Перейти к основному содержимому",
    currentSection: "текущий раздел",
    externalLink: "открывается в новой вкладке",
    copy: {
      button: "Скопировать email",
      copied: "Email скопирован",
      failed: "Не удалось скопировать. Воспользуйтесь ссылкой на email.",
    },
    customersList: "Некоторые из моих клиентов",
    timeline: "Хронология пути",
    portraitAlt: "Портрет Dmytro Polizhai",
    assistant: {
      open: "Открыть AI-ассистента",
      log: "Диалог",
      thinking: "Ассистент печатает",
    },
  },
} satisfies SiteCopy;

// ---------------------------------------------------------------------------
// Ukrainian
// ---------------------------------------------------------------------------

export const uk = {
  meta: {
    title: "Dmytro Polizhai · Full-Stack розробник у Ризі",
    description:
      "Dmytro Polizhai — full-stack розробник у Ризі (Латвія). Проєктує, створює та запускає вебзастосунки: Stundio, Prolifts, Curio.",
    og: {
      title: "Dmytro Polizhai · Full-Stack розробник у Ризі",
      description: "Запустити. Довести до ладу. Вебзастосунки від першого коміту до робочого сайту.",
      imageAlt: "Dmytro Polizhai, full-stack розробник у Ризі",
    },
  },

  common: {
    emailMe: "Написати мені",
    copied: "Скопійовано",
    backToWork: "Назад до проєктів",
    linkLabels: {
      visit: "Відвідати сайт",
      app: "Відкрити застосунок",
      site: "Сайт проєкту",
      caseStudy: "Читати кейс",
      source: "Вихідний код на GitHub",
      contact: "Написати щодо проєкту",
    },
    statusLabels: { live: "Працює", "repo-only": "Лише код" },
    close: "Закрити",
  },

  nav: {
    label: "Розділи",
    sections: {
      top: { label: "Вгору", short: "Вгору" },
      work: { label: "Проєкти", short: "Проєкти" },
      how: { label: "Як я працюю", short: "Процес" },
      journey: { label: "Шлях", short: "Шлях" },
      about: { label: "Про мене", short: "Про мене" },
      reviews: { label: "Відгуки", short: "Відгуки" },
      contact: { label: "Контакти", short: "Контакти" },
    },
  },

  hero: {
    headline: "Запустити. Довести до ладу.",
    identity: "Dmytro Polizhai · Full-Stack розробник у Ризі",
    subline: "Проєктую, розробляю та запускаю вебзастосунки — від першого коміту до робочого сайту.",
    seeWork: "Дивитися проєкти",
    customers: {
      label: "Більше 5 задоволених клієнтів",
      listIntro: "Деякі з них",
    },
  },

  stats: {
    stundioUsers: "студентів щодня під час навчання",
    stundioCommits: "з 545 комітів написані мною",
    curioLoadTime: "швидше завантаження сторінок",
  },

  work: {
    heading: "Проєкти",
    intro: "Спершу діючі продукти. Кожна картка веде на сайт або код.",
    secondaryLine: "Спочатку результат. Рух лише там, де доречно.",
    sideProjectsHeading: "Сайд-проєкти",
    canvasTitle: "Дослідити проєкти",
    cursor: { drag: "Тягнути", view: "Дивитися" },
    outcomeLabel: "Результат",
    projects: {
      prolifts: {
        kindLabel: "Сайт клієнта",
        oneLiner:
          "Сайт компанії Pro-lifts SIA, що займається ліфтами в Ризі. Трьома мовами (латиська, російська, англійська), з відео у шапці при скролі.",
        role: "Спроєктував дизайн і код, налаштував CMS і автоматичний деплой.",
        outcome: "Один сайт трьома мовами та CMS, яку команда оновлює без допомоги розробника.",
      },
      stundio: {
        kindLabel: "Open source",
        oneLiner:
          "Неофіційний розклад для студентів Ризького державного технікуму. У вебі, на Android та Linux.",
        role: "Я написав 442 з 545 комітів.",
        outcome: "400+ студентів перевіряють свій розклад щодня під час навчання.",
      },
      curio: {
        kindLabel: "Розроблено для засновника Curio",
        oneLiner: "Стрічка коротких новин. Переписав фронтенд на Next.js із підтримкою кількох мов.",
        role: "Написав 830 із 830 комітів у фронтенд-репозиторії. Час завантаження сторінок зменшився на 10% (за аналітикою сайту).",
        outcome: "Сторінки завантажуються на 10% швидше, кількома мовами.",
      },
      numerologgi: {
        kindLabel: "Магазин клієнта",
        oneLiner: "Онлайн-магазин планерів із каталогом у CMS та оплатою картками.",
        role: "Написав усі 113 комітів.",
        outcome: "Продажі планерів онлайн, прийом карток і каталог, який власник редагує сам.",
      },
      zinly: {
        kindLabel: "Співзаснований застосунок",
        oneLiner: "ШІ-застосунок для навчання, що аналізує календар студента й заповнює вільні вікна короткими уроками.",
        role: "Співзаснував разом з Іриною Коваленко та створив сайт.",
        outcome: "Короткі текстові, аудіо- та відеоуроки, які вкладаються у вільні хвилини студента.",
        note: "Ранній доступ відкриється влітку 2027 року.",
      },
      "one-to-one": {
        kindLabel: "Код",
        oneLiner:
          "Приватний чат тет-а-тет у реальному часі з авторизацією через код на пошту. Працює на Socket.IO, Redis, Postgres та Docker.",
        role: "Написав усі 212 комітів: фронтенд, бекенд і CI.",
        outcome: "Повноцінний стек реального часу в одному репозиторії: авторизація, чат, дані та CI.",
        note: "В архіві. Сайту немає, але код відкритий.",
      },
      dnf: {
        kindLabel: "Сайд-проєкт",
        oneLiner: "Таймер для спідкуберів, що збирають кубик Рубіка на швидкість.",
        role: "Мій власний сайд-проєкт, створений на Angular.",
        outcome: "Зручний таймер для тренувань спідкуберів.",
      },
    },
  },

  how: {
    heading: "Як я працюю",
    intro: "Чого очікувати від нашої співпраці.",
    cells: {
      launch: {
        title: "Запуск за тижні, а не місяці агенцій",
        body: "Я особисто відповідаю за дизайн, фронтенд, бекенд і деплой. Ви не переплачуєте менеджерам проєктів і не втрачаєте час на узгодження — ваш продукт стає доступним клієнтам за 2–4 тижні.",
        figures: [
          { value: "2–4 тиж.", label: "від старту до запуску" },
          { value: "0", label: "посередників агенції" },
        ],
        stages: ["Дизайн", "Фронтенд", "Бекенд", "Деплой"],
      },
      cms: {
        title: "Досить платити розробникам за правки тексту",
        body: "Я налаштовую сучасну CMS (Sanity або Payload) під ваші процеси. Ваша команда змінює тексти, фото, ціни та товари за лічені хвилини — без додаткових рахунків від програміста.",
        figure: { value: "0 €", label: "за оновлення контенту чи цін" },
        tools: ["Sanity", "Payload CMS"],
      },
      speed: {
        title: "Сучасні технології, що перетворюють кліки на заявки",
        body: "Повільні сайти спалюють рекламний бюджет ще до того, як клієнт побачить пропозицію. Я використовую сучасний стек (Next.js, React, TypeScript), що забезпечує завантаження швидше 1,8 секунди, високі позиції в пошуку та конверсію.",
        stack: ["Next.js", "React", "TypeScript"],
      },
      support: {
        title: "2 тижні безкоштовної підтримки, далі — щомісячний догляд",
        body: "Кожен запуск включає два тижні безкоштовної підтримки для бездоганної роботи. Потрібні регулярні оновлення, моніторинг та нові функції? Залишайтеся на передбачуваній щомісячній підписці.",
        phases: [
          { value: "2 тиж.", label: "безкоштовно після запуску" },
          { value: "Щомісяця", label: "план підтримки за вибором" },
        ],
        tags: ["Оновлення", "Моніторинг", "Виправлення"],
      },
      languages: {
        title: "Чотири мови без жодних доплат",
        body: "Пряме спілкування з вашою командою латиською, англійською, українською або російською — і повна підтримка всіх чотирьох мов у вашому проєкті безкоштовно.",
        figures: [
          { value: "4", label: "мови на вибір" },
          { value: "0 €", label: "налаштування багатомовності" },
        ],
      },
    },
  },

  journey: {
    heading: "Шлях",
    intro: "Мій шлях від проєкту до проєкту.",
    entries: {
      "data-pipeline": {
        title: "Пайплайн даних Google Maps",
        body: "Мій перший комерційний код: збір даних щодо кав'ярень у найбільших містах Канади для клієнта з Upwork із синхронізацією масивів у Google Drive та Google Таблиці.",
      },
      systems: {
        title: "C++ та C# до епохи ШІ",
        body: "Низькорівневе програмування на C++ та C# ще до появи LLM. Це дало мені глибоке розуміння роботи з пам'яттю, структур даних і того, як програми виконуються на рівні системи.",
      },
      curio: {
        title: "Curio: фронтенд під ключ",
        body: "Переведення платформи новин із кастомного інтерфейсу на Shadcn у Next.js. Здав повністю готовий фронтенд із підтримкою кількох мов, зменшивши час завантаження сторінок на 10%.",
      },
      stundio: {
        title: "Stundio: заміна Edupage",
        body: "Офіційний розклад технікуму був незручним на смартфонах. Я створив швидкий open-source клієнт — він поширився студентськими чатами без жодного маркетингу і став щоденною звичкою для сотень учнів.",
      },
      prolifts: {
        title: "Запуск Pro-lifts",
        body: "Корпоративний сайт під ключ для ліфтової компанії в Ризі. Повна юридична відповідність стандартам Латвії, 3 мови та налаштування Sanity CMS для оновлення вмісту без коду.",
      },
      numerologgi: {
        title: "Numerologgi: здано достроково",
        body: "Інтернет-магазин з оплатою через Stripe і каталогом у CMS. Клієнту потрібен був запуск до листопада; я закінчив архітектуру, інтеграції та реліз уже до середини жовтня.",
      },
      freelance: {
        title: "Full-stack для засновників",
        body: "Одна людина закриває продуктове бачення, дизайн, архітектуру та реліз у прод. Швидка здача, пряме спілкування і нуль накладних витрат агенцій.",
      },
    },
  },

  about: {
    heading: "Про мене",
    nameLabel: "Як вимовляти моє ім'я",
    bio: [
      "Я full-stack розробник у Ризі (Латвія). Створюю вебзастосунки та доводжу їх до повноцінного запуску.",
      "Мій open-source застосунок Stundio — це розклад для студентів Ризького державного технікуму. Більше 400 з них використовують його щодня під час навчання. Я створив сайти для Pro-lifts SIA та Numerologgi, а також фронтенд Curio для його засновника.",
    ],
    originLine: "Самоук. Почав зі скрапера Google Maps. Тепер створюю реальні продукти для клієнтів і для себе.",
    schoolLine: "Вивчаю програмування в Ризькому державному технікумі (RVT).",
    languages: {
      heading: "Мови",
      names: { uk: "Українська", ru: "Російська", lv: "Латиська", en: "Англійська" },
      native: "Рідна",
    },
    certificates: { heading: "Сертифікати", note: "Професійні сертифікати на Coursera." },
  },

  client: {
    heading: "Слова клієнта",
    quote: "Це вогонь. Мені дуже подобається. Усі будуть питати мене, хто це зробив. Я буду ростити тобі ціну та репутацію.",
  },

  testimonials: {
    heading: "Відгуки",
    subheading: "Оцінка клієнтів та співзасновників за якість виконання, швидкість та майстерність.",
    kinds: {
      client: "Клієнт",
      venture: "Співзасновник",
    },
    items: {
      prolifts: {
        quote: "Це вогонь. Мені дуже подобається. Усі будуть питати мене, хто це зробив. Я буду ростити тобі ціну та репутацію.",
        context: "Сайт компанії трьома мовами та CMS",
      },
      zinly: {
        quote: "Дмитро перетворює складні інженерні концепції на швидкі та інтуїтивні інтерфейси за лічені дні. Його надійність і майстерність роблять його неймовірним творцем продуктів.",
        context: "ШІ-застосунок для навчання студентів",
      },
    },
  },

  services: servicesUk,

  contact: {
    heading: "Розкажіть, що ви хочете запустити",
    body: "Заплануйте 40-хвилинну бриф-розмову, щоб обговорити цілі продукту, обсяг робіт і терміни запуску.",
    labels: { email: "", telegram: "", call: "Запланувати дзвінок" },
    localTimeLabel: "Час у Ризі",
  },

  footer: { credit: "Створено Dmytro Polizhai у Ризі.", backToTop: "Вгору" },

  notFound: {
    title: "Сторінку не знайдено · Dmytro Polizhai",
    heading: "Сторінку не знайдено",
    body: "Цієї сторінки не існує, або вона була переміщена.",
    cta: "На головну сторінку",
  },

  caseStudy: {
    headings: {
      problem: "Проблема",
      constraints: "Обмеження",
      built: "Що зроблено",
      how: "Реалізація",
      result: "Результат",
      links: "Посилання",
    },
    stackGroups: {
      app: "Застосунок",
      content: "Контент і мови",
      forms: "Форми та спам",
      delivery: "Деплой",
      data: "Дані та сповіщення",
      platforms: "Платформи",
      quality: "Тести",
    },
  },

  caseStudies: {
    prolifts: {
      meta: {
        title: "Prolifts: сайт для Pro-lifts SIA · Dmytro Polizhai",
        description:
          "Як я створив pro-lifts.lv — сайт на Next.js та Sanity трьома мовами з керованим скролом відео у шапці.",
      },
      byline: "Сайт для Pro-lifts SIA, автор Dmytro Polizhai",
      intro:
        "Pro-lifts SIA — сервісна ліфтова компанія в Ризі. Я створив сайт трьома мовами з CMS та відео у шапці, що керується скролом.",
      note: "Здано під назвою моєї студії Multilance.",
      problem: [
        "Pro-lifts SIA встановлює та обслуговує ліфти багатьох виробників. Сайту потрібно було пояснити шість послуг, показати досвід компанії та спростити зв'язок.",
        "Він мав працювати латиською, російською та англійською мовами. Також клієнт мав редагувати контент без участі розробника.",
      ],
      constraints: [
        "Три мови. Латиська — основна, російська та англійська — додаткові.",
        "Відео у шапці, яке швидко та плавно працює навіть на смартфонах.",
        "Контент у CMS, а не в коді.",
      ],
      built: [
        "Шапка відтворюється під час скролу. Я розбив ШІ-відео на кадри, тож скрол безпосередньо керує часом. Для вертикальних і горизонтальних екранів створені окремі набори кадрів.",
        "Шість розділів послуг, вибір виробників, етапи роботи, список проєктів та часті запитання.",
        "Контактна форма з відправкою на пошту та блокуванням спаму.",
        "Sanity Studio всередині сайту для редагування та публікації контенту.",
        "Карта сайту, структуровані дані та зображення для соцмереж для кожної мови.",
      ],
      how: "Відеоролики для шапки я згенерував у Google Flow (Veo 3.1) на основі ключових кадрів. Потім розрізав їх на послідовність кадрів і написав код керування скролом власноруч, без анімаційних бібліотек. Перед кожним деплоєм GitHub Actions запускає лінтер, перевірку типів і збірку. Гілка main іде на прод, а dev — на прев'ю.",
      result: [
        "Сайт став доступний на pro-lifts.lv у вересні 2026 року латиською, російською та англійською мовами. Проєкт продовжує отримувати оновлення.",
        "Клієнт редагує контент сторінок у Sanity самостійно без мене.",
      ],
    },
    stundio: {
      meta: {
        title: "Stundio: застосунок розкладу для студентів RVT · Dmytro Polizhai",
        description:
          "Як я створив Stundio — open-source застосунок розкладу для вебу, Android та Linux. 400+ студентів використовують його щодня під час навчання.",
      },
      byline: "Open-source застосунок розкладу, автор Dmytro Polizhai",
      intro:
        "Створено в Ризі. Використовується щодня. Stundio показує розклад Ризького державного технікуму у вашому смартфоні з усіма змінами.",
      note: "Неофіційний застосунок. Не пов'язаний з RVT, EduPage чи aSc.",
      problem: [
        "Розклад занять постійно змінюється. Пари переносять, скасовують або змінюють викладачів.",
        "Студентам потрібно швидко побачити на телефоні потрібну аудиторію та актуальні зміни.",
      ],
      constraints: [
        "Дані беруться з публічного розкладу EduPage технікуму. Я їх не контролюю.",
        "Жодних акаунтів і збереження персональних даних на сервері.",
        "Три платформи: веб, Android та Linux. Я головний розробник.",
        "Безкоштовно та з відкритим вихідним кодом.",
      ],
      built: [
        "Номер наступної аудиторії, а також скасовані, перенесені та замінені пари прямо в списку.",
        "Швидке завантаження з кешу браузера після першого візиту з позначкою про актуальність даних.",
        "Без реєстрації. Групу чи викладача ви обираєте лише один раз.",
        "Режим студента з маршрутами між корпусами та режим викладача.",
        "Web Push та локальні сповіщення.",
        "Три віджети для головного екрана Android.",
        "Встановлюваний вебзастосунок, застосунок для Android з автооновленням та десктопний застосунок для Linux.",
        "Латиська, англійська та українська мови.",
      ],
      how: "Застосунок зчитує публічний розклад технікуму з EduPage. Після першого візиту браузер зберігає його в кеші, тому застосунок відкривається миттєво.",
      result: [
        "Понад 400 студентів відкривають Stundio щодня під час навчання. Застосунок працює за адресою app.stundio.lv.",
        "Код відкритий за ліцензією MIT. Я написав 442 з 545 комітів (станом на 9 листопада 2026 року).",
      ],
    },
  },

  assistant: {
    navButton: "Запитати AI",
    contactLine: "Коротке питання? Запитайте асистента.",
    title: "Асистент",
    greeting:
      "Вітаю. Я AI-асистент. Відповідаю за матеріалами цього сайту: проєкти, послуги, як працює Дмитро. Якщо не знаю відповіді, передам питання йому.",
    languagesHint: "Можна писати англійською, латиською, російською або українською.",
    disclaimer: "AI може помилятися. Головне джерело — сам сайт.",
    placeholder: "Напишіть питання",
    send: "Надіслати",
    stop: "Стоп",
    reset: "Новий чат",
    prompts: [
      "Що ви розробляєте?",
      "Покажіть живий проєкт",
      "З чого починається проєкт?",
      "Як зв'язатися з Дмитром?",
    ],
    handoff: {
      button: "Передати Дмитру",
      title: "Повідомлення Дмитру",
      name: "Ім'я (необов'язково)",
      contact: "Email або Telegram",
      message: "Ваше повідомлення",
      privacy: "Повідомлення і цей чат підуть Дмитру в Telegram. Більше нічого не зберігається.",
      submit: "Надіслати",
      sent: "Надіслано. Дмитро відповість на вказаний контакт.",
      contactInvalid: "Вкажіть email або нік у Telegram.",
    },
    error: {
      offline: "Асистент недоступний. Напишіть у Telegram або запишіться на дзвінок.",
      limit: "Ліміт поки вичерпано. Спробуйте пізніше або напишіть у Telegram.",
      tooLong: "Задовге повідомлення. До 1000 символів.",
      sendFailed: "Не вдалося надіслати. Спробуйте ще раз або напишіть у Telegram.",
    },
  },

  a11y: {
    skipLink: "Перейти до основного вмісту",
    currentSection: "поточний розділ",
    externalLink: "відкривається в новій вкладці",
    copy: {
      button: "Скопіювати email",
      copied: "Email скопійовано",
      failed: "Не вдалося скопіювати. Скористайтеся посиланням на email.",
    },
    customersList: "Деякі з моїх клієнтів",
    timeline: "Хронологія шляху",
    portraitAlt: "Портрет Dmytro Polizhai",
    assistant: {
      open: "Відкрити AI-асистента",
      log: "Діалог",
      thinking: "Асистент друкує",
    },
  },
} satisfies SiteCopy;

export const copy = { en, lv, ru, uk } satisfies Record<Locale, SiteCopy>;

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
