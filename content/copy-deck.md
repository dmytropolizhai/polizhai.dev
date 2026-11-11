# Copy deck: polizhai.dev (English)

Source of truth is `content/site.ts`. This file is the readable version for review.
Facts as of 2026-11-09. Everything not verified is a `[TBD: ...]`.

---

## Hero

Rationale: the hero follows your amendment. Name, your motto, a plain subline, then a customers bar. No age, no availability, no origin line. The role stays above the H1 in the eyebrow, so a recruiter sees "Full-stack developer · Riga" in one second. "Built in Riga. Used every day." moved to the Stundio case-study intro, the only place where "used every day" is verified.

| Element | Copy | Chars |
|---|---|---|
| Eyebrow | Full-stack developer · Riga | 27 |
| H1 | Dmytro Polizhai | 15 |
| Tagline | Make it run, make it right. | 27 |
| Subline | I design, build and launch web apps, from the first commit to the live site. | 76 |
| Primary CTA | Email me (copies the address; shows "Copied") | 8 |
| Secondary CTA | See the work | 12 |
| Customers label | More than 5 happy customers | 27 |
| Logo strip intro | Some of them | 12 |
| Logo strip | Pro-lifts SIA · Curio · Numerologgi (logo `/logos/numerologgi.svg`, links to shop.numerologgi.com) · [TBD: more customers and logos] | n/a |

Meta title: `Dmytro Polizhai · Full-Stack Developer in Riga` (46 chars).
Meta description: `Dmytro Polizhai is a full-stack developer in Riga, Latvia. He designs, builds and launches web apps such as Stundio, Prolifts and Curio.` (135 chars).
OG title: same as the title. OG description: `Make it run, make it right. Web apps from the first commit to the live site.`

Notes on the customers bar:
- "More than 5 happy customers" is your claim and stays. The "Some of them" intro (and the screen-reader label "Some of my customers") makes clear the logos are a sample, not the full list.
- Stundio is out of the strip. It is your own product, not a customer. It still leads the proof in Selected work.
- Numerologgi is visible (launched, approved) and links to https://shop.numerologgi.com. Its logo is `design/assets/logos/numerologgi.svg`, served as `/logos/numerologgi.svg`.

## Nav (the dock)

One dock, fixed at the bottom of the screen. It links to five sections with their short labels: Work · How · Journey · About · Contact (`facts.dock`). The current section is marked. There are no section numbers.

Full section list, in page order: Top · Selected work · How I work · Journey · About · Client words · Contact. Short labels: Top, Work, How, Journey, About, Client, Contact. Top is reached through the logo and "Back to top". Client words appears only when the quote is visible (one flag: `facts.clientQuote.status`).

## Selected work

Rationale: live proof first, deepest first. The section is one bento grid; Prolifts is its largest tile. Every tile states exactly what you did.

- Heading: Selected work
- Intro: Live products first. Every card links to the site or the code.
- Secondary line: Live first. Motion only where it helps.

| Project | Label | One-liner | Role line |
|---|---|---|---|
| Prolifts | Client site | The website of Pro-lifts SIA, an elevator company in Riga. In Latvian, Russian and English, with a video hero that plays as you scroll. | I designed and built it, set up the CMS and run the deploys. |
| Stundio | Open source | An unofficial timetable app for students at Riga State Technical School. On web, Android and Linux. | I wrote 442 of its 545 commits. Stat: 400+ students every school day. |
| Curio | Built for Curio's founder | A feed of short news stories. I rebuilt its frontend in Next.js, with support for several languages. | I wrote 830 of 830 commits in the frontend repository. Page load time went down 10% (site analytics). Stat: 10% lower page load time. |
| Numerologgi | Client shop | An online shop for planners, with a CMS catalogue and card payments. | I wrote all 113 commits. Link: Visit the live site (shop.numerologgi.com) |
| one-to-one | Code | A private one-to-one chat in real time, with email code sign-in. It runs on Socket.IO, Redis, Postgres and Docker. | I wrote all 212 commits, across frontend, backend and CI. Note: Archived. There is no live site, but the code is public. |
| DNF (side project) | Side project | A timer app for Rubik's cube speedsolvers. | My own side project, built with Angular. |

Link labels: Visit the live site · Open the app · Project site · Read the case study · Source on GitHub · Email me about a project. Status badges: Live · Code only.

The owner of Curio is never named. Prodamus and prices never appear.

## How I work

- Intro: What you can expect when we work together.
1. One person, the whole build: I do the design, frontend, backend and deploy myself. You talk to the person who writes the code.
2. Fast and easy to use: I set a speed budget before I build. This site aims to show its main content in under 1.8 seconds, with under 160 kB of JavaScript. It works with a keyboard and with reduced motion.
3. You edit the content: When a site needs it, I add a CMS, such as Sanity or Payload. Your team can then change text and images without me.
4. Checked before every deploy: On Prolifts, GitHub Actions runs lint, type checks and a build before each deploy. The site is live and still gets updates.

Languages line: I can talk to your team in Latvian, English, Ukrainian or Russian.

## Journey

Rationale: shows the path, not the age. Only dates that a source holds. No "since 2021".

| When | Title | Body |
|---|---|---|
| (none) | First script | A Google Maps scraper. I taught myself the rest. |
| 2025 | Curio frontend | I rebuilt the frontend of a news feed in Next.js, for its founder. Page load time went down 10%. |
| 2026 | one-to-one | A real-time chat app. I built the frontend, the backend and the deploy. |
| 2026 | Stundio | An open-source timetable app for students at Riga State Technical School. Over 400 of them use it every school day. |
| 2026 | Client work | I build sites and apps for clients on my own, from design to deploy. |
| September 2026 | Prolifts goes live | The site for Pro-lifts SIA, an elevator company in Riga, in three languages. |
| 2026 | Numerologgi goes live | An online shop for a Riga business, with a CMS catalogue and payments through Stripe. |

Dates are stored as `"2026-09"` / `"2026"` and formatted per locale. Numerologgi shows the year only: it launched after the repo was created (2026-10-06), and the month is not confirmed.

## About

- Name line: Dmytro Polizhai · poh-lee-ZHAI · Дмитро Поліжай (по-лі-ЖАЙ). "ZHAI" is set in white and bold; the rest is grey. The Cyrillic part uses the system font, because Archivo has no Cyrillic. Label: How to say my name
- Bio 1: I am a full-stack developer in Riga, Latvia. I build web apps and take them all the way to launch.
- Bio 2: My open-source app Stundio is a timetable for students at Riga State Technical School. Over 400 of them use it every school day. I built the live sites for Pro-lifts SIA and Numerologgi, and the frontend of Curio for its founder.
- Age: I'm 18.
- Origin: Self-taught. I started with a Google Maps scraper. Now I build live products for clients and for myself.
- School: I study programming at Riga State Technical School (RVT).
- Languages: Ukrainian native · Russian native · Latvian B1 · English B1
- Certificates (note: "Professional certificates on Coursera."): Google UX Design · Meta Front-End Developer · Google AI. Each links to its Coursera share page (verified 2026-11-09).
- Portrait: placeholder, 3:4. Alt: "Portrait of Dmytro Polizhai".

## Client words (visible, pending sign-off)

- Heading: What a client says
- Quote (edited English translation, profanity removed): "This is fire. I really like it. Everyone is going to ask me who made it. I'll build your price and reputation."
- Attribution: Dmitrijs Kuliks, [TBD: role], Pro-lifts SIA
- Status: `facts.clientQuote.status: "visible"`, `approval: "pending-client-signoff"`. The text is a translation of a private chat message, so Dmitrijs Kuliks must approve this English wording before launch. Then set `approval: "approved"`.

For the record (not rendered):
- Source: Russian chat message from Dmitrijs Kuliks (Pro-lifts SIA) to the team, 2026-08-10, sent after he saw the design.
- Original Russian, profanity redacted to "…" (Telegram, 2026-08-10, 21:54–21:55):
  > … ребята огонь ...
  > Мне очень заходит
  > Буду обробатывать думать и с партнерами обсужк
  > Учтите - мне все будут спрашивать кто делал ...
  > Я набью вам цену и репутацию
  - The translation leaves out the third line ("I'll process it, think it over and discuss with partners"), because it's about his decision, not praise.
  - "Я набью вам цену и репутацию" is an idiom: "I'll drive up your value and your reputation". Suggested English for his sign-off: "I'll raise your value and your reputation."
- English translation as approved by Dmytro: see above.

## Contact

- Heading: Tell me what you want to launch
- Body: Write to me by email or on Telegram, or book a call. Tell me what you want to build and when it should go live.
- Channels: Email (dmytropolizhai@gmail.com) · Telegram (@dmytropolizhai, https://t.me/dmytropolizhai) · Book a call ([TBD: booking link])
- Riga time label: Time in Riga

## Footer and 404

- Credit: Built by Dmytro Polizhai in Riga.
- Rights: © 2026 Dmytro Polizhai (built from facts)
- Links: GitHub, LinkedIn, Telegram. Back to top.
- 404: "Page not found" / "This page does not exist, or it moved." / button "Back to the home page".

## Case study: Prolifts

Arc: problem (many brands, six services, three languages, client edits) → build (scroll-played hero, CMS) → result (live September 2026, client edits in Sanity).

- H1: Prolifts. Byline: A website for Pro-lifts SIA, by Dmytro Polizhai.
- Intro: Pro-lifts SIA is an elevator contractor in Riga. I built its site in three languages, with a CMS and a video hero that plays as you scroll.
- Note: Delivered under my studio name, Multilance.
- Problem: Pro-lifts SIA installs and services elevators of many brands. Its site had to explain six services, show the company's experience and help visitors get in touch. It had to work in Latvian, Russian and English. The client also had to edit the content without a developer.
- Constraints: Three languages (Latvian is the main one); a video hero that still runs well on a phone; content in a CMS, not in code.
- What I built: hero played by scroll from AI video cut into frames (portrait and landscape sets); six service sections, manufacturer selector, process, works list, FAQ; contact form that sends email and blocks spam; Sanity Studio inside the site; sitemap, structured data and a social image per language.
- How: I made the hero clips with Google Flow (Veo 3.1) from keyframe images. Then I cut them into frames and wrote the scroll code myself, with no animation library. Before each deploy, GitHub Actions runs lint, type checks and a build. The main branch goes to production, and the dev branch goes to a preview.
- Stack: App: Next.js 16 (App Router), React 19, TypeScript, styled-components · Content and languages: Sanity, next-intl · Forms and spam: Server Actions, Nodemailer, Cloudflare Turnstile · Delivery: GitHub Actions, self-hosted runner.
- Result: The site went live at pro-lifts.lv in September 2026, in Latvian, Russian and English. It still gets updates. The client edits the page content in Sanity without me.
- Links: Visit the live site · Email me about a project.

## Case study: Stundio

Arc: problem (timetable changes, students need it fast on a phone) → build (inline changes, widgets, three platforms, cache) → result (400+ students every school day, 442 of 545 commits).

- H1: Stundio. Byline: An open-source timetable app, by Dmytro Polizhai.
- Intro: Built in Riga. Used every day. Stundio shows the timetable of Riga State Technical School on your phone, with every change.
- Note: Unofficial. Not affiliated with RVT, EduPage or aSc.
- Problem: A school timetable changes all the time. Lessons move, get cancelled, or get a new teacher. Students need to see the next room and the changes fast, on their phone.
- Constraints: data comes from the public EduPage timetable, which I do not control; no accounts, no personal data on a server; three platforms, and I am the main developer; free and open source.
- What I built: next room and inline changes; fast loading from the browser cache after the first visit, with a note on how fresh the data is; no sign-up; Student mode with a building route, and Teacher mode; Web Push and local notifications; three Android widgets; web app, Android app with automatic updates, Linux desktop app; Latvian, English and Ukrainian.
- How: The app reads the school's public EduPage timetable. After the first visit, the browser keeps it in its cache, so the app opens fast.
- Stack: App: React 19, TypeScript, Vite, Tailwind 4, Zustand, Framer Motion · Data and notifications: EduPage, IndexedDB, Web Push · Platforms: PWA, Capacitor 7, Tauri 2, Flatpak, GitHub Releases · Tests: Vitest, Testing Library.
- Result: Over 400 students open Stundio every school day. It is live at app.stundio.lv. The code is public under the MIT license. I wrote 442 of its 545 commits (as of 9 November 2026).
- Links: Open the app · Project site · Source on GitHub.

## Accessibility strings

- Skip link: Skip to main content
- Dock nav label: Sections. Current item: "current section".
- External links: opens in a new tab
- Copy button: Copy email address. Live region: "Email copied". On failure: "Could not copy. Use the email link instead."
- Customers list: Some of my customers
- Timeline: Journey timeline

## JSON-LD

One `@graph` on `/`: Person (`#person`), WebSite (`#website`, publisher → person), ProfilePage (`#profile`, isPartOf → website, mainEntity → person).
Person: name, givenName, familyName, alternateName Дмитро Поліжай, jobTitle Full-Stack Developer, url https://polizhai.dev, image (placeholder `/images/portrait.jpg`), sameAs GitHub, LinkedIn, Telegram (t.me/dmytropolizhai), knowsLanguage uk, ru, lv, en (derived from the About languages), address Riga, LV, alumniOf Riga State Technical School (alternate names Rīgas Valsts tehnikums, RVT).

---

## Every [TBD]

1. Customers bar: more customers and their logos.
2. Logo files: Pro-lifts SIA, Curio (Numerologgi is done).
3. Prolifts quote: Dmitrijs Kuliks's role.
4. Prolifts quote: his sign-off on the English wording (`approval` → "approved").
5. ~~Prolifts quote: the original Russian text~~ (added by the orchestrator).
6. Contact: booking link for "Book a call".
7. Portrait file (About and JSON-LD `image`).
8. Stundio languages: stundio.lv lists Latvian, English, Ukrainian; github.md says "four languages". Confirm the set.

Not in the file but still open: the OG image, and the "Site by Dmytro Polizhai" link on pro-lifts.lv (you add it).

## Translation notes

Strings that need care in lv / ru / uk:
- **Tagline "Make it run, make it right."** A rhythm pair. Keep both halves short and parallel. "Run" means "works", not "executes".
- **"Live first. Motion only where it helps."** Two short claims. Keep them short in translation.
- **"More than 5 happy customers" + "Some of them".** Numeral plus noun needs plural forms. Ukrainian: "Більше 5 задоволених клієнтів", genitive plural. Latvian: "Vairāk nekā 5 apmierināti klienti". "Some of them" must read as a sample ("Серед них", "Daži no tiem").
- **Scroll-scrubbed.** No standard word in lv, ru or uk. Describe it: "the video moves with your scroll". Never a word for "hijack".
- **"Built for Curio's founder".** Keep the owner unnamed in every locale.
- **"I'm 18."** Plain statement. "Мені 18" / "Мне 18" / "Man ir 18", with no extra words.
- **"Book a call".** Use the common local phrase for booking a call, not a literal "reserve a phone".
- **Names.** Pro-lifts SIA, Stundio, Prolifts, Curio, Numerologgi stay in Latin script. Names, stack and certificate titles live in `facts`, so translators never see them.
- **Latvian grammar.** Prefer frames that avoid declining company names ("projekts Curio").
- **RVT.** Say "Rīgas Valsts tehnikums (RVT)" in lv.
- **Levels.** "B1" stays a code. Native: "dzimtā" / "родной" / "рідна".
- **Dates.** Journey dates are ISO in facts. Format them with `Intl.DateTimeFormat` (month + year for "2026-09").
- **Plain-language limit.** Keep sentences short in translation too. Do not merge sentences to save space.

Hero length risk (English chars: eyebrow 27, H1 15, tagline 27, subline 76, customers label 27):
- Russian and Ukrainian run 15 to 30% longer. The subline could reach about 95 characters. Keep it to 2 lines at 360 px.
- Latvian is 10 to 20% longer. Check latin-ext glyphs in the eyebrow.
- Keep the customers label on its own line above the logo strip on mobile.

---

## Review notes

Reviewer pass, 2026-11-09 (creative director + TypeScript). Checked against brand/strategy.md (amendments first), research/BRIEF.md, research/profile.md (confirmed block first), research/github.md, and Dmytro's new confirmations sent through the coordinator.

**Verdict: PASS WITH FIXES.**

**1. Brand fit**
- Hero: "ship" became "launch" in the subline. It is plainer for B1 readers and small-business clients. Read aloud, the hero takes about 8 seconds: role, name, motto, what he does, two actions, then proof.
- "Shipped first. Animated on purpose." became "Live first. Motion only where it helps." The old line was a pun on "ship" that B1 readers and translators would miss.
- Removed filler and mannered lines: "and I ship" (bio), "a Docker setup that deploys itself" (vague), "Checked, shipped, kept up" (a triplet that says little), "Courses I finished. The projects above matter more." (it apologises), and the colon reveals in the contact body and the reduced-motion caption.
- How I work: the intro repeated row 1's title. It now sets up the rows instead.
- Case studies now each run problem → build → result. Prolifts lost two lines that were not true from the sources: "No GSAP" as a constraint (it is a choice, so it moved to How), and "people who turn off motion still get a clear page" (no source shows reduced-motion handling on pro-lifts.lv).
- Origin line: "Now I ship apps that people use every day" said "apps" in the plural, but only Stundio has a verified daily-use figure. It is now "Now I build live products for clients and for myself."

**2. Fact audit**
- Prolifts launch: September 2026 (confirmed by Dmytro). Journey entry "2026-09 · Prolifts goes live". The case study says "went live in September 2026". The 8 August first commit is no longer printed; it was the only date-like claim the copy needed to defend.
- "Client edits content in Sanity": confirmed. Worded as "page content", because the client cannot change the footer.
- Stundio: every "offline" and "service worker" claim is gone (problem, constraints, built, how, meta, stack). It now says "fast loading from the browser cache after the first visit". The data-freshness indicator stays (stundio.lv). "One developer" became "I am the main developer", which matches 442 of 545 commits (github.md: 96 by a `claude` co-author identity, plus 7 by two other people). "A parser reads EduPage" was inferred and is cut.
- Stundio stats: 400+ daily (BRIEF, confirmed); 442/545 (github.md, re-verified); MIT, three Android widgets, Capacitor 7 and Tauri 2 (profile.md). The language set is a new TBD: stundio.lv lists three languages and github.md says four.
- Curio: 830/830 and 10% verified. "Payload CMS backend" was cut from the card, because the CMS repo is separate and his share of it is not shown.
- Numerologgi: visible, approved, launched. Stack and 113/113 from github.md. Journey uses the year only. URL: shop.numerologgi.com.
- Journey "I started building for clients" in 2026 clashed with Curio (client work in 2025). It is now "I build sites and apps for clients" with no start claim.
- Hard rules checked by grep: no game development, no "2021", no owner name, no availability line, no Prodamus.

**3. Customers bar.** The claim stays. "Some of them" plus the screen-reader label "Some of my customers" frame the logos as a sample. Stundio is out (own product), so the `relation` field is gone too.

**4. "I'm 18."** It stays as a line of its own in About, next to the origin story. It has no qualifier, adjective or "but", so it reads as a plain, confident fact. Age appears nowhere else.

**5. TypeScript**
- Split into `facts` (never translated: names, URLs, numbers, dates, stack, visibility) and `SiteCopy` (strings only). Before, every locale would have copied hrefs, `status`, `logoSrc`, `stack` and stat values, so a fact change meant N edits and could drift between locales.
- Lists in `SiteCopy` are `Record<ProjectId | JourneyId | SectionId | StatId, ...>`, with ids derived from `facts` keys. A locale that misses an entry fails to compile (tested: removing `numerologgi` from `en.work.projects` errors).
- Literal unions instead of `string`: `Href` (template literal: https / mailto / path / hash), `Tbd` (`[TBD: ...]`) with an `isTbd` guard, `YearOrMonth` (`"2025"` / `"2026-09"`, so "August 2026" no longer type-checks), `Visibility`, `ProjectStatus`, `LinkKind`, `StackGroup`, `LanguageCode`. Stat suffix is `"" | "+" | "%"`.
- Removed dead or duplicate structure: `locale` field; `precision` (derived from the date string); `hero.h1` and `nameLine.latin` (both the name, now from facts); `srText` (the renderer composes "400+ students..."); `a11y.floorsNavLabel` (duplicate of `nav.label`); `contact.emailCtaLabel` / `emailLabel`; `footer.links` and `rights` (built from facts); per-project link labels (now one `linkLabels` map); the per-case-study repeated headings and back link (now `caseStudy.headings` and `common.backToWork`); the "client" section flag that had to be kept in sync with `client.status` (now one flag).
- All arrays are `readonly`. `facts` uses `as const satisfies Facts`, so key literals survive. `en` uses plain `satisfies SiteCopy`; it does not need `as const`.
- `tsc --noEmit --strict --target es2022 content/site.ts` exits 0.
- Smell to know about: prose still repeats some numbers (442/545, 830, 212, 113). Interpolation would fix that, but it costs renderer complexity. The header comment says to grep when you refresh counts.

**6. JSON-LD.** Replaced the single Person with a `@graph` of Person + WebSite + ProfilePage, linked by `@id` (cheap, and ProfilePage is the type Google expects for a personal profile). Person now has `image` (placeholder), `alumniOf` (EducationalOrganization, Riga State Technical School / Rīgas Valsts tehnikums / RVT) and `@id`. `sameAs` and `knowsLanguage` are derived from facts, so they cannot drift from the visible profile links and languages. One nit: he is a current RVT student, and schema.org's `alumniOf` loosely means "studied at", which is accepted in practice. Google's validator accepts it.

**Second update (same day)**
- Telegram https://t.me/dmytropolizhai added to Contact, to the footer and to JSON-LD `sameAs` (all three built from `facts.profiles` / `facts.contact`).
- "Book a call" is a booking link (TBD), so strategy §9's no-phone rule holds.
- Numerologgi: https://shop.numerologgi.com, logo `/logos/numerologgi.svg` (file present in design/assets/logos/; copy it to `public/logos/`).
- Client quote is visible, attributed to Dmitrijs Kuliks, Pro-lifts SIA. New `facts.clientQuote` fields: `approval`, `name`, `role`, `source`. The copy layer now holds only the translated text.

**Quote review**
- It does the job the strategy gives the Client words section: a named person at a real client, speaking warmly. It answers the age doubt without saying it.
- "This is fire" is slang. It is fine for a quote, because it is his voice, not yours.
- "I'll build your price and reputation" reads as unclear English. It sounds like a literal translation of a Russian phrase meaning "I'll raise your rates and your name" or "I'll recommend you". Ask Dmitrijs which he meant, and fix it in the sign-off. One option: "I will help you raise your prices and your name." Do not change it without his OK.
- The quote is a private message from 10 August, before launch, about the design. It praises the design, not the finished site. That is honest as long as it is not framed as a launch review. The heading "What a client says" is fine.
- Risk: the section ships visible while `approval` is "pending-client-signoff". Render it only when `approval === "approved"`, or get the sign-off before launch.

**Flags for Dmytro**
- Strategy §9 "logo walls" is overridden by your hero amendment. Noted so the conflict is on record.

**Third update (2026-11-11, design system)**
- Domain is polizhai.dev (`siteUrl`, JSON-LD ids and URLs follow from it).
- The floor idea is gone from this site. `facts.floors` is now `facts.sections`, `FloorId` is `SectionId`, `nav.floors` is `nav.sections`. `a11y.floorItem` is removed and `a11y.currentFloor` is now `a11y.currentSection`. New `facts.dock` lists the sections the bottom dock links to; it is checked against `SectionId`.
- The site is dark only, so `a11y.themeToggle` is removed.
- Portrait ratio is 3:4, to match `design/design-system.md`.
- `tsc --noEmit --strict --target es2022 content/site.ts` exits 0.

**Fourth update (2026-11-11, no lift, bento grid)**
- Every lift and shaft line is gone from the copy. Prolifts is described as a three-language site with a video hero that plays as you scroll. The company is still "an elevator company", because that is what it is.
- The scroll-played Prolifts stage on the home page is cancelled. Removed with it: `work.proliftsStage`, `a11y.proliftsSequence`, `a11y.proliftsReducedMotion`, and the first "What I built" line of the Prolifts case study.
- Selected work is now one animated bento grid (`design/landing-page.md`, section 2).
- `tsc --noEmit --strict --target es2022 content/site.ts` exits 0.
