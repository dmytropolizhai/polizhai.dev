import { useMemo } from "react";
import { useSiteContent } from "@/lib/content-context";

/** Section IDs that clear the active nav indicator when in the viewport band. */
export const NAV_CLEAR_SECTIONS = ["top", "services"] as const;

/** Memoized dock section IDs, omitting `reviews` when no approved client quote is present. */
export function useDockSections() {
  const { facts, showClientQuote } = useSiteContent();
  return useMemo(
    () => (showClientQuote ? facts.dock : facts.dock.filter((id) => id !== "reviews")),
    [facts.dock, showClientQuote],
  );
}
