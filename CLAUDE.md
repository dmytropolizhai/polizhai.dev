# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read `AGENTS.md` first: this Next.js version has breaking changes, so check `node_modules/next/dist/docs/` before writing Next-specific code.

## What this is

The **polizhai.dev** personal-brand portfolio of Dmytro Polizhai, "Full-Stack Developer". Next.js 16 (App Router) + React 19 + TypeScript, Tailwind 4, shadcn on Base UI, `motion`. It is a **static export** (`output: "export"` in `next.config.mjs`; output dir is `out/`, not `dist/`). Content is read from Sanity CMS at build time, with a built-in fallback. `PRODUCT.md` states the product goal; planning docs (`research/`, `brand/`, `design/`, `content/`) sit beside the app.

## Commands

pnpm only.

- `pnpm dev`: Next dev server. Studio at `/studio`.
- `pnpm build`: `next build`, prerenders into `out/`. There is no lint or test setup; `pnpm typecheck` (`tsc --noEmit`) is the only check. TS is strict with `noUncheckedIndexedAccess`.
- `pnpm sanity:seed`: seeds Sanity from `content/site.ts` + `src/lib/pending.ts`. Needs `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_WRITE_TOKEN` (see `.env.example`).
- `pnpm dlx shadcn@latest add <item>`: add registry components (`@magicui/...`, `@animate-ui/...`, React Bits URLs). Afterwards check that `cn` imports from `@/lib/utils` (shadcn once resolved it to the npm package `cn`), and strip `'use client'` and unused `React` imports.

## Architecture

### Two route groups, two root layouts

There is no top-level `app/layout.tsx`. `src/app/(site)/layout.tsx` and `src/app/(studio)/layout.tsx` each render their own `<html>`.

- `(site)`: `layout.tsx` builds metadata from `getSiteContent()` and imports `src/index.css`. `page.tsx` is a server component that fetches content, wraps `<PortfolioShell />` in `SiteContentProvider`.
- `(studio)/studio/[[...tool]]`: the embedded Sanity Studio (`sanity.config.ts`, `basePath: "/studio"`), a client component with `generateStaticParams` for the static export.
- `PortfolioShell` (`'use client'`) composes the page: SiteNav, Hero, `<main>` (Services, How, Journey, About, ClientQuote, Contact), Footer, Dock. The Dock is last in the DOM by design.

### Content pipeline (the part that spans many files)

Three layers, resolved in `src/sanity/lib/fetch.ts` (`getSiteContent()`):

1. **Defaults**: `content/site.ts` (all copy and facts, TS source of truth) and `src/lib/pending.ts` (copy waiting on Dmytro, screenshot paths, portrait). `buildDefaultContent()` turns these into a `ResolvedSiteContent`.
2. **Sanity overrides**: GROQ queries in `src/sanity/lib/queries.ts`, schemas in `src/sanity/schemaTypes/`. When `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty (`isSanityConfigured` is false) the defaults are returned as is, so the site builds with no CMS.
3. **Client access**: `SiteContentProvider` in `src/lib/content-context.tsx`; components call `useSiteContent()`, which adds derived values (`visibleProjects`, `letsTalkLabel`, `showClientQuote`, service and tier price labels).

Components never hard-code copy. Aliases: `@/` → `src/`, `@content/` → `content/`. `src/lib/content.ts` is the older static accessor (`t`, `facts`, `hrefOf`, `isTbd`, `VisibleProjectId`); prefer `useSiteContent()` for anything Sanity can override. Adding a content field means touching `content/site.ts` (or `pending.ts`), the Sanity schema, the query, `ResolvedSiteContent`, and the seed script.

### `content/site.ts` model

- `facts` (names, URLs, numbers, dates, stack; never translated) and `SiteCopy` (every translatable string). Lists are `Record<Id, ...>` keyed by ids in `facts`, so a locale missing an entry fails to compile.
- Locales: `en`, `lv`, `ru`, `uk`; only `en` is active (`defaultLocale`). Add one by copying `en`, translating, `export const lv = {...} satisfies SiteCopy`, and registering it in `copy`.
- `Tbd` values (`[TBD: ...]`) are gaps for Dmytro; renderers must skip them (`isTbd`) and skip `status: "hidden"`. The client quote also needs `approval: "approved"`.
- `src/lib/pending.ts` holds the NEW-copy flags (`letsTalk`, `budgetFigures`, `projectOutcome`), screenshot base paths (`/shots/<id>.avif` + `.webp`), and the portrait path (`null` renders a halftone placeholder).
- Counts (442/545, 830, 212, 113, 400+) are repeated inside prose strings; grep copy when refreshing `facts.asOf`.

### Styling and UI

- `src/index.css` imports Tailwind, `@fontsource-variable/archivo/wdth.css` and `design/tokens.css`. Token classes (`type-*`, `.mark`, `texture-*`) and utilities (`bg-surface`, `text-fg-muted`, `ease-move`, `rounded-pill`, `rounded-panel`) come from the tokens; the stock Tailwind palette is removed. `index.css` adds `container-site`, `.reveal`, `.rise-in`, `.glass-*` (canvas cards) and `.mark3d*`.
- `cn` (`src/lib/utils.ts`) uses `extendTailwindMerge` with the `pill` radius; without it `rounded-none` cannot override `rounded-pill`.
- One job per UI library: React Bits = hero `Ferrofluid` background (`effects/ferrofluid.tsx`, a port); Magic UI = `ui/number-ticker.tsx` (adapted: HTML ships the final value, `play` restarts the count); Animate UI = icons in `components/animate-ui/icons/`; shadcn on Base UI = primitives in `components/ui/` (the button has the pill variants `primary`/`secondary`); own code = project canvas, dock, journey rail. `effects/mark-3d.tsx` and `liquid-ether.*` exist but are unmounted; leave them alone.
- Hero: H1 is the motto, static and the LCP (`type-display type-display-poster`, hero-only modifier). Buttons: "See the work" (scrolls the canvas to fill the viewport, then focuses it) and "Email me" (`CopyEmailButton`).
- **Project canvas** (the hero's one moving thing, the signature element), in `components/sections/projects/`: `use-pan-canvas.ts` (`src/hooks`) is refs only, no React state per frame, one rAF loop with lerp plus inertia, per-card modulo wrap, tuning in a `TUNING` object. `project-canvas.tsx` holds a `LAYOUT` record keyed by `VisibleProjectId`, so a newly visible project fails to compile until it is placed. Cards are Liquid Glass (`.glass-card`): nothing above them may set filter, opacity, mask or clip-path (it breaks the backdrop root), so edge fades are overlays. `project-dialog.tsx` is a shadcn Dialog on Base UI. Touch uses `touch-action: pan-y`; reduced motion gives a static layout.
- Entrances use `<Reveal>` (CSS rise and fade, once, stagger `index` × 60ms). Titles and the H1 never animate.
- `SiteNav` is the fixed top bar (`useScrolled` uses a sentinel + IntersectionObserver, not a scroll listener); `Dock` is the bottom pill for phones only; `useActiveSection` is an IntersectionObserver band at 50% viewport.

## Source-of-truth order

When documents disagree, later entries win:

1. `research/` (`BRIEF.md` summary): raw input. It still says polizhai.com; the domain is **polizhai.dev**.
2. `brand/strategy.md`: voice, motion rules, structure, budgets. Its wordmark (§3) and palette/type (§6) are superseded by the design system.
3. `design/design-system.md` ("Poster mono") + `design/tokens.css`: Archivo only, black/white/grey, **dark only, no theme toggle**. `design/preview.html` renders every token.
4. `content/site.ts`: all site copy and facts; `content/copy-deck.md` is the prose mirror.
5. `design/landing-page.md`: home page plan ("a stack of posters"); quotes `site.ts` keys, so don't invent copy.

## Hard rules (decided by Dmytro)

- **Never mention game development** (NN Game Studio / UE5) anywhere on the site.
- **No lift/elevator metaphor, no "lift shaft" wording, no floor concept**, and no scroll-played Prolifts stage on the home page.
- The project canvas is the one named exception to the design system's no-tilt, vertical-only motion, 0px radius and no-depth rules (tilted cards, free 2D drag, rounded Liquid Glass). The canvas itself has no frame. Everything else stays vertical, untilted, flat and square.
- No green accent, no light theme, no toggle, no availability pill.
- Education shown is RVT (Riga State Technical School), not RTU. Languages: Ukrainian/Russian native, Latvian B1, English B1.
- One job per UI library; one moving thing per poster section.
- Showcase clients: Prolifts, Numerologgi, Stundio (400+ daily users), Curio ("built for Curio's founder", owner not named).
- New copy (the "Let's talk" Contact line, budget labels in How I work) needs Dmytro's OK before shipping, as do the lv/ru/uk wording of `work.canvasTitle`, `work.cursor.*` and `common.close`.

## Workflow

Act as senior mentor/orchestrator: plan first and execute only after approval; delegate each task to a subagent routed by difficulty (easy → Haiku, medium → Sonnet, hardest → Opus), then spawn a reviewer agent to check its output. State the model chosen and why.
