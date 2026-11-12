# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: clients and startups who want a web product built and shipped. Founders and small business owners in Riga and the Baltics, plus early-stage startups abroad. They buy outcomes and fear risk. Their job on this page: decide whether to get in touch with Dmytro.

Secondary: recruiters and hiring engineers, who need to judge whether he is a credible full-stack hire. Stated as a second audience, not the primary one.

## Product Purpose

polizhai.dev is the personal-brand portfolio of Dmytro Polizhai, a full-stack developer in Riga. Its job is to turn a visitor into a contact: a name, a role, live products to click, and one way to get in touch (Telegram, Gmail, booking a call). Success means a visitor who has seen the work leaves knowing who built it and how to reach him.

## Positioning

"Shipped, not shown." Proof is live products that real people use, not mockups. One owner covers the whole build (design, frontend, backend, data, deploy), and commit ownership is stated precisely (for example 442 of 545 commits, 830 of 830, 212 of 212) rather than claimed loosely. A competitor cannot truthfully copy the claim that the work is live and that one person shipped all of it.

## Operating Context

- Proof is checked by clicking: live links come first, screenshots second.
- Client projects are edited by their owners through CMS tools (Sanity, Payload), so handoff and maintainability matter to prospective clients.

## Capabilities and Constraints

- Site is a static single-page app (Vite, React 19, TypeScript strict) deployed to Cloudflare Pages. No backend.
- Copy and facts live in `content/site.ts` and reach components only through `src/lib/content.ts`.
- Four locales: English (default), Latvian, Russian, Ukrainian.
- Languages Dmytro speaks, as shown on the site: Ukrainian and Russian (native), Latvian (B1), English (B1). Spanish is not shown.
- Education shown is RVT (Riga State Technical School), not RTU.
- Pending on Dmytro (see `src/lib/pending.ts`): the Prolifts quote text and sign-off, the customer logo list, the portrait photo, the Telegram handle and booking link, and the screenshot assets. Null values render placeholders; nothing is invented to fill them.
- Undecided: the exact customer count claim ("more than 5 happy customers") needs a confirmed list before it ships.

## Brand Commitments

- Brand is the person, **Dmytro Polizhai**, not the Multilance agency. Always this spelling.
- Never mention game development (NN Game Studio, UE5), anywhere on the site.
- No elevator or lift metaphor, no "lift shaft" wording, no floor concept, and no scroll-played Prolifts stage on the home page.
- Showcase clients as confirmed: Prolifts, Numerologgi, Stundio (400+ daily users), Curio. Curio is described as "built for Curio's founder"; the owner is not named.
- Voice: factual and specific, per `brand/strategy.md`. "Make it run, make it right" is his own motto.
- Age: Removed. Never mention age or year on the site. Studying at RVT is stated factually.

## Evidence on Hand

- **Stundio**: open-source RVT timetable app, live at app.stundio.lv, used by 400+ students daily (confirmed), 442 of 545 commits by Dmytro.
- **Prolifts**: client site for Pro-lifts SIA, live at pro-lifts.lv since September 2026. Client quote approved in principle; exact text and name/role still pending from Dmytro.
- **Curio**: news platform frontend, 830 of 830 commits, built for its founder. Page load time down 10% per site analytics.
- **Numerologgi**: shop platform, 113 of 113 commits, launched; shown on the site.
- **one-to-one**: real-time app, 212 of 212 commits; archived, repo only.
- Absences future work must not fabricate: customer logos beyond the known three, the Prolifts quote text, the Telegram handle, a booking link, and the portrait photo.

## Product Principles

- **Proof before promise.** Every claim sits next to a live link or a public repo; no mockups stand in for real work.
- **Equal weight across projects.** No single project is singled out as the lead proof. Prolifts and the others are presented with the same prominence; the page does not promote one above the rest.
- **Claims are precise and sourced.** Numbers come from verified data (commit counts, user counts, analytics); when a figure is unconfirmed, it is marked pending rather than rounded up.
- **Motion and interaction serve the work.** The project canvas exists to let visitors browse proof; anything that does not explain or prove something is cut.
- **Honest about background.** Studying programming at RVT and building real products is stated factually, with no age hook or junior framing.

## Accessibility & Inclusion

- Four-language support (EN, LV, RU, UK) with copy kept in one source.
- Reduced motion is honored: the project canvas shows a static layout with 1:1 drag and no inertia.
- Touch: vertical swipes scroll the page; only horizontal pan moves the canvas.
