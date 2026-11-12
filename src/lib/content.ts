/**
 * The one door into `content/site.ts`. Components import copy and facts from here,
 * never from the content file directly, so locale selection lives in one place.
 */
import { copy, defaultLocale, facts, isTbd, stats, urls, type Href, type ProjectId, type Tbd } from "@content/site";
import { pendingCopy } from "./pending";

export { facts, isTbd, stats, urls };

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
export const hrefOf = (href: Href | Tbd | null | undefined): Href | null =>
  href == null || isTbd(href) ? null : href;

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
