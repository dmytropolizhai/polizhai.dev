# Landing page plan: polizhai.dev

Date: 2026-11-11. Covers the home page (`/`) only. The two case-study pages come later.

Built on `design/design-system.md` (look), `content/site.ts` (every string) and `brand/strategy.md` (rules). All text below is quoted from `site.ts` with its key, so nothing here is new copy unless it is marked **NEW**. New copy needs your OK before it ships.

## The idea: a stack of posters

Your moodboard is a set of posters: black ground, one huge white line, two small labels in the corners. The page is that, seven times. Each section is one poster with one loud line. Everything under the loud line is quiet, small and factual.

Three things repeat on every poster, so the page feels like one series:

1. **The corner labels.** A hairline, `polizhai` on the left, the topic on the right. Same as the top of every post you made.
2. **The loud line.** One `type-h2` or `type-display` title in wide, heavy Archivo capitals.
3. **One moving thing.** Each poster has one thing that moves and no more: the lines in the hero, the bento grid in Selected work, the white rail in Journey, the clock in Contact.

Colour appears in one place only: product screenshots. On a black and white page, the real products are the brightest thing you see.

## Page skeleton

```
skip link
<header>  Hero                      #top
<main>
  Selected work                     #work
  How I work                        #how
  Journey                           #journey
  About                             #about
  What a client says                #client   (only when approved)
  Contact                           #contact
<footer>
<nav>     Dock, fixed at the bottom
```

- Container 1280px, gutter `clamp(16px, 4vw, 48px)`, space between sections `--section-y`.
- Native scroll. No smooth-scroll library, no snap. Dock links jump with `scroll-behavior: smooth` (off under reduced motion).
- `<main>` has bottom padding of the dock height plus 32px, so the dock never covers the last line.
- Every section enters the same way, once: the corner labels and the title are already there (no animation on titles), the content under them rises 14px and fades in over 560ms with `--motion-arrive`.

## The dock

The only navigation. There is no top nav bar.

| Item | Text | Source |
|---|---|---|
| Nav label (screen readers) | Sections | `nav.label` |
| Items | Work · How · Journey · About · Contact | `nav.sections[id].short`, ids from `facts.dock` |
| Current item suffix (screen readers) | current section | `a11y.currentSection` |

- **Place:** fixed, bottom centre, 16px above the edge plus the phone safe-area inset. One pill on `--raised` with a 1px `--line-strong` border.
- **Items:** 44px high, bold 14px labels in `--fg-muted` (13px and tighter padding under 480px; five labels fit a 360px phone, checked in `preview.html`).
- **Current section:** white label with the small white mark under it, `aria-current="location"`. The current section is the one that crosses the middle of the screen (IntersectionObserver, no scroll listener).
- **Hover:** white label, `--line` fill, rise 2px, 160ms. No bounce on click.
- **On the hero:** the dock is there from first paint, with no item marked. It does not animate in; a nav that arrives late looks broken.
- **Top:** not in the dock. The logo in the hero and "Back to top" in the footer go there.
- **Client words:** not in the dock. You reach it by scrolling between About and Contact.
- **Keyboard:** the skip link comes first in tab order, then the hero, then the page. The dock is last in the DOM and is reachable with one Shift+Tab from the top.

## 1. Hero: the name poster

**Job:** pass the 10-second test. Name, role, what he does, one action.

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

## 2. Selected work: the bento grid

**Job:** show live work, deepest first. Each tile says exactly what you did. This is the signature section of the page.

**Header**

| Element | Text | Style | Source |
|---|---|---|---|
| Corner labels | polizhai / work | `type-label` | `facts.person.familyName`, `nav.sections.work.short` |
| Title | Selected work | `type-h2` | `work.heading` |
| Intro | Live products first. Every card links to the site or the code. | `type-lede` | `work.intro` |

### The grid

Seven tiles of four different sizes on a 12-column grid, 16px gaps. Rows are at least 288px high and grow with their content. Every tile is a design-system card: `--surface`, 1px `--line`, square corners, 24px padding. The project with the most to show gets the most space.

```
┌───────────────────────────────────────┬───────────────────┐
│                                       │                   │
│  PROLIFTS                     8 × 2   │  STUNDIO   4 × 2  │
│  page scrolls itself │ text           │  phones, 400+     │
│                                       │                   │
├───────────────────┬───────────────────┼───────────────────┤
│                   │                   │                   │
│  CURIO     4 × 2  │  NUMEROLOGGI 4 × 2│  ONE-TO-ONE 4 × 2 │
│  10%, two bars    │  three screens    │  chat lines       │
│                   │                   │                   │
├───────────────────┴──────────────┬────┴───────────────────┤
│  DNF                      7 × 1  │  Live first.    5 × 1  │
│  running timer                   │  Motion only where…    │
└──────────────────────────────────┴────────────────────────┘
```

- **Tablet (under 1024px):** 6 columns. Prolifts 6 × 2, then Stundio and Curio 3 × 2, Numerologgi and one-to-one 3 × 2, DNF 6 × 1, statement 6 × 1.
- **Phone (under 640px):** one column, tiles in the order above, each as tall as its content.

### Rules for every tile

- **One animation per tile, and it says what the project is.** No decoration.
- **When it plays.** On a device with a mouse: while the pointer is over the tile, or while keyboard focus is inside it. On touch: once, when 60% of the tile is on screen. Nothing runs while the tile is off screen.
- **How it moves.** Up and down only, transforms and opacity only, `--motion-move`, no bounce, no tilt, no glow that follows the pointer.
- **Entrance.** The seven tiles rise 14px and fade in one after another, 60ms apart, in reading order, once.
- **Hover.** The border goes from `--line` to `--control`. The tile itself does not move or scale.
- **Colour.** Screenshots are in true colour. Everything drawn (bars, chat lines, timer) is white and grey.
- **Buttons.** The Prolifts tile has the one white button of the section. Every other tile uses secondary pills and links.
- **A tile is not one big link.** It holds real links and buttons, so every action has a clear name for keyboard and screen-reader users.
- **Reduced motion.** Every tile shows its finished state and nothing plays. The states are listed per tile below.

### Tile 1: Prolifts (8 × 2)

The largest tile, split in two: the animation on the left (56% of the tile, full height), the text on the right.

**Animation: the page scrolls itself.** The left side is a window onto one tall, full-page screenshot of pro-lifts.lv in true colour. When the animation plays, the screenshot moves up slowly, top to bottom of the page in about 8 seconds, like someone reading the site. When the pointer leaves, it goes back to the top in 560ms. You see the whole real site without leaving the tile. Reduced motion: the top of the page, still.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label | Client site | `type-label`, `--fg-muted` | `work.projects.prolifts.kindLabel` |
| Status | ▰ Live | mark + `type-label` | `common.statusLabels.live` |
| Title | Prolifts | `type-h2` style at 44px (the other tiles use `type-h3`) | `facts.projects.prolifts.name` |
| One-liner | The website of Pro-lifts SIA, an elevator company in Riga. In Latvian, Russian and English, with a video hero that plays as you scroll. | `type-body`, white | `work.projects.prolifts.oneLiner` |
| Role | I designed and built it, set up the CMS and run the deploys. | `type-body`, `--fg-muted` | `work.projects.prolifts.role` |
| Tags | Next.js 16 · Sanity · next-intl · GitHub Actions | tags | `facts.projects.prolifts.stack` |
| Primary button | Visit the live site | primary pill, opens pro-lifts.lv in a new tab | `common.linkLabels.visit` |
| Link | Read the case study | underlined link to `/work/prolifts` | `common.linkLabels.caseStudy` |
| New-tab note (screen readers) | opens in a new tab | appended to every external link on the page | `a11y.externalLink` |

On phones the window sits on top at 4:3 and the text goes under it.

### Tile 2: Stundio (4 × 2)

Tall tile. Top half: two phone screenshots of the app, in true colour, on `--raised`. Bottom half: the number and the text.

**Animation: the number counts.** "400+" counts from 0 to 400 (Animate UI `CountingNumber`; the "+" is printed outside the counter and the HTML already says 400). When it stops, "students every school day" gets one white underline sweep, 560ms (Animate UI `HighlightText`). This is the only underline sweep on the page, and it sits on the one number that is verified daily use. At the same time the two phones rise 14px into place, the second 60ms after the first. Reduced motion: 400+, underlined, phones in place.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Open source / ▰ Live | `type-label` | `work.projects.stundio.kindLabel` |
| Title | Stundio | `type-h3` | `facts.projects.stundio.name` |
| Stat | **400+** students every school day | figure in `type-h2` size with `type-num`; label in `type-small` | `stats.stundioUsers`, `en.stats.stundioUsers` |
| One-liner | An unofficial timetable app for students at Riga State Technical School. On web, Android and Linux. | `type-body`, `--fg-muted` | `work.projects.stundio.oneLiner` |
| Role | I wrote 442 of its 545 commits. | `type-small`, `--fg-muted` | `work.projects.stundio.role` |
| Tags | React 19 · TypeScript · Vite · Capacitor · Tauri | tags | `facts.projects.stundio.stack` |
| Actions | Open the app (secondary pill) · Read the case study · Source on GitHub (links) | | `common.linkLabels` |

### Tile 3: Curio (4 × 2)

Top: a screenshot of curio.today in true colour. Bottom: the number and the text.

**Animation: two bars.** Next to "10%" stand two thin vertical bars on a hairline base. The first is grey and full height. The second is white and 10% shorter. When the animation plays, both grow up from the base in 560ms, the white one 160ms later, and "10%" counts up from 0. The picture is the claim: the same page, a tenth less waiting. Reduced motion: both bars full, 10% shown.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Built for Curio's founder / ▰ Live | `type-label` | `work.projects.curio.kindLabel` |
| Title | Curio | `type-h3` | |
| Stat | **10%** lower page load time | figure in `type-h2` size with `type-num`; label in `type-small` | `stats.curioLoadTime`, `en.stats.curioLoadTime` |
| Bar labels | before / after | `type-label`, `--fg-subtle`, under each bar | **NEW**, needs your OK |
| One-liner | A feed of short news stories. I rebuilt its frontend in Next.js, with support for several languages. | `type-body`, `--fg-muted` | `work.projects.curio.oneLiner` |
| Role | I wrote 830 of 830 commits in the frontend repository. Page load time went down 10% (site analytics). | `type-small`, `--fg-muted` | `work.projects.curio.role` |
| Tags | Next.js 16 · React 19 · TypeScript · next-intl · TanStack Query | tags | |
| Actions | Visit the live site (secondary pill) · Source on GitHub (link) | | |

The owner is never named. If you say no to the two bar labels, drop the bars and keep the counting number.

### Tile 4: Numerologgi (4 × 2)

Top: a screenshot window. Bottom: the text.

**Animation: three screens.** The window shows the catalogue. When the animation plays, the product page slides up over it, then the checkout slides up over that, each move 560ms with a 1.4 second hold. Three screens tell the whole shop: browse, choose, pay. Three small hairline ticks under the window show which screen is up; the current tick is white. Reduced motion: the catalogue, still.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Client shop / ▰ Live | `type-label` | `work.projects.numerologgi.kindLabel` |
| Title | Numerologgi | `type-h3` | |
| One-liner | An online shop for planners, with a CMS catalogue and card payments. | `type-body`, `--fg-muted` | `work.projects.numerologgi.oneLiner` |
| Role | I wrote all 113 commits. | `type-small`, `--fg-muted` | `work.projects.numerologgi.role` |
| Tags | Next.js 16 · Payload · Postgres · Stripe · three.js | tags | |
| Actions | Visit the live site (secondary pill) | | |

### Tile 5: one-to-one (4 × 2)

There is no live site, so there is no screenshot. The top half is `--raised` with `texture-halftone`, and the animation is drawn.

**Animation: a conversation.** Five short horizontal lines appear one by one, each rising 14px into place: grey on the left, white on the right, grey, white, grey. They are chat messages reduced to lines, two people taking turns in real time. After the fifth, the set fades and starts again while the pointer stays. No words, no bubbles, no avatars. Reduced motion: all five lines shown.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label / status | Code / Code only (no mark, `--fg-subtle`) | `type-label` | `work.projects["one-to-one"].kindLabel`, `common.statusLabels["repo-only"]` |
| Title | one-to-one | `type-h3` | |
| One-liner | A private one-to-one chat in real time, with email code sign-in. It runs on Socket.IO, Redis, Postgres and Docker. | `type-body`, `--fg-muted` | `work.projects["one-to-one"].oneLiner` |
| Role | I wrote all 212 commits, across frontend, backend and CI. | `type-small`, `--fg-muted` | `work.projects["one-to-one"].role` |
| Note | Archived. There is no live site, but the code is public. | `type-small`, `--fg-subtle` | `work.projects["one-to-one"].note` |
| Tags | Next.js 16 · Socket.IO · Redis 7 · Postgres 17 · Docker Compose · GitHub Actions | tags | |
| Actions | Source on GitHub (secondary pill) | | |

This is the only project tile without the live mark. The page shows the difference between live and code-only instead of hiding it.

### Tile 6: DNF (7 × 1)

A wide, low tile. Text on the left, the animation on the right.

**Animation: the timer runs.** On the right, a stopwatch in wide heavy figures: `0.00`. While the pointer is on the tile, it runs like a speedcubing timer, hundredths of a second, tabular figures so nothing jumps. When the pointer leaves, it stops for a moment and resets to `0.00`. On touch it runs while the tile is on screen. The timer has `aria-hidden`, because it is a picture of the app and not information. Reduced motion: `0.00`, still.

| Element | Text | Style | Source |
|---|---|---|---|
| Kind label | Side project | `type-label`, `--fg-muted` | `work.projects.dnf.kindLabel` |
| Title | DNF | `type-h3` | `facts.projects.dnf.name` |
| One-liner | A timer app for Rubik's cube speedsolvers. | `type-body`, `--fg-muted` | `work.projects.dnf.oneLiner` |
| Role | My own side project, built with Angular. | `type-small`, `--fg-muted` | `work.projects.dnf.role` |
| Tags | Angular · Tailwind | tags | `facts.projects.dnf.stack` |
| Action | Source on GitHub | underlined link | `common.linkLabels.source` |

`work.sideProjectsHeading` ("Side projects") is no longer shown, because DNF now carries its own "Side project" label inside the grid. The key can stay unused or be removed.

### Tile 7: the statement (5 × 1)

No project. One sentence, the only tile with no border fill: `--bg` instead of `--surface`, so it reads as a gap in the grid with words in it.

**Animation: two beats.** "Live first." rises in. 320ms later, "Motion only where it helps." rises in under it. It plays once, when the tile enters the screen, and it is the last tile to arrive. After six tiles that each move once, the grid explains itself. Reduced motion: both lines shown.

| Element | Text | Style | Source |
|---|---|---|---|
| Statement | Live first. Motion only where it helps. | `type-h3`, white, two lines | `work.secondaryLine` |

**Needs from you:** a full-page screenshot of pro-lifts.lv (about 1200px wide); two phone screenshots of Stundio; a screenshot of curio.today; three Numerologgi screens (catalogue, product, checkout).

## 3. How I work: the spec sheet

**Job:** answer "will he disappear" and "who maintains it" before they are asked.

**Layout (desktop).** Two columns. The left column (5 of 12) is sticky: corner labels, title and intro stay on screen while the right column (7 of 12) scrolls through four rows. On phones it is one column and nothing sticks.

The rows look like a printed spec sheet: a hairline on top, the row title in wide heavy type on the left, the body on the right. No icons, no cards.

| Element | Text | Style | Source |
|---|---|---|---|
| Corner labels | polizhai / how | | |
| Title | How I work | `type-h2` | `how.heading` |
| Intro | What you can expect when we work together. | `type-lede` | `how.intro` |
| Row 1 title | One person, the whole build | `type-h3` | `how.rows[0].title` |
| Row 1 body | I do the design, frontend, backend and deploy myself. You talk to the person who writes the code. | `type-body`, `--fg-muted` | `how.rows[0].body` |
| Row 2 title | Fast and easy to use | | `how.rows[1].title` |
| Row 2 body | I set a speed budget before I build. This site aims to show its main content in under 1.8 seconds, with under 160 kB of JavaScript. It works with a keyboard and with reduced motion. | | `how.rows[1].body` |
| Row 3 title | You edit the content | | `how.rows[2].title` |
| Row 3 body | When a site needs it, I add a CMS, such as Sanity or Payload. Your team can then change text and images without me. | | `how.rows[2].body` |
| Row 4 title | Checked before every deploy | | `how.rows[3].title` |
| Row 4 body | On Prolifts, GitHub Actions runs lint, type checks and a build before each deploy. The site is live and still gets updates. | | `how.rows[3].body` |
| Closing line | I can talk to your team in Latvian, English, Ukrainian or Russian. | `type-lede`, full width, on its own hairline | `how.languagesLine` |

**The creative part.** Row 2 makes a claim about this very page, so the page shows the numbers. Next to the body, two figures in wide heavy type: **1.8 s** and **160 kB**, each with a small label under it. They are the budget, not a live measurement, and the labels say so.

| Element | Text | Status |
|---|---|---|
| Figure label 1 | main content, budget | **NEW**, needs your OK |
| Figure label 2 | JavaScript, budget | **NEW**, needs your OK |

If you do not want new copy, drop the two figures; the row works without them.

**Motion:** each row rises in once as it enters. The sticky column does not animate.

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
- **Entries link back.** Titles of projects that have a tile (Curio, one-to-one, Stundio, Prolifts, Numerologgi) are links to that tile in the bento grid.

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
| Hero background | White vertical lines drifting up, desktop only | React Bits `Threads` |
| Hero customers | Slow logo loop, only with six or more logos | React Bits `LogoLoop` |
| Dock | Rise 2px on hover, mark under the current section | SmoothUI `dock` |
| Bento grid | Seven tiles, one animation each: page scrolls itself, phones rise, bars grow, three screens, chat lines, timer, two-beat statement | Own code |
| Stundio and Curio stats | Count up | Animate UI `CountingNumber` |
| Stundio stat label | One underline sweep | Animate UI `HighlightText` |
| Email buttons | Icon flips to a check, "Copied" | Animate UI `CopyButton` |
| Journey | White rail fills, entries light up, mark at the end | Aceternity `timeline` |
| Every section | Content rises 14px and fades in, once | CSS |

Nothing moves sideways. Titles never animate. Under reduced motion everything above is static and complete.

## Open items

| # | Item | Blocks |
|---|---|---|
| 1 | "Let's talk" as the Contact poster line: yes or no | Contact layout |
| 2 | The two budget labels in How I work: yes or no | Row 2 figures |
| 2b | The bar labels "before" and "after" in the Curio tile: yes or no | Curio bars |
| 3 | Logos for Pro-lifts SIA and Curio; more customers | Hero customers bar |
| 4 | Portrait, 3:4 | About, OG image |
| 5 | Three Riga photos | About strip (optional) |
| 6 | Full-page screenshot of pro-lifts.lv; two Stundio phone screenshots; a Curio screenshot; three Numerologgi screens | Bento grid |
| 7 | Dmitrijs Kuliks: role and sign-off | Client section stays hidden |
| 8 | Booking link | "Book a call" stays hidden |
| 9 | `/logos/numerologgi.svg`: the copy deck says the file is in `design/assets/logos/`, but that folder does not exist | Hero customers bar |
