> ## ✅ Confirmed by Dmytro (2026-11-09) — overrides anything below
> - **polizhai.site**: domain expired; old site source is on GitHub (to be identified in github.md).
> - **Education**: RVT (Riga State Technical School), Programmēšanas tehniķis — not RTU.
> - **Game development**: do NOT mention anywhere on the site (NN Game Studio / UE5 excluded from all copy).
> - **Languages**: Ukrainian — native, Russian — native, Latvian — B1, English — B1. (Spanish not listed.)
> - **Client work cleared for public showcase**: Prolifts, Numerologgi, Stundio, Curio.

# Dmytro Polizhai: source profile for portfolio rebuild

Compiled from: LinkedIn export PDF (`/home/dmytro/Downloads/Profile.pdf`), live fetches of stundio.lv, curio.today, pro-lifts.lv and shop.numerologgi.com, local project folders under `/home/dmytro/Projects`, and web searches. Reviewed and corrected (see "Review notes" at the end). Known context from Dmytro's CLAUDE.md is used only for cross-checking (see section 8).

Fetch status: polizhai.site is NOT reachable from the research environment (DNS `getaddrinfo ENOTFOUND` for `polizhai.site` and `www.polizhai.site`, two attempts each). Section 5 is therefore empty of live data and must be redone once the site resolves, or from a copy of the current source.

---

## 1. Identity facts (verified, with source)

| Fact | Value | Source |
|---|---|---|
| Full name | Dmytro Polizhai | LinkedIn PDF p.1; stundio.lv footer "© 2026 Dmytro Polizhai" |
| LinkedIn headline | Full-Stack Developer (Next.js/Node.js) \| I build fast, conversion-focused websites & web apps for small/medium businesses | LinkedIn PDF p.1 |
| Location | Riga, Latvia | LinkedIn PDF p.1 |
| Email | dmytropolizhai@gmail.com (listed in PDF; not reproduced here beyond this line) | LinkedIn PDF p.1 |
| LinkedIn | www.linkedin.com/in/polizhai | LinkedIn PDF p.1 |
| Top skills (LinkedIn) | Progressive Web Applications (PWAs); Android Development; Reverse Engineering | LinkedIn PDF p.1 |
| Self-taught claim | "I'm self-taught. I wrote my first script at 12 — a scraper pulling restaurant data off Google Maps" | LinkedIn PDF p.1 (Summary) |
| Career path claim | Worked through Unity/UE4 and C++ before full-stack web development | LinkedIn PDF p.1 |
| Client scope claim | "shipped React/Next.js frontends and Node.js backends for clients across four countries" | LinkedIn PDF p.1 (unverified count) |
| Brand | Multilance (listed as employer/company; also the commercial brand in CLAUDE.md). Credited as "Design — Multilance" in the pro-lifts.lv footer | LinkedIn PDF p.1; pro-lifts.lv footer (fetched) |
| Curio credit on site | "Created by@dmytropolizhai" | curio.today footer (fetched) |
| Stundio credit on site | "© 2026 Dmytro Polizhai" | stundio.lv footer (fetched) |
| Multilance credit on any fetched site | Present on pro-lifts.lv ("Design — Multilance"); none on stundio.lv or curio.today | fetched |

Languages (as listed on LinkedIn, PDF p.1, verified exact): English (Professional Working), Ukrainian (Native or Bilingual), Latvian (Professional Working). Russian and Spanish are not listed on LinkedIn.

---

## 2. Experience timeline

| Dates (as stated) | Role | Company | Location | Key points (from PDF) |
|---|---|---|---|---|
| July 2026 - present (5 months) | Web Developer | Multilance | Riga, Latvia | Custom websites, landing pages and Telegram bots for multiple industries, design and development solo. Cinematic scroll-driven website concept with AI-generated video for an elevator company client (Prolifts, per CLAUDE.md; confirmed by pro-lifts.lv footer credit "Design — Multilance" and local repo, see section 6). Production payment webhook system integrating Stripe with a Notion-based database backend for an e-commerce client (Numerologgi, per CLAUDE.md). Tiered commercial packages and contract negotiation. CI/CD pipelines for bot and web projects "using GitLab" (no GitLab config found in any inspected local repo; see section 8). |
| June 2025 - February 2026 (9 months) | Full-stack Developer / UI Designer | Curio.today | Riga, Latvia | Rebuilt frontend in Next.js, reducing dynamically rendered pages, 10% lower page load time. Nginx load balancer configuration. Admin panel integrated with the frontend. Custom navigation and API endpoint configuration. |
| May 2023 - April 2025 (2 years) | Middle UE5 Game Developer / NDA (exact LinkedIn title) | NN Game Studio | Wrocław, Dolnośląskie, Poland | P2P networking replacing centralized server dependency. Network debugging module. BusSystem for in-game event communication. Config system parsing .cfg files in modern C++. Code reviews. |

Not on LinkedIn but relevant: Stundio (unofficial school timetable app for Riga's Rigas Valsts tehnikums, see section 6). It is a personal/product project, not a job entry.

---

## 3. Certifications and education

### Certifications (LinkedIn)
- Google UX Design Professional Certificate. Issuer: Google (inferred from the title; the export lists no issuer). Date: not in export.
- Meta Front-End Developer Professional Certificate. Issuer: Meta (inferred from the title). Date: not in export.
- Google AI Professional Certificate. Issuer: Google (inferred from the title). Date: not in export.

### Education (LinkedIn)
- Riga State Technical School (Rigas Valsts tehnikums). Programme (exact): "Programmēšana tehniķis, Computer Programming". Dates: September 2025 - June 2029.
- IT STEP Computer Academy (@itstep.bg). "Basics of CS, Information Technology". Dates: November 2017 - December 2022.

Note: CLAUDE.md says he studies Entrepreneurship & Management at RTU. This does not appear on LinkedIn. See section 8. Per instruction, university studies are not a headline item in any case.

---

## 4. Skills (merged, deduplicated)

Sources: LinkedIn top skills and experience text, CLAUDE.md stack list, and tech visible on fetched sites. Items marked (CLAUDE only) or (PDF only) are single-source.

**Frontend**
- React (CLAUDE, PDF summary)
- Next.js (PDF, CLAUDE; Curio rebuild)
- Vite (CLAUDE; stundio, stundio-landing, stundio-website package.json)
- TypeScript (CLAUDE; all inspected repos)
- Tailwind CSS (CLAUDE; stundio and numerologgi repos)
- Progressive Web Apps (PDF top skill; stundio.lv is a PWA)
- Android development (PDF top skill; stundio.lv Android APK and home-screen widgets)
- UI design (PDF: "Full-stack Developer / UI Designer" title at Curio)
- Zustand (CLAUDE; stundio and numerologgi package.json)

**Animation**
- GSAP (CLAUDE only; not found in pro-lifts, stundio or numerologgi package.json)
- Framer Motion / `motion` (CLAUDE; framer-motion in stundio, motion + Lenis + three in numerologgi package.json)
- Cinematic scroll-driven/scroll-jacking UI (PDF, Prolifts; CLAUDE)

**Backend / data**
- Node.js (PDF)
- Prisma (CLAUDE only; not in any inspected repo)
- Socket.IO (CLAUDE only; not in any inspected repo)
- Stripe webhooks (PDF)
- Notion as database (PDF, CLAUDE)
- Payload CMS 3 / Postgres (CLAUDE; numerologgi package.json), Sanity CMS (pro-lifts package.json), Tauri/Capacitor (stundio package.json)
- REST/API endpoint configuration (PDF, Curio)

**Infra / DevOps**
- Nginx load balancer (PDF)
- Hetzner (CLAUDE only)
- GitHub Actions (CLAUDE; pro-lifts and stundio have `.github/workflows`, pro-lifts deploys via a self-hosted runner)
- GitLab CI/CD (PDF only; no GitLab config found locally; numerologgi has `bitbucket-pipelines.yml`; see section 8)
- GitHub (CLAUDE; public repo for Stundio)
- DigitalOcean (CLAUDE only, Numerologgi)

**Bots / automation**
- Telegram bots (PDF, CLAUDE)
- Python + aiogram (CLAUDE only)

**Game / systems (older)**
- Unreal Engine 5 / UE4 (PDF)
- C++ (PDF)
- P2P networking, reverse engineering (PDF)

**Soft / business**
- Solo end-to-end delivery: design + development (PDF, CLAUDE)
- Commercial packaging and contract negotiation (PDF, CLAUDE)
- Conversion-focused landing pages (PDF)
- Code review (PDF, NN Game Studio)

---

## 5. Current polizhai.site

**Status: NOT FETCHED. polizhai.site is currently down / unresolvable.** DNS does not resolve for `polizhai.site` or `www.polizhai.site` (two attempts each, `getaddrinfo ENOTFOUND`). No copy, meta, nav, copy inventory or i18n check was possible. Data below is limited to what can be said without the site.

- Structure, section order, nav, CTAs, contact methods: unknown.
- Languages: CLAUDE.md says the site is i18n in 4 languages (en/lv/ru/uk). Unverified. Not tested (no /en, /lv, /ru, /uk pages could be loaded).
- Projects shown: unknown. Likely candidates to check on the live site: Stundio, Curio, Prolifts, Numerologgi.
- Weak points: cannot assess. The site being unreachable from DNS itself is worth checking (domain, DNS records, or whether the site is currently down or unpublished).

To complete this section: need old site source or confirm domain status. Note `/home/dmytro/Projects/portfolio/` currently contains only `research/` (no site source), so it is not the old site repo.

---

## 6. Case-study material

### Stundio (stundio.lv)
**Facts (fetched stundio.lv):**
- Unofficial, non-commercial, open-source (MIT) timetable app for students and teachers at Rigas Valsts tehnikums (RVT), Riga. "Not affiliated with RVT, EduPage, or aSc".
- Languages: Latvian, English, Ukrainian.
- Features: next room, cancelled/moved/substituted lessons inline (cancelled struck through); offline-first with local cache and a data-freshness indicator; no accounts (group or teacher name picked once); paired lessons, subgroups, TIC-building marking; Student mode (route between buildings, Rigas Satiksme map) and Teacher mode; Web Push and local notifications; three Android home-screen widgets.
- Install: PWA at app.stundio.lv (iPhone via Safari); Android APK at app.stundio.lv/download with auto-updates from GitHub Releases; Linux desktop (Tauri/Flatpak).
- Stats on page: "400+" students daily, 11+ teachers, "1100+" unique visitors, 2,000+ PWA sessions, "0 B" personal data on server.
- Footer "© 2026 Dmytro Polizhai". Source: github.com/dmytropolizhai/stundio. Tech named on page: PWA, Tauri, Capacitor, Flatpak, TypeScript, Rust.

**Facts (local repos, read-only):**
- `/home/dmytro/Projects/stundio` (app, package.json v2.1.0): React 19, Vite, TypeScript, Tailwind 4, Zustand, Framer Motion (`framer-motion`), Radix UI, date-fns, idb (IndexedDB), `@block65/webcrypto-web-push`; Capacitor 7 for Android (local notifications, network); Tauri 2 for desktop; `functions/` dir with `api-edupage`, `api-push`, `apk.ts`, `download.ts` (serverless-style functions; host not confirmed); Vitest + Testing Library. Has `.github/` and `LINUX.md`/`packaging/` for Flatpak. Git: 535 commits, 2026-09-09 to 2026-10-27, remote github.com/dmytropolizhai/stundio.
- README: data comes from RVT's public EduPage timetable (`pikcrvt.edupage.org`); "local-first". README says "more than 200 people use Stundio, ~1.1k unique visitors, 2k total visits, Android users outnumber iOS" (older than, and conflicting with, the "400+" on stundio.lv).
- Companion repos: `stundio-landing` (React 19 + Vite + Tailwind 4 + Framer Motion marketing site, no README), `stundio-website` (React 19 + Vite + Tailwind 4; README says Cloudflare-Pages-style URLs stundio.pages.dev / app.stundio.pages.dev, which is a different host from stundio.lv; unclear which is live), `stundio-video` (Remotion 4 promo video, README is the Remotion template).
- Scope summary (inferred): solo end-to-end product: parser/data layer for EduPage, offline PWA, native Android wrapper with widgets, desktop packaging, push backend, landing site, promo video, design docs (DESIGN.md, PRODUCT.md).

**Inferred:** Dmytro built it (footer credit; repo remote under his GitHub handle). Personal project, not client work; no Multilance credit.

**Open questions for Dmytro:**
- Confirm personal project and that RVT is OK with it being named (it is explicitly unaffiliated).
- Which user figure is current: 400+ daily (site) or 200+ (README)?
- Which landing site is canonical (stundio.lv vs stundio.pages.dev; which of stundio-landing / stundio-website)?
- Hardest part to write up (EduPage change parsing, offline sync, widgets)?
- Case study page or product page?

### Curio (curio.today)
**Facts (re-fetched curio.today, claims verified):**
- Title "Curio. | Feed"; tagline "Smart Curiosity". Short light-hearted news feed with headline, summary, date.
- Categories: Amazes, Informs, Amuses, Inspires.
- Features: search, theme toggle, language selector (shows EN), "Click To Load More".
- Footer: "All Rights Are Reserved ©" and "Created by@dmytropolizhai" (no visible link target in fetched text).
- Socials: facebook.com/people/Curio-Today/61580098790279/ and instagram.com/curio.today.
- Dated articles seen range 7 Sep 2026 to 15 Oct 2026. No company, owner or Multilance mention.
- Local folder: none. `ls /home/dmytro/Projects` has no curio directory (g44hub, gg-shop, gym-coach-ai, numerologgi, numerologgi.git.bak, portfolio, pro-lifts.lv, reverse, stundio, stundio-landing, stundio-video, stundio-website), so no code-level stack check was possible. Next.js/Nginx/admin panel claims rest on LinkedIn only.

**Inferred:** the LinkedIn Curio.today role (June 2025 - Feb 2026) is this product, based on the matching name. Note a timing gap: the newest visible articles are Sep-Oct 2026, after the stated end date (Feb 2026), so he may still be credited/involved, or the content is run by others on his build.

**Open questions for Dmytro:**
- Ownership: yours, a co-founder's, or a client's? Is the job over (Feb 2026) while the credit remains?
- Is the feed the Next.js rebuild? Source/method of the 10% load-time figure.
- Is the admin panel yours? Is only EN live?

### Prolifts (Pro-lifts SIA, Riga) - https://pro-lifts.lv
**Facts (fetched https://pro-lifts.lv, resolves and is live; local repo `/home/dmytro/Projects/pro-lifts.lv`, read-only; `.env` files not read):**
- Live URL: https://pro-lifts.lv (also confirmed by `src/lib/site.ts`, README, and git remote github.com/pro-lifts/pro-lifts.lv). Corrects the earlier "NOT FOUND": the researcher searched for the wrong name/URL.
- Client: "Pro-lifts SIA", multi-brand elevator contractor in Riga (README, PRODUCT.md). Footer: "© 2026 Pro-lifts SIA" and "Design — Multilance".
- Positioning: "One contractor for every elevator need"; hero headline (fetched): "Viens partneris. Katram liftam."; 20+ years in industry (client claim); client confirmed 5+ staff (intentionally not published).
- Status: a production site, not just a "concept" (LinkedIn wording). Git: first commit 2026-08-08, latest 2026-10-30.
- Concept: the page is a lift shaft, "scrolling is the ride" (DESIGN.md). Sections are "floors" (Stāvs 01-10) with a floor readout. Hero is a scroll-scrubbed frame sequence ("shaft descent", `DescentStage.tsx`, `useDescentFrames.ts`, `descent.ts`) across floors 01-02, separate landscape and portrait sequences, with lift doors component and optional hero soundtrack (off by default).
- AI video: docs show hero clips were generated via Google Flow with Veo 3.1 "Frames to Video" and Nano Banana image keyframes (`docs/descent-portrait-prompts.md`, `docs/descent-portrait-shaft-prompts.md`); service imagery also from AI prompts (`docs/floor-03-image-prompts.md`). Audio is cut from a client-supplied promo video. (Whether the AI video is visibly labelled on the site: not checked.)
- Sections (fetched): approach, six services (installation, maintenance, repair, modernization, emergency dispatch, technical support), manufacturers selector (Otis, Schindler, Mitsubishi, Kone, ThyssenKrupp, Soviet-era brands), experience, six sectors, process (3 steps), works register, FAQ (7), contact form.
- Languages: Latvian at `/` (source of truth), `/ru`, `/en`; locale detection deliberately off (README).
- Stack (package.json): Next.js 16 (App Router), React 19, next-intl, Sanity CMS (Studio at `/studio`, publish webhook `/api/revalidate`), styled-components, Nodemailer with Gmail OAuth contact form Server Action, Cloudflare Turnstile (`src/lib/turnstile.ts`), pnpm, ESLint, `sharp` AVIF/WebP asset pipeline. SEO: sitemap, robots, `llms.txt`, structured data, per-locale OG image. CI/CD: GitHub Actions (lint, typecheck, build, deploy on self-hosted runner; main = Production, dev = Preview). No GSAP/Framer dependency: the scroll motion is custom code (README/package.json).
- Commercial package (pricing tiers, contract, design system): CLAUDE.md only; `DESIGN.md` (design tokens: amber on steel/black, Archivo + IBM Plex Mono) and `PRODUCT.md` exist in the repo. Proposal/contract documents were not found in the repo.

**Open questions for Dmytro:**
- Client approval to show it as a case study, and whether the contract/pricing can be mentioned (no).
- Is the repo under the client's GitHub org (`pro-lifts`) meant to stay private?
- Any real results (leads, performance scores) to quote?
- "Scroll-jacking" is Dmytro's wording; code shows a scrubbed frame sequence, so say "scroll-scrubbed" unless the page actually locks scrolling.

### Numerologgi (shop.numerologgi.com)
**Facts:**
- CLAUDE.md: planner shop, Next.js + Payload/Postgres catalogue, Notion orders, Stripe/Prodamus, DigitalOcean AMS3. Phase 1 "Basic" quote 800 EUR, due early Nov 2026.
- Local repo `/home/dmytro/Projects/numerologgi` (package.json, read-only): Next.js 16.3, React 19, Payload CMS 3.90 with `db-postgres`, next-intl, Stripe SDK, Tailwind-style shadcn setup (`components.json`, base-ui), Motion, Lenis (smooth scroll), three.js, Leaflet, Zustand, react-hook-form + zod, Vitest. `bitbucket-pipelines.yml` and a `deploy/` dir (CI is Bitbucket, not GitHub Actions or GitLab). No README. Git: 2026-10-02 to 2026-10-21. PRODUCT.md brief: client is SIA NUMEROLOGI GG, Riga (numerologgi.com is the client's existing diary site).
- LinkedIn "Stripe + Notion payment webhook for an e-commerce client" is probably this client (inferred).
- Public status: shop.numerologgi.com returns 401 (auth wall): not publicly viewable yet; Phase 1 due Nov 2026 (today is 2026-11-09, so check delivery).

**Open questions for Dmytro:**
- Is the 401 intentional staging? Production URL and launch date?
- Client approval / NDA for portfolio use.
- Is the LinkedIn "e-commerce client" this one? Is Prodamus to be mentioned publicly?

---

## 7. Other public footprint

- LinkedIn: https://www.linkedin.com/in/polizhai (profile export in `/home/dmytro/Downloads/Profile.pdf`)
- GitHub repository for Stundio: https://github.com/dmytropolizhai/stundio (linked from stundio.lv; not fetched directly)
- Stundio: https://stundio.lv (app: https://app.stundio.lv)
- Prolifts: https://pro-lifts.lv (live; repo github.com/pro-lifts/pro-lifts.lv, client org)
- Curio: https://curio.today (footer credit "Created by@dmytropolizhai"; Facebook and Instagram links in the header/footer, URLs not extracted)
- Numerologgi shop: https://shop.numerologgi.com (401, login wall)
- Web search for "Dmytro Polizhai" found no articles, hackathons, press or profiles about him. The only Polizhai result was LinkedIn https://ua.linkedin.com/in/olena-polizhai, a different person (defence-tech product manager). It is not evidence about Dmytro and was not used.
- No public record of a Multilance website was found in the search results. Its existence as a brand is supported only by CLAUDE.md and LinkedIn.

---

## 8. Contradictions and open questions for Dmytro

- Education: CLAUDE.md says first-year Entrepreneurship & Management at RTU. LinkedIn says Riga State Technical School, Computer Programming (Sep 2025 - Jun 2029), plus IT STEP Bulgaria (2017-2022). Which is correct? Stundio being built for RVT suggests the LinkedIn version.
- Languages: CLAUDE.md lists Ukrainian & Russian native, English B2, Latvian A2, Spanish A1. LinkedIn lists English (Professional Working), Ukrainian (Native or Bilingual), Latvian (Professional Working). Russian and Spanish are missing from LinkedIn. Which levels should the portfolio show?
- CI/CD: CLAUDE.md says GitHub Actions; LinkedIn says "using GitLab". Local repos show GitHub Actions (pro-lifts, stundio) and Bitbucket Pipelines (numerologgi); no GitLab anywhere. Which is accurate, and fix LinkedIn?
- Work history: NN Game Studio (UE5 developer, Wroclaw, May 2023 - April 2025, "Middle" title) is in LinkedIn but not in CLAUDE.md. Confirm dates and title. A "Middle" title starting around age 14-15 (if born 2008) will raise questions for clients; decide whether to show it, and how.
- Stundio: not in CLAUDE.md or LinkedIn but is a substantial product with an explicit credit. Is it his, and should it be featured?
- Curio: LinkedIn calls the role "Full-stack Developer / UI Designer" at Curio.today (June 2025 - Feb 2026). The live site is a news feed credited to him personally, with no company name. Is Curio a company, a personal project or a client? The 10% page-load figure needs a source.
- Multilance dates: "July 2026 - Present (5 months)". Today (2026-11-09) is about 4 months from July (5 only if counted inclusively). Also, first commit in pro-lifts is 2026-08-08. Minor; check start date.
- Location of "four countries": LinkedIn claims clients in four countries. Unverified; list the countries or drop the claim.
- Positioning: CLAUDE.md says React/Vite/TS first; LinkedIn headline says "Full-Stack Developer (Next.js/Node.js)" for small/medium businesses. Which headline should the portfolio use?
- Top skills on LinkedIn (PWAs, Android, Reverse Engineering) are not in CLAUDE.md. Should these be shown on the site?
- Certification dates are missing from the export. Add dates or issuer confirmation.
- polizhai.site does not resolve from DNS (confirmed independently by the orchestrator). Need old site source or confirm domain status (expired, moved, or wrong domain?). Section 5 is blank because of this.
- Prolifts: RESOLVED, live at https://pro-lifts.lv (see section 6). Remaining: client approval for case-study use.
- Numerologgi shop returns 401. Is this intentional?
- Contact: LinkedIn lists a phone number and email. Confirm which contact methods should appear publicly (number not reproduced here).

---

## 9. Five-line summary

1. polizhai.site could not be fetched (DNS fails), so the current site's copy, structure and i18n are unassessed; Stundio, Curio and Prolifts/Numerologgi data are from fetches, local repos, LinkedIn and CLAUDE.md.
2. Verified from LinkedIn: Multilance (July 2026 - present), Curio.today Next.js rebuild (June 2025 - Feb 2026), NN Game Studio UE5 developer (May 2023 - April 2025), and certs from Google and Meta.
3. Stundio (stundio.lv) is a free, open-source RVT school timetable app (PWA, Android, Linux build) credited to Dmytro, not in CLAUDE.md or LinkedIn; Curio (curio.today) is a news feed credited to him, with no Multilance credit.
4. Prolifts is live at https://pro-lifts.lv (Next.js 16, Sanity, scroll-scrubbed AI-video hero, LV/RU/EN, "Design — Multilance" credit); shop.numerologgi.com returns 401 (not publicly viewable yet; due Nov 2026).
5. Major contradictions to resolve: education (RTU vs Riga State Technical School), languages, GitHub Actions vs GitLab, NN Game Studio missing from CLAUDE.md, and polizhai.site DNS failure.

---

## Review notes

Reviewer pass, 2026-11-09. Sources: LinkedIn PDF re-read in full (pdftotext), local repos (read-only, no .env files read, nothing run), live fetches of pro-lifts.lv, stundio.lv, curio.today.

**Changes made**
1. Header: added pro-lifts.lv and local repos to sources.
2. LinkedIn sections 1-4 checked line by line against the PDF. Correct: headline, location, email, URL, top skills, languages and levels, all three experience entries (dates, durations, locations, bullets), certifications, education dates. Errors fixed: education programme had lost diacritics ("Programmēšana tehniķis"); NN Game Studio title now exact ("Middle UE5 Game Developer / NDA") and location "Wrocław, Dolnośląskie"; Summary quote restored to the exact em-dash wording.
3. Certification issuers (Google/Meta) marked "(inferred from title)": the export lists no issuer.
4. Prolifts block rewritten: live URL https://pro-lifts.lv, client Pro-lifts SIA, stack, features, AI-video provenance (Veo 3.1 / Flow per repo docs), languages, CI, commit dates. Corrects the researcher's "not found". "Design — Multilance" footer credit added to sections 1 and 2.
5. Stundio block enriched from repos (React 19/Vite/TS/Tailwind 4/Zustand/Framer Motion, Capacitor 7 Android, Tauri 2 desktop, serverless functions, Vitest, 535 commits Sep-Oct 2026) plus companion repos. Fixed researcher's claims: the Android build is Capacitor (not Tauri); site also mentions MIT licence and 2,000+ sessions. Flagged conflict 400+ vs README 200+.
6. Curio re-verified; all claims hold. Added social URLs, article date range (Sep-Oct 2026, after LinkedIn end date Feb 2026), and that no local folder exists. Stack claims remain LinkedIn-only.
7. Numerologgi: stack from package.json (Next 16, Payload 3.90/Postgres, Stripe, next-intl, Lenis, three.js); CI is Bitbucket; marked not publicly viewable (401), due Nov 2026. Added that PRODUCT.md identifies the client entity.
8. Skills section: annotated each "CLAUDE only" item with repo evidence; GSAP, Prisma, Socket.IO have no evidence in the inspected repos. GitLab claim flagged (no GitLab config found).
9. Section 5/8: stated polizhai.site down clearly, added "need old site source or confirm domain status"; noted the portfolio folder holds no old source. Multilance dates note refined; summary lines 1 and 4 updated.

**Not changed / limits**
- Prolifts "AI video visible on live site" and "scroll lock" not verified in a browser; WebFetch cannot see the scroll behaviour. Repo shows scroll-scrubbed frame sequences.
- Proposal package (pricing, contract) not found in the repo.
- Facts on Curio stack, Stundio's live hosting (stundio.lv vs pages.dev), and the 10% figure remain unverified.

**Open questions for Dmytro**
1. polizhai.site: domain status, and where is the old source?
2. Education: RVT (LinkedIn) vs RTU (CLAUDE.md); and which languages/levels to show.
3. Client approval to show Prolifts and Numerologgi publicly; is the Numerologgi 401 intentional?
4. Curio: who owns it, why are you still credited after Feb 2026, source of the 10% figure; and is the LinkedIn "GitLab" claim right (repos use GitHub Actions/Bitbucket)?
5. Stundio: which user figure is current, which landing site is canonical, and is NN Game Studio "Middle" title/dates to be shown?
