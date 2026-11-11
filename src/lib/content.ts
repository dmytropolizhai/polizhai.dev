/**
 * The one door into `content/site.ts`. Components import copy and facts from here,
 * never from the content file directly, so locale selection lives in one place.
 */
import { copy, defaultLocale, facts, isTbd, stats, urls, type Href, type Tbd } from "@content/site";

export { facts, isTbd, stats, urls };

/** Active locale. Only `en` exists today; add the switch here when `lv`/`ru`/`uk` land. */
export const t = copy[defaultLocale];

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
