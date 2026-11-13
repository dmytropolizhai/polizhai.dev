/**
 * The one door into `content/site.ts`. Components import copy and facts from here,
 * never from the content file directly, so locale selection lives in one place.
 */
import {
  copy,
  defaultLocale,
  facts,
  isTbd,
  servicesCopy,
  stats,
  urls,
  type Href,
  type ProjectId,
  type ServiceId,
  type Tbd,
  type TierId,
  type PriceUnit,
} from "@content/site";
import { pendingCopy } from "./pending";

export { facts, isTbd, servicesCopy, stats, urls };
export type { ServiceId, TierId };

/** Active locale. Only `en` exists today; add the switch here when `lv`/`ru`/`uk` land. */
export const t = copy[defaultLocale];

/** Projects whose `status` is not "hidden", derived from the literal statuses in `facts`. */
export type VisibleProjectId = {
  [K in ProjectId]: (typeof facts.projects)[K]["status"] extends "hidden" ? never : K;
}[ProjectId];

/** Visible projects in `facts` order. */
export const visibleProjects = (Object.keys(facts.projects) as ProjectId[]).filter(
  (id): id is VisibleProjectId => facts.projects[id].status !== "hidden",
);

/** "Let's talk" while that copy is pending approval, else the Contact label. Nav action and hero button. */
export const letsTalkLabel = pendingCopy.letsTalk.show ? pendingCopy.letsTalk.text : t.nav.sections.contact.label;

/** A usable href, or null when the value is still a `[TBD: ...]` gap. */
export const hrefOf = (href: string | Tbd | null | undefined): Href | null =>
  href == null || isTbd(href) ? null : (href as Href);

export const isExternal = (href: string) => href.startsWith("https://");

/** Client quote renders only when it is visible and the client signed off. */
export const showClientQuote =
  facts.clientQuote.status === "visible" && (facts.clientQuote.approval as string) === "approved";

/** "2026-09" → "September 2026", "2025" → "2025". */
export const formatWhen = (when: string | null, locale = defaultLocale) => {
  if (!when) return null;
  const [year, month] = when.split("-").map(Number);
  if (!month) return String(year);
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(year!, month - 1));
};

/** Services picker rows, in `facts` order. */
export const serviceIds = Object.keys(facts.services.items) as ServiceId[];
export const tierIds = Object.keys(facts.services.supportTiers) as TierId[];

/** Hidden while the services copy is pending and switched off. */
export const showServices = pendingCopy.services.show;

/** Visible proof projects of a service, as `visibleProjects` ids. Empty for support (links to the How support cell). */
export const serviceProof = (id: ServiceId) =>
  (facts.services.items[id].proof as readonly ProjectId[]).filter((p): p is VisibleProjectId =>
    (visibleProjects as readonly ProjectId[]).includes(p),
  );

const euro = (amount: number) => new Intl.NumberFormat(defaultLocale).format(amount);
const withUnit = (label: string, unit: PriceUnit) =>
  unit === "month" ? `${label} ${t.services.price.units.month}` : label;

/** "from 600 €", "Custom quote", "from 100 € / month". */
export const servicePriceLabel = (id: ServiceId) => {
  const { price, priceUnit } = facts.services.items[id];
  if (price === null) return t.services.price.custom;
  return withUnit(t.services.price.from.replace("{price}", euro(price)), priceUnit);
};

/** "100 € / month" for a support tier. */
export const tierPriceLabel = (id: TierId) => t.services.price.tier.replace("{price}", euro(facts.services.supportTiers[id].price));
