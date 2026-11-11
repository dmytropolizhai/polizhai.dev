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

- `index.html` → `src/main.tsx` → `src/App.tsx`: Hero, `<main>` (Work, How, Journey, About, ClientQuote, Contact), Footer, Dock. The dock is last in the DOM by design.
- `src/index.css` imports Tailwind, `@fontsource-variable/archivo/wdth.css` (both axes; the wide titles need it) and `design/tokens.css`. Token classes (`type-*`, `.mark`, `texture-*`) and utilities (`bg-surface`, `text-fg-muted`, `ease-move`, `rounded-pill`) come from there; the stock Tailwind palette is removed. `index.css` adds only `container-site`, `.reveal`, `.rise-in` and `.highlight-sweep`.
- **Content goes through `src/lib/content.ts`** (`t` = active locale copy, `facts`, `hrefOf`, `showClientQuote`, `formatWhen`). Components never hard-code copy. Aliases: `@/` → `src/`, `@content/` → `content/`.
- `src/lib/pending.ts` holds everything waiting on Dmytro: **NEW** copy flags (`letsTalk`, `budgetFigures`, `curioBars`), screenshot and portrait paths (`null` renders a halftone placeholder with the same ratio and animation), and `caseStudyPagesLive` (hides `/work/*` links until those pages exist).
- One job per library:
  - React Bits Threads: hero background, `src/components/effects/threads.tsx`, lazy-loaded and desktop only, capped at 15% by wrapper opacity.
  - Magic UI NumberTicker: Stundio and Curio counters, in `ui/number-ticker.tsx`. It is adapted: the HTML ships the final value, and a `play` prop restarts the count.
  - Animate UI: icons, in `components/animate-ui/icons/`.
  - shadcn on Base UI: primitives in `components/ui/`. The button is rewritten to the design system's pill variants `primary` and `secondary`.
  - Own code: the bento grid, the dock (SmoothUI's job), and the journey rail (Aceternity's job), all rebuilt monochrome.
- Bento tiles (`sections/work/`): `Tile` passes `{ playing, reduced }` from `usePlayTrigger`. The trigger is hover or focus on a fine pointer, and once at 60% in view on touch. Each tile owns exactly one animation and must render its finished state when `reduced`.
- Entrances use `<Reveal>` (CSS rise and fade, once, stagger with `index` × 60ms). Titles and the H1 never animate.
- Dock highlight: `useActiveSection`, an IntersectionObserver band at 50% viewport. `#top` and `#client` clear it.

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
- **No lift/elevator metaphor, no "lift shaft" wording, no floor concept**, and no scroll-played Prolifts stage on the home page. The signature element is an own-code animated bento grid in Selected work.
- No green accent, no light theme, no toggle, no availability pill.
- Education shown is RVT (Riga State Technical School), not RTU. Languages: Ukrainian/Russian native, Latvian B1, English B1.
- Effects: **one job per UI library** (shadcn/ui, React Bits, Aceternity UI, Animate UI, SmoothUI); one moving thing per poster section.
- Showcase clients: Prolifts, Numerologgi, Stundio (400+ daily users), Curio ("built for Curio's founder", owner not named).
- New copy (e.g. "Let's talk" Contact line, two budget labels in How I work) needs Dmytro's OK before shipping.

## Workflow

Act as senior mentor/orchestrator: plan first and execute only after approval; delegate each task to a subagent routed by difficulty (easy → Haiku, medium → Sonnet, hardest → Opus), then spawn a reviewer agent to check its output. State the model chosen and why.
