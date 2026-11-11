# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The **polizhai.dev** rebuild: personal-brand portfolio of Dmytro Polizhai, "Full-Stack Developer". A single-page React 19 + Vite 8 + TypeScript app (Tailwind 4, shadcn on Base UI, motion), deployed as a static site on Cloudflare Pages. Planning docs (research, brand, design, content) live beside the app and are its source of truth.

## Commands

pnpm only.

- `pnpm dev`: Vite dev server
- `pnpm build`: `tsc -b && vite build` (strict TS with `noUncheckedIndexedAccess`; this is the only check, there is no lint or test setup yet)
- `pnpm typecheck`: types only
- `pnpm dlx shadcn@latest add <item>`: add registry components (`@magicui/...`, `@animate-ui/...`, React Bits URLs). After adding, check the import of `cn`: shadcn once resolved it to the npm package `cn`, which is wrong; it must be `@/lib/utils`. Strip `'use client'` and unused `React` imports.

## App architecture

- `index.html` → `src/main.tsx` → `src/App.tsx`: Hero, `<main>` (How, Journey, About, ClientQuote, Contact), Footer, Dock. The dock is last in the DOM by design. There is no Work section: the hero holds the tagline, subline, two buttons and the project canvas (panel `id="work"`).
- `src/index.css` imports Tailwind, `@fontsource-variable/archivo/wdth.css` (both axes; the wide titles need it) and `design/tokens.css`. Token classes (`type-*`, `.mark`, `texture-*`) and utilities (`bg-surface`, `text-fg-muted`, `ease-move`, `rounded-pill`, `rounded-panel`) come from there; the stock Tailwind palette is removed. `index.css` adds only `container-site`, `.reveal`, `.rise-in` and the `.mark3d*` block (`.highlight-sweep` is removed).
- **Content goes through `src/lib/content.ts`** (`t` = active locale copy, `facts`, `hrefOf`, `showClientQuote`, `formatWhen`). Components never hard-code copy. Aliases: `@/` → `src/`, `@content/` → `content/`.
- `src/lib/pending.ts` holds everything waiting on Dmytro: **NEW** copy flags (`letsTalk`, `budgetFigures`; `curioBars` is removed), screenshot and portrait paths (`null` renders a halftone placeholder with the same ratio and animation), and `caseStudyPagesLive` (hides `/work/*` links until those pages exist).
- One job per library:
  - React Bits: the hero background, `Ferrofluid` (`src/components/effects/ferrofluid.tsx`, a port). Threads is removed.
  - Magic UI NumberTicker: the stats in the project dialog (Stundio 400+, Curio 10%), in `ui/number-ticker.tsx`. It is adapted: the HTML ships the final value, and a `play` prop restarts the count.
  - Animate UI: icons, in `components/animate-ui/icons/`.
  - shadcn on Base UI: primitives in `components/ui/`, including the Dialog. The button is rewritten to the design system's pill variants `primary` and `secondary`.
  - Own code: the project canvas, the dock (SmoothUI's job), and the journey rail (Aceternity's job), all rebuilt monochrome.
- Hero: no H1 and no 3D mark. The background is the lazy WebGL `Ferrofluid`, which ignores the pointer (move and click) while it is over the canvas panel. `Mark3D` (`src/components/effects/mark-3d.tsx`) still exists but is unmounted; leave it alone.
- Project canvas (the hero's one moving thing and the site's signature element):
  - `src/hooks/use-pan-canvas.ts` (own code): refs only, no React state per frame, one rAF loop with lerp plus friction inertia. Each card wraps on its own with a modulo, so six cards are six DOM nodes with no clones. The loop stops when settled, off screen or tab hidden. Tuning lives in a `TUNING` object.
  - `sections/work/project-canvas.tsx`: the panel, and the cards as `<button id="work-<id>">`. Layout (position, size, rotation, depth) is a `LAYOUT` record keyed by `ProjectId`, so a new project fails to compile until it is placed.
  - `sections/work/project-dialog.tsx`: a shadcn Dialog on Base UI. It shows the meta, body, stats and actions, built from `sections/work/project-parts.tsx`.
  - Touch: `touch-action: pan-y`, so vertical swipes scroll the page and only horizontal pan moves the canvas. Reduced motion: static layout, 1:1 drag, no inertia.
- Entrances use `<Reveal>` (CSS rise and fade, once, stagger with `index` × 60ms). Titles and the H1 never animate.
- Navigation: `SiteNav` is the fixed top bar: lockup, section links from md up, and a "Let's talk" action. `useScrolled` uses a sentinel and an IntersectionObserver, not a scroll listener. When scrolled, the bar turns solid and everything inside it goes transparent and square. `Dock` is the bottom pill for phones only.
- `cn` uses `extendTailwindMerge` with the `pill` radius. Without it, `rounded-none` cannot override `rounded-pill`.
- Section highlight: `useActiveSection`, an IntersectionObserver band at 50% viewport. `#top` and `#client` clear it.

## Layout and source-of-truth order

When documents disagree, later entries win:

1. `research/` (`BRIEF.md` summary; `github.md`, `profile.md`, `market.md`, `stack.md`) — raw input. `BRIEF.md` still says polizhai.com; the domain is now **polizhai.dev**.
2. `brand/strategy.md` — voice, motion rules, structure, performance budgets. Its wordmark (§3) and palette/type (§6) are superseded by the design system.
3. `design/design-system.md` ("Poster mono") + `design/tokens.css` — Tailwind v4 `@theme` plus shadcn variable mapping, Archivo only, black/white/grey, **dark only, no theme toggle**. `design/preview.html` renders every token (open in a browser); `design/logo/` holds the SVGs.
4. `content/site.ts` — **all site copy and facts**; `content/copy-deck.md` is the prose mirror.
5. `design/landing-page.md` — home page plan ("a stack of posters"); quotes `site.ts` keys, so don't invent copy there.

## Content model (`content/site.ts`)

- Two layers: `facts` (names, URLs, numbers, dates, stack; never translated) and `SiteCopy` (every translatable string). Lists are `Record<Id, ...>` keyed by ids in `facts`, so a locale missing an entry fails to compile.
- Locales: `en`, `lv`, `ru`, `uk` (default `en`). Add one by copying `en`, translating, `export const lv = {...} satisfies SiteCopy`, and registering it in `copy`.
- `Tbd` values (`[TBD: ...]`) are gaps for Dmytro to fill; renderers must skip them (`isTbd`) and skip anything with `status: "hidden"`. The client quote also needs `approval: "approved"` before launch.
- Counts (442/545, 830, 212, 113, 400+) are repeated inside prose strings; grep copy when refreshing `facts.asOf`.
- Navigation is a single dock fixed at the bottom (`sections` / `dock` / `SectionId`: Work, How, Journey, About, Contact). Sections are unnumbered.

## Hard rules (decided by Dmytro)

- **Never mention game development** (NN Game Studio / UE5) anywhere on the site.
- **No lift/elevator metaphor, no "lift shaft" wording, no floor concept**, and no scroll-played Prolifts stage on the home page. The signature element is the own-code draggable project canvas in the hero.
- The project canvas is the one named exception to the design system's no-tilt, vertical-only motion and 0px radius: tilted cards, free 2D drag and `rounded-panel`. Decided by Dmytro, 2026-11-11. Everything else stays vertical, untilted and square.
- No green accent, no light theme, no toggle, no availability pill.
- Education shown is RVT (Riga State Technical School), not RTU. Languages: Ukrainian/Russian native, Latvian B1, English B1.
- Effects: **one job per UI library** (shadcn/ui, React Bits, Aceternity UI, Animate UI, SmoothUI); one moving thing per poster section.
- Showcase clients: Prolifts, Numerologgi, Stundio (400+ daily users), Curio ("built for Curio's founder", owner not named).
- New copy (e.g. "Let's talk" Contact line, two budget labels in How I work) needs Dmytro's OK before shipping. The same goes for the lv/ru/uk wording of `work.canvasTitle`, `work.cursor.*` and `common.close`.

## Workflow

Act as senior mentor/orchestrator: plan first and execute only after approval; delegate each task to a subagent routed by difficulty (easy → Haiku, medium → Sonnet, hardest → Opus), then spawn a reviewer agent to check its output. State the model chosen and why.
