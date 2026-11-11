/**
 * Copy and assets the plan marks **NEW** or "needs from you". Everything here is waiting on
 * Dmytro's OK or files. Flip a flag to false to drop the element; the layout has a fallback
 * for each (design/landing-page.md, "Open items").
 */
export const pendingCopy = {
  /** Open item 1. Off → the Contact heading becomes the poster line in `type-h2`. */
  letsTalk: { show: true, text: "Let's talk" },
  /** Open item 2. Off → Row 2 in How I work loses its two figures. */
  budgetFigures: {
    show: true,
    items: [
      { value: "1.8 s", label: "main content, budget" },
      { value: "160 kB", label: "JavaScript, budget" },
    ],
  },
  /** Open item 2b. Off → the Curio tile keeps the counter and drops the bars. */
  curioBars: { show: true, before: "before", after: "after" },
} as const;

/**
 * Screenshots (open item 6). `null` renders a halftone placeholder with the same ratio and
 * the same animation, so swapping in a file changes nothing else. Put files in `public/shots/`.
 */
export const shots = {
  prolifts: null as string | null, // full-page pro-lifts.lv, ~1200px wide
  stundio: [null, null] as (string | null)[], // two phone screens
  curio: null as string | null, // curio.today, 16:10
  numerologgi: [null, null, null] as (string | null)[], // catalogue, product, checkout
  portrait: null as string | null, // 3:4, black and white
};

/** Case-study pages are not built yet; their links stay hidden until they are. */
export const caseStudyPagesLive = false;
