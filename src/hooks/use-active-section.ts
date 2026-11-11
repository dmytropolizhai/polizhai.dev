import { useEffect, useState } from "react";

/**
 * The section crossing the middle of the viewport. One IntersectionObserver with a
 * zero-height band at 50%, no scroll listener (landing-page.md, "The dock").
 * The hero (`#top`) and any untracked section clear the selection, so nothing is marked there.
 */
export function useActiveSection<T extends string>(ids: readonly T[], clearIds: readonly string[] = ["top", "client"]) {
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    const tracked = new Set<string>(ids);
    const targets = [...ids, ...clearIds]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(tracked.has(entry.target.id) ? (entry.target.id as T) : null);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, clearIds]);

  return active;
}
