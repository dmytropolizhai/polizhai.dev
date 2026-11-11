> ## ✅ Amendments by Dmytro (2026-11-11): override anything below and the 2026-11-09 block
> - **Domain:** polizhai.dev.
> - **Visuals live in `design/`** (`design-system.md`, `tokens.css`): Archivo only, black, white and grey, no green accent, dark theme only, no theme toggle. The parallelogram mark replaces the square and the "DP" monogram.
> - **No floor concept.** Sections are not floors and have no numbers. Navigation is one dock fixed at the bottom of the screen.
> - **No lift, no shaft.** Not as a metaphor, not in copy, not as a scroll-played stage on the home page. Selected work was planned as one animated bento grid; see the 2026-11-11 note below, which replaces it with the project canvas.
> - **Changed 2026-11-11 (Dmytro): project canvas.** The bento grid is replaced by an "Explore the projects" canvas in the hero: a draggable panel of tilted project cards, with a dialog per project. It is the signature element. The hero has no H1 and no 3D mark; its background is the lazy WebGL ferrofluid, which ignores the pointer over the canvas. The canvas is the one named exception to "motion is always vertical", no tilt and 0px corners. Wherever this file names the bento grid, the Selected work poster, or the hero as H1 plus CSS-only subline motion, read the canvas instead. Spec: `design/design-system.md` and `design/landing-page.md`.
> - Sections 3, 6 and 7 below are rewritten to match. The review notes at the end are the 2026-11-09 record and still describe the old visuals.

> ## ✅ Amendments by Dmytro (2026-11-09): override anything below
> - **Hero is now:** H1 `Dmytro Polizhai`, then the tagline **"Make it run, make it right."** (his own motto, replacing "Built in Riga. Used every day.", which may move to a later section, e.g. Stundio or the footer), then a **customers bar**: "More than 5 happy customers" plus a client logo strip (React Bits LogoLoop is the natural fit). The customer list and logos are [TBD from Dmytro]; known so far: Pro-lifts SIA, Curio, Numerologgi.
> - **Prolifts quote:** approved, with the person's name, role and "Pro-lifts SIA". Dmytro will provide the exact text and will add the "Site by Dmytro Polizhai" footer link himself.
> - **Curio:** say "built for Curio's founder". Do NOT name the owner.
> - **Portrait:** Dmytro will generate the photo himself. Design for a placeholder with a fixed aspect ratio.
> - **Availability pill:** none.
> - **Stundio in the timeline:** year only.

# Brand strategy: Dmytro Polizhai

Phase 2 output. Drives the polizhai.dev rebuild (static Vite + React, Cloudflare).
Built on: research/BRIEF.md (binding), market.md ("Shipped, in motion"), profile.md (confirmed block), github.md §7, stack.md (constraints).
Date: 2026-11-09. Every claim here traces to a verified fact in BRIEF.md "Proof". Anything not verified is a `[TBD: …]`.

---

## 1. Brand core

**Positioning statement**
For founders, small teams and businesses that need a web product built and launched, Dmytro Polizhai is a full-stack developer in Riga who designs, builds and ships the whole thing himself, from the first commit to the live site. His proof is in production: an open-source app students open every school day (Stundio), a live client site for a Riga elevator company (Prolifts), and the frontend of a news platform, built for its owner (Curio: 830 of 830 frontend commits, page load time down 10%).

**Brand promise**
*You get one person who owns the whole build, and a product that is live, not a demo.*

**Three pillars**

| Pillar | What it means | Backed by |
|---|---|---|
| **Shipped, not shown** | Work is judged by whether real people use it. Live links first, screenshots second. | **Stundio**: live at app.stundio.lv, PWA + Android + Linux desktop, MIT, 442 of 545 commits by Dmytro, used by 400+ RVT students every school day. |
| **Motion with a job** | Animation explains or proves something. If it does neither, it is cut. | **Prolifts**: the hero is an AI video that plays as you scroll. Custom scroll code, no GSAP. Next.js 16, Sanity, LV/RU/EN. |
| **The whole stack, one owner** | Frontend, backend, data, deploy, CI. No hand-off gaps. | **one-to-one**: Next.js 16, Socket.IO, Redis 7, Postgres 17, Docker Compose, GitHub Actions, 212 of 212 commits. **Curio**: 830 of 830 frontend commits; the Next.js rebuild cut page load time by 10% (site analytics). |

Numerologgi (Next 16, Payload, Stripe, three.js, 113 of 113 commits) will strengthen pillar 3 once it is live and approved. Until then it does not appear.

---

## 2. Audience

### Primary: clients and startups hiring a full-stack developer
Founders, small business owners in Riga and the Baltics, early-stage startups abroad. They buy outcomes and fear risk.

- **In 10 seconds they need:** a name, a role, a live product they can click, and one way to contact him.
- **Objections:**
  1. *"He's 18. Will he disappear mid-project?"*
  2. *"Is this a student side project or real production work?"*
  3. *"Can he talk to my team and my customers?"* (language, communication)
  4. *"Who maintains it after launch?"*
- **How the site answers:**
  1. Live client site (pro-lifts.lv) above the fold, a named client quote ([TBD: Prolifts quote]) right after the work, and a real project timeline (Prolifts: first commit 2026-08-08, live, still maintained 2026-10-30).
  2. Every project card shows a live link or a public repo. No mockups.
  3. Languages shown plainly: Ukrainian and Russian native, Latvian and English B1. Prolifts itself ships in LV/RU/EN.
  4. "How I work" row on handoff: CMS (Sanity, Payload) so clients edit content themselves; CI/CD on every project.

### Secondary: recruiters and hiring engineers
- **In 10 seconds they need:** title (Full-Stack Developer), location (Riga), stack in context, GitHub link, a project with real users.
- **Objections:**
  1. *"Too young for a full-stack role."*
  2. *"Are those commits really his, or AI / a team?"*
  3. *"Does he have formal training?"*
- **How the site answers:**
  1. Proof first, age once in About, never as a hook (§8).
  2. Commit ownership stated precisely (442/545, 830/830, 212/212) and linked to public repos. Precision reads as honesty.
  3. One quiet line in About: studying programming at RVT, plus certificates. Small, factual, not a headline.

---

## 3. Name as brand

**Rules**
- **"Dmytro Polizhai"** is the brand. The H1, the `<title>`, the OG image, the footer credit on client sites. Always this spelling. Never "Dmitry", "Dmitrii", "D. Polizhai".
- **"Polizhai"** alone: the domain (polizhai.dev) and the short wordmark in tight spaces (mobile nav, favicon alt). Never used as a first-person name in copy.
- **The mark** (a parallelogram): a logomark only. There is no "DP" monogram.
- **Handle: @dmytropolizhai everywhere.** It is already live on GitHub, Telegram, the canonical LinkedIn (linkedin.com/in/dmytropolizhai) and the Curio footer credit. Kill the two other LinkedIn slugs (`/in/polizhai`, `/in/dmytro-polizhai-770a86384`) or redirect them. Same photo, same one-sentence bio on every profile.

**Wordmark and mark**
A white parallelogram, leaning 30°, followed by `POLIZHAI.DEV`. The files are in `design/logo/` (`mark.svg`, `wordmark.svg`, `lockup.svg`). The parallelogram is the brand's one graphic element: it is the "live" marker on projects and proof items and the current-section light in the dock. One shape, used everywhere, means "this is running". Rules for size and clear space are in `design/design-system.md` section 2.

**Favicon**
`design/logo/favicon.svg`: the white mark on a black square. No `prefers-color-scheme` swap, because the site is dark only. Plus a 180px Apple touch icon exported from it.

**"How to say my name" line** (About header, small):
> Dmytro Polizhai · poh-lee-ZHAI · Дмитро Поліжай

Stress on the last syllable (по-лі-ЖАЙ), confirmed by Dmytro. Set "ZHAI" in white and bold, with the rest in grey, so the stress is visible without IPA. Use the Ukrainian form only (no Russian variant). An optional 1-second audio clip of his own voice can come later. Archivo has no Cyrillic, so the Cyrillic part uses the system font. No second font family is loaded for it.

**SEO entity naming**
- `<title>`: `Dmytro Polizhai · Full-Stack Developer in Riga`
- Meta description: `Dmytro Polizhai is a full-stack developer in Riga, Latvia. He designs, builds and ships web apps: Stundio, Prolifts, Curio.`
- One H1 per page. Home H1 = "Dmytro Polizhai". Case-study H1 = project name; the byline carries the full name.
- Person JSON-LD on `/`: `name`, `givenName: "Dmytro"`, `familyName: "Polizhai"`, `alternateName: "Дмитро Поліжай"`, `jobTitle: "Full-Stack Developer"`, `url: "https://polizhai.dev"`, `image`, `address: Riga, LV`, `knowsLanguage: ["uk","ru","lv","en"]`, `sameAs: [github.com/dmytropolizhai, linkedin.com/in/dmytropolizhai, t.me/dmytropolizhai]`. Plus `WebSite`. Case-study pages: `CreativeWork` with `creator` → the Person.
- Off-site: footer credit "Site by Dmytro Polizhai" linking to polizhai.dev on client sites where the client agrees; `author` field in public repos' package.json; README credit on Stundio. Update the GitHub bio (drop "Google & Meta Certified", see §8) to the one-sentence bio below.

---

## 4. Messaging

### Tagline: **"Built in Riga. Used every day."**
Why this one:
- **It is a claim, not an adjective.** It survives the "could a competitor paste this unchanged?" test: almost no one else can say both halves.
- **Both halves are true, and each rests on one named proof.** "Built in Riga": he lives and works in Riga, and Stundio (RVT, Riga) and Prolifts (a Riga company) are both Riga projects. "Used every day": only Stundio is verified (400+ daily users, confirmed by Dmytro). Prolifts and Curio have no usage figure, so they do not back this half; they back "live". Because of that, the first proof-strip item under the tagline must be Stundio.
- **Why not "every school day" in the tagline?** It is exact, but it adds a clause and reads as a hedge. The tagline says "every day" (Dmytro's confirmed word is "daily"); the proof strip and cards carry the precise "every school day".
- **It carries the positioning** (shipped, real users) and the human layer (Riga) in six plain words. B1-easy to read, easy to say.
- **The number behind it is confirmed:** Stundio has 400+ daily users. The tagline stays general; the hard number goes in the proof strip and the Stundio card, where it can be checked.
- **Strong alternative used as a proof line, not the tagline:** "400+ students open my app every school day." It is the most concrete sentence on the site, but it describes one project, not the person.

### Alternates
1. **"Shipped first. Animated on purpose."** Best as a secondary line on the Work section; it justifies the motion.
2. **"From first commit to live site."** Plain process promise; good for LinkedIn headline and OG image.
3. **"Make it run, make it right."** His own line from the old site. Keep it as a personal motto in About and the footer, not as the tagline (it describes how he works, not what he delivers).

### Hero
- **Eyebrow (label style, 14px minimum, `--fg-muted`):** `Full-stack developer · Riga` (it is the only place the role appears above the fold, so it must stay legible at 14px or larger)
- **H1:** `Dmytro Polizhai`
- **Headline (display, second line):** `Built in Riga. Used every day.`
- **Subline:** `I design, build and ship web apps, from the first commit to the live site.`
- **Primary CTA:** `Email me` (copies the address, Animate UI "Copied" state, falls back to `mailto:`; the address is visible in the Contact section and the copied state is announced with a polite live region, so a click never changes the clipboard silently)
- **Secondary CTA:** `See the work ↓` (the arrow is `aria-hidden`)
- **Proof strip (below CTAs):** `▰ Stundio · 400+ students every school day` `▰ Prolifts · live client site` `▰ Curio · built the frontend, 830 commits` (the marker is the CSS `.mark` shape from `design/tokens.css`, not a glyph)
- **Availability pill:** `[TBD: e.g. "Taking projects from …"]`. Do not show a pill until Dmytro states a real date.

### Bios
- **One sentence:** Dmytro Polizhai is a full-stack developer in Riga who designs, builds and ships web apps that people use every day.
- **~60 words:** Dmytro Polizhai is a full-stack developer in Riga, Latvia. He works alone across design, frontend, backend and deploy, and he ships. His open-source app Stundio is an unofficial timetable for students at Riga State Technical School, on web, Android and Linux. 400+ students use it every school day. He built the live site for Pro-lifts SIA and rebuilt the frontend of the news platform Curio, cutting page load time by 10%. He works in English, Latvian, Ukrainian and Russian.
- **Elevator pitch (spoken, ~20 s):** "I'm Dmytro, a full-stack developer in Riga. I build web apps from the first commit to launch, on my own. Over 400 students at a Riga technical school use my timetable app every school day, and a Riga elevator company has a live site I built. If you need a product live, not a prototype, that's what I do."

### Proof statements (verified facts only)
1. **Stundio:** 400+ students open it every school day. An open-source, unofficial timetable app for Riga State Technical School, on web, Android and Linux. I wrote 442 of its 545 commits.
2. **Prolifts:** the live website of Pro-lifts SIA, a Riga elevator company. Next.js, Sanity CMS, three languages, and a video hero that plays as you scroll.
3. **Curio:** I rebuilt the Next.js frontend of curio.today for its owner and cut page load time by 10%. I made all 830 commits in the frontend repository (the backend is a separate repo).

(Wording rule for Curio: "all mine" is never used. It reads as owning the product and covers the whole of Curio, but Dmytro made all commits of one repository only, `curio-today/frontend`; the CMS repo is separate, private and not counted. Safest true forms: "830 of 830 frontend commits" or "built the frontend, 830 commits".)

(Commit counts as of 2026-11-09; regenerate at build time from the GitHub API or freeze with a date.)

---

## 5. Tone of voice

Write the way Dmytro talks to a client he respects: short, direct, concrete. English B1 is an asset here. Short sentences and plain words read as confident and are easy for every visitor, most of whom are not native speakers either.

| Trait | Do | Don't |
|---|---|---|
| **Plain** | "I build web apps." | "I craft seamless digital experiences." |
| **Specific** | "Web, Android and Linux. 442 of 545 commits." | "Cross-platform solutions at scale." |
| **Steady** (calm confidence, no hype, no apology) | "I own the build from start to launch." | "I'm just starting out but I learn fast!" / "World-class results guaranteed." |
| **Hands-on** (first person, active verbs, things he did) | "I cut the video into frames so it scrubs with your scroll." | "Leveraging cutting-edge technologies to deliver value." |

**Writing rules**
- One idea per sentence. Aim for 8 to 15 words. No sentence over 20.
- Common words. "Use", not "utilise". "Fast", not "performant".
- Numbers as digits. Units always ("830 commits", not "830+").
- First person on the site ("I"), third person in bios and JSON-LD.
- No exclamation marks. No emoji in copy.
- Every claim either links to proof or is cut.

**Banned phrases**
passionate · aspiring · junior · young talent · prodigy · wunderkind · "Hi, I'm…" · "Welcome to my portfolio" · crafting · seamless · elevate · delve · cutting-edge · pixel-perfect · next-level · rockstar / ninja / guru · "Let's connect" (as a lone CTA) · "100% responsive" · "top 5 GitHub Latvia" · any price ("150€+") · "to perfection" · "scroll-jacking" (say "scroll-scrubbed") · "x years of experience".

---

## 6. Visual direction

**Mood:** poster · black and white · heavy type · grain · calm.
Think of a printed poster at night: one huge line of white type on black, a little grain, nothing else. Not neon, not gradient, not "hacker terminal".

**The full system is in `design/design-system.md`, and the values are in `design/tokens.css`.** This section only records the decisions.

### Palette

Dark only. Black `#000000`, white `#FFFFFF` and a neutral grey ramp. No hue, no accent colour, no gradients, no light theme and no theme toggle. White is the accent: one primary button per view, plus the mark. All text pairs pass WCAG AA; body and secondary text pass AAA (table in the design system, section 3). Replace every shadcn default token (no stock zinc/slate).

### Type

One family: **Archivo Variable** (`@fontsource-variable/archivo`, import `wdth.css`). Titles are weight 900 at 125% width, uppercase. Body is normal width at 17px, max line length 68ch. Labels are small, bold and lowercase. There is no mono face. Archivo covers Latin and Latin-ext (Latvian "Rīga") but has no Cyrillic. Scale and loading notes are in the design system, section 4.

### Motion

Motion is always **vertical**. It accelerates, cruises, then slows and settles without bounce. Nothing slides sideways, nothing spins, nothing pops from zero scale. (Exception, 2026-11-11: the hero project canvas pans freely in 2D with tilted cards.)

Tokens (one set, shared by every library; names as in `design/tokens.css`):
- `--motion-move: cubic-bezier(0.65, 0, 0.35, 1)` for moves between states.
- `--motion-arrive: cubic-bezier(0.22, 1, 0.36, 1)` for things entering.
- Durations: 160ms (micro), 320ms (component), 560ms (section reveal). Spring for `motion`: stiffness 380, damping 38 (no visible overshoot).
- Entrance = rise 12 to 16px + fade, once per element. H1 never animates (LCP); hero motion is CSS on the subline only.
- `<MotionConfig reducedMotion="user">` at the root; every effect has a static fallback.

**One job per library**

| Library | Job | Feel of its one effect |
|---|---|---|
| **React Bits** | Hero background | A slow field of thin white vertical lines drifting upward: you notice it on the second look, not the first. Lazy WebGL after `load`, desktop with `pointer: fine` only, pauses off-screen; static black with grain on mobile, reduced motion and Save-Data. **Component: `Threads`** (`@react-bits/Threads-TS-TW`, verified in the registry: zero npm dependencies, raw WebGL2, props `angle`, `lineCount`, `speed`, `brightness`, `opacity`, `fade`, `paused`, `enableMouseInteraction`). Tune: `angle` so lines run vertical (confirm visually, the axis convention is not documented), low `speed`, `enableMouseInteraction={false}`, white lines only, and `opacity` under the cap in the design system (no pixel behind text brighter than `#262626`). Fallback if `Threads` cannot be made vertical: `LineWaves` (`rotation` prop). Reject Aurora, Galaxy, Particles, Silk, Hyperspeed (the 2026 template look). Budget: ~5 kB gz measured for a comparable item (stack.md); mount via `React.lazy` after `load`, so it cannot touch LCP (the LCP element is the prerendered H1) or the entry JS budget (≤120 kB gz entry, ≤160 kB total). The static poster is rendered in the prerendered HTML so there is no layout shift. Note: market.md calls an animated WebGL background behind a centred name the most recognisable template hero. Dmytro's decision overrides it; the monochrome, vertical, near-invisible tuning is what keeps it from reading as a template. Compare Lighthouse with the effect on and off before shipping. |
| **SmoothUI** | Dock nav | One pill fixed at the bottom of the screen with five text links: Work, How, Journey, About, Contact. Items rise 2px under the pointer, and the current section shows the white mark under its label. **Component: `dock`** (`@smoothui/dock`; also exists: `floating-navbar`, which is a top pill and does not fit). `dock` has `orientation`, `items[].active` (draws a status dot), `magnification`, `showLabels`, `useReducedMotion`; it needs `tokens.json` (prune `index.css`, see stack.md). Required changes in the copied file: render short text labels instead of icon tiles; set `magnification={1.12}` or lower (default 1.55 is far above this brand's limit); **delete the macOS launch-bounce** on click (`BOUNCE_*` constants, `-0.4 × size` jump: it breaks "no bounce"); change the `aria-label` suffix "(running)" to "(current section)" and add `aria-current="location"`; rename `aria-label="Application dock"` to "Sections"; replace the active dot with the white mark. Five short labels fit a 360 px phone at 13px with 8px side padding (checked in `design/preview.html`). Top is reached through the logo and "Back to top"; Client words is reached by scroll. |
| **Aceternity** | Journey timeline | A rail that fills downward in white as you scroll, lighting each entry as you pass it. **Component: `timeline`** (`@aceternity/timeline`, uses `useScroll` + `useTransform` from `motion/react`; the rail already fills top to bottom with scroll). Gaps: its fill is hard-coded purple-blue (`from-purple-500 via-blue-500`), which the palette bans, so make it white; its titles are `neutral-500`, so use `--fg-subtle` until lit. It does not light entries as you pass them: add an `active` state with `useMotionValueEvent` on the same scroll progress. Remove `React`/`useMotionValueEvent` unused-import errors (TS6133). The stock sticky year titles are `md` only, so on mobile each year sits inline above its text. Static rail, all entries lit, under reduced motion. |
| **Animate UI** | Micro-interactions | Short, tactile, honest: the copy icon flips to a check with "Copied", true numbers count up once on first view (tabular figures), and one proof phrase gets a single white underline sweep. Never on hover-for-nothing. **Components** (verified in `@animate-ui/react` 2.4.3): `primitives/buttons/copy` (`CopyButton` + `CopyButtonIcon`, `content` prop; add `aria-live="polite"` text "Email copied"), `primitives/texts/counting-number` (`CountingNumber`; for "400+" count the 400 and print the "+" outside; the span is `aria-hidden` with a static `sr-only` "400+"; prerendered HTML must show 400, not 0, so use `initiallyStable` or verify the SSR output), `primitives/texts/highlight` (`HighlightText`, a background-size sweep, not an underline; give it `bg-[linear-gradient(transparent_92%,var(--fg)_92%)]` so the filled strip is a 2 px underline, and set `transition` to 560 ms, because the default is 2 s). `primitives/effects/highlight` is a different thing (a moving hover pill) and is not used. All three import full `motion` (~45 kB gz, paid once, inside budget). |
| **shadcn** | Base primitives | No motion of its own. Buttons, dialog, tooltip, tabs, all restyled to the design tokens: square surfaces, pill buttons. |
| **Own code** | Project canvas in the hero (signature) | A draggable panel of six tilted project cards that wraps in both directions, with inertia. A card opens a dialog with the project's detail. Replaces the planned bento grid (2026-11-11). Full spec in `design/landing-page.md`, section 2. |

### Imagery
- **A real photo of Dmytro.** None exists yet ([TBD: portrait]). One natural-light portrait in Riga, chest-up, looking at camera, no laptop-on-knees cliché. Used in About, OG image variant, and all profiles.
- **Riga, shot by him.** 2 to 3 own photos (street, tram, river at dusk) in About and footer. Black and white, high contrast. No stock skyline.
- **Product screenshots, real, current and in true colour** (they are the only colour on the page). Stundio on phone frames (the README already has four), Prolifts from the live site and its hero frames, Curio from curio.today, one-to-one's Mermaid architecture diagram. AVIF stills, explicit width/height, no fake device mockups with reflections.
- No AI-generated portraits or illustrations of him. The only AI imagery is Prolifts' own hero, credited as part of that case study.

---

## 7. Site narrative

Single page plus two case-study routes (`/work/prolifts`, `/work/stundio`). Sections run top to bottom. One dock, fixed at the bottom of the screen, links to Work, How, Journey, About and Contact and marks the current section. Sections have no numbers.

| Section | Purpose | Proof it carries |
|---|---|---|
| **Hero** | Name, role, tagline, one action. Pass the 10-second test. | Proof strip: Stundio (400+ daily) · Prolifts · Curio, each with a live mark; "400+" counts up once (Animate UI). React Bits background. |
| **Selected work** | Show production work, deepest first. | The hero's project canvas (2026-11-11; no separate poster): Prolifts, Stundio, Curio, Numerologgi, one-to-one, DNF as draggable cards, each opening a dialog. |
| **How I work** | Answer the reliability and handoff objections. | 4 plain rows: design + build solo; performance and accessibility (this site's own budgets: LCP ≤1.8s, JS ≤160 kB); CMS handoff (Sanity, Payload); CI/CD on every project. Prolifts timeline as the real example. No icon-card grid. |
| **Journey** | Show the path, not the age. | Aceternity timeline (see §8 for wording): the Google Maps scraper (no year label) → 2025 Curio → 2026 one-to-one, Stundio, freelance client work, Prolifts → Numerologgi (when live). |
| **About** | The human layer. | Photo, Riga, name line, languages, "Make it run, make it right.", one RVT line, certificates (small). |
| **Client words** | Neutralise the age doubt with someone else's voice. | `[TBD: Prolifts quote, name, role, Pro-lifts SIA]`. Section hidden until the quote is real. |
| **Contact** | One path. | Copy email (Animate UI), GitHub, LinkedIn, Telegram. Riga local time. No form. |
| **Footer** | Craft details. | "Built by Dmytro Polizhai in Riga", source link, © 2026, custom 404. |

**The signature moment (the hero canvas).** Changed 2026-11-11: the bento grid is gone. The signature is the draggable project canvas in the hero, built in own code. The visitor drags tilted project cards in any direction and opens one for its detail. Stundio's "400+" counts up in its dialog. Under reduced motion the layout is static and the drag is 1:1.

**Project depth**

| Project | Depth | Content |
|---|---|---|
| **Prolifts** | Full case study + the first card on the canvas | Context (Riga elevator contractor, LV/RU/EN), how the AI video was made into scrubbable frames, mobile performance trade-offs, Sanity handoff, CI on a self-hosted runner, timeline (2026-08-08 to live), quote [TBD]. Mention once: "delivered under my studio name, Multilance". |
| **Stundio** | Full case study | Problem (school timetable changes daily), offline-first design, EduPage data, Android widgets, push, three platforms, MIT repo link, commit share, 400+ daily users. State "unofficial, not affiliated with RVT". Strongest recruiter proof. |
| **Curio** | Card + short write-up on home | Built for its owner, Alexander Shunin. Next.js rebuild of the curio.today frontend: multilingual, Payload backend, 830/830 commits, page load time down 10% (site analytics), live link. Label: "Client product", not "my product". |
| **one-to-one** | Card, "code" label | Real-time private chat: Socket.IO, Redis, Postgres, Docker, CI, email OTP. Archived, no live link: show the architecture diagram and the repo. Proof of backend depth. |
| **Numerologgi** | Gated (`status: "pending"`) | Hidden until the shop is public and the client approves. Then a card: Next 16, Payload, Stripe, three.js, 113/113 commits. |

| **DNF** | One line in a small "Side projects" row under Selected work | A timer app for Rubik's cube speedsolvers (Angular). Shows personality and range; no case study, repo link only. |

Not shown: any other small repos (they dilute the proof).

---

## 8. Credibility system

### Age
- **Never in the hero, title, meta or dock.** Never as a selling point.
- **Once, in About, as a plain fact:** "I'm 18." Next to the origin story below, no adjectives.
- Let the work do the work: a live client site, 830 commits on Curio, 400+ daily Stundio users. A reader does the maths and is impressed on their own.
- Never "young", "junior", "student developer", "despite my age".

### Origin story (replaces "coding since 2021")
Dmytro wants the "since 2021" label gone. Good call: a start year invites a GitHub audit, and a duration claim ("5 years") is the weakest kind of proof. Replace the year with the story and the result.

- **Hero: no origin line at all.** The proof strip is the credential.
- **About, recommended wording:** "Self-taught. I started with a Google Maps scraper. Now I ship apps that people use every day." (BRIEF confirms only "started with a Google Maps scraper". His LinkedIn summary adds "pulling restaurant data", in his own words, but the BRIEF has not confirmed it, so the detail stays out. The line has no date to check and ends on the verified proof.)
- **Short form (dock tooltip, LinkedIn, OG):** "Self-taught, from a Google Maps scraper to production apps."
- **Journey timeline:** first node is "First script: a Google Maps scraper" with no year; dated nodes use years or months only where a source holds the date: Curio 2025 (repo created 2025-07), Prolifts 2026-08 (first commit). Stundio: year 2026 only, because github.md (created 2026-04-29) and the local clone in profile.md (first commit 2026-09-09) disagree.
- **Never:** "coding since 2021", "since age 12" as a headline, "X years of experience".

### Certifications
Google UX Design, Meta Front-End Developer, Google AI Professional Certificate. Issuers are inferred from the titles; show them only with verified credential links ([TBD per cert]). Place: a small row in About ("Certificates"), never in the hero. Drop "Google & Meta Certified" from the GitHub bio: for clients, certificates are weaker than live products, and leading with them signals the opposite of "shipped".

### Languages
Show as: "Ukrainian, Russian: native · Latvian, English: B1". Frame as a client benefit in "How I work": "I can talk to your team in Latvian, English, Ukrainian or Russian." Align LinkedIn levels with these. The site itself is English only in v1 (an unmaintained 4-language site is worse than one clean English one).

### RVT
Low-key, recruiter-facing only. One line in About: "Studying programming at Riga State Technical School (RVT)." Stundio names RVT as context ("for students at Riga State Technical School"), not as "my school". Not in client copy, not in the hero, not in the title.

### Ownership precision
Always say exactly what he did: "442 of 545 commits", "830 of 830". Never round up to "built entirely" when it isn't. This precision is itself a credibility device.

---

## 9. Out of scope / never say

- Game development, of any kind, anywhere (hard rule; includes timeline, skills, bios, alt text, JSON-LD).
- Multilance as the brand (one factual mention in the Prolifts case study only; no logo).
- Prices, packages, "150€+", contract terms, client budgets.
- "Top 5 GitHub Latvia" or any ranking.
- Invented or unsourced numbers: Curio "2.5k users", "8.4 min sessions", "94%", "clients in four countries". (The Curio 10% load-time figure is verified from analytics and allowed.)
- "Coding since 2021" or any start-year / years-of-experience claim.
- Calling Curio "my product" (it belongs to Alexander Shunin).
- Stundio as Flutter / Dart, or as "in development".
- Kubernetes, Kafka, GitLab, Prisma, GSAP as skills (no evidence in the repos).
- "Scroll-jacking" for Prolifts (it is scroll-scrubbed).
- RTU, Entrepreneurship & Management, IT STEP.
- Anything that implies Stundio is official or affiliated with RVT or EduPage.
- Numerologgi before it is public and approved; Prodamus.
- Unnamed testimonials, logo walls, skill bars, percentage rings, "Hi, I'm…".
- Private repos, client repo links (pro-lifts org), personal documents (MyDiplomas).
- Phone number or WhatsApp.

---

## 10. Open questions for Dmytro (blocking only)

Resolved 2026-11-09 (BRIEF.md): name (Поліжай, по-лі-ЖАЙ), Stundio 400+ daily, Curio owner (Alexander Shunin) and 10% figure, DNF, origin wording (§8), Prolifts hero frames reusable and a client quote coming, domain polizhai.com.

1. **Prolifts quote:** exact words, and can we print the person's name, role and "Pro-lifts SIA"? Blocks the Client words section. Also: OK to add "Site by Dmytro Polizhai" to the pro-lifts.lv footer (currently "Design — Multilance")?
2. **Curio credit:** may the site name Alexander Shunin as the owner, or should it say "built for Curio's founder" without a name?
3. **Photo:** will you shoot a real portrait in Riga? About and the OG image wait on it.
4. **Availability:** is there a true line you want near the CTA ("Taking projects from …")? If not, no pill ships.
5. **Stundio start date:** github.md says the repo was created 2026-04-29; the local clone's first commit is 2026-09-09. Which is right? Only needed if the Journey timeline shows a Stundio month.

---

## Review notes

Reviewer pass, 2026-11-09 (brand, UI/UX, accessibility). Checked against BRIEF.md, profile.md (confirmed block), github.md, market.md, stack.md; contrast and font data recomputed or fetched live.

**Verdict: PASS WITH FIXES.** Strategy and decisions stand. Changes below are fact precision, one missing contrast pair, component specifics and a few accessibility holes.

**Facts**
1. Origin line: removed "restaurant". BRIEF confirms only "started with a Google Maps scraper". profile.md quotes his LinkedIn ("restaurant data"), but that is unconfirmed, so it can come back only if Dmytro says so. Former open question 5 is closed as a result.
2. Curio: replaced "830 commits, all mine" with "built the frontend, 830 commits". github.md shows 830/830 commits by dmytropolizhai in `curio-today/frontend` only; the CMS is a separate private repo. "All mine" sounds like owning the product (Curio belongs to Alexander Shunin, never "my product") and implies the whole of Curio. Positioning "wrote alone" and "10% faster page loads" softened to the sourced "built for its owner" and "page load time down 10%".
3. Tagline logic: "Built in Riga" is backed by Stundio and Prolifts (both Riga). "Used every day" is verified for Stundio only; Prolifts and Curio have no usage figure. Rewrote the rationale and made Stundio the first proof-strip item. Tagline kept.
4. Removed "Unlike most portfolios his age" (an unsourced comparison and an age hook, against §8).
5. Bio and proof 1: added "unofficial" for Stundio (the site states it is not affiliated with RVT). Pitch: "runs on a site I built" became "has a live site I built".
6. Journey: Stundio no longer shows "2026-04"; github.md and the local clone disagree on its start. Year only until confirmed (new open question 5).
7. Game development: no mention outside the never-say list. Checked.
8. Open question list: removed what BRIEF already answers.

**Contrast** (script in /tmp/claude-1000/c/c.py). All existing ratios were right and every pair passes. Added the missing pairs: dark accent on surface 10.1:1; light text on surface 18.7:1; light accent on surface 1.8:1 (fill only); text and muted on `--line`. Light `--control` is 3.47:1 on bg, above the 3:1 UI minimum but with a thin margin. Added a hero-line brightness cap: at `#17372B` the muted text is still 4.9:1.

**Fonts.** Onest Variable 5.3.1 and JetBrains Mono Variable 5.3.0 both ship latin, latin-ext and cyrillic. The package CSS ranges include Latvian ā č ē ģ ī ķ ļ ņ š ū ž and Ukrainian і ї є ґ. No replacement. The `■` glyph is outside both subsets, so the proof-strip marker must be a CSS square.

**Feasibility.** React Bits `Threads` (hero lines, zero deps, lazy, poster fallback); SmoothUI `dock` (not `floating-navbar`; needs magnification 1.12, deletion of the click bounce, aria fixes, 5 to 6 tiles on mobile); Aceternity `timeline` (needs recolour away from purple-blue, entry lighting added); Animate UI `CopyButton`, `CountingNumber`, `HighlightText` (an underline needs a gradient trick; the default 2 s duration must be shortened). Nothing is without a component. Budget fits (hero effect lazy, LCP stays on the H1).

**Brand quality.** Hero hierarchy passes the 10-second test (role, name, claim, how, action, proof). Eyebrow set to a 14px minimum because it carries the role. Copy is B1 and free of banned clichés. Floors metaphor limited to four named places so it stays a rhythm, not a costume. Email CTA now needs a live-region announcement and a visible address.
