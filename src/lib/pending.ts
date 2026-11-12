import type { VisibleProjectId } from "./content";

/**
 * Copy and assets the plan marks **NEW** or "needs from you". Everything here is waiting on
 * Dmytro's OK or files. Flip a flag to false to drop the element; the layout has a fallback
 * for each (design/landing-page.md, "Open items").
 */
export const pendingCopy = {
  /** Open item 1. Off → the Contact heading becomes the poster line in `type-h2`. */
  letsTalk: { show: true, text: "Let's talk" },
  /** Open item 2. Off → Speed cell in How I work loses its two budget figures. */
  budgetFigures: {
    show: true,
    items: [
      { value: "< 1.8 s", label: "main content, budget" },
      { value: "≤ 160 kB", label: "JavaScript, budget" },
    ],
  },
  /** NEW: the "Outcome" line in each project dialog, `work.projects[id].outcome` (moved off the canvas card face, 2026-11-12). Off → the dialog drops it. */
  projectOutcome: { show: true },
  /** NEW: the whole Services picker copy, `services.*` in all four locales (`servicesCopy`). Off → the section is not rendered. */
  services: { show: true },
} as const;

/**
 * Screenshots (open item 6). `null` renders a halftone placeholder with the same ratio, so swapping
 * in a file changes nothing else. A project shot is a base path in `public/shots/`: the card serves
 * `<base>.avif` with a `<base>.webp` fallback, both 960 × 478.
 */
const projectShots: Record<VisibleProjectId, string | null> = {
  prolifts: "/shots/prolifts",
  stundio: "/shots/stundio",
  curio: "/shots/curio",
  numerologgi: "/shots/numerologgi",
  zinly: "/shots/zinly",
};

export const shots = {
  projects: projectShots,
  /** Intrinsic size of every project shot, for `width`/`height` (no layout shift). */
  projectSize: { w: 960, h: 478 },
  portrait: "/images/portrait.webp" as string | null, // 3:4, black and white
};

/** Case-study pages are not built yet; their links stay hidden until they are. */
export const caseStudyPagesLive = false;
