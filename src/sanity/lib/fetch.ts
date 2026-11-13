import type { SanityImageSource } from "@sanity/image-url";
import {
  copy,
  defaultLocale,
  facts as defaultFacts,
  stats as defaultStats,
  type Href,
  type Link,
  type Locale,
  type ProjectId,
  type ServiceId,
  type SiteCopy,
  type StatId,
  type TierId,
} from "@content/site";
import { pendingCopy as defaultPendingCopy, shots as defaultShots } from "@/lib/pending";
import { isSanityConfigured } from "../env";
import { client } from "./client";
import { urlFor } from "./image";
import {
  CLIENT_QUOTE_QUERY,
  CUSTOMERS_QUERY,
  JOURNEY_QUERY,
  PROJECTS_QUERY,
  SERVICES_QUERY,
  SERVICES_SETTINGS_QUERY,
  SITE_SETTINGS_QUERY,
  TESTIMONIALS_QUERY,
} from "./queries";

export type ResolvedProject = {
  id: string;
  name: string;
  status: "live" | "repo-only" | "hidden";
  kind: "client" | "own" | "code" | "side";
  kindLabel: string;
  display: string;
  oneLiner: string;
  role: string;
  outcome: string;
  note?: string;
  stack: readonly string[];
  stats: readonly { id: string; value: number; suffix: string; label: string }[];
  links: readonly Link[];
  caseStudy: string | null;
  /** Either a Sanity CDN URL (`https://...`) or a local base path (`/shots/...`) or null. */
  shot: string | null;
};

export type ResolvedJourneyEntry = {
  id: string;
  title: string;
  body: string;
  when: string | null;
  status: "visible" | "hidden";
};

export type ResolvedService = {
  id: ServiceId;
  name: string;
  outcome: string;
  price: number | null;
  priceUnit: "once" | "month";
  proof: readonly string[];
};

export type ResolvedSupportTier = {
  id: TierId;
  name: string;
  includes: string;
  price: number;
  priceUnit: "month";
};

export type ResolvedTestimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  project: string;
  kind: "client" | "venture";
  quote: string;
  context: string;
  photo: string | null;
};

export type ResolvedSiteContent = {
  locale: Locale;
  t: SiteCopy;
  facts: {
    siteUrl: string;
    email: string;
    copyrightYear: number;
    person: typeof defaultFacts.person;
    contact: readonly { id: "call" | "email" | "telegram"; display: string; href: string }[];
    profiles: readonly { label: string; href: string }[];
    sections: typeof defaultFacts.sections;
    dock: typeof defaultFacts.dock;
    certificates: readonly { title: string; issuer: string; href: string }[];
    clientQuote: {
      status: "visible" | "hidden";
      approval: "pending-client-signoff" | "approved";
      name: string;
      role: string;
      company: string;
    };
  };
  projects: readonly ResolvedProject[];
  journey: readonly ResolvedJourneyEntry[];
  testimonials: readonly ResolvedTestimonial[];
  services: {
    show: boolean;
    items: readonly ResolvedService[];
    supportTiers: readonly ResolvedSupportTier[];
  };
  portrait: string | null;
  ogImage: string | null;
  pendingCopy: {
    letsTalk: { show: boolean; text: string };
    budgetFigures: {
      show: boolean;
      items: readonly { value: string; label: string }[];
    };
    projectOutcome: { show: boolean };
    services: { show: boolean };
    assistant: { show: boolean };
  };
};

function buildDefaultContent(locale: Locale = defaultLocale): ResolvedSiteContent {
  const currentCopy = copy[locale] ?? copy[defaultLocale];

  const projects: ResolvedProject[] = (Object.keys(defaultFacts.projects) as ProjectId[]).map((id) => {
    const f = defaultFacts.projects[id];
    const c = currentCopy.work.projects[id];
    const shot = id in defaultShots.projects ? defaultShots.projects[id as keyof typeof defaultShots.projects] : null;
    return {
      id,
      name: f.name,
      status: f.status,
      kind: f.kind,
      kindLabel: c.kindLabel,
      display: f.display,
      oneLiner: c.oneLiner,
      role: c.role,
      outcome: c.outcome,
      note: "note" in c ? c.note : undefined,
      stack: f.stack,
      stats: f.stats.map((sid: StatId) => ({
        id: sid,
        value: defaultStats[sid].value,
        suffix: defaultStats[sid].suffix,
        label: currentCopy.stats[sid],
      })),
      links: f.links,
      caseStudy: f.caseStudy,
      shot,
    };
  });

  const journey: ResolvedJourneyEntry[] = (Object.keys(defaultFacts.journey) as (keyof typeof defaultFacts.journey)[]).map(
    (id) => ({
      id,
      title: currentCopy.journey.entries[id].title,
      body: currentCopy.journey.entries[id].body,
      when: defaultFacts.journey[id].when,
      status: defaultFacts.journey[id].status,
    }),
  );

  const services: ResolvedService[] = (Object.keys(defaultFacts.services.items) as ServiceId[]).map((id) => ({
    id,
    name: currentCopy.services.items[id].name,
    outcome: currentCopy.services.items[id].outcome,
    price: defaultFacts.services.items[id].price,
    priceUnit: defaultFacts.services.items[id].priceUnit,
    proof: defaultFacts.services.items[id].proof,
  }));

  const supportTiers: ResolvedSupportTier[] = (Object.keys(defaultFacts.services.supportTiers) as TierId[]).map(
    (id) => ({
      id,
      name: currentCopy.services.support.tiers[id].name,
      includes: currentCopy.services.support.tiers[id].includes,
      price: defaultFacts.services.supportTiers[id].price,
      priceUnit: defaultFacts.services.supportTiers[id].priceUnit,
    }),
  );

  const testimonials: ResolvedTestimonial[] = defaultFacts.testimonials.map((item) => {
    const itemCopy = currentCopy.testimonials.items[item.id];
    return {
      id: item.id,
      name: item.name,
      role: item.role,
      company: item.company,
      project: item.project,
      kind: item.kind,
      quote: itemCopy?.quote ?? currentCopy.client.quote,
      context: itemCopy?.context ?? "",
      photo: item.photo,
    };
  });

  return {
    locale,
    t: currentCopy,
    facts: {
      siteUrl: defaultFacts.siteUrl,
      email: defaultFacts.email,
      copyrightYear: defaultFacts.copyrightYear,
      person: defaultFacts.person,
      contact: defaultFacts.contact,
      profiles: defaultFacts.profiles,
      sections: defaultFacts.sections,
      dock: defaultFacts.dock,
      certificates: defaultFacts.certificates,
      clientQuote: {
        status: defaultFacts.clientQuote.status,
        approval: defaultFacts.clientQuote.approval,
        name: defaultFacts.clientQuote.name,
        role: defaultFacts.clientQuote.role,
        company: defaultFacts.clientQuote.company,
      },
    },
    projects,
    journey,
    testimonials,
    services: {
      show: defaultPendingCopy.services.show,
      items: services,
      supportTiers,
    },
    portrait: defaultShots.portrait,
    ogImage: null,
    pendingCopy: {
      letsTalk: { ...defaultPendingCopy.letsTalk },
      budgetFigures: { ...defaultPendingCopy.budgetFigures },
      projectOutcome: { ...defaultPendingCopy.projectOutcome },
      services: { ...defaultPendingCopy.services },
      assistant: { ...defaultPendingCopy.assistant },
    },
  };
}

export const defaultSiteContent: ResolvedSiteContent = buildDefaultContent();

function imageUrl(source: SanityImageSource | null | undefined, width?: number, height?: number): string | null {
  const b = urlFor(source);
  if (!b) return null;
  let chain = b.auto("format");
  if (width) chain = chain.width(width);
  if (height) chain = chain.height(height);
  return chain.url();
}

/**
 * Fetches portfolio content from Sanity CMS at build/request time.
 * Falls back to `content/site.ts` whenever Sanity is unconfigured, empty, or unreachable.
 */
export async function getSiteContent(locale: Locale = defaultLocale): Promise<ResolvedSiteContent> {
  const fallback = buildDefaultContent(locale);
  if (!isSanityConfigured || !client) {
    return fallback;
  }

  try {
    const [settings, projects, journey, services, servicesSettings, clientQuote, testimonials] = await Promise.all([
      client.fetch(SITE_SETTINGS_QUERY),
      client.fetch(PROJECTS_QUERY),
      client.fetch(JOURNEY_QUERY),
      client.fetch(SERVICES_QUERY),
      client.fetch(SERVICES_SETTINGS_QUERY),
      client.fetch(CLIENT_QUOTE_QUERY),
      client.fetch(TESTIMONIALS_QUERY),
      client.fetch(CUSTOMERS_QUERY),
    ]);

    const next: ResolvedSiteContent = {
      ...fallback,
      locale,
      t: structuredClone(fallback.t),
      facts: { ...fallback.facts },
      pendingCopy: {
        letsTalk: { ...fallback.pendingCopy.letsTalk },
        budgetFigures: { ...fallback.pendingCopy.budgetFigures },
        projectOutcome: { ...fallback.pendingCopy.projectOutcome },
        services: { ...fallback.pendingCopy.services },
        assistant: { ...fallback.pendingCopy.assistant },
      },
    };

    if (settings) {
      if (settings.metaTitle) next.t.meta.title = settings.metaTitle;
      if (settings.metaDescription) next.t.meta.description = settings.metaDescription;
      if (settings.ogTitle) next.t.meta.og.title = settings.ogTitle;
      if (settings.ogDescription) next.t.meta.og.description = settings.ogDescription;
      if (settings.ogImageAlt) next.t.meta.og.imageAlt = settings.ogImageAlt;
      const ogImg = imageUrl(settings.ogImage, 1200, 630);
      if (ogImg) next.ogImage = ogImg;

      if (settings.name) next.facts.person = { ...next.facts.person, name: settings.name };
      if (settings.givenName) next.facts.person = { ...next.facts.person, givenName: settings.givenName };
      if (settings.familyName) next.facts.person = { ...next.facts.person, familyName: settings.familyName };
      if (settings.ukrainian) next.facts.person = { ...next.facts.person, ukrainian: settings.ukrainian };
      if (settings.phonetic) next.facts.person = { ...next.facts.person, phonetic: settings.phonetic };
      if (settings.phoneticStress) next.facts.person = { ...next.facts.person, phoneticStress: settings.phoneticStress };
      if (settings.jobTitle) next.facts.person = { ...next.facts.person, jobTitle: settings.jobTitle };
      if (settings.city) next.facts.person = { ...next.facts.person, city: settings.city };
      if (settings.country) next.facts.person = { ...next.facts.person, country: settings.country };
      if (settings.email) next.facts.email = settings.email;
      if (settings.copyrightYear) next.facts.copyrightYear = settings.copyrightYear;

      const sanityPortrait = imageUrl(settings.portrait, 900, 1200);
      if (sanityPortrait) {
        next.portrait = sanityPortrait;
      } else if (settings.portraitFallback !== undefined) {
        next.portrait = settings.portraitFallback || null;
      }

      if (settings.heroHeadline) next.t.hero.headline = settings.heroHeadline;
      if (settings.heroIdentity) next.t.hero.identity = settings.heroIdentity;
      if (settings.heroSubline) next.t.hero.subline = settings.heroSubline;
      if (settings.heroSeeWork) next.t.hero.seeWork = settings.heroSeeWork;

      if (settings.workHeading) next.t.work.heading = settings.workHeading;
      if (settings.workIntro) next.t.work.intro = settings.workIntro;
      if (settings.canvasTitle) next.t.work.canvasTitle = settings.canvasTitle;
      if (settings.cursorDrag) next.t.work.cursor.drag = settings.cursorDrag;
      if (settings.cursorView) next.t.work.cursor.view = settings.cursorView;
      if (settings.outcomeLabel) next.t.work.outcomeLabel = settings.outcomeLabel;
      if (typeof settings.showProjectOutcome === "boolean") {
        next.pendingCopy.projectOutcome.show = settings.showProjectOutcome;
      }

      if (settings.howHeading) next.t.how.heading = settings.howHeading;
      if (settings.howIntro) next.t.how.intro = settings.howIntro;
      if (settings.howLaunchTitle) next.t.how.cells.launch.title = settings.howLaunchTitle;
      if (settings.howLaunchBody) next.t.how.cells.launch.body = settings.howLaunchBody;
      if (settings.howLaunchFigures?.length) next.t.how.cells.launch.figures = settings.howLaunchFigures;
      if (settings.howLaunchStages?.length) next.t.how.cells.launch.stages = settings.howLaunchStages;

      if (settings.howCmsTitle) next.t.how.cells.cms.title = settings.howCmsTitle;
      if (settings.howCmsBody) next.t.how.cells.cms.body = settings.howCmsBody;
      if (settings.howCmsFigureValue && settings.howCmsFigureLabel) {
        next.t.how.cells.cms.figure = {
          value: settings.howCmsFigureValue,
          label: settings.howCmsFigureLabel,
        };
      }
      if (settings.howCmsTools?.length) next.t.how.cells.cms.tools = settings.howCmsTools;

      if (settings.howSpeedTitle) next.t.how.cells.speed.title = settings.howSpeedTitle;
      if (settings.howSpeedBody) next.t.how.cells.speed.body = settings.howSpeedBody;
      if (settings.howSpeedStack?.length) next.t.how.cells.speed.stack = settings.howSpeedStack;
      if (typeof settings.showBudgetFigures === "boolean") {
        next.pendingCopy.budgetFigures.show = settings.showBudgetFigures;
      }
      if (settings.budgetFigures?.length) {
        next.pendingCopy.budgetFigures.items = settings.budgetFigures;
      }

      if (settings.howSupportTitle) next.t.how.cells.support.title = settings.howSupportTitle;
      if (settings.howSupportBody) next.t.how.cells.support.body = settings.howSupportBody;
      if (settings.howSupportPhases?.length) next.t.how.cells.support.phases = settings.howSupportPhases;
      if (settings.howSupportTags?.length) next.t.how.cells.support.tags = settings.howSupportTags;

      if (settings.howLanguagesTitle) next.t.how.cells.languages.title = settings.howLanguagesTitle;
      if (settings.howLanguagesBody) next.t.how.cells.languages.body = settings.howLanguagesBody;
      if (settings.howLanguagesFigures?.length) next.t.how.cells.languages.figures = settings.howLanguagesFigures;

      if (settings.journeyHeading) next.t.journey.heading = settings.journeyHeading;
      if (settings.journeyIntro) next.t.journey.intro = settings.journeyIntro;
      if (settings.testimonialsHeading) next.t.testimonials.heading = settings.testimonialsHeading;
      if (settings.testimonialsSubheading) next.t.testimonials.subheading = settings.testimonialsSubheading;

      if (settings.aboutHeading) next.t.about.heading = settings.aboutHeading;
      if (settings.nameLabel) next.t.about.nameLabel = settings.nameLabel;
      if (settings.bio?.length >= 2) next.t.about.bio = settings.bio;
      if (settings.originLine) next.t.about.originLine = settings.originLine;
      if (settings.schoolLine) next.t.about.schoolLine = settings.schoolLine;
      if (settings.languagesHeading) next.t.about.languages.heading = settings.languagesHeading;
      if (settings.nativeLabel) next.t.about.languages.native = settings.nativeLabel;
      if (settings.certificatesHeading) next.t.about.certificates.heading = settings.certificatesHeading;
      if (settings.certificatesNote) next.t.about.certificates.note = settings.certificatesNote;
      if (settings.certificates?.length) next.facts.certificates = settings.certificates;

      if (typeof settings.letsTalkEnabled === "boolean") {
        next.pendingCopy.letsTalk.show = settings.letsTalkEnabled;
      }
      if (settings.letsTalkText) {
        next.pendingCopy.letsTalk.text = settings.letsTalkText;
      }
      if (typeof settings.showAssistant === "boolean") {
        next.pendingCopy.assistant.show = settings.showAssistant;
      }
      if (settings.contactHeading) next.t.contact.heading = settings.contactHeading;
      if (settings.contactBody) next.t.contact.body = settings.contactBody;
      if (settings.contactCallLabel) next.t.contact.labels.call = settings.contactCallLabel;
      if (settings.contactCallDisplay || settings.contactCallHref) {
        next.facts.contact = [
          {
            id: "call",
            display: settings.contactCallDisplay || next.facts.contact[0]?.display || "",
            href: settings.contactCallHref || next.facts.contact[0]?.href || "",
          },
        ];
      }
      if (settings.localTimeLabel) next.t.contact.localTimeLabel = settings.localTimeLabel;
      if (settings.footerCredit) next.t.footer.credit = settings.footerCredit;
      if (settings.backToTop) next.t.footer.backToTop = settings.backToTop;
      if (settings.profiles?.length) next.facts.profiles = settings.profiles;
    }

    if (Array.isArray(projects) && projects.length > 0) {
      next.projects = projects.map((p: Record<string, unknown>) => {
        const shotUrl = imageUrl(p.screenshot as SanityImageSource, 960, 478);
        return {
          id: String(p.id),
          name: String(p.name ?? ""),
          status: (p.status as ResolvedProject["status"]) ?? "live",
          kind: (p.kind as ResolvedProject["kind"]) ?? "client",
          kindLabel: String(p.kindLabel ?? ""),
          display: String(p.display ?? ""),
          oneLiner: String(p.oneLiner ?? ""),
          role: String(p.role ?? ""),
          outcome: String(p.outcome ?? ""),
          note: p.note ? String(p.note) : undefined,
          stack: Array.isArray(p.stack) ? p.stack.map(String) : [],
          stats: Array.isArray(p.stats)
            ? p.stats.map((s: Record<string, unknown>) => ({
                id: String(s.id ?? ""),
                value: Number(s.value ?? 0),
                suffix: String(s.suffix ?? ""),
                label: String(s.label ?? ""),
              }))
            : [],
          links: Array.isArray(p.links)
            ? p.links.map((l: Record<string, unknown>) => ({
                kind: l.kind as Link["kind"],
                href: String(l.href ?? "") as Href,
              }))
            : [],
          caseStudy: p.caseStudySlug ? String(p.caseStudySlug) : null,
          shot: shotUrl ?? (p.screenshotFallback ? String(p.screenshotFallback) : null),
        };
      });
    }

    if (Array.isArray(journey) && journey.length > 0) {
      next.journey = journey.map((j: Record<string, unknown>) => ({
        id: String(j.id),
        title: String(j.title ?? ""),
        body: String(j.body ?? ""),
        when: j.when ? String(j.when) : null,
        status: (j.status as ResolvedJourneyEntry["status"]) ?? "visible",
      }));
    }

    if (servicesSettings) {
      if (typeof servicesSettings.show === "boolean") {
        next.services.show = servicesSettings.show;
        next.pendingCopy.services.show = servicesSettings.show;
      }
      if (servicesSettings.heading) next.t.services.heading = servicesSettings.heading;
      if (servicesSettings.intro) next.t.services.intro = servicesSettings.intro;
      if (servicesSettings.pickPrompt) next.t.services.pickPrompt = servicesSettings.pickPrompt;
      if (servicesSettings.cta) next.t.services.cta = servicesSettings.cta;
      if (servicesSettings.proofLabel) next.t.services.proofLabel = servicesSettings.proofLabel;
      if (servicesSettings.priceFrom) next.t.services.price.from = servicesSettings.priceFrom;
      if (servicesSettings.priceCustom) next.t.services.price.custom = servicesSettings.priceCustom;
      if (servicesSettings.priceMonthUnit) next.t.services.price.units.month = servicesSettings.priceMonthUnit;
      if (servicesSettings.priceTier) next.t.services.price.tier = servicesSettings.priceTier;
      if (servicesSettings.supportFreeNote) next.t.services.support.freeNote = servicesSettings.supportFreeNote;
      if (Array.isArray(servicesSettings.supportTiers) && servicesSettings.supportTiers.length > 0) {
        next.services.supportTiers = servicesSettings.supportTiers.map((tier: Record<string, unknown>) => ({
          id: tier.id as TierId,
          name: String(tier.name ?? ""),
          includes: String(tier.includes ?? ""),
          price: Number(tier.price ?? 0),
          priceUnit: "month" as const,
        }));
      }
    }

    if (Array.isArray(services) && services.length > 0) {
      next.services.items = services.map((s: Record<string, unknown>) => ({
        id: s.id as ServiceId,
        name: String(s.name ?? ""),
        outcome: String(s.outcome ?? ""),
        price: typeof s.price === "number" ? s.price : null,
        priceUnit: (s.priceUnit as "once" | "month") ?? "once",
        proof: Array.isArray(s.proofIds) ? s.proofIds.map(String) : [],
      }));
    }

    if (clientQuote) {
      if (clientQuote.heading) next.t.client.heading = clientQuote.heading;
      if (clientQuote.quote) next.t.client.quote = clientQuote.quote;
      next.facts.clientQuote = {
        status: clientQuote.status ?? next.facts.clientQuote.status,
        approval: clientQuote.approval ?? next.facts.clientQuote.approval,
        name: clientQuote.name ?? next.facts.clientQuote.name,
        role: clientQuote.role ?? next.facts.clientQuote.role,
        company: clientQuote.company ?? next.facts.clientQuote.company,
      };
    }

    if (Array.isArray(testimonials) && testimonials.length > 0) {
      next.testimonials = testimonials.map((item: Record<string, unknown>) => {
        const photoUrl = imageUrl(item.photo as SanityImageSource, 128, 128);
        return {
          id: String(item.id ?? ""),
          name: String(item.name ?? ""),
          role: String(item.role ?? ""),
          company: String(item.company ?? ""),
          project: String(item.project ?? ""),
          kind: item.kind === "venture" ? "venture" : "client",
          quote: String(item.quote ?? ""),
          context: String(item.context ?? ""),
          photo: photoUrl ?? (item.photoFallback ? String(item.photoFallback) : null),
        };
      });
    }

    return next;
  } catch (error) {
    console.warn("[sanity] Failed to fetch content, falling back to content/site.ts:", error);
    return fallback;
  }
}
