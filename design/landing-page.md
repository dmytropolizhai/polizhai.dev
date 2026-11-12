# Landing page plan: polizhai.dev

Date: 2026-11-11. Covers the home page (`/`) only. The two case-study pages come later.

Built on `design/design-system.md` (look), `content/site.ts` (every string) and `brand/strategy.md` (rules). All text below is quoted from `site.ts` with its key, so nothing here is new copy unless it is marked **NEW**. New copy needs your OK before it ships.

## The idea: a stack of posters

Your moodboard is a set of posters: black ground, one huge white line, two small labels in the corners. The page is that, seven times. Each section is one poster with one loud line. Everything under the loud line is quiet, small and factual.

Three things repeat on every poster, so the page feels like one series:

1. **The corner labels.** A hairline, `polizhai` on the left, the topic on the right. Same as the top of every post you made.
2. **The loud line.** One `type-h2` or `type-display` title in wide, heavy Archivo capitals.
3. **One moving thing.** Each poster has one thing that moves and no more: the project canvas in the hero (the ferrofluid behind it is the background, not a second mover), the white rail in Journey, the clock in Contact. (Changed 2026-11-11: the bento grid in Selected work is gone, and the canvas replaced it as the signature element.)

Colour appears in one place only: product screenshots. On a black and white page, the real products are the brightest thing you see.

## Page skeleton

```
skip link
<header>  Hero + project canvas     #top, panel #work
<main>
  How I work                        #how
  Journey                           #journey
  About                             #about
  What a client says                #client   (only when approved)
  Contact                           #contact
<footer>
<header>  Top bar, fixed at the top (before the hero)
<nav>     Dock, fixed at the bottom (phones)
```

- Container 1280px, gutter `clamp(16px, 4vw, 48px)`, space between sections `--section-y`.
- Native scroll. No smooth-scroll library, no snap. Dock links jump with `scroll-behavior: smooth` (off under reduced motion).
- `<main>` has bottom padding of the dock height plus 32px, so the dock never covers the last line.
- Every section enters the same way, once: the corner labels and the title are already there (no animation on titles), the content under them rises 14px and fades in over 560ms with `--motion-arrive`.

## Navigation

Changed 2026-11-11 (Dmytro): a top bar joins the dock. Spec in `design-system.md` §9 Navigation.

| Item | Text | Source |
|---|---|---|
| Nav label (screen readers) | Sections | `nav.label` |
| Bar links (768px and up) | Work · How · Journey · About | `nav.sections[id].short`, `facts.dock` without `contact` |
| Bar action | Let's talk → `#contact` | `pendingCopy.letsTalk` (**NEW**, needs your OK); falls back to `nav.sections.contact.label` |
| Dock items (phones) | Work · How · Journey · About · Contact | `nav.sections[id].short`, ids from `facts.dock` |
| Current item suffix (screen readers) | current section | `a11y.currentSection` |

- **Top bar:** fixed to the top, full width. Lockup left (links to `#top`), links centre, action right.
  - At the top of the page it is transparent, the links sit in the `--raised` pill and the action is a secondary pill.
  - After 8px of scroll the bar turns solid (`--bg`, hairline under it), and everything inside it goes flat: no fills, the link group loses its pill.
- **Dock:** phones only (under 768px). Fixed bottom centre, 16px above the edge plus the safe-area inset, one pill on `--raised` with a 1px `--line-strong` border. Five labels fit a 360px phone.
- **Current section:** white label with the small white mark under it, `aria-current="location"`. It is the section that crosses the middle of the screen (IntersectionObserver, no scroll listener). In the hero and in Client words nothing is marked.
- **Hover:** white label, `--line` fill, 160ms. No rise, no bounce on click.
- **First paint:** both are there from first paint and do not animate in; a nav that arrives late looks broken.
- **Keyboard:** skip link first, then the top bar, then the page. On phones the dock is last in the DOM.

## 1. Hero: the name poster

**Job:** pass the 10-second test. Name, role, what he does, one action.

> **Changed 2026-11-11 (Dmytro).** As built, the hero is centred: the 3D mark (own code, it turns toward the cursor) in the middle of the screen, then the name on one line from 768px up (two lines on phones), tagline, subline, the two buttons, and the customers bar on its hairline. The lockup and the role label moved out: the lockup is in the top bar, and the role label was removed. React Bits Threads is no longer used. The layout below is the original plan, kept as a record.

> **Changed again 2026-11-11 (Dmytro, project canvas).** The hero has no H1 and no 3D mark any more. The background is the lazy WebGL ferrofluid (React Bits port); `Mark3D` still exists but is unmounted. The hero now holds the tagline, subline, the two buttons and the "Explore the projects" canvas (panel `id="work"`, see section 2). The canvas is the hero's one moving thing. The ferrofluid ignores the pointer while it is over the panel. Where the text below mentions the 3D mark, the H1, the name poster or the Threads lines, it is the original plan, kept as a record. Open question for Dmytro: the plan does not say whether the customers bar stays in the hero.

> **Changed again 2026-11-12 (Dmytro).** The H1 is heavy and wide (`type-display-poster`: 900, 125%, uppercase, hero only). The second pill is "Email me" (`CopyEmailButton`, primary, `common.emailMe`) instead of "Let's talk", which stays in the nav only.
>
> **Changed 2026-11-12 (Dmytro, new hero).** The hero has an H1 again: the motto "Make it run, make it right." (`hero.headline`, was `hero.tagline`) in `type-display` capped at 6rem, centred and static; it is the LCP. Under it the subline, then two pills: "See the work" (secondary; scrolls the canvas to fill the viewport) and "Let's talk" (primary, `#contact`, label from `pendingCopy.letsTalk`). The eyebrow (`hero.eyebrow`) is deleted and "Email me" left the hero. The canvas below runs full-bleed with no panel. See section 2.

**Layout (desktop).** Full viewport height (`100svh`), content pinned to the bottom-left like a printed poster.

```
┌──────────────────────────────────────────────────────────┐
│ ▰ POLIZHAI.DEV                 full-stack developer · riga │  top row
│                                                          │
│                  (thin white lines, grain)               │
│                                                          │
│ DMYTRO                                                   │
│ POLIZHAI                                                 │  H1, edge to edge
│                                                          │
│ Make it run, make it right.                              │
│ I design, build and launch web apps, from the first...   │
│ (Email me)  (See the work ↓)                             │
│ ──────────────────────────────────────────────────────── │
│ more than 5 happy customers    PRO-LIFTS  CURIO  NUMER…  │  customers bar
│                    ( Work  How  Journey  About  Contact ) │  dock
└──────────────────────────────────────────────────────────┘
```

**Text**

| Element | Text | Style | Source |
|---|---|---|---|
| Top left | lockup (`design/logo/lockup.svg`), 18px high, links to `#top` | | |
| Top right | Full-stack developer · Riga | `type-label` at 14px, `--fg-muted`, lowercase by CSS | `hero.eyebrow` |
| H1 | Dmytro Polizhai | `type-display`, two lines with a `<br>`, uppercase by CSS | `facts.person.name` |
| Tagline | Make it run, make it right. | `type-lede`, white | `hero.tagline` |
| Subline | I design, build and launch web apps, from the first commit to the live site. | `type-body`, `--fg-muted`, max 46rem | `hero.subline` |
| Primary button | Email me | primary pill | `common.emailMe` |
| After click | Copied | same button, icon flips to a check | `common.copied` |
| Screen-reader announce | Email copied | polite live region | `a11y.copy.copied` |
| If the copy fails | Could not copy. Use the email link instead. | live region; the button then opens `mailto:` | `a11y.copy.failed` |
| Secondary button | See the work ↓ | secondary pill, links to `#work`; the arrow is `aria-hidden` | `hero.seeWork` |
| Customers label | More than 5 happy customers | `type-label`, `--fg-muted` | `hero.customers.label` |
| Customers intro (screen readers) | Some of my customers | list label | `a11y.customersList` |
| Customers | Pro-lifts SIA · Curio · Numerologgi | white logos at 60% | `facts.customers` |

**The creative parts**

- **The name is the picture.** The surname line runs from the left gutter to the right gutter. Size it from the container, about `16.7cqw` capped at `12.5rem` (tune in the browser so POLIZHAI touches both edges at 1440px and at 360px). Nothing else in the hero is larger than 36px, so the name has no competition.
- **The role is where a poster keeps its topic:** top right, small. It is the answer to "who is this" for a recruiter, one second in.
- **Background:** React Bits `Threads`, white lines only, running vertical, drifting up slowly, capped at 15% brightness. Over it, `texture-grain`. On phones, reduced motion and Save-Data there are no lines, only black with grain.
- **The customers bar is the bottom edge of the poster,** on a hairline, like the print credits on a film poster. React Bits `LogoLoop` moves the logos slowly. With three logos it should not loop at all; show them still until there are at least six.
- **Motion:** the H1 never animates (it is the LCP element). The subline rises 14px and fades in once, CSS only. Buttons and the bar are static.

**Mobile.** Top row stays on one line (lockup left, role right). The H1 is about 54px, two lines. Buttons sit side by side. The customers label goes on its own line above the logos. Height is `100svh`, with the dock clearance inside it.

**Needs from you:** white single-colour logos for Pro-lifts SIA and Curio; more customer names so "more than 5" has at least six logos behind it.

## 2. Selected work: the project canvas

> **Changed 2026-11-11 (Dmytro).** The Work poster is gone. Its job moved into the hero: an "Explore the projects" canvas under the buttons (panel `id="work"`), plus a dialog per project. The bento grid, its seven tiles, the per-tile animations and the statement line are removed. The canvas is now the signature element of the page. The project text tables below are still the source for the dialog; the tile sizes, animations, Curio bars and statement line are dropped.

**Job:** show live work, deepest first. Each project says exactly what you did. This is the signature element of the page, and it lives in the hero.

### The canvas

> **Changed 2026-11-12 (Dmytro).** No panel: the canvas is full-bleed with no frame and no fill, and the cards are rounded Liquid Glass instead of light paper. The two bullets below replace the old Panel and Cards bullets.

- **Canvas.** `<section id="work">`, full-bleed under the hero band (outside `container-site`), no frame, no fill, `overflow-clip`, height `clamp(32rem, 85svh, 60rem)`, so at 1440×900 and 1280×720 the cards peek at the fold. "Explore the projects" (`work.canvasTitle`) is a visually hidden `<h2>`. It is **NEW** copy: lv/ru/uk wording needs your OK. The bottom edge fades into the page.
- **Cards.** One per visible project: five, equal size, in a loose ring around an empty centre (two above, one at each side, one below), so no project leads. Each is a button (`#work-<id>`) of rounded Liquid Glass: inset screenshot (`/shots/<id>.avif`, WebP fallback, 16:10), then a caption plate with `kindLabel`, the name and the host (`facts.projects[id].display`) with the live mark. One-liner and outcome are in the dialog only. Position, rotation (±5°), depth (0.95 to 1.04), first-screen flag and crop live in a `LAYOUT` record keyed by `VisibleProjectId`.
- **Drag.** Free 2D drag on fine pointers, with inertia (lerp plus friction). The canvas wraps in both directions: every card wraps on its own, so six cards are six DOM nodes with no clones. A drag past 5px suppresses the click that follows it.
- **Feel.** The world scales to 0.97 while pressed (system spring, stiffness 380, damping 38). Cards lean up to ±4° with drag velocity. The cards scatter in once when the panel enters the view. A "Drag" / "View" cursor pill shows on fine hover pointers only (`work.cursor.drag`, `work.cursor.view`, **NEW**).
- **Touch.** `touch-action: pan-y`: vertical swipes scroll the page, horizontal swipes pan the canvas. No wheel hijacking.
- **Keyboard.** Arrow keys on the focused panel pan by 120px. Focus on a card centres it. Enter opens it.
- **Links in.** A `#work-<id>` hash (Journey links) centres that card and opens its dialog. Nav "Work" and "See the work" land on the panel.
- **Reduced motion.** Static layout, 1:1 drag, no inertia, no intro, no lean.
- **Ferrofluid.** The hero's background ignores the pointer while it is over the panel, so the two never compete.

### The project dialog

Clicking a card opens a shadcn Dialog on Base UI. It holds what a tile used to hold: the meta row (kind label, status), the title, one-liner, role, tags, the stat (Stundio 400+, Curio 10%, counted by Magic UI `NumberTicker`, which ships the final value in the HTML) and the actions. `Esc` closes it and returns focus to the card. The close label is `common.close` (**NEW**, lv/ru/uk need your OK). The dialog is square, like every dialog in the system.

- **Buttons.** The Prolifts dialog has the one white button. Every other dialog uses secondary pills and links.
- **Colour.** Screenshots in true colour. Everything else is white and grey.
- **Reduced motion.** The dialog shows its finished state; the counters show their final value.

The project text per dialog:

### Project 1: Prolifts

The first project. It has the most to show.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label | Client site | `type-label`, `--fg-muted` | `work.projects.prolifts.kindLabel` |
| Status | ▰ Live | mark + `type-label` | `common.statusLabels.live` |
| Title | Prolifts | `type-h2` style at 44px (the other dialogs use `type-h3`) | `facts.projects.prolifts.name` |
| One-liner | The website of Pro-lifts SIA, an elevator company in Riga. In Latvian, Russian and English, with a video hero that plays as you scroll. | `type-body`, white | `work.projects.prolifts.oneLiner` |
| Role | I designed and built it, set up the CMS and run the deploys. | `type-body`, `--fg-muted` | `work.projects.prolifts.role` |
| Tags | Next.js 16 · Sanity · next-intl · GitHub Actions | tags | `facts.projects.prolifts.stack` |
| Primary button | Visit the live site | primary pill, opens pro-lifts.lv in a new tab | `common.linkLabels.visit` |
| Link | Read the case study | underlined link to `/work/prolifts` | `common.linkLabels.caseStudy` |
| New-tab note (screen readers) | opens in a new tab | appended to every external link on the page | `a11y.externalLink` |

### Project 2: Stundio

Two phone screenshots of the app, in true colour, on `--raised`; then the number and the text.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Open source / ▰ Live | `type-label` | `work.projects.stundio.kindLabel` |
| Title | Stundio | `type-h3` | `facts.projects.stundio.name` |
| Stat | **400+** students every school day | figure in `type-h2` size with `type-num`; label in `type-small` | `stats.stundioUsers`, `en.stats.stundioUsers` |
| One-liner | An unofficial timetable app for students at Riga State Technical School. On web, Android and Linux. | `type-body`, `--fg-muted` | `work.projects.stundio.oneLiner` |
| Role | I wrote 442 of its 545 commits. | `type-small`, `--fg-muted` | `work.projects.stundio.role` |
| Tags | React 19 · TypeScript · Vite · Capacitor · Tauri | tags | `facts.projects.stundio.stack` |
| Actions | Open the app (secondary pill) · Read the case study · Source on GitHub (links) | | `common.linkLabels` |

### Project 3: Curio

A screenshot of curio.today in true colour; then the number and the text.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Built for Curio's founder / ▰ Live | `type-label` | `work.projects.curio.kindLabel` |
| Title | Curio | `type-h3` | |
| Stat | **10%** lower page load time | figure in `type-h2` size with `type-num`; label in `type-small` | `stats.curioLoadTime`, `en.stats.curioLoadTime` |
| One-liner | A feed of short news stories. I rebuilt its frontend in Next.js, with support for several languages. | `type-body`, `--fg-muted` | `work.projects.curio.oneLiner` |
| Role | I wrote 830 of 830 commits in the frontend repository. Page load time went down 10% (site analytics). | `type-small`, `--fg-muted` | `work.projects.curio.role` |
| Tags | Next.js 16 · React 19 · TypeScript · next-intl · TanStack Query | tags | |
| Actions | Visit the live site (secondary pill) · Source on GitHub (link) | | |

The owner is never named.

### Project 4: Numerologgi

A screenshot window; then the text.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Client shop / ▰ Live | `type-label` | `work.projects.numerologgi.kindLabel` |
| Title | Numerologgi | `type-h3` | |
| One-liner | An online shop for planners, with a CMS catalogue and card payments. | `type-body`, `--fg-muted` | `work.projects.numerologgi.oneLiner` |
| Role | I wrote all 113 commits. | `type-small`, `--fg-muted` | `work.projects.numerologgi.role` |
| Tags | Next.js 16 · Payload · Postgres · Stripe · three.js | tags | |
| Actions | Visit the live site (secondary pill) | | |

### Project 5: one-to-one

There is no live site, so there is no screenshot. The media area is `--raised` with `texture-halftone`.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Code / Code only (no mark, `--fg-subtle`) | `type-label` | `work.projects["one-to-one"].kindLabel`, `common.statusLabels["repo-only"]` |
| Title | one-to-one | `type-h3` | |
| One-liner | A private one-to-one chat in real time, with email code sign-in. It runs on Socket.IO, Redis, Postgres and Docker. | `type-body`, `--fg-muted` | `work.projects["one-to-one"].oneLiner` |
| Role | I wrote all 212 commits, across frontend, backend and CI. | `type-small`, `--fg-muted` | `work.projects["one-to-one"].role` |
| Note | Archived. There is no live site, but the code is public. | `type-small`, `--fg-subtle` | `work.projects["one-to-one"].note` |
| Tags | Next.js 16 · Socket.IO · Redis 7 · Postgres 17 · Docker Compose · GitHub Actions | tags | |
| Actions | Source on GitHub (secondary pill) | | |

This is the only project without the live mark. The page shows the difference between live and code-only instead of hiding it.

### Project 6: DNF

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label | Side project | `type-label`, `--fg-muted` | `work.projects.dnf.kindLabel` |
| Title | DNF | `type-h3` | `facts.projects.dnf.name` |
| One-liner | A timer app for Rubik's cube speedsolvers. | `type-body`, `--fg-muted` | `work.projects.dnf.oneLiner` |
| Role | My own side project, built with Angular. | `type-small`, `--fg-muted` | `work.projects.dnf.role` |
| Tags | Angular · Tailwind | tags | `facts.projects.dnf.stack` |
| Action | Source on GitHub | underlined link | `common.linkLabels.source` |

`work.sideProjectsHeading` ("Side projects") is no longer shown, because DNF carries its own "Side project" label. The key can stay unused or be removed.

**Needs from you:** a full-page screenshot of pro-lifts.lv (about 1200px wide); two phone screenshots of Stundio; a screenshot of curio.today; three Numerologgi screens (catalogue, product, checkout). They show on the cards and in the dialogs.

## 3. How I work: the proof grid

> **Changed 2026-11-12 (Dmytro).** Replaced the 4-row sticky spec sheet with an asymmetric 12-column hairline Proof Grid (`how.cells.*`) where each cell pairs a commercial outcome claim with a bespoke structural proof block at the bottom of the cell.

**Job:** answer "how fast will this launch", "will I pay for every text edit", "is it built to convert", "who maintains it after launch", and "can we work in our language" before they are asked.

**Layout (desktop).** Standard `<Section id="how" title={t.how.heading} intro={t.how.intro}>` header, followed by a 12-column hairline grid (`border-t border-l border-line`):
- Row 1: Cell 1 (`lg:col-span-7` on `--bg`) + Cell 2 (`lg:col-span-5` on `--surface`).
- Row 2: Cell 3 (`lg:col-span-4` on `--bg`) + Cell 4 (`lg:col-span-4` on `--surface`) + Cell 5 (`lg:col-span-4` on `--bg`).
- Tablet (`md`): 2-column grid where Cell 1 spans 2 columns (`md:col-span-2`) and Cells 2–5 sit in two paired rows. Mobile: 1 column.
- Craft floor rules: no kickers or numbers above `<h3>` headings; `<h3>` leads each cell directly (`type-h3 text-fg`), followed tightly by `<p>` (`mt-(--space-3)`), with `mt-auto pt-(--space-8)` separating the bespoke proof artifact at the bottom. Every `<dl>` metric renders the large `type-num` `<dd>` visually above the `type-label` `<dt>`.

| Element | Text | Style | Source |
|---|---|---|---|
| Title | How I work | `type-h2` | `how.heading` |
| Intro | What you can expect when we work together. | `type-lede` | `how.intro` |
| Cell 1 title | Live in weeks, not agency months | `type-h3` | `how.cells.launch.title` |
| Cell 1 body | I handle design, frontend, backend and deploy myself. You don't pay for project managers or handoff delays—your product goes from start to live customers in 2–4 weeks. | `type-body`, `--fg-muted` | `how.cells.launch.body` |
| Cell 1 proof | Figures `2–4 wks` (`from start to live`) & `0` (`agency middlemen`) + 4-stage pipeline strip (`Design → Frontend → Backend → Deploy`) | `type-num` + hairline boxes | `how.cells.launch.figures`, `how.cells.launch.stages` |
| Cell 2 title | Stop paying developers for text edits | `type-h3` | `how.cells.cms.title` |
| Cell 2 body | I set up a modern CMS (Sanity or Payload) around your workflow. Your team changes text, photos, prices and catalogue items in minutes—without paying a developer invoice. | `type-body`, `--fg-muted` | `how.cells.cms.body` |
| Cell 2 proof | Figure `0 €` (`per content or price update`) + spec tags `Sanity`, `Payload CMS` | `type-num` + `bg-raised` tags | `how.cells.cms.figure`, `how.cells.cms.tools` |
| Cell 3 title | Modern tech that turns clicks into leads | `type-h3` | `how.cells.speed.title` |
| Cell 3 body | Slow sites burn ad spend before visitors even see your offer. I use a modern stack (Next.js, React, TypeScript) built to load under 1.8 seconds, rank in search, and convert traffic into sales. | `type-body`, `--fg-muted` | `how.cells.speed.body` |
| Cell 3 proof | Budget figures `< 1.8 s` (`main content, budget`) & `≤ 160 kB` (`JavaScript, budget`) + spec tags `Next.js`, `React`, `TypeScript` | `type-num` + `bg-raised` tags | `pendingCopy.budgetFigures`, `how.cells.speed.stack` |
| Cell 4 title | 2 weeks free support, then monthly care | `type-h3` | `how.cells.support.title` |
| Cell 4 body | Every launch includes two weeks of free support to make sure everything runs smoothly. Need ongoing updates, monitoring and new features after that? Stay covered on a predictable monthly subscription. | `type-body`, `--fg-muted` | `how.cells.support.body` |
| Cell 4 proof | 2-column phase split: `2 wks` (`free after launch`) / `Monthly` (`optional care plan`) + spec tags `Updates`, `Monitoring`, `Fixes` | `type-num` + `bg-raised` tags | `how.cells.support.phases`, `how.cells.support.tags` |
| Cell 5 title | Four languages, zero extra cost | `type-h3` | `how.cells.languages.title` |
| Cell 5 body | I talk directly with your team in Latvian, English, Ukrainian or Russian—and include full support for all four languages in your project for free. | `type-body`, `--fg-muted` | `how.cells.languages.body` |
| Cell 5 proof | Figures `4` (`languages supported`) & `0 €` (`multilingual setup`) + `2×2` hairline language matrix (`Ukrainian · UK`, `Russian · RU`, `Latvian · LV`, `English · EN`) | `type-num` + hairline matrix | `how.cells.languages.figures`, `facts.person.languages`, `about.languages.names` |

**Motion:** each cell rises in once as it enters (`Reveal` with staggered delay).

## 3b. Services: the picker

> **Added 2026-11-12.** New section after How I work, `src/components/sections/services.tsx`. All copy is NEW and pending Dmytro's OK (`pendingCopy.services`; off → the section is not rendered). Not in `facts.sections` / the nav yet (open decision).

**Job:** turn "what would this cost me" into one choice. The visitor picks the closest kind of build, sees what it gets them, its starting price and the live work that proves it, then goes to Contact.

**Layout.** `<section id="services">`, `container-site`, `--section-y` padding, `min-h-svh` from `lg` up so it reads as a full poster (no pin, no sticky, no scroll hijack). Header is the shared `SectionHeader` (`type-h2` title, `type-lede` intro).
- **Desktop (`lg`):** 12-column grid inside a `<fieldset>`. Rows in columns 1–8, the detail panel in columns 9–12, top-aligned with the first row and sharing its top hairline. Grid rows are `auto` (prompt), four `auto` (services) and a `1fr` filler, so a taller panel (support tiers) grows the filler and never stretches the rows.
- **Mobile (below `lg`):** one column. The same single panel moves directly under the selected row (accordion) through CSS `order`; nothing is duplicated in the DOM.
- Rows: hairline `border-t` (last row also `border-b`), `--space-6` vertical padding. A reserved mark slot on the left, then the name and the from-price stacked under it, so every row is the same height in every locale. Names may wrap to two lines (RU/LV run about 20% longer); nothing truncates.
- No kickers or numbers above headings, square corners, pill only on the button.

| Element | Text | Style | Source |
|---|---|---|---|
| Title | Services | `type-h2` | `services.heading` |
| Intro | Four ways to start working together. Pick the closest one and we will adjust the details. | `type-lede`, `--fg-muted` | `services.intro` |
| Prompt | Pick one to start | `type-label`, `--fg-muted`; hidden (space kept) after the first pick | `services.pickPrompt` |
| Row name ×4 | Landing page / Online shop / Web app / Monthly support | `type-display` at `clamp(2rem, 5.2vw, 4.5rem)`, 800, 125% width, white; the biggest type after the H1 | `services.items[id].name` |
| Row price ×4 | from 600 € / from 1,000 € / Custom quote / from 100 € / month | `type-small type-num`, `--fg-muted`, white when selected or hovered | `servicePriceLabel(id)` |
| Selected marker | the mark | `.mark`, white, in the reserved slot | — |
| Panel outcome | e.g. One focused page that turns visitors into enquiries. | `type-lede`, white, max 28ch | `services.items[id].outcome` |
| Panel price | e.g. from 600 € | `type-h3 type-num`, 800, wide | `servicePriceLabel(id)` |
| Proof label + links | See it live · Prolifts, Curio (landing) / Numerologgi (ecommerce) / Stundio (webapp) | `type-label` + text links with the live mark | `services.proofLabel`, `serviceProof(id)`, `facts.projects[id].name` |
| Support tiers (support only) | Basic / Standard / Premium, includes line, 100 / 200 / 600 € / month | hairline `<table>`: name bold 15px, includes `type-small` `--fg-muted`, price `type-small type-num` right | `tierIds`, `services.support.tiers[tier]`, `tierPriceLabel(tier)` |
| Free note (support only) | Every launch includes 2 weeks of free support. | `type-small`, `--fg-muted` | `services.support.freeNote` |
| How link (support only) | 2 weeks free support, then monthly care → `#how` | text link | `how.cells.support.title` |
| CTA | Start with this → `#contact` | primary pill (the one white button in view) | `services.cta` |

**Behaviour.**
- Rows are native radio inputs (visually hidden) in labels: one tab stop, arrow keys move the selection, the focus ring (2px white, inset) sits on the row. The first service is preselected, so the panel is never empty.
- "See it live" links are the existing deep link `#work-<id>` (as in Journey): the canvas scrolls into view, centres the card and opens its dialog. Clicking a link whose hash is already set replays `hashchange`, so the dialog reopens.
- The CTA only scrolls to Contact. Contact has no form, so the chosen service is not carried over.

**Motion:** one moving thing, the panel swap: the new panel content rises and fades in over `--dur-component` with `--motion-arrive` (the `rise-in` keyframes), only after the visitor's first pick. The section enters once with `Reveal`. Titles and row names never animate. Reduced motion: no animation.

**States:** default (first row selected, prompt visible), hover (row fills `--surface`, price turns white), focus (white ring on the row), selected (mark, white price, panel). No empty, loading or error state: everything is static data.

## 4. Journey: the rail

**Job:** show the path, not the age. No start year, no "x years".

**Layout.** Aceternity `timeline`, restyled. A 1px `--line` rail on the left. As you scroll, a 2px white line fills the rail downward. This is the only scroll-linked motion on the page. Entries above the fill are lit: white title, `--fg-muted` body. Entries below it are dim: everything `--fg-subtle`.

On desktop the date sits to the left of the rail and sticks while its entries pass. Four entries share "2026", so the year stays in place while one-to-one, Stundio and Client work scroll by, then changes to "September 2026" for Prolifts. On phones each date sits above its title.

| Element | Text | Style | Source |
|---|---|---|---|
| Corner labels | polizhai / journey | | |
| Title | Journey | `type-h2` | `journey.heading` |
| Intro | The path, one project at a time. | `type-lede` | `journey.intro` |
| Timeline label (screen readers) | Journey timeline | | `a11y.timeline` |

| Date shown | Title (`type-h3`) | Body (`type-body`) | Source key |
|---|---|---|---|
| (none) | First script | A Google Maps scraper. I taught myself the rest. | `first-script` |
| 2025 | Curio frontend | I rebuilt the frontend of a news feed in Next.js, for its founder. Page load time went down 10%. | `curio` |
| 2026 | one-to-one | A real-time chat app. I built the frontend, the backend and the deploy. | `one-to-one` |
| 2026 | Stundio | An open-source timetable app for students at Riga State Technical School. Over 400 of them use it every school day. | `stundio` |
| 2026 | Client work | I build sites and apps for clients on my own, from design to deploy. | `freelance` |
| September 2026 | Prolifts goes live | The site for Pro-lifts SIA, an elevator company in Riga, in three languages. | `prolifts` |
| 2026 | Numerologgi goes live | An online shop for a Riga business, with a CMS catalogue and payments through Stripe. | `numerologgi` |

Dates come from `facts.journey` and are formatted with `Intl.DateTimeFormat`. Dates are `type-label` with `type-num`.

**The creative parts**

- **The first entry has no date, on purpose.** Where the others show a year, "First script" shows an empty slot. The path starts with a thing he made, not with a number.
- **The rail ends in the mark.** When the fill reaches the last entry, the small white mark appears at the bottom end of the rail, next to "Numerologgi goes live". It is the same mark that means "live" on the project cards. The timeline ends on a live product.
- **Entries link back.** Titles of projects that have a card (Curio, one-to-one, Stundio, Prolifts, Numerologgi) are links to `#work-<id>`: that card is centred on the canvas and its dialog opens.

**Reduced motion:** the rail is full, every entry is lit, the mark is shown.

## 5. About: the person

**Job:** the human layer. Short, plain, one photo.

**Layout (desktop).** Two columns. Left (5 of 12): the portrait, 3:4, square corners, black and white, with `texture-grain`. It sticks while the right column scrolls. Right (7 of 12): the name line, the bio, three short facts, then two small tables.

| Element | Text | Style | Source |
|---|---|---|---|
| Corner labels | polizhai / about | | |
| Title | About | `type-h2` | `about.heading` |
| Portrait alt | Portrait of Dmytro Polizhai | | `a11y.portraitAlt` |
| Name label | How to say my name | `type-label`, `--fg-muted` | `about.nameLabel` |
| Name line | poh-lee-**ZHAI** · Дмитро Поліжай | `type-lede`; "ZHAI" white and bold, the rest `--fg-muted`; the Cyrillic part in `type-small`, system font | `facts.person.phonetic`, `.phoneticStress`, `.ukrainian` |
| Bio 1 | I am a full-stack developer in Riga, Latvia. I build web apps and take them all the way to launch. | `type-lede`, white | `about.bio[0]` |
| Bio 2 | My open-source app Stundio is a timetable for students at Riga State Technical School. Over 400 of them use it every school day. I built the live sites for Pro-lifts SIA and Numerologgi, and the frontend of Curio for its founder. | `type-body`, `--fg-muted` | `about.bio[1]` |
| Age | I'm 18. | `type-h3`, white, on its own line | `about.ageLine` |
| Origin | Self-taught. I started with a Google Maps scraper. Now I build live products for clients and for myself. | `type-body` | `about.originLine` |
| School | I study programming at Riga State Technical School (RVT). | `type-small`, `--fg-muted` | `about.schoolLine` |
| Languages heading | Languages | `type-label`, `--fg-muted` | `about.languages.heading` |
| Languages | Ukrainian · Native / Russian · Native / Latvian · B1 / English · B1 | four hairline rows, name left, level right | `about.languages`, `facts.person.languages` |
| Certificates heading | Certificates | `type-label`, `--fg-muted` | `about.certificates.heading` |
| Certificates note | Professional certificates on Coursera. | `type-small`, `--fg-subtle` | `about.certificates.note` |
| Certificates | Google UX Design · Meta Front-End Developer · Google AI | three hairline rows, each an external link | `facts.certificates` |

**The creative parts**

- **"I'm 18." is set like a title.** Three words, wide and heavy, alone on a line, no adjective near it. A fact said that plainly reads as confidence. It appears here and nowhere else on the site.
- **The stress is typography.** In "poh-lee-ZHAI" the last syllable is white and bold and the first two are grey. You hear the name by looking at it.
- **Riga strip.** Under the two columns, a row of three of your own Riga photos, black and white, square corners, 4:3, edge to edge of the container with 1px gaps. No captions. Leave the row out until the photos exist.

**Mobile.** Portrait first at full width, then the text. Nothing sticks.

**Needs from you:** the portrait (3:4); three Riga photos.

## 6. What a client says

**Job:** another person's voice answers the age doubt.

**Renders only when** `facts.clientQuote.status` is "visible" **and** `approval` is "approved". Today it is "pending-client-signoff", so the section is built but hidden until Dmitrijs Kuliks signs off the English wording.

**Layout.** The quietest section on the page, to make the quote loud. No title in big type here: the quote is the loud line. Full container width, a 2px white rule on the left, the quote in large type, the attribution under it.

| Element | Text | Style | Source |
|---|---|---|---|
| Corner labels | polizhai / client | | |
| Heading | What a client says | `type-label`, `--fg-muted` (an `<h2>` for structure, small on screen) | `client.heading` |
| Quote | This is fire. I really like it. Everyone is going to ask me who made it. I'll build your price and reputation. | `type-h2` size, but sentence case, weight 800, width 125% | `client.quote` |
| Attribution | Dmitrijs Kuliks · [TBD: role] · Pro-lifts SIA | `type-label`, `--fg-muted` | `facts.clientQuote` |

**The creative part.** The quote is set in the same wide heavy type as the section titles, in his words and his rhythm, four short sentences on four lines. There are no quote marks and no card; the white rule on the left does that job.

**Needs from you:** his role; his sign-off on the wording (the copy deck suggests asking about the last sentence).

## 7. Contact: the last poster

**Job:** one path. No form.

**Layout.** Full viewport height, `texture-grain` like the hero, content pinned bottom-left. The page ends the way it began.

| Element | Text | Style | Source |
|---|---|---|---|
| Corner labels | polizhai / contact | | |
| Poster line | Let's talk | `type-display`, one line, tracking −0.06em | **NEW**, from your LinkedIn cover; needs your OK |
| Heading | Tell me what you want to launch | `type-lede`, white (this is the `<h2>`) | `contact.heading` |
| Body | Write to me by email or on Telegram, or book a call. Tell me what you want to build and when it should go live. | `type-body`, `--fg-muted` | `contact.body` |
| Email | dmytropolizhai@gmail.com | `type-h3`, selectable text, also a `mailto:` link | `facts.contact[0].display` |
| Primary button | Copy email address | primary pill, copies the address | `a11y.copy.button` |
| After click | Copied / "Email copied" announced | | `common.copied`, `a11y.copy.copied` |
| Secondary button | Telegram | secondary pill to t.me/dmytropolizhai, shows @dmytropolizhai next to it | `contact.labels.telegram`, `facts.contact[1]` |
| Secondary button | Book a call | secondary pill; **hidden until the booking link exists** | `contact.labels.call`, `facts.contact[2]` |
| Clock | Time in Riga · 14:32 | `type-label` + `type-num`, top right under the corner label | `contact.localTimeLabel` |

If you say no to "Let's talk", the heading "Tell me what you want to launch" becomes the poster line in `type-h2`, and nothing else changes.

**The creative parts**

- **The clock is live.** It shows the real time in Riga (`Europe/Riga`), updating each minute. A client abroad sees at once whether it is a good time to write. The HTML ships without the time and the script fills it in, so the prerendered page is never wrong.
- **The address is text first.** It is big, selectable and visible before any button. Copying is a shortcut, not the only way.
- **Symmetry.** Hero and Contact are the only two full-height, grained, bottom-pinned posters. Name at the start, invitation at the end.

## 8. Footer

Small and factual, under a hairline.

| Element | Text | Style | Source |
|---|---|---|---|
| Credit | Built by Dmytro Polizhai in Riga. | `type-small` | `footer.credit` |
| Rights | © 2026 Dmytro Polizhai | `type-small`, `--fg-muted` | `facts.copyrightYear`, `facts.person.name` |
| Links | GitHub · LinkedIn · Telegram | underlined links | `facts.profiles` |
| Back to top | Back to top | underlined link to `#top` | `footer.backToTop` |

**The creative part.** Under those lines, the lockup (`▰ POLIZHAI.DEV`) scaled to the full width of the container, as the last thing on the page. The dock floats over its lower part. It is the logo at poster size, the same way the page opened with the name at poster size.

## Motion summary

| Where | What | Library |
|---|---|---|
| Hero background | Ferrofluid, lazy WebGL, ignores the pointer over the canvas panel | React Bits `Ferrofluid` (port) |
| Hero project canvas | Full-bleed draggable surface with five tilted Liquid Glass cards, inertia, wrap in both directions, press scale, velocity lean and a pointer glare | Own code (`use-pan-canvas.ts`) |
| Hero customers | Slow logo loop, only with six or more logos | React Bits `LogoLoop` |
| Dock | Rise 2px on hover, mark under the current section | SmoothUI `dock` |
| Stundio and Curio stats (in the project dialog) | Count up | Magic UI `NumberTicker` |
| Email buttons | Icon flips to a check, "Copied" | Animate UI `CopyButton` |
| Journey | White rail fills, entries light up, mark at the end | Aceternity `timeline` |
| Every section | Content rises 14px and fades in, once | CSS |

Nothing moves sideways except the project canvas, which is the one named exception (tilted cards and free 2D drag, decided by Dmytro 2026-11-11; rounded Liquid Glass cards, 2026-11-12). Titles never animate. Under reduced motion everything above is static and complete.

## Open items

| # | Item | Blocks |
|---|---|---|
| 1 | "Let's talk" as the Contact poster line: yes or no | Contact layout |
| 2 | The two budget labels in How I work: yes or no | Row 2 figures |
| 2b | The lv/ru/uk wording of `work.canvasTitle`, `work.cursor.*` and `common.close` | Canvas and dialog copy |
| 3 | Logos for Pro-lifts SIA and Curio; more customers | Hero customers bar |
| 4 | Portrait, 3:4 | About, OG image |
| 5 | Three Riga photos | About strip (optional) |
| 6 | Full-page screenshot of pro-lifts.lv; two Stundio phone screenshots; a Curio screenshot; three Numerologgi screens | Canvas cards and dialogs |
| 7 | Dmitrijs Kuliks: role and sign-off | Client section stays hidden |
| 8 | Booking link | "Book a call" stays hidden |
| 9 | `/logos/numerologgi.svg`: the copy deck says the file is in `design/assets/logos/`, but that folder does not exist | Hero customers bar |
