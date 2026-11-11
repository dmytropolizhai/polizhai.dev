# Stack feasibility: Vite + React 19 + TS + Tailwind v4 + five component sources

Date of study: 2026-11-09. Method: `npm view` for versions; registry JSON fetched directly from each site; official docs; and a **real install test** in a throwaway Vite project (since deleted) where I ran `shadcn init` plus 9 components from 4 registries, then `tsc -b` and `vite build`.

Verdict: **feasible, low conflict risk, with 5 concrete traps** (section 2). All five sources install through the shadcn CLI into a Vite project. The only genuine blockers are Aceternity's missing keyframes and unclear licence wording, and SmoothUI's token injection.

Reviewer verdict (2026-11-09): **PASS WITH FIXES.** Versions and most claims re-verified. Three corrections matter: (1) adding React Bits BlurText **rewrites the direct `motion` dependency from ^14 to ^12**, and the proposed `overrides` fix makes this worse by hiding the peer mismatch (2.3); (2) the shortlist in section 4 broke the motion budget in market.md and has been replaced by a section map; (3) Cloudflare's own Pages docs now say "Start new projects with Workers", so deploy target changed (section 6). See "Decisions" (binding) and "Review notes" (end of file).

## Decisions (reviewer, binding for v1)

Each decision is backed by a measurement or a source in "Review notes". Change one only by editing this list.

1. **Primitives: Base UI (`base-nova`, the CLI default).** Measured: entry with one shadcn Button is 83.3 kB gz on Base UI vs 81.9 kB gz on Radix (`radix-nova`), so size is not a factor. Base UI wins because it is the CLI default (no fighting future `shadcn add`), and `@animate-ui/react` ships both `primitives/base-ui/*` and `primitives/radix-ui/*`. Rule: use Base UI's `render` prop, never `asChild`. Do not add Radix-based third-party items (some SmoothUI items pull `@radix-ui/react-slot`/`-popover`).
2. **One `cn`: the `cn` npm package (0.5.2, shadcn-ui/cn).** It is the only implementation. shadcn primitives import `from "cn"` directly; `src/lib/utils.ts` stays as the one-line `export { cn } from "cn"` only because third-party registry items import `@/lib/utils`. Never install `clsx`/`tailwind-merge`. Note `cn` declares `engines.node >=22`.
3. **One motion: `motion` exact `14.11.1`, no `overrides`.** `overrides: { motion: "$motion" }` was tested and does not help: `shadcn add @react-bits/BlurText-TS-TW` still rewrote `"motion"` to `^12.43.0`, and with the override in place `npm ls motion` exited 0 while `@animate-ui/react` (peer `^14`) got 12. Guard instead: a `prebuild` check that `motion/package.json` version starts with `14.`, plus `git diff package.json` after every `shadcn add`. Own code uses `motion/react`; never install `framer-motion`.
4. **No GSAP in v1.** The Prolifts frame sequence uses `motion`'s `useScroll` + CSS `position: sticky` (section 4.2). Measured cost over a bare React entry (68.6 kB gz): `useScroll` +5.5 kB gz; `gsap` + `ScrollTrigger` +44.4 kB gz.
5. **Libraries in v1: shadcn + `@animate-ui/react` only.** React Bits, Aceternity and SmoothUI stay registered in `components.json` but ship **zero** items in v1: no section slot needs them under the market.md motion budget (section 4.1). Any later item must replace a "plain" cell in the section map, not add a new effect.
6. **Folders:**
   ```
   src/
     components/ui/        shadcn primitives (CLI-owned; restyle via tokens, not edits)
     components/fx/<src>/  third-party effects: shadcn add ... --path src/components/fx/<src>  (verified to work)
     components/           own shared pieces (FrameSequence, CopyEmail, Section)
     sections/             Nav, Hero, Proof, Work, About, Stack, Contact, Footer: compose only
     content/*.ts          typed data: type + satisfies, no JSX
     lib/utils.ts          the cn re-export (only file in lib/ at start)
     styles/fx.css         @theme keyframes + any vendor tokens
   ```
   Provenance header in every fx file: `// source: @react-bits/LogoLoop-TS-TW, MIT + Commons Clause (c) David Haz, added 2026-11`.
7. **CSS isolation:** `src/index.css` holds only Tailwind imports, shadcn tokens and brand tokens. Everything a third-party item needs (keyframes, `--animate-*`, SmoothUI tokens/utilities) goes into `src/styles/fx.css`, imported once from `index.css`. The CLI always writes into `components.json` `tailwind.css` (`src/index.css`), so after any third-party `add`: `git diff src/index.css`, move the vendor block into `fx.css` under a `/* vendor: smoothui tokens.json */` comment, delete unused vars. One global reduced-motion rule lives in `fx.css`.
8. **Content as typed data:** `src/content/{projects,proof,profile,stack}.ts`, e.g. `export const projects = [...] as const satisfies readonly Project[]` with `type Project = { slug: string; name: string; url: string; line: string; stack: readonly string[]; status: "live" | "pending-approval" }`. Sections read content; content never imports components. Unapproved entries (Numerologgi, Prolifts until client approval) filtered by `status`.
9. **Static HTML, not a bare SPA:** build-time prerender with `react-dom/static` `prerender()` from a Vite SSR build, then `hydrateRoot`. Prototype worked in ~15 lines (Animate UI CopyButton rendered to HTML). Routes: `/`, later `/work/prolifts`, `/work/stundio`, `/404`, each written to its own `index.html`; plain `<a href>` between them, no router dependency. Required by market.md SEO step 1 and the biggest LCP lever.
10. **Reduced motion, once:** `<MotionConfig reducedMotion="user">` at the root covers all motion/Animate UI transforms; `useReducedMotion()` gates the frame sequence (poster only, no frames fetched).
11. **Deploy: Cloudflare Workers Static Assets** (assets-only `wrangler.jsonc`, no Worker script), Workers Builds from GitHub, `.node-version` = `22`. No contact form backend (market.md: one contact path = copy email + mailto).
12. **Budgets (CI-checked):** entry JS ≤ 120 kB gz, total JS ≤ 160 kB gz, CSS ≤ 15 kB gz; Lighthouse mobile lab FCP ≤ 1.2 s, LCP ≤ 1.8 s, TBT ≤ 100 ms, CLS ≤ 0.02; Prolifts frames ≤ 1 MB mobile / ≤ 3 MB desktop, never fetched before `load` (section 3.1).

## 0. Verified versions (npm, 2026-11-09)

| Package | Version | Notes |
|---|---|---|
| react / react-dom | 19.3.1 | |
| vite | 8.3.7 | needs Node `^20.19 \|\| >=22.12` |
| @vitejs/plugin-react | 6.3.0 | peer `vite ^8` |
| typescript | 7.0.2 | Vite template pins `~7.0.2`; template does **not** enable `strict` (add it) |
| tailwindcss / @tailwindcss/vite | 4.3.5 | plugin peer `vite ^5.2 \|\| ^6 \|\| ^7 \|\| ^8` |
| shadcn (CLI) | 4.23.0 | |
| motion (= framer-motion, same 14.11.1) | 14.11.1 | peer React 18 or 19; import from `motion/react` |
| gsap / @gsap/react | 3.15.1 / 2.1.2 | |
| @animate-ui/react | 2.4.3 | peer `react ^19`, `motion ^14` (most other peers optional) |
| lucide-react | 1.70.0 | |
| tw-animate-css | 1.4.0 | replaces `tailwindcss-animate` on v4 |
| ogl / three | 1.0.11 / 0.187.0 | only if a component needs them (see section 3) |
| cn | 0.5.2 | added by `shadcn init`; `engines.node >=22` (reviewer) |
| @base-ui/react / radix-ui | 1.9.0 / 1.8.1 | Base UI pulled by `base-nova`; Radix by `radix-nova` (reviewer) |
| wrangler / @cloudflare/vite-plugin | 4.159.0 / 1.68.0 | plugin peer `vite ^6.1 \|\| ^7 \|\| ^8`; plugin not needed for assets-only deploy (reviewer) |

Reviewer re-check 2026-11-09: every version above matches `npm view` (react 19.3.1, tailwindcss and @tailwindcss/vite 4.3.5, motion = framer-motion 14.11.1, @animate-ui/react 2.4.3 with peers `react ^19`, `motion ^14` and all primitive libs optional, shadcn 4.23.0 with `engines.node >=20.18.1`, gsap 3.15.1, @gsap/react 2.1.2, vite 8.3.7 with `engines.node ^20.19 || >=22.12`). Note `shadcn init` also adds `shadcn` itself as a dependency, because the generated `index.css` imports `shadcn/tailwind.css`; it is build-time only and can move to `devDependencies`.

## 1. Per library

All five are **copy-in-source** libraries, not runtime dependencies. You own the files after install. Tests below come from my install run unless stated.

### 1.1 shadcn/ui
- Source: https://ui.shadcn.com/docs/installation/vite, https://ui.shadcn.com/docs/components-json
- Install: `npx shadcn@latest init`, then `npx shadcn@latest add <name>`. Vite is a first-class target (`init -t vite` also exists, but it is interactive about monorepos; I did not use it).
- Tailwind: v4 (`tailwind.config` left empty). React 19. TS output (`"tsx": true`).
- Primitive base: **the current default style is `base-nova` (Base UI, `@base-ui/react`)**, not Radix. This is a change from older shadcn. Radix is still an option at init; decide up front, see risk R3.
- Animation: none by default; `tw-animate-css` (CSS) for transitions.
- Next-only APIs: none in `ui/*`. Set `"rsc": false`.
- Licence: MIT. No paid tier.
- Observed: `init` generated `src/lib/utils.ts` as `export { cn } from "cn"`. The `cn` npm package is `github.com/shadcn-ui/cn`, a "drop-in replacement for clsx + tailwind-merge". It is a **new dependency instead of the clsx + tailwind-merge pair**. See 2.1.

### 1.2 React Bits (reactbits.dev, ~1274 registry items)
- Source: https://reactbits.dev/get-started/installation, GitHub `DavidHDev/react-bits`.
- Install: `npx shadcn@latest add @react-bits/<Name>-<TS|JS>-<TW|CSS>` e.g. `SplitText-TS-TW`. Namespace: `"@react-bits": "https://reactbits.dev/r/{name}.json"`. Also jsrepo: `npx jsrepo@latest add https://reactbits.dev/r/SplitText-TS-TW`. Manual copy from each Code tab.
- Variants: JS/TS x CSS/Tailwind. **Use `-TS-TW`.**
- Vite: works. I installed SplitText, Aurora, LogoLoop and built them with no changes. No `next/*` imports in the ones I scanned (SplitText, Aurora, Particles, LogoLoop, Dock, SpotlightCard, BlurText, ScrollReveal, Threads, Silk, CircularGallery, BounceCards, StaggeredMenu). Every file starts with `'use client'`, which is harmless in Vite.
- Deps vary per component, declared in the registry item: SplitText/ScrollReveal/StaggeredMenu use `gsap` (+`@gsap/react`); BlurText uses `motion@^12` (reviewer-verified: registry declares `motion@^12.23.12`, and installing it **downgrades the project's direct `motion` from ^14.11.1 to ^12.43.0**, see 2.3); Dock pins `react-dom@^19`. WebGL backgrounds (Aurora, Silk, Threads, Particles, Orb, Galaxy, LiquidEther, Iridescence, Ballpit) are **zero-dependency raw WebGL** in the current registry (no `ogl`/`three` import found in what I fetched). Re-verify per component before adding.
- Tailwind v4: the TW variants use plain utility classes and compiled under v4 with no config.
- File placement: **it landed in `src/components/` root, not `ui/`** (no `fx` folder). Move/relocate manually, see section 5.
- Licence: **MIT + Commons Clause** (c) 2026 David Haz. Free to use in an app, website or product; you may not sell or redistribute the components themselves. Fine for a client portfolio. No paid tier found.

### 1.3 Aceternity UI (ui.aceternity.com, ~318 registry items)
- Source: https://ui.aceternity.com/docs/cli. Install: `npx shadcn@latest add @aceternity/<name>` with `"@aceternity": "https://ui.aceternity.com/registry/{name}.json"` (or the full URL form).
- Vite: works (verified installing bento-grid, spotlight, timeline). The Next.js docs page is just the shadcn init flow. No `next/*` imports in the 13 items I scanned. `"use client"` appears and is harmless.
- Animation lib: registry code imports `from "motion/react"` (checked background-beams, text-generate-effect, timeline, floating-dock, animated-testimonials, lamp, glowing-effect, sparkles). Good: no legacy `framer-motion`.
- Extra deps: bento-grid, floating-dock, animated-testimonials need `@tabler/icons-react` (a second icon set next to lucide; swap icons to lucide to avoid it). sparkles pulls `@tsparticles/*` (heavy, avoid). wavy-background needs `simplex-noise`.
- **Tailwind v4 gap:** registry items carry **no `css`/`tailwind` field**, so custom animation classes are not installed. Spotlight uses `animate-spotlight`, infinite-moving-cards `animate-scroll`, aurora-background `animate-aurora`. They silently do nothing until you add `@theme` keyframes yourself (resolution in 2.4).
- Quality note: the generated files had TS6133 unused-import errors under `noUnusedLocals` (`React` in spotlight, `useMotionValueEvent` in timeline). Fix by hand.
- Licence: **free tier (the 100+ "components") has no licence text I could find on the pages I could fetch** (pricing page says "Free, forever"; `/licence` covers Pro items only). Pro (blocks/templates/pages, $169-$199 one-time) is paid; **avoid Pro** (items in the registry with `pro` blocks, e.g. page templates). Flagged as open question Q1.
- Reviewer, primary source found: Aceternity's own `https://ui.aceternity.com/llms-full.txt` (generated 2026-11-09) states: "components are free to use in unlimited personal and commercial projects. Reselling or redistributing the components as a competing library is not permitted", and the FAQ there: "unlimited personal and commercial client projects". So a portfolio and client sites are fine. Caveats: this is not an SPDX licence and contradicts the generic site `/terms` ("for your own personal use", no redistribution), and `/licence` is titled "Aceternity UI Pro". Moot for v1 (no Aceternity items, Decision 5); if one is added later, save a dated copy of that llms-full.txt line in the repo next to the file.

### 1.4 Animate UI (animate-ui.com)
- Source: https://animate-ui.com/docs/installation, https://animate-ui.com/docs/react (read via the `.md` endpoints and `llms.txt`).
- **This changed from the old "v1 copy-paste components" model.** v2 is an npm package `@animate-ui/react` (v2.4.3) exporting animated drop-in versions of Radix / Base UI / React Aria primitives plus its own primitives (text effects, cursor, tilt, magnetic, highlight, typing text, etc.), plus **registry-delivered** backgrounds and icons.
- Install: `npm i @animate-ui/react motion`, then either import `@animate-ui/react/primitives/<name>` directly, or run `npx @animate-ui/cli@latest animate all` to rewrite your shadcn components' primitive imports. Registry items (backgrounds, icons, page-transition) via `npx shadcn@latest add @animate-ui/backgrounds-stars` with `"@animate-ui": "https://animate-ui.com/r/{name}.json"`. The registry holds only ~16 non-icon items (9 backgrounds, 4 buttons, 3 page-transition) plus ~773 animated icons.
- React: **19 only** (peer `^19`). `motion ^14`. Tailwind not stated in docs; the install ran fine on v4.
- Vite: nothing Next-specific in the background I scanned; page-transition has React Router / TanStack variants (skip, it is a single-page site). Import `cn` from the `cn` package (see 2.1).
- Licence: **MIT + Commons Clause** (c) 2025 Elliot Sutton (from the package's `LICENSE.md`; npm field says "SEE LICENSE IN LICENSE.md"). Same terms as React Bits. No paid tier found.
- Reviewer-verified from the 2.4.3 tarball: grant is to use/modify/distribute "as part of an application, website, or product"; restriction: "you do not sell or redistribute the components themselves in their original form". Practical meaning: a personal portfolio, a public GitHub repo of that portfolio, and client websites you are paid to build are all fine (you sell the site, not the components). Not fine: selling or giving away a template/starter/UI kit made of these components (e.g. "Multilance landing kit", a ThemeForest template, a reusable fx package). Keep the copyright notice: npm keeps `LICENSE.md` in `node_modules`, and copied React Bits files need the provenance header (Decision 6).
- Reviewer: the primitives exist in the package as `@animate-ui/react/primitives/{buttons/copy, texts/counting-number, texts/sliding-number, effects/highlight, base-ui/*, radix-ui/*, ...}`. They import the full `motion` component (not `m`), so `LazyMotion strict` savings are lost once any Animate UI primitive is on the page; budget for full motion (~45 kB gz measured).

### 1.5 SmoothUI (smoothui.dev, ~275 registry items)
- Source: https://smoothui.dev/docs/guides/installation, https://smoothui.dev/docs/guides/vite, GitHub `educlopez/smoothui`.
- Install: `npx shadcn@latest add @smoothui/<name>`, `"@smoothui": "https://smoothui.dev/r/{name}.json"`; also `npx smoothui-cli add <name>` or manual.
- Vite: **official Vite guide exists** (Vite 6+, React 19+, Node 18+). It states `"use client"` is ignored by Vite.
- Requirements stated by its Vite guide: **Tailwind 4.0+, Motion 12.0+** (import from `motion/react`). Some components also use GSAP (SmoothUI docs).
- Extra: components depend on shared registry items, e.g. `dock`/`cursor-follow`/`glow-hover-card` need `https://smoothui.dev/r/tokens.json`, `infinite-slider` needs `.../lib.json` and `react-use-measure`.
- **Side effect:** installing `dock` rewrote `src/index.css`, adding a block of colour tokens to `:root`/`.dark` (`--amber*`, `--blue*`, `--green*`, `--info*`, `--success*`, `--warning*`, `--brand-ink`, `--smooth-50`, ...) and `@utility focus-ring`, `focus-ring-within`, `state-transition`, plus an `@layer base` block. Review and prune (2.2).
- Files go to `src/components/smoothui/<name>/index.tsx` (own folder; a good pattern).
- Licence: MIT. Pro: none mentioned.

### 1.6 GSAP (optional)
- Licence: since the Webflow acquisition GSAP, **including SplitText, ScrollTrigger and other former Club plugins, is free for commercial use** under the "Standard 'no charge' licence" (https://gsap.com/community/standard-license/). Restriction: not for tools that compete with Webflow's visual animation builder. Irrelevant for a portfolio. npm `license` field points to that licence, not SPDX.
- `gsap/SplitText` imports work from the `gsap` package (React Bits SplitText compiled).
- Reviewer-verified on the licence page: "Commercial usage is covered under the standard license", and the FAQ says this covers "All of GSAP including the plugins that were formerly 'members-only' like SplitText". npm `license` = "Standard 'no charge' license: https://gsap.com/standard-license." Claim holds; not used in v1 anyway (Decision 4).
- Cost (measured): the SplitText chunk including `gsap` + `ScrollTrigger` was **127.6 kB raw / 50.3 kB gzip**.

## 2. Compatibility matrix

Tested combination: React 19.3.1, Tailwind 4.3.5, motion 14.11.1, shadcn 4.23, gsap 3.15.1. `vite build` succeeded (463 modules, 230 ms). `tsc -b` only reported 2 unused-import errors in Aceternity files.

| Pair | React 19 | Tailwind v4 | motion 14 | Verdict |
|---|---|---|---|---|
| shadcn | yes | yes | n/a | ok |
| React Bits (TS-TW) | yes | yes | BlurText pins `motion@^12` (dedupes to 14 via npm semver? **no**, see R5) | ok, check |
| Aceternity | yes | yes, but keyframes missing | `motion/react` | ok after 2.4 |
| Animate UI | **19 only** | yes | needs `^14` | ok |
| SmoothUI | yes | needs 4.0+ | needs 12+ | ok, prune tokens |
| GSAP | yes | n/a | independent | ok, two animation engines |

### 2.1 Duplicate `cn` utils
- Symptom seen: `src/lib/utils.ts` = `export { cn } from "cn"`; Aceternity/SmoothUI items import `cn` from `@/lib/utils`; Animate UI imports `from 'cn'` directly (in the stars background).
- Resolution (single source): keep **one** `cn`. Either keep shadcn's generated re-export (works for both import styles, `cn` package is installed) or replace it with the classic form and rewrite Animate UI's direct import:
  ```ts
  // src/lib/utils.ts
  import { clsx, type ClassValue } from "clsx"
  import { twMerge } from "tailwind-merge"
  export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
  ```
  Then `sed -i "s#from 'cn'#from '@/lib/utils'#" ...` on installed files. Recommendation: **keep the default `cn` package** (less code, authored by the shadcn team) unless you want zero surprises with `tailwind-merge` v3 on v4 class names. Check R6.
- Never keep two `cn` implementations in different files.
- Reviewer: decided, keep the `cn` package (Decision 2). Re-verified on a fresh `shadcn init -t vite`: `components.json` style `base-nova`, `src/lib/utils.ts` = `export { cn } from "cn"`, and `components/ui/button.tsx` itself imports `from "cn"` (not from `@/lib/utils`). Both import paths resolve to one implementation, so there is no duplication to fix. The class-merge unit test from R6 is still worth one line.

### 2.2 CSS variable / theme token clashes
- shadcn defines the semantic tokens (`--background`, `--primary`, `--border`, `--radius`, ...) in `:root` and `.dark`, mapped via `@theme inline`.
- SmoothUI `tokens.json` appends its own colour tokens and utilities to the same file. They use different names (no overwrite seen) but add ~35 variables and a base layer you may not want.
- Resolution: after each SmoothUI install, `git diff src/index.css`; keep only tokens that the chosen components reference (grep `var(--`). Better, install SmoothUI components **only** from the shortlist (few need tokens) and put your brand palette in one `:root` block. Do not run `shadcn add` with `--overwrite` on `index.css`.
- React Bits, Animate UI and Aceternity inject no CSS variables (confirmed on tested items).
- shadcn `base-nova` also imports `@fontsource-variable/geist` and sets `--font-sans`; remove or replace if the brand font differs.

### 2.3 Multiple animation libraries
- Only two engines in practice: `motion` (Aceternity, SmoothUI, Animate UI, some React Bits) and `gsap` (React Bits SplitText/ScrollReveal/StaggeredMenu, some SmoothUI). Plus `@animate-ui/react` which is built on motion.
- Resolution: **pin one `motion` version** (`^14.11.1`) as a direct dependency. If `npm ls motion` shows a second copy (React Bits BlurText declares `motion@^12.23.12`), add an `overrides` entry (`"overrides": { "motion": "$motion" }`) or edit the file's import dependency. Both import from `motion/react`, so API compatibility is the only risk; the v12 to v14 changelog should be skimmed (open question Q3).
- Decide a rule: **GSAP only for scroll-driven/text splitting; motion for component state/hover/layout.** Do not mix both on the same element. Avoid loading `ScrollTrigger` if only SplitText is needed (React Bits SplitText registers both; trim).
- Do not install `framer-motion` separately: it is the same package/version as `motion` (both 14.11.1) and `motion/react` is the canonical import.
- **Reviewer correction (tested):** the problem is not a second copy. `shadcn add` runs an install of `motion@^12.23.12`, which **replaces** the direct dependency (`"motion": "^14.11.1"` became `"^12.43.0"`; `npm ls` showed a single `motion@12.43.0`, deduped under `@animate-ui/react`, whose peer is `^14`). Adding `"overrides": { "motion": "$motion" }` first changed nothing except silencing the error: `npm ls motion` exited 0 with the invalid peer. So: no `overrides`; add a `prebuild` guard (`node -e "if(!require('motion/package.json').version.startsWith('14.'))process.exit(1)"`) and restore with `npm i motion@14.11.1` after any React Bits motion item. Also, motion 12 to 14 spans two majors released 2026-08-05 and 2026-10-02 (Q3 stays open for any item written against v12).

### 2.4 Keyframes: tailwind config vs CSS `@theme`
- Tailwind v4 has no `tailwind.config.js` here (`tailwind.config` is empty). Old Aceternity docs tell you to extend `theme.extend.animation/keyframes`; **that does nothing in v4**.
- Resolution: put them in CSS. Example for Spotlight, which needs `animate-spotlight`:
  ```css
  @theme {
    --animate-spotlight: spotlight 2s ease .75s 1 forwards;
    --animate-scroll: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
    @keyframes spotlight { 0% { opacity: 0; transform: translate(-72%, -62%) scale(0.5); } 100% { opacity: 1; transform: translate(-50%, -40%) scale(1); } }
    @keyframes scroll { to { transform: translate(calc(-50% - 0.5rem)); } }
  }
  ```
  Copy the exact keyframe values from each component's docs page (I confirmed the class names but not the canonical values). Keep them in one file, e.g. `src/styles/fx.css`, imported from `index.css`.
- Respect reduced motion: add `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important } }` or use Tailwind `motion-reduce:` variants.

### 2.5 Other clashes
- Icon sets: lucide-react (shadcn), `@tabler/icons-react` (Aceternity bento/dock/testimonials), Hugeicons (Animate UI icons). Standardise on **lucide**; hand-edit Aceternity files. Saves ~1 dependency.
- Primitive base: shadcn `base-nova` = Base UI; Animate UI's animated primitives mirror Radix/Base UI/React Aria. If you want Animate UI drop-ins for dialog/tabs, keep shadcn on the same base. For a landing page you likely need none of these primitives, which makes it moot.
- Path/alias: React Bits files land outside `ui/`; SmoothUI creates `components/smoothui/`; Animate UI creates `components/animate-ui/`. Aliases in `components.json` don't control these.

## 3. Bundle and performance risk

Measured (production build, tiny harness, lazy-loaded components): entry chunk **394 kB raw / 129 kB gzip** (React + motion + Timeline + BentoGrid + shadcn button), Aurora chunk 11.4 kB / 4.95 kB gz, Animate UI stars 10.4 kB / 4.0 kB gz, SplitText with gsap+ScrollTrigger 127.6 kB / 50.3 kB gz, CSS 49 kB / 9.4 kB gz (includes shadcn tokens and SmoothUI additions). Lighthouse was **not** run (no deploy); numbers are from the build only.

| Weight | Components |
|---|---|
| Light (<5 kB gz own code, no deps) | React Bits SpotlightCard, BounceCards, Aceternity spotlight, bento-grid, infinite-moving-cards, text-generate-effect, SmoothUI reveal-text, magnetic-button |
| Medium (motion only, or gsap) | Aceternity timeline, floating-dock, animated-testimonials; SmoothUI dock, cursor-follow, infinite-slider; React Bits SplitText/ScrollReveal (gsap ~50 kB gz), BlurText; Animate UI primitives (pay for `motion` once) |
| Heavy (WebGL/canvas, continuous GPU) | React Bits Aurora, Silk, Threads, Particles, Galaxy, LiquidEther, Iridescence, Ballpit, Orb; Animate UI Gravity Stars/Hole/Topography; Aceternity vortex, globe/3d-globe (three), canvas-reveal-effect, shooting-stars/stars-background; sparkles (`@tsparticles`, avoid) |

Strategy (all verifiable in review):
1. **Hero background: exactly one** WebGL/canvas effect, `React.lazy` + `Suspense` with a CSS gradient poster as fallback so LCP is the text, not the shader.
2. **IntersectionObserver mount**: a small `<Mount whenVisible>` wrapper (`useInView` from `motion/react` is already in the bundle) so below-the-fold effects do not instantiate until near the viewport; unmount on exit for WebGL contexts.
3. **`prefers-reduced-motion`**: a single `useReducedMotion()` (from `motion/react`) gate. If true, render the static fallback and skip GSAP timelines. Animate UI states that reduced motion is respected without setup; the React Bits / Aceternity components do **not** all do this, so test each.
4. **Mobile downgrade**: `matchMedia('(pointer: coarse), (max-width: 768px)')` returns the static fallback for WebGL, cursor effects and spotlights; cursor/spotlight effects are pointless on touch anyway.
5. Pause offscreen / hidden tab (`document.visibilityState`, IO) and cap `devicePixelRatio` at 1.5 for canvases.
6. Fonts: keep one variable font, `font-display: swap`, preload the latin subset only (the harness shipped 5 Geist woff2 files, 77 kB; trim cyrillic/vietnamese subsets if not needed). Reviewer correction: files in `dist/` are not downloads. Fontsource declares `unicode-range` per subset, so the browser fetches only subsets whose characters appear (latin 29.4 kB; latin-ext 16.5 kB is needed anyway for Latvian "Rīga"; cyrillic 15.1 kB only if the Cyrillic name appears). See 3.1.
7. Image/video: no `next/image`; use `<img width height loading="lazy" decoding="async">`, AVIF/WebP, `fetchpriority="high"` only for the LCP image.
8. Chunking: dynamic-import the GSAP-based components, and register only the GSAP plugins used (`gsap.registerPlugin(SplitText)`).
9. Targets: LCP <2 s on mobile Slow 4G, TBT <150 ms, CLS 0. With one lazy WebGL hero and 3-4 light effects, Lighthouse >=95 on mobile is realistic **but unproven**; a WebGL hero is the single biggest risk to the score (TBT and main-thread time). Make "hero static poster" a quick toggle so you can compare.

### 3.1 Performance plan (reviewer, replaces the hero-WebGL plan above)

Market.md says no hero background effect, so items 1 and 4 (WebGL hero, WebGL mobile downgrade) no longer apply; the rest stands.

Measured on 2026-11-09 (Vite 8 production build, temp project, gzip as reported by Vite):

| Entry contents | JS gz |
|---|---|
| React 19.3 + react-dom, bare `<h1>` | 68.6 kB |
| + motion `useScroll` + `useMotionValueEvent` only | 74.1 kB |
| + shadcn Button (Base UI) | 83.3 kB (Radix: 81.9 kB) |
| + `LazyMotion`/`m` with `domAnimation` | 99.4 kB |
| + `gsap` + `ScrollTrigger` | 113.0 kB |
| + Animate UI `CopyButton` (full motion) | 116.2 kB |
| + React Bits BlurText + Button (full motion) | 130.7 kB |

Budget (Decision 12):
- **JS:** entry ≤ 120 kB gz (React + motion + Animate UI primitives + sections). Total ≤ 160 kB gz including lazy chunks. CSS ≤ 15 kB gz. Fail CI if exceeded (`vite build` output parsed by a 10-line script, or `size-limit`).
- **Lab targets (Lighthouse mobile):** FCP ≤ 1.2 s, LCP ≤ 1.8 s, TBT ≤ 100 ms, CLS ≤ 0.02. **Field (CrUX p75):** LCP < 2.5 s, INP < 200 ms.
- **LCP element = the hero H1 text in prerendered HTML.** Never animate the H1's entrance with JS: an element at opacity 0 is not painted, so a JS reveal pushes LCP behind download + hydration. Hero motion is CSS only and only on the sub-line.

Lazy-loading:
1. Prerender HTML (Decision 9). Above the fold (nav, hero, proof strip) hydrates from the entry chunk.
2. `FrameSequence` is `React.lazy`, mounted when the Work section is within one viewport (`IntersectionObserver`, `rootMargin: "100% 0px"`). Before that the poster `<picture>` sits in the same box (fixed `aspect-ratio`, no CLS).
3. Frames are fetched only after `window.load` **and** section proximity; skipped entirely when `useReducedMotion()` is true or `navigator.connection?.saveData` is set. Lighthouse does not scroll, so frames never count toward lab scores; check field data for that.
4. Any future below-the-fold fx item (`components/fx/*`) is lazy by default.

Prolifts frame sequence (format and size):
- Source: the real Prolifts lift-shaft video, cut to the 2 to 4 s that read well when scrubbed.
- **Mobile set:** 32 frames, 720 px wide (720x405 at 16:9), **WebP q≈70, ≈25 to 30 kB each, ≤ 1 MB total.** **Desktop set:** 48 frames, 1280 px wide, WebP q≈70, ≈55 to 65 kB each, ≤ 3 MB total. Pick the set with `matchMedia("(min-width: 768px)")` once at mount.
- Why WebP for frames, AVIF for stills: every scroll step decodes a new frame, and AVIF decodes noticeably slower than WebP on mid-range phones; for one-off stills (poster, project shots) AVIF's size win is worth it. Poster: `<picture>` AVIF + WebP fallback, explicit `width`/`height`.
- Memory: decoded RGBA is width x height x 4. Mobile: 1.17 MB x 32 ≈ 37 MB (acceptable). Desktop: 3.7 MB x 48 ≈ 177 MB if all stay decoded, so keep frames as `HTMLImageElement`s (the browser may evict decoded data) and do not convert all to `ImageBitmap`; at most keep a ±6-frame `ImageBitmap` window if profiling shows decode jank.
- Load order: every 4th frame first, then fill gaps, so scrubbing works coarse-to-fine early.
- Hashing: put frames in `src/assets/prolifts/{sm,lg}/` and load with `import.meta.glob("...*.webp", { eager: true, query: "?url", import: "default" })`, so Vite fingerprints them into `/assets/` and the immutable cache rule covers them. If they live in `public/`, use a versioned folder (`/frames/prolifts/v1/`).
- Canvas: cap `devicePixelRatio` at 2 (desktop) / 1.5 (mobile); size with `ResizeObserver`; draw in one `requestAnimationFrame` only when the frame index changes.

Fonts:
- Max **two** families (display + body); numbers via `font-variant-numeric: tabular-nums` instead of a third mono family, unless Geist Mono is the body face. Market.md suggests three; that costs a third preload for little gain.
- Self-host via `@fontsource-variable/*`; remove the `@fontsource-variable/geist` import that `shadcn init` adds if the brand font differs (R11).
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the **latin** file of the H1 face only. latin-ext loads on demand via `unicode-range` (Latvian diacritics in About).
- `font-display: swap` plus a size-adjusted local fallback (`@font-face { src: local("Arial"); size-adjust; ascent-override }`) so the swap does not shift the H1 (CLS).

## 4. Shortlist (reviewer-revised to the market.md "Shipped, in motion" budget)

The original shortlist (Aceternity spotlight hero, Aurora upgrade, React Bits text reveal, SpotlightCard, bento grid, LogoLoop, Aceternity timeline, testimonials, dock, magnetic CTA) put 8 to 10 effects on the page. market.md section 2 allows **1 signature motion moment, ≤1 text effect, ≤1 card hover effect, micro-interactions only on interactive elements, no hero background effect**, and lists Spotlight, Floating Dock, Bento Grid template and Infinite Moving Cards as "template" tells. That shortlist is withdrawn.

### 4.1 Section map (exactly one component or "plain" per section)

| Section | Component | Why / rules |
|---|---|---|
| Nav + availability pill + copy email | **Animate UI `CopyButton`** (`@animate-ui/react/primitives/buttons/copy`) | Micro-interaction on a real action (copied state). Pill = plain shadcn `Badge` + one CSS pulse dot (no SmoothUI `badge`: it pulls `tokens.json` + `lib.json` into `index.css`). Plain sticky header, no dock (market.md lists Floating Dock as a template tell). |
| Hero | **plain shadcn/CSS** | H1 static (it is the LCP element). Optional CSS-only fade/translate on the role line and tagline (`@starting-style` or a keyframe in `fx.css`). No background effect. The "≤1 text effect" slot is left unused on purpose. |
| Proof strip / stats | **Animate UI `CountingNumber`** (`primitives/texts/counting-number`, `inView inViewOnce`) | The one number transition (Stundio users), as market.md suggests. Verified: its prerendered HTML contains the real number in an `sr-only` span (visible text starts at `0`), so SEO and screen readers get the truth; set `fromNumber` close to the target so the no-JS look is not "0". Final figure blocked on market.md open question 3 (200+ vs 400+). |
| Selected Work (list) | **Animate UI `Highlight`** (`primitives/effects/highlight`) | The single card/row hover effect: one highlight that slides between the 3 work rows on hover/focus. |
| Selected Work: Prolifts | **own `FrameSequence`** (`components/FrameSequence.tsx`, canvas + motion `useScroll`, see 4.2) | The one signature motion moment. No library. Needs client approval for reusing frames. |
| Selected Work: Stundio | **plain shadcn** | Screenshot (AVIF), one-line proof, GitHub + live links. Proof, not decoration. |
| Selected Work: Curio | **plain shadcn** | Short entry, no metric until ownership and figure are confirmed (market.md Q5). |
| About / Riga | **plain** | Riga local time via `Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Riga", timeStyle: "short" })`, updated once a minute; real photo; no weather widget. |
| Stack | **plain shadcn/CSS** | Grouped static list, or tools shown per project (market.md: "tools-in-context per project" beats skill displays). If a marquee is wanted later, use React Bits `LogoLoop` (zero deps, handles reduced motion, 44 kB source, lazy) and add a visible pause button (WCAG 2.2.2; hover-pause alone fails keyboard/touch). |
| Contact | **Animate UI `CopyButton`** (same component as Nav, DRY) | Email copy + `mailto:` + booking link + GitHub/LinkedIn. No form, so no backend. |
| Footer | **plain** | Built-with credit, "Edition 2026", Riga time (reuse About's hook), links to custom 404. |

Net: one npm package (`@animate-ui/react`) supplies all three micro-interactions; no copy-in fx files in v1. Sources not used in v1 and why: React Bits (only candidate slots were the H1 text effect, which hurts LCP, and the marquee); Aceternity (licence ambiguity, keyframes gap, tabler icons, and its signature pieces are on market.md's tell list); SmoothUI (every candidate pulls `tokens.json` into `index.css`, and Animate UI covers the same jobs from one package).

### 4.2 Frame-sequence scrubbing: motion `useScroll`, not GSAP ScrollTrigger

Decision: **motion `useScroll` + CSS sticky.**

```tsx
// components/FrameSequence.tsx (sketch)
const ref = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
const index = useTransform(scrollYProgress, [0, 1], [0, frames.length - 1])
useMotionValueEvent(index, "change", (v) => scheduleDraw(Math.round(v))) // rAF, skip if unchanged
return (
  <div ref={ref} className="relative h-[250svh]">
    <div className="sticky top-0 h-svh"><canvas … /></div>
  </div>
)
```

Why:
- **Cost:** motion is already in the entry for Animate UI; `useScroll` added 5.5 kB gz in isolation. GSAP + ScrollTrigger added 44.4 kB gz, a second animation engine, and a licence that is free but not OSI.
- **Pinning:** CSS `position: sticky` inside a tall wrapper does what ScrollTrigger `pin` does, with no pin-spacer, no JS layout writes and no CLS. Use `svh` so the iOS address bar does not resize the stage mid-scrub.
- **Smoothing:** ScrollTrigger's `scrub: 0.5` maps to `useSpring(scrollYProgress, { stiffness, damping })`. `snap` is not needed for a frame index (`Math.round`).
- **Mobile memory and data:** not a library question. It is handled by the smaller mobile frame set, lazy fetch, and `HTMLImageElement` storage (3.1).
- **Reduced motion:** `useReducedMotion()` true: render the poster `<picture>` in normal flow (no 250svh wrapper, no frames fetched). `MotionConfig reducedMotion="user"` does not cover this, because the canvas is drawn by hand.
- **When GSAP would win:** if the existing Prolifts code is GSAP and can be lifted nearly as-is (open question), or if the moment grows into a multi-step timeline (labels, pinned text cues). Then load GSAP only inside the lazy `FrameSequence` chunk and register only `ScrollTrigger`.

## 5. Exact setup recipe

### 5.1 Scaffold and dependencies
```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm i tailwindcss @tailwindcss/vite motion
npm i -D @types/node
# optional, only if you keep gsap-based components:
# npm i gsap @gsap/react
npx shadcn@latest init        # pick Radix or Base UI deliberately (default: base-nova/Base UI)
```
Reviewer version (per Decisions; flags verified with `shadcn init --help`, non-interactive run succeeded):
```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio && echo 22 > .node-version
npm i tailwindcss @tailwindcss/vite motion@14.11.1 @animate-ui/react
npm i -D @types/node wrangler
# set up the @ alias in vite.config.ts + both tsconfigs first (5.2, 5.3), then:
npx shadcn@latest init -t vite --no-monorepo -y     # base-nova = Base UI (Decision 1)
# Radix alternative, if ever: -b radix -p nova  (-b alone opens an interactive preset prompt)
npm pkg set scripts.prebuild="node -e \"if(!require('motion/package.json').version.startsWith('14.'))process.exit(1)\""
```
No `gsap` (Decision 4). `shadcn add --path src/components/fx/<source>` works for third-party items (verified with React Bits LogoLoop and Aceternity spotlight).
Versions resolved in my run: react 19.3.1, vite 8.3.7, tailwindcss + @tailwindcss/vite 4.3.5, motion 14.11.1, shadcn 4.23.0, typescript ~7.0.2.

### 5.2 `vite.config.ts`
```ts
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
})
```
(`import.meta.dirname` worked on Node 26; fine on Node >=20.11. The shadcn docs use `__dirname` which is undefined in ESM `"type": "module"` projects on some setups.)

### 5.3 tsconfig (the Vite template has no `strict`)
`tsconfig.json` (root) and `tsconfig.app.json` both need the alias, as in the shadcn docs; `baseUrl` is not needed with `paths` and `moduleResolution: "bundler"` (I did not set it and the alias and shadcn CLI worked):
```jsonc
// tsconfig.app.json
{ "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": { "@/*": ["./src/*"] }
    // keep template flags: verbatimModuleSyntax, noUnusedLocals, erasableSyntaxOnly...
} }
```
```jsonc
// tsconfig.json
{ "files": [], "compilerOptions": { "paths": { "@/*": ["./src/*"] } },
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }] }
```
Note: `erasableSyntaxOnly` forbids `enum`/parameter properties: consistent with your `type` + `satisfies` preference.

### 5.4 `src/index.css`
```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
@import "./styles/fx.css";   /* your @theme keyframes for Aceternity etc. */
/* shadcn tokens + @theme inline mapping are added by init */
```
Reviewer: current `init` actually writes `@import "tailwindcss"; @import "tw-animate-css"; @import "shadcn/tailwind.css"; @import "@fontsource-variable/geist";` then `@custom-variant dark` and the `@theme inline` block. Keep the first three; replace the Geist import with the brand font; add `@import "./styles/fx.css";` after them. `fx.css` shape:
```css
/* src/styles/fx.css: everything motion- or vendor-specific. index.css stays tokens-only. */
@theme {
  --animate-rise: rise 600ms cubic-bezier(.2,.8,.2,1) both;   /* hero sub-line, CSS only */
  @keyframes rise { from { opacity: 0; translate: 0 8px } }
}
/* vendor: <source>/<item> (paste injected tokens/keyframes here, prune unused) */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important }
}
```

### 5.5 `components.json` (as produced by init, plus registries)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/index.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json",
    "@react-bits": "https://reactbits.dev/r/{name}.json",
    "@smoothui": "https://smoothui.dev/r/{name}.json",
    "@animate-ui": "https://animate-ui.com/r/{name}.json"
  }
}
```
This exact namespace set resolved and installed all 9 test components (`@aceternity/{bento-grid,spotlight,timeline}`, `@react-bits/{SplitText,Aurora,LogoLoop}-TS-TW`, `@smoothui/{dock,cursor-follow}`, `@animate-ui/backgrounds-stars`). Schema note: `style` cannot be changed after init.

### 5.6 Folder convention
```
src/
  components/
    ui/        shadcn primitives (button, card, input...) -- CLI-owned, do not hand-style
    fx/        effect components moved from react-bits / aceternity / smoothui / animate-ui
    sections/  Hero, Projects, Timeline, Contact (compose ui + fx)
  lib/utils.ts (single cn)
  hooks/       useReducedMotion wrapper, useCoarsePointer, useInViewMount
  styles/fx.css  @theme keyframes
```
Reviewer: superseded by Decision 6 (`src/sections/*` and `src/content/*.ts` at the `src/` root, own shared components in `components/`, fx per source). `--path` is verified, so the "move after add" step is no longer needed.

Recipe: `shadcn add` puts everything where the library chooses (observed: Aceternity into `ui/`, React Bits into `components/`, SmoothUI into `components/smoothui/`, Animate UI into `components/animate-ui/`). After each add, **move into `fx/<source>/`** (or pass `--path`) and fix imports, then record provenance as a header comment `// source: @react-bits/Aurora-TS-TW @ 2026-11`. Tip: `shadcn add --path src/components/fx` should override the target, verify before relying on it (not tested).

### 5.7 TS style fit (`type` + `satisfies`)
Library props are mostly `interface`. Do not rewrite them; wrap them. For project data use `type` + `satisfies`:
```ts
type Project = { slug: string; title: string; stack: readonly string[]; href: string }
export const projects = [ /* ... */ ] satisfies readonly Project[]
```
Avoid generic `<Effect variant=... />` abstraction layers; compose directly in sections.

## 6. Cloudflare Pages

Sources: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/, /pages/configuration/build-image/, /serving-pages/, /headers/.
- Build command: `npm run build` (`tsc -b && vite build`). Output directory: `dist`. Framework preset "React (Vite)".
- Node: build image v3 default is **22.23.4**; v3 does not read `package.json` `engines`. Vite 8 needs `^20.19 || >=22.12`, so default is fine. Pin explicitly with a `.node-version` file (e.g. `22`) or `NODE_VERSION`. My local test ran Node 26.12.1; do not rely on that.
- SPA fallback: Pages serves `/` for unmatched paths **if there is no top-level `404.html`**, so no `_redirects` needed. For one single-scroll landing page you need no routing at all. A `/* /index.html 200` rule is unnecessary (and the docs discourage it).
- `public/_headers` (copied to `dist/`; limit 100 rules, 2000 chars/line):
  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /*.woff2
    Cache-Control: public, max-age=31536000, immutable
  /
    Cache-Control: public, max-age=0, must-revalidate
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```
  Vite emits fingerprinted files under `/assets/`, which is safe to mark immutable. Keep `index.html` revalidating. `_headers` applies to static assets, not Pages Functions responses.
- Optional: a CSP is hard with inline styles/WebGL; add later in report-only mode.
- Fonts: self-host (`@fontsource-variable/*`), no Google Fonts round trip.
- Contact form: a Pages Function (`functions/api/contact.ts`) or external form service; "static" is not a limit.

### 6.1 Reviewer: deploy to Workers Static Assets instead

Checked 2026-11-09:
- **Cloudflare's guidance changed.** The Pages overview (https://developers.cloudflare.com/pages/) has a callout "Are you sure you want to use Pages?" that says "Start new projects with Workers", linking to the migration guide (https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/, last updated Oct 12, 2026), which says "Workers supports most Pages use cases and offers a broader feature set". Pages is not marked deprecated.
- **What changes for this site:** `_headers` and `_redirects` work natively in Workers static assets; SPA/404 behaviour is explicit (`not_found_handling`) instead of inferred; Git deploys use Workers Builds; preview URLs need `preview_urls` in config. Custom domains on Workers need the zone on Cloudflare nameservers, which market.md step 0 already plans. Requests served from static assets do not invoke a Worker (the React guide says they "are thus free").
- **Node claim:** confirmed. Pages build image v3 default Node is **22.23.4**; v3 does **not** read `package.json` `engines`; `.node-version`/`.nvmrc` or `NODE_VERSION` work. Pin `22` (needed by `cn`'s `engines.node >=22` and Vite's `>=22.12`). Workers Builds image: assume the same files are honoured, confirm in the first build log.
- **Recommendation: Workers Static Assets, assets-only** (no Worker script, no `@cloudflare/vite-plugin` needed while there is no server code):
  ```jsonc
  // wrangler.jsonc
  {
    "name": "polizhai",
    "compatibility_date": "2026-11-01",
    "assets": { "directory": "./dist", "not_found_handling": "404-page" }
  }
  ```
  `404-page` (not `single-page-application`) because every route is prerendered to its own HTML and market.md wants a custom 404 (`dist/404.html`). Deploy: Workers Builds connected to GitHub, build `npm run build`, deploy `npx wrangler deploy`.
- **`_headers` review:** syntax is right and works unchanged on Workers. Docs confirm: 100 rules, 2,000 chars/line, and **matching rules merge**, with the same header joined by commas. So never set `Cache-Control` in `/*`, or it gets joined with the `/assets/*` value. Fixes: the `/*.woff2` rule is redundant (Fontsource fonts are fingerprinted into `/assets/` by Vite); the `/` rule only covers the root and is the default behaviour anyway, so drop it; add frame protection. Corrected:
  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    X-Frame-Options: DENY
  ```
  If frames live in `public/frames/prolifts/v1/`, add an immutable rule for `/frames/*` and bump `v1` on any change. A CSP stays a later, report-only step; HSTS goes on at the zone level.
- Contact: no form (market.md: one contact path), so no Functions/Worker code at all.

## 7. Risks and open questions

Risks
- R1 Aceternity keyframes are not shipped in the registry for v4: silent no-op animations (2.4). Test every Aceternity effect visually.
- R2 Licence mix: MIT (shadcn, SmoothUI), **MIT + Commons Clause** (React Bits, Animate UI), GSAP standard no-charge licence, Aceternity free-tier terms unconfirmed. All permit use in a client site; none permit re-selling the components. Do not publish `components/fx` as a template/kit.
- R3 shadcn default style is now Base UI (`base-nova`), not Radix; Animate UI and many tutorials assume Radix. Pick deliberately at init.
- R4 SmoothUI shared `tokens.json` mutates `index.css` (35+ vars). Prune per 2.2.
- R5 Duplicate `motion` versions via per-component pins (BlurText `^12.23.12`). Check `npm ls motion` after every add; use `overrides`. **Reviewer: wrong fix.** The CLI downgrades the direct dependency; `overrides` hides the peer break. Use the `prebuild` guard (Decision 3).
- R6 `cn` is now the `cn` npm package (0.5.2) rather than clsx + tailwind-merge; verify class merging with Tailwind v4 conflicts (`cn("p-2","p-4")`) in a unit test, and keep one implementation.
- R7 The tooling is **fast-moving** (Vite 8, TS 7, motion 14, Animate UI v2 rewrite). Pin exact versions in the lockfile and commit it; do not `shadcn add` blindly later.
- R8 Generated code quality: unused imports (TS6133), `React` default imports, large single files (LogoLoop 44 kB, Dock 47 kB source). Expect lint cleanups; run `tsc -b` after each add.
- R9 WebGL hero and Lighthouse >=95 on mobile: unproven. Needs a measured spike (section 3, item 9).
- R10 Accessibility: marquee/auto-moving content needs a pause control (WCAG 2.2.2); cursor/spotlight effects must not hide content; ensure focus rings (SmoothUI `focus-ring` utility helps).
- R11 Fonts: shadcn init pulls Geist (5 woff2 files). Replace with the brand font.

Open questions
- Q1 Aceternity free-component licence: no text found for components outside Pro. Check ui.aceternity.com/terms or ask the author before using for a paying client. (Pro is paid; avoid.)
- Q2 Brand direction: dark or light, accent colour, fonts. This sets tokens (2.2) and decides whether Aurora/Spotlight fit.
- Q3 Does `motion` 12 to 14 change anything these components use (`useInView`, `useScroll`, `AnimatePresence`)? Builds passed; no runtime test was done.
- Q4 Single-page only, or multiple routes (project case-study pages)? Affects router choice and `_redirects`.
- Q5 Languages: the portfolio uses i18n in 4 languages. Which i18n lib; `SplitText` and per-character animation behave badly with RTL/accents/long words; test.
- Q6 Is a global GSAP needed at all? Dropping it saves ~50 kB gz and a second animation engine. Recommend decide after the text-reveal pick.
- Q7 Does `shadcn add --path` reliably relocate files (for `fx/`)? Untested.
- Q8 Contact backend (Pages Function vs external) and spam protection (Turnstile).
- Q9 Hosting domain and analytics (Umami?) that may affect CSP and performance budget.

Reviewer status: Q1 resolved enough (first-party llms-full.txt allows personal and commercial client use; moot in v1). Q3 open but only matters if a v12-era item is added. Q4 answered by market.md (2 case-study pages): prerendered routes, no router (Decision 9). Q5 answered by market.md: English only for v1. Q6 resolved: no GSAP (Decision 4). Q7 resolved: `--path` works. Q8 resolved: no form. Q2 and Q9 stay open.

## Sources
- shadcn: https://ui.shadcn.com/docs/installation/vite, https://ui.shadcn.com/docs/components-json
- React Bits: https://reactbits.dev/get-started/installation, https://github.com/DavidHDev/react-bits (README, LICENSE.md), registry https://reactbits.dev/r/{name}.json
- Aceternity: https://ui.aceternity.com/docs/cli, https://ui.aceternity.com/pricing, https://ui.aceternity.com/licence, registry https://ui.aceternity.com/registry/{name}.json
- Animate UI: https://animate-ui.com/docs/installation, https://animate-ui.com/docs/react, https://animate-ui.com/llms.txt, https://animate-ui.com/r/registry.json, npm `@animate-ui/react@2.4.3` LICENSE.md
- SmoothUI: https://smoothui.dev/docs/guides/installation, https://smoothui.dev/docs/guides/vite, https://github.com/educlopez/smoothui, https://smoothui.dev/r/{name}.json
- GSAP: https://gsap.com/community/standard-license/
- Cloudflare: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/, /pages/configuration/build-image/, /pages/configuration/serving-pages/, /pages/configuration/headers/
- Versions: `npm view <pkg> version peerDependencies`, 2026-11-09. Install test: temp project in `/tmp/claude-1000/`, deleted.

---

## Review notes

Staff frontend review, 2026-11-09. market.md read only, not edited. Fetched pages and registry JSON treated as data. All tests ran in a throwaway Vite 8 project under `/tmp/claude-1000/` on Node 26.12.1, deleted afterwards.

**Claims checked**

| Claim | Result | Evidence |
|---|---|---|
| Key versions (react, tailwindcss, @tailwindcss/vite, motion, @animate-ui/react, shadcn, gsap, vite) and peers | Confirmed, all match | `npm view <pkg> version peerDependencies engines` |
| (a) `shadcn init` defaults to Base UI `base-nova` | Confirmed | Fresh `init -t vite -y`: `"style": "base-nova"`, `@base-ui/react ^1.9.0`, button imports `@base-ui/react/button`. `--help`: `-d` = `--preset=base-nova`; `-b base\|radix\|aria` |
| (b) `export { cn } from "cn"` + `cn` npm package | Confirmed, plus: primitives import `from "cn"` directly; `cn` needs Node ≥22 | Generated files; `npm view cn` (repo shadcn-ui/cn, MIT, 0.5.2) |
| (c) Animate UI is an npm package | Confirmed: `@animate-ui/react` 2.4.3, `exports: "./*"`, primitives for buttons/texts/effects/base-ui/radix-ui/react-aria; registry still serves backgrounds/buttons/page-transition/icons | npm tarball |
| (d) BlurText pins `motion@^12` | Confirmed (`motion@^12.23.12`) and **worse than stated**: it rewrites the direct dep to `^12.43.0`; `overrides: $motion` hides it | Registry JSON + install test |
| (e) GSAP incl. SplitText free commercially | Confirmed | gsap.com standard licence FAQ |
| (f) React Bits / Animate UI = MIT + Commons Clause | Confirmed (React Bits © 2026 David Haz; Animate UI © 2025 Elliot Sutton). Portfolio and paid client sites fine; selling/redistributing the components as a kit/template not fine; keep notices | GitHub LICENSE.md; npm tarball LICENSE.md |
| Aceternity free licence | Primary source found: `ui.aceternity.com/llms-full.txt` allows unlimited personal + commercial client use, no resale as a competing library. Conflicts with generic `/terms` wording; no SPDX licence | Fetched 2026-11-09 |
| Cloudflare Node default 22.23.4, `engines` ignored | Confirmed | Pages build-image docs |
| `_headers` example | Syntax correct; two redundant rules; merge semantics noted | Pages headers docs |
| `shadcn add --path` (Q7) | Works for third-party registry items | Install test |

**Changes made to this file**
1. Added the reviewer verdict under the original verdict, and a binding **Decisions** section (12 items) before section 0.
2. Section 0: added `cn`, `@base-ui/react`/`radix-ui`, `wrangler`/`@cloudflare/vite-plugin` rows and a re-verification note (incl. `shadcn` added as a dependency for `shadcn/tailwind.css`).
3. 1.2: BlurText downgrade finding. 1.3: Aceternity primary-source licence text and caveats. 1.4: verified licence wording, practical Commons Clause meaning, primitive paths, full-`motion` cost. 1.6: GSAP licence verified.
4. 2.1: `cn` decision and evidence. 2.3: corrected the `overrides` advice (tested; it masks the problem) and added the `prebuild` guard. R5 annotated.
5. Section 3: corrected the font-subset claim; added **3.1 Performance plan** (measured bundle table, budgets, LCP rule, lazy-loading, frame format/size/memory, fonts).
6. Section 4: **replaced** the shortlist with a one-component-per-section map aligned to market.md, and **4.2** motion-`useScroll`-vs-GSAP decision with sketch and reasons.
7. 5.1: reviewer setup commands (non-interactive init flags verified). 5.4: actual `init` CSS output plus an `fx.css` template. 5.6: points to Decision 6.
8. Section 6: added **6.1** Workers Static Assets recommendation with sources, `wrangler.jsonc`, corrected `_headers`.
9. Section 7: status line for Q1 to Q9.

**Alignment with market.md ("Shipped, in motion")**
- Original shortlist conflicted on: hero background (Aceternity spotlight/Aurora, but market.md says "No background effect"), Floating Dock / Bento Grid / Spotlight / marquee (listed as template tells), and effect count. The revised map has exactly one signature moment (Prolifts frames in Selected Work), one number transition, one hover effect, and micro-interactions only on the copy-email action.
- market.md's SEO step 1 ("a Vite SPA with no prerender is the weak spot") was not addressed by this study; Decision 9 fixes it.
- market.md places GSAP in the signature moment ("the one place GSAP/custom scroll code is used"); this review picks the "custom scroll code" branch with `motion` (4.2).

**Open questions for Dmytro**
1. Is the existing Prolifts scroll code GSAP, and is lifting it as-is worth +44 kB gz (lazy chunk only)? If not, build `FrameSequence` on motion as specified.
2. Prolifts approval covers reusing the hero frames on the portfolio? (market.md Q4.) Without it the Selected Work signature moment has no source.
3. Brand fonts and palette (Q2): needed to set the preload and the size-adjusted fallback.
4. Analytics (Umami or Cloudflare Web Analytics)? Affects JS budget and a future CSP.
5. Is the portfolio repo going public? Fine under all licences in use, but then the provenance headers and the `LICENSE`/notice handling in Decision 6 become mandatory, not nice-to-have.
