# Design system: polizhai.dev

Name: **Poster mono**. Date: 2026-11-11. Dark only.

Sources: `brand/moodboard/` (the look), `brand/strategy.md` (voice, motion, structure), `brand/references.md` (x.com, framer.com), and Dmytro's decisions of 2026-11-11.

Files in this folder:

| File | What it is |
|---|---|
| `tokens.css` | Every value, once. Tailwind v4 `@theme` plus the shadcn variable mapping. Compiles with Tailwind 4.3.5 (checked). |
| `preview.html` | Open in a browser. Renders every token and component from `tokens.css`. |
| `logo/` | `mark.svg`, `wordmark.svg`, `lockup.svg`, `favicon.svg`, cut from the moodboard SVG. |

## 0. What this replaces

Decisions by Dmytro, 2026-11-11: **drop the green accent, dark theme only, the domain is polizhai.dev, the font is Archivo, no floor concept, one dock at the bottom.**

This system replaced these parts of `brand/strategy.md`, which is now updated to match:

| Strategy says | Now |
|---|---|
| §6 palette: graphite plus green `#3DDC97`, light theme with toggle | Black, white and greys. No hue. No light theme, no toggle. |
| §6 type: Onest + JetBrains Mono | Archivo Variable only. |
| §3 wordmark: name in Onest plus a green square; "DP" monogram | The parallelogram mark plus `POLIZHAI.DEV`. No monogram. |
| "The square" as live light, dock light, cursor | The parallelogram mark does all of these jobs. |
| polizhai.com | polizhai.dev |
| Sections as numbered floors, "the lift" as a motion theme | Plain sections with no numbers. One dock fixed at the bottom. |

Everything else in the strategy still holds: voice, "one job per library", the motion rules, the performance budgets.

## 1. Principles

1. **Poster first.** Each section opens with one huge line of type. The type is the image.
2. **Two values.** Black and white. Grey is for hierarchy only. White is the accent, so use it for one thing per view: the primary button or the mark.
3. **One shape.** The parallelogram means "this is live" or "you are here". Nothing else on the page is slanted.
4. **Sharp surfaces, round controls.** If it holds content, its corners are square. If you can press it, it is a pill.
5. **Real things carry the colour.** Product screenshots stay in true colour. They are the only colour on the page, so the proof stands out.

## 2. Logo

- **Mark:** a parallelogram, ratio 306.378 : 143.34 (about 2.14 : 1), leaning 30° from vertical.
- **Lockup:** mark plus `POLIZHAI.DEV`. The wordmark is outlined paths; do not retype it.
- **Colour:** white on black. On a white fill (for example print), black. Never grey, never outlined, never on a busy photo without a black panel.
- **Clear space:** the mark's height on every side.
- **Minimum size:** lockup 120px wide. Below that, use the mark alone. Mark minimum 12px wide.
- **Favicon:** `favicon.svg`, white mark on a black square. Export a 180px PNG from it for the Apple touch icon.
- **In code:** the SVG files use `fill="currentColor"` with a white default, so they work as `<img>` and can be recoloured when inlined. For small inline uses there is a CSS shape, `.mark`, sized in `em` from the surrounding text.
- **Where the mark appears:** nav lockup, favicon, "live" marker on projects and proof items, the current section in the dock, OG image. Not as a bullet in body text and not as decoration.

## 3. Colour

| Token | Hex | Use | Contrast on bg / surface / raised |
|---|---|---|---|
| `--bg` | `#000000` | Page | |
| `--surface` | `#0D0D0D` | Cards, panels | |
| `--raised` | `#171717` | Dock, tooltips, hover fill, media placeholders | |
| `--line` | `#262626` | Hairlines and dividers (decorative) | 1.4 / 1.3 / 1.2 |
| `--line-strong` | `#3D3D3D` | Tag and dock outlines (decorative) | 1.9 / 1.8 / 1.7 |
| `--control` | `#6B6B6B` | Borders that carry meaning: secondary button, inputs | 3.9 / 3.6 / 3.4 (UI needs 3:1) |
| `--fg-subtle` | `#808080` | Tertiary text, 14px or larger | 5.3 / 4.9 / 4.5 (AA) |
| `--fg-muted` | `#A3A3A3` | Secondary text, labels | 8.3 / 7.7 / 7.1 (AAA) |
| `--fg` | `#FFFFFF` | Headings, body | 21.0 / 19.4 / 17.9 (AAA) |
| `--inverse` | `#FFFFFF` | Primary button fill, mark, active states, focus ring | |
| `--inverse-hover` | `#D9D9D9` | Primary button hover | black text on it: 14.9 |
| `--on-inverse` | `#000000` | Text on white fills | 21.0 |

Ratios use the WCAG 2.x formula, computed 2026-11-11.

Rules:
- No hue anywhere in the UI. No gradients, no glows, no coloured shadows.
- White fills cover a small part of any view: one primary button, plus marks.
- `--fg-subtle` is 4.5:1 on `--raised`, with no margin. Do not lighten `--raised` or darken `--fg-subtle`.
- `--line` and `--line-strong` are decoration. Never use them for a border the user must see to understand state.
- **Background cap:** anything drawn behind text (hero lines, grain, halftone) must not lift a pixel above `#262626`, which is white at 15% over black. At that level `--fg-muted` is still 6.0:1 and `--fg` 15.1:1. `--fg-subtle` drops to 3.8:1 there, so do not set subtle text over textures.
- Text selection: white background, black text.

The shadcn names (`--background`, `--primary`, `--muted-foreground`, `--ring` and the rest) are mapped onto these tokens in `tokens.css`. The stock Tailwind palette is removed with `--color-*: initial`, so `bg-zinc-500` does not exist.

## 4. Type

One family: **Archivo Variable**, using two axes. Weight runs 100 to 900, width runs 62% to 125% (checked on Fontsource, 2026-11-11).

| Class | Size | Weight | Width | Tracking | Leading | Case | Use |
|---|---|---|---|---|---|---|---|
| `type-display` | `clamp(3rem, 14.5vw, 11rem)` | 900 | 125% | −0.035em | 0.88 | upper | H1 name, one poster line per page |
| `type-h2` | `clamp(2rem, 6.5vw, 4.5rem)` | 900 | 125% | −0.03em | 0.95 | upper | Section titles |
| `type-h3` | `clamp(1.375rem, 2.6vw, 2rem)` | 800 | 125% | −0.025em | 1.05 | sentence | Card titles, timeline entries |
| `type-lede` | `clamp(1.375rem, 3vw, 2.25rem)` | 400 | 100% | −0.035em | 1.15 | sentence | Tagline, quote, intro lines |
| `type-body` | 17px | 400 | 100% | −0.01em | 1.6 | sentence | Paragraphs, max 68ch |
| `type-small` | 14px | 400 | 100% | −0.005em | 1.5 | sentence | Captions, notes |
| `type-label` | 13px | 700 | 100% | −0.01em | 1.2 | lower | Corner labels, card meta, dock items |
| `type-num` | inherits | 700 | inherits | | | | Adds tabular figures to counts and dates |

Rules:
- The hierarchy is width and weight, not colour and not a second typeface. Wide and heavy means "title". Normal width means "read this".
- The H1 is set on two lines, `DMYTRO` / `POLIZHAI`, with a `<br>`. It fits from 360px to 1440px (checked at 390 and 1440). The text in the HTML stays "Dmytro Polizhai"; uppercase is CSS only.
- The role label in the hero ("full-stack developer · riga") is the only place the role shows above the fold. Set it at 14px, not 13px.
- Labels replace the mono eyebrows from the strategy. Lowercase, bold, small, in pairs at the two ends of a hairline, like the corner labels in the posts.
- Display type is never set in grey and never below weight 800.
- No italics. No underline except on links.
- "Let's talk" in Contact is the one place tracking goes to −0.06em, on one line (`white-space: nowrap`).

Loading:
- Package: `@fontsource-variable/archivo` 5.3.0. Import `wdth.css`, which carries both axes. The default `index.css` has weight only and cannot do the wide titles.
- Cost: the latin file with both axes is 90 kB. The weight-only file is 35 kB. The H1 is the LCP element and needs the wide face, so preload the 90 kB latin file. If the mobile LCP budget (1.8 s) is tight, the fix is a subset of that file (uppercase plus digits for display), not a different font.
- Subsets: latin, latin-ext, vietnamese. Latvian letters (ā č ē ģ ī ķ ļ ņ š ū ž) are in latin-ext.
- **No Cyrillic.** The one Cyrillic line on the site ("Дмитро Поліжай" in About) falls back to the system font in the stack. Keep that line at `type-small` or `type-label` size so the change of face is quiet. Do not load a second family for it.
- Add a size-adjusted local fallback for layout stability, and remove the Geist import that `shadcn init` adds.

## 5. Layout

- **Container:** max 80rem (1280px), centred. Gutter `clamp(1rem, 4vw, 3rem)`.
- **Grid:** 12 columns, 24px gap. Under 800px everything is one column.
- **Section rhythm:** `--section-y`, `clamp(6rem, 14vw, 12rem)` between sections.
- **Section header:** a hairline, then two labels on one row (`polizhai` left, the section topic right), then the `type-h2` title. This is the corner-label pattern from the posts. Sections have no numbers.
- **Space scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Tokens `--space-1` to `--space-32`. Use the scale; no one-off values.
- **Alignment:** left. Centre only the single poster line where a section is nothing but that line.
- **Breakpoints:** Tailwind defaults (640, 768, 1024, 1280).

## 6. Shape

- Corners: 0 on cards, media, panels, images, dialogs. `--radius` is 0, so every shadcn primitive is square by default.
- Pills (`--round-pill`): buttons, tags, the dock and its items. In the shadcn button, set `rounded-pill` in the variant, because the default radius is now 0.
- Borders: 1px. Hairlines use `--line`. Meaningful borders use `--control`.
- Depth: none. No shadows. Layers are separated by a 1px line and a step up the grey ramp (`bg` → `surface` → `raised`).
- The 30° lean (`--shear`) belongs to the mark and shapes cut from it. Do not skew cards, buttons, images or text.

## 7. Texture and imagery

Textures (classes in `tokens.css`):
- `texture-grain`: fine noise, screen-blended at 10%. For the hero, the portrait and full-bleed poster sections.
- `texture-halftone`: a 6px dot grid at 14%. For empty media areas and feature panels.
- Use at most one textured area per screen. Not on cards in a grid, not under body paragraphs, never animated.

Imagery:
- **Photos** (portrait, Riga): black and white, high contrast, deep blacks, on a plain ground. The reference is the hoodie shot: faceless, calm, product-like.
- **Portrait:** 3:4, fixed ratio, square corners. Until the photo exists, the placeholder is a `--raised` panel with grain and a label.
- **Screenshots:** real, current, in true colour, 16:10, inside a square frame with a 1px line. No device mockups, no tilt, no reflections.
- **Client logos** (customers bar): single-colour white at 60% opacity, 100% on hover. No colour logos.
- No stock photos, no illustrations, no emoji in the UI.

## 8. Motion

Same values as the strategy. Motion is vertical and settles without bounce. Tokens:

| Token | Value | Use |
|---|---|---|
| `--motion-move` (`ease-move`) | `cubic-bezier(0.65, 0, 0.35, 1)` | Moves between states |
| `--motion-arrive` (`ease-arrive`) | `cubic-bezier(0.22, 1, 0.36, 1)` | Things entering |
| `--dur-micro` | 160ms | Hover, press, colour |
| `--dur-component` | 320ms | Cards, dock, dialogs |
| `--dur-section` | 560ms | Section reveal |
| `--rise` | 14px | Entrance offset |

- Vertical only. No sideways slides, no spin, no bounce, no scale from zero.
- Entrance is a rise plus fade, once per element. The H1 never animates.
- `motion` spring: stiffness 380, damping 38.
- Under `prefers-reduced-motion`, the duration tokens become 0 and `--rise` becomes 0. Every effect also needs a static state.

## 9. Components

Reference markup for each is in `preview.html`.

**Button.** Pill, 48px high (44px for `sm`), 24px side padding, 15px bold label.
| Variant | Default | Hover | Focus |
|---|---|---|---|
| Primary | white fill, black text | fill `--inverse-hover` | 2px white ring, 2px offset |
| Secondary | transparent, `--control` border, white text | border white, fill `--raised` | same ring |
One primary button per view. No press scale; the colour change is the feedback. Touch target is never under 44px.

**Link.** White text, 1px underline in `--control`, offset 0.25em. On hover the underline turns white. Links in body text are always underlined.

**Tag.** Pill, 28px high, 1px `--line-strong`, 13px medium, `--fg-muted`. For stack items. Not clickable.

**Live marker.** `.mark` plus the word "live". A project that is not live has no mark and the label "code only" in `--fg-subtle`. The state is carried by the shape and the word, not by colour.

**Section header.** Hairline, label pair, `type-h2`. See Layout.

**Proof strip.** Three columns split by hairlines. Each has a wide heavy figure (`type-num`) and one line with a mark. One column on mobile.

**Customers bar.** A label ("more than 5 happy customers") then white logos at 60%. With React Bits LogoLoop, keep the loop slow and pause it under reduced motion.

**Project card.** `--surface`, 1px `--line`, square. Media 16:10 on top, then: meta row (type label left, live marker right), `type-h3` title, one or two lines of body in `--fg-muted`, tags, actions. Card buttons are secondary, so a grid of cards never shows a row of white buttons. On hover the border goes to `--control`. Nothing moves.

**Bento grid.** The signature layout, used for Selected work. A 12-column grid with 16px gaps (`--space-4`); rows are at least 288px and grow with content. Tiles are project cards in four sizes: 8 × 2, 4 × 2, 7 × 1, 5 × 1. Under 1024px the grid has 6 columns; under 640px it has one. Each tile has one animation that shows what the project is. It plays on hover or keyboard focus (once on entering the screen on touch), moves up and down only, and uses transforms and opacity. On hover the tile border goes to `--control`; the tile does not scale, tilt or glow. One tile may be text only, on `--bg`. Tile-by-tile spec: `design/landing-page.md`, section 2.

**Dock.** The only navigation. One pill on `--raised` with a 1px `--line-strong` border, fixed at the bottom centre of the screen, 16px above the edge (plus the safe-area inset on phones). Five text items, 44px high, bold 14px with 16px side padding (13px with 8px under 480px, which fits a 360px phone): Work, How, Journey, About, Contact. Default `--fg-muted`. Hover: white text, fill `--line`, rise 2px. The current section is white with a small mark under the label and has `aria-current="location"`. The nav is labelled "Sections". No numbers and no icons. The page keeps bottom padding equal to the dock height plus 32px so the dock never covers the last line.

**Timeline.** A 1px `--line` rail on the left. A 2px white fill grows down it with scroll. Entries above the fill are white with muted text; entries below are `--fg-subtle`. Under reduced motion the rail is full and every entry is lit.

**Quote.** 2px white rule on the left, the quote in `type-lede`, then a label with name, role and company.

**Contact.** "Let's talk" in `type-display` at −0.06em, then three pills: Copy email (primary), Telegram, Book a call. The email address is also shown as text.

**Portrait.** See Imagery.

**Focus.** Every interactive element shows a 2px white outline with a 2px offset on keyboard focus. Never remove it.

## 10. The component libraries, restyled

The "one job per library" map from the strategy stays. Only the colours change.

| Library | Job | Change for this system |
|---|---|---|
| React Bits `Threads` | Hero background | Lines in white only. Keep them under the 15% cap from the colour rules. No accent colour. |
| React Bits `LogoLoop` | Customers bar | White logos, 60% opacity. |
| SmoothUI `dock` | Bottom dock nav | Text labels instead of icon tiles. Active dot becomes the mark. Magnification 1.12 or lower, no click bounce (as in the strategy). |
| Aceternity `timeline` | Journey | Replace the purple-blue fill with white. Titles in `--fg-subtle` until lit. |
| Animate UI | Copy button, counters, highlight | Underline sweep in white, 2px, 560ms. |
| shadcn | Base primitives | Tokens from `tokens.css`. Square by default; buttons get `rounded-pill`. |
| Own code | Bento grid in Selected work | CSS grid plus small CSS and `motion` animations. No bento library: the ready-made ones bring glow, tilt and colour that this system bans. |

## 11. Accessibility

- All text pairs pass AA; body and muted text pass AAA on every surface. Ratios are in the colour table.
- State is never shown by brightness alone: "live" has a shape and a word, the current section has `aria-current` and the mark.
- Uppercase is CSS, so screen readers get normal words.
- Touch targets are 44px or larger.
- Tight leading on display type (0.88) is for one or two lines only. Anything longer uses `type-h3` or `type-lede`.
- Reduced motion is handled in the tokens and must also be handled in every `motion` component (`<MotionConfig reducedMotion="user">`).
- Dark only: set `<meta name="color-scheme" content="dark">` and `theme-color` `#000000`.

## 12. Do and don't

| Do | Don't |
|---|---|
| One poster line per section | Several display lines fighting on one screen |
| White for the one action that matters | White fills on several buttons in a row |
| Square cards, pill buttons | Rounded cards, square buttons |
| Screenshots in true colour | Tinting or desaturating product screenshots |
| The mark for "live" | The mark as a bullet or ornament |
| Lowercase labels in pairs | All-caps tracked-out eyebrows, mono text |
| Grain on one area | Grain over the whole page |

## 13. Other files

Updated on 2026-11-11 to match this system: `brand/strategy.md` (amendment block, sections 3, 6 and 7), `content/site.ts` and `content/copy-deck.md` (domain, `sections` and `dock` in place of floors, no theme toggle, portrait 3:4).

Still describing the old direction, left as a record: the review notes at the end of `brand/strategy.md`, and `research/` (BRIEF.md still says polizhai.com).

The page-by-page plan is in `design/landing-page.md`.
