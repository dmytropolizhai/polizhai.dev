# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State of the repo

Pre-code planning workspace for the **polizhai.dev** rebuild (personal-brand portfolio of Dmytro Polizhai, "Full-Stack Developer"). There is no `package.json`, no app source, no git repo, and no build/lint/test commands yet. Everything here is research, brand, design and content that the future React/Vite/TS app will consume. Planned deployment: static site on Cloudflare Pages.

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
