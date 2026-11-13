/**
 * Seeds Sanity CMS with the initial portfolio content from `content/site.ts` and `src/lib/pending.ts`.
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=... SANITY_API_WRITE_TOKEN=... pnpm sanity:seed
 */
import { createClient } from "next-sanity";
import { copy, defaultLocale, facts, stats } from "../../content/site.ts";
import { pendingCopy, shots } from "../lib/pending.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable.");
  process.exit(1);
}
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN environment variable.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const en = copy[defaultLocale];

async function seed() {
  const tx = client.transaction();

  // 1. Site Settings (singleton)
  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    metaTitle: en.meta.title,
    metaDescription: en.meta.description,
    ogTitle: en.meta.og.title,
    ogDescription: en.meta.og.description,
    ogImageAlt: en.meta.og.imageAlt,

    name: facts.person.name,
    givenName: facts.person.givenName,
    familyName: facts.person.familyName,
    ukrainian: facts.person.ukrainian,
    phonetic: facts.person.phonetic,
    phoneticStress: facts.person.phoneticStress,
    jobTitle: facts.person.jobTitle,
    city: facts.person.city,
    country: facts.person.country,
    email: facts.email,
    copyrightYear: facts.copyrightYear,
    portraitFallback: shots.portrait,

    aboutHeading: en.about.heading,
    nameLabel: en.about.nameLabel,
    bio: [...en.about.bio],
    originLine: en.about.originLine,
    schoolLine: en.about.schoolLine,
    languagesHeading: en.about.languages.heading,
    nativeLabel: en.about.languages.native,
    languages: facts.person.languages.map((l, idx) => ({
      _key: `lang-${idx}`,
      code: l.code,
      name: en.about.languages.names[l.code],
      level: l.level,
    })),
    certificatesHeading: en.about.certificates.heading,
    certificatesNote: en.about.certificates.note,
    certificates: facts.certificates.map((c, idx) => ({
      _key: `cert-${idx}`,
      title: c.title,
      issuer: c.issuer,
      href: c.href,
    })),

    heroHeadline: en.hero.headline,
    heroIdentity: en.hero.identity,
    heroSubline: en.hero.subline,
    heroSeeWork: en.hero.seeWork,

    workHeading: en.work.heading,
    workIntro: en.work.intro,
    canvasTitle: en.work.canvasTitle,
    cursorDrag: en.work.cursor.drag,
    cursorView: en.work.cursor.view,
    outcomeLabel: en.work.outcomeLabel,
    showProjectOutcome: pendingCopy.projectOutcome.show,

    howHeading: en.how.heading,
    howIntro: en.how.intro,
    howLaunchTitle: en.how.cells.launch.title,
    howLaunchBody: en.how.cells.launch.body,
    howLaunchFigures: en.how.cells.launch.figures.map((f, idx) => ({ _key: `lf-${idx}`, ...f })),
    howLaunchStages: [...en.how.cells.launch.stages],
    howCmsTitle: en.how.cells.cms.title,
    howCmsBody: en.how.cells.cms.body,
    howCmsFigureValue: en.how.cells.cms.figure.value,
    howCmsFigureLabel: en.how.cells.cms.figure.label,
    howCmsTools: [...en.how.cells.cms.tools],
    howSpeedTitle: en.how.cells.speed.title,
    howSpeedBody: en.how.cells.speed.body,
    howSpeedStack: [...en.how.cells.speed.stack],
    showBudgetFigures: pendingCopy.budgetFigures.show,
    budgetFigures: pendingCopy.budgetFigures.items.map((f, idx) => ({ _key: `bf-${idx}`, ...f })),
    howSupportTitle: en.how.cells.support.title,
    howSupportBody: en.how.cells.support.body,
    howSupportPhases: en.how.cells.support.phases.map((f, idx) => ({ _key: `sp-${idx}`, ...f })),
    howSupportTags: [...en.how.cells.support.tags],
    howLanguagesTitle: en.how.cells.languages.title,
    howLanguagesBody: en.how.cells.languages.body,
    howLanguagesFigures: en.how.cells.languages.figures.map((f, idx) => ({ _key: `lgf-${idx}`, ...f })),

    journeyHeading: en.journey.heading,
    journeyIntro: en.journey.intro,
    testimonialsHeading: en.testimonials.heading,
    testimonialsSubheading: en.testimonials.subheading,

    letsTalkEnabled: pendingCopy.letsTalk.show,
    letsTalkText: pendingCopy.letsTalk.text,
    contactHeading: en.contact.heading,
    contactBody: en.contact.body,
    contactCallLabel: en.contact.labels.call,
    contactCallDisplay: facts.contact[0]?.display ?? "",
    contactCallHref: facts.contact[0]?.href ?? "",
    localTimeLabel: en.contact.localTimeLabel,
    footerCredit: en.footer.credit,
    backToTop: en.footer.backToTop,
    profiles: facts.profiles.map((p, idx) => ({ _key: `prof-${idx}`, ...p })),
  });

  // 2. Projects
  const projectEntries = Object.entries(facts.projects) as [
    keyof typeof facts.projects,
    (typeof facts.projects)[keyof typeof facts.projects],
  ][];
  projectEntries.forEach(([id, proj], order) => {
    const c = en.work.projects[id];
    const shotFallback =
      id in shots.projects ? shots.projects[id as keyof typeof shots.projects] : null;
    tx.createOrReplace({
      _id: `project-${id}`,
      _type: "project",
      id,
      order,
      name: proj.name,
      status: proj.status,
      kind: proj.kind,
      kindLabel: c.kindLabel,
      display: proj.display,
      oneLiner: c.oneLiner,
      role: c.role,
      outcome: c.outcome,
      ...("note" in c && c.note ? { note: c.note } : {}),
      stack: [...proj.stack],
      stats: proj.stats.map((sid, idx) => ({
        _key: `stat-${idx}`,
        id: sid,
        value: stats[sid].value,
        suffix: stats[sid].suffix,
        label: en.stats[sid],
      })),
      links: proj.links.map((l, idx) => ({
        _key: `link-${idx}`,
        kind: l.kind,
        href: l.href,
      })),
      ...(proj.caseStudy ? { caseStudySlug: proj.caseStudy } : {}),
      ...(shotFallback ? { screenshotFallback: shotFallback } : {}),
    });
  });

  // 3. Journey Entries
  const journeyEntries = Object.entries(facts.journey) as [
    keyof typeof facts.journey,
    (typeof facts.journey)[keyof typeof facts.journey],
  ][];
  journeyEntries.forEach(([id, j], order) => {
    const c = en.journey.entries[id];
    tx.createOrReplace({
      _id: `journey-${id}`,
      _type: "journeyEntry",
      id,
      order,
      title: c.title,
      body: c.body,
      ...(j.when ? { when: j.when } : {}),
      status: j.status,
    });
  });

  // 4. Services & Services Settings
  tx.createOrReplace({
    _id: "servicesSettings",
    _type: "servicesSettings",
    show: pendingCopy.services.show,
    heading: en.services.heading,
    intro: en.services.intro,
    pickPrompt: en.services.pickPrompt,
    cta: en.services.cta,
    proofLabel: en.services.proofLabel,
    priceFrom: en.services.price.from,
    priceCustom: en.services.price.custom,
    priceMonthUnit: en.services.price.units.month,
    priceTier: en.services.price.tier,
    supportFreeNote: en.services.support.freeNote,
    supportTiers: (
      Object.keys(facts.services.supportTiers) as (keyof typeof facts.services.supportTiers)[]
    ).map((tid, idx) => ({
      _key: `tier-${idx}`,
      id: tid,
      name: en.services.support.tiers[tid].name,
      includes: en.services.support.tiers[tid].includes,
      price: facts.services.supportTiers[tid].price,
    })),
  });

  (Object.keys(facts.services.items) as (keyof typeof facts.services.items)[]).forEach((sid, order) => {
    const item = facts.services.items[sid];
    const c = en.services.items[sid];
    tx.createOrReplace({
      _id: `service-${sid}`,
      _type: "service",
      id: sid,
      order,
      name: c.name,
      outcome: c.outcome,
      ...(item.price !== null ? { price: item.price } : {}),
      priceUnit: item.priceUnit,
      proofIds: [...item.proof],
    });
  });

  // 5. Featured Client Quote (singleton)
  tx.createOrReplace({
    _id: "clientQuote",
    _type: "clientQuote",
    status: facts.clientQuote.status,
    approval: facts.clientQuote.approval,
    heading: en.client.heading,
    quote: en.client.quote,
    name: facts.clientQuote.name,
    role: facts.clientQuote.role,
    company: facts.clientQuote.company,
  });

  // 6. Testimonials
  facts.testimonials.forEach((item, order) => {
    const c = en.testimonials.items[item.id];
    tx.createOrReplace({
      _id: `testimonial-${item.id}`,
      _type: "testimonial",
      id: item.id,
      order,
      name: item.name,
      role: item.role,
      company: item.company,
      project: item.project,
      kind: item.kind,
      quote: c?.quote ?? en.client.quote,
      context: c?.context ?? "",
      ...(item.photo ? { photoFallback: item.photo } : {}),
    });
  });

  // 7. Customers
  facts.customers.forEach((cust, order) => {
    tx.createOrReplace({
      _id: `customer-${order}`,
      _type: "customer",
      order,
      name: cust.name,
      ...(cust.href && !cust.href.startsWith("[TBD") ? { href: cust.href } : {}),
      ...(cust.logo && !cust.logo.startsWith("[TBD") ? { logoFallback: cust.logo } : {}),
      status: cust.status,
    });
  });

  await tx.commit();
  console.log(`Seeded Sanity dataset "${dataset}" in project "${projectId}".`);
}

seed().catch((err) => {
  console.error("Failed to seed Sanity:", err);
  process.exit(1);
});
