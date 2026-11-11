# GitHub audit: dmytropolizhai

Audit date: 2026-11-09. Read-only: `gh api` GET calls and HEAD requests to live URLs only. Nothing was created, starred, forked or modified on GitHub. Private repos are listed by name and metadata only; no private code is quoted.

Scope: 56 owned repos (28 public, 28 private; 4 forks; 4 archived) plus 13 repos in 5 orgs the account belongs to (curio-today, stundio, multilance, pro-lifts, numerologgi).

---

## 1. Profile summary

| Field | Value (source) |
|---|---|
| Name | Dmytro Polizhai (GitHub API) |
| Login | dmytropolizhai |
| Bio | "Google & Meta Certified Full-stack developer" (GitHub API; certifications not verifiable from GitHub) |
| Location | Latvia, Riga |
| Company / blog / Twitter | none set |
| Followers / following | 22 / 37 |
| Public repos (API) | 28 |
| Account created | 2019-10-06 (about 7 years old) |
| Earliest repo (re-verified 2026-11-09) | 2024-02-21 (created_at, across all 69 owned and org repos incl. private, archived, forks). No repo created 2019-2023. See section 5. |
| Public orgs (`users/.../orgs`) | none returned |
| Member orgs (`gh api user/orgs`, authenticated) | curio-today, stundio, multilance, pro-lifts, numerologgi |

Profile README (`dmytropolizhai/dmytropolizhai`, which is also the source of polizhai.site, see section 3a and section 7):
- Header: "Make it run, make it right." Status "[x] Open for work".
- About: Role "Full-Stack Developer / Software Developer", OS Arch, focus "Software architecture & Clean Code", philosophy "Simplicity is the ultimate sophistication."
- Stack listed: Next.js, TypeScript, JavaScript, Node.js, REST, PostgreSQL, MongoDB, Payload CMS, SOLID/DRY/KISS, Docker, Docker Compose, Kubernetes, GitHub Actions, Nginx, Kafka, self-hosting. Only Next.js, Payload, Postgres/Mongo, Docker and GitHub Actions are visible in the repos I inspected. Kubernetes and Kafka are not verified.
- Projects listed: PRO-LIFTS (pro-lifts.lv), Curio (curio.today), DNF (github.com/dmytropolizhai/dnf). Stundio and Numerologgi are not mentioned.
- Contact links: email, Telegram, LinkedIn, Instagram.

Org details (from the authenticated org API):
- curio-today: "Modern news platform. Smart curiosity", created 2025-07-26, blog curio.today, 1 public repo.
- stundio: name "stundio (deprecated)", created 2026-04-15, description "Next-generation mobile experience for EduPage". All 5 repos archived.
- multilance: "Web Boutique Agency", created 2026-06-18, blog https://multilance.lv, 0 public repos.
- pro-lifts: "Full-cycle elevator service across the Baltics", created 2026-09-21, blog pro-lifts.lv, 0 public repos.
- numerologgi: created 2026-10-06, no description, 0 public repos.

The public `orgs` endpoint returns nothing while the authenticated endpoint returns five. This means membership is hidden (inferred). Making memberships public would let visitors see the client work.

---

## 2. Aggregate stack

### 2a. Language bytes across non-fork owner repos (52 repos, public + private)

Source: `repos/dmytropolizhai/<repo>/languages`, summed per language. Byte counts are GitHub linguist counts and include any vendored or generated files in the repo.

| Language | Bytes | Share |
|---|---:|---:|
| TypeScript | 3,513,187 | 47.85% |
| JavaScript | 1,336,437 | 18.20% |
| HTML | 1,297,983 | 17.68% |
| Python | 841,163 | 11.46% |
| CSS | 126,147 | 1.72% |
| Java | 56,119 | 0.76% |
| C# | 36,207 | 0.49% |
| Shell | 35,867 | 0.49% |
| C++ | 34,347 | 0.47% |
| Lua | 23,573 | 0.32% |
| Batchfile | 17,197 | 0.23% |
| C | 9,344 | 0.13% |
| Rust | 6,596 | 0.09% |
| SCSS | 5,011 | 0.07% |
| Dockerfile | 1,580 | 0.02% |
| Makefile | 1,563 | 0.02% |
| **Total** | **7,342,321** | **100%** |

Caveats (inferred unless stated):
- The HTML total is dominated by one archived private repo, `true-tears-quality-bot` (1,150,762 bytes of HTML). It probably contains generated output (a `graphify-out/` folder is present).
- The JavaScript total is dominated by `stundio` (1,214,264 of 1,336,437 bytes). Likely bundled or generated assets, not hand-written code.
- Org repos are excluded from this table. Their main languages are TypeScript (curio-today, numerologgi, pro-lifts.lv, multilance) and Dart/C++ (archived stundio Flutter app).
- Hand-written TypeScript is the real headline: the top active repos (stundio, curio frontend, numerologgi, pro-lifts.lv) are all TypeScript or Next.js.

### 2b. Frameworks and libraries from manifests (top repos)

Read from `package.json`, `pyproject.toml` or `requirements.txt`. Names only, versions not checked.

| Repo | Manifest | Detected frameworks and libraries |
|---|---|---|
| stundio (public, active) | package.json | React, Vite, Tailwind (@tailwindcss/vite), Zustand, Framer Motion, Radix UI, Capacitor (Android), Tauri (desktop), idb (IndexedDB), date-fns, @block65/webcrypto-web-push, Vitest + Testing Library, ESLint, Prettier |
| curio-today/frontend (org, public) | package.json | Next.js (README: 16, App Router), React 19 (README), next-intl, TanStack Query, next-themes, Radix UI, shadcn-style components, Vaul, Sonner. README claims Jest, Playwright E2E, GitHub Actions and pnpm. |
| curio-today/cms (org, private) | package.json | Payload CMS (MongoDB adapter), Next.js, Lexical rich text, Groq SDK, fluent-ffmpeg, sharp |
| numerologgi/numerologgi (org, private) | package.json | Next.js, Payload CMS (Postgres), Stripe, Zod, react-hook-form, next-intl, Three.js, Leaflet, Zustand, Lenis, Motion, shadcn |
| pro-lifts/pro-lifts.lv (org, private) | package.json | Next.js, next-intl, Sanity (Studio + client + image-url), styled-components, Nodemailer |
| dmytropolizhai/dmytropolizhai (site source, public) | package.json | React, Vite, TanStack Router, i18next + react-i18next, GSAP, Framer Motion, Tailwind, Sass, TypeScript |
| stundio-landing (private) | package.json | React, Vite, GSAP + @gsap/react, Lenis, Motion, Radix UI, Sonner, Tailwind |
| g44hub (private) | package.json | Next.js, Payload CMS (SQLite), GSAP, Cal.com embed, i18next, shadcn, Tailwind |
| dnf (public) | package.json | Angular (common, core, forms, router, material, CDK), Tailwind (@tailwindcss/postcss), Vitest |
| disciplio (public) | package.json | Expo / React Native, Expo Router, NativeWind, Drizzle ORM + expo-sqlite, react-hook-form, Zustand, i18next, Reanimated |
| cookie-slasher (public) | package.json | React, Vite, Framer Motion, Zustand, Tailwind, ESLint |
| gym-coach-ai (private) | pyproject.toml | aiogram 3 (Telegram), google-genai (Gemini), FastMCP, aiosqlite, httpx, pydantic-settings, authlib. Ruff and pytest in dev. Description: "Personal AI gym coach Telegram bot for Raspberry Pi". |
| true-tears-quality-bot (private, archived) | requirements.txt | aiogram 3.28.2 |
| MykoobNotifierBot (private) | none found | README: Telegram bot. Library not confirmed (`src/bot.py`, handlers and keyboards present). |
| google-form-blooming (public) | requirements.txt | selenium 4.39, trio (browser automation, inferred) |
| job-notifier (fork, not owned work) | requirements.txt | aiogram 3.21, playwright, aiohttp |
| one-to-one (public, archived) | none found | No root package.json. Not further inspected. |

Not found in any inspected repo:
- A Google Maps scraper. No repo name or description mentions maps or scraping. Possibly private code outside GitHub, or not on this account.
- polizhai.site-specific repo: the site lives in `dmytropolizhai/dmytropolizhai` (CNAME). The `portfolio` repo is empty.

---

## 3. Repo table

Verdict rules applied: forks, tutorials and course exercises, empty repos, and repos with fewer than 5 commits are HIDE. Archived repos are HIDE unless they carry a real product story. "~" marks counts from pagination.

### 3a. Owner account (56 repos)

| Repo | Vis | Fork | Lang | Stars | Commits | Last push | Homepage | Description | Verdict and reason |
|---|---|---|---|---:|---:|---|---|---|---|
| stundio | PUBLIC | no | TypeScript | 6 | 545 | 2026-11-09 | https://app.stundio.lv | Open-source mobile app for school timetables (EduPage) | **SHOWCASE (#1)**: live, 545 commits (re-verified 2026-11-09), Dmytro 442 commits (81%), releases up to v2.1.5, screenshots in README, 3 forks |
| disciplio | PUBLIC | no | TypeScript | 0 | 71 | 2026-01-24 | (none) | Disciplio helps you build self-discipline through habits, routines, and consistency (API description) | **MAYBE (demoted from SHOWCASE)**: early-stage Expo/React Native habit and to-do app (3 tabs, create-task modal, Drizzle + SQLite), about 62 KB of source, no tests, no release, no live or store link, last push 2026-01-24. README is mostly a boilerplate install guide with a `your-username` placeholder. Fine as a mobile-stack breadth item, not a headline. |
| dmytropolizhai | PUBLIC | no | TypeScript | 0 | 100 | 2026-09-11 | (none; CNAME polizhai.site) | (none; API description is null) | **HIDE as showcase / rebuild source**: confirmed as the old polizhai.site source (section 7). Dated copy, pitch for a different positioning. Do not pin as a project; content inventory is in section 7. |
| dnf | PUBLIC | no | TypeScript | 0 | 136 | 2026-03-03 | (none) | Rubik's cube timer with modern UI (Angular) | **MAYBE**: clean small Angular app, 136 commits, README with image. Narrow utility, no live link. |
| cookie-slasher | PUBLIC | no | TypeScript | 0 | 38 | 2026-06-04 | (none) | (minimal) | **HIDE**: unrelated to web portfolio. |
| self-setuper | PUBLIC | no | TypeScript | 1 | 23 | 2025-06-19 | (none) | Automatically installs software from a predefined package | **HIDE (demoted from MAYBE)**: spot-checked. About 19 KB TypeScript, README shows "Soon" on most features and "Documentation: Soon". Unfinished. |
| one-to-one | PUBLIC | no | TypeScript | 0 | 212 | 2026-03-31 | (none) | Open-Source Private 1-to-1 Chat App | **SHOWCASE (promoted from MAYBE, #5)**: 100% Dmytro (212/212 commits), Next.js 16 + React 19, Socket.IO websocket service, Express email-OTP service (Resend), PostgreSQL 17, Redis 7, Docker Compose, GitHub Actions deploy workflow, README with Mermaid architecture diagram. Archived (read-only) and no live URL, but it is the best public evidence of real-time and backend architecture. |
| MyKoob-API | PUBLIC | no | JavaScript | 1 | 10 | 2024-10-09 | (none) | Python library for a hidden MyKoob API | **MAYBE**: reverse-engineered API client. Language and description disagree (JS vs Python). |
| calm-down-the-teacher | PUBLIC | no | TypeScript | 0 | 7 | 2026-06-17 | (none) | (no description) | **HIDE**: unrelated to web portfolio. |
| stundio-landing | PRIVATE | no | TypeScript | 0 | 5 | 2026-11-09 | (none) | (no description) | **MAYBE**: private landing page for Stundio (GSAP, Lenis, Motion). Case-study only. |
| g44hub | PRIVATE | no | TypeScript | 0 | 16 | 2026-10-28 | (none) | (no description) | **MAYBE**: private Next.js + Payload project with unknown client (inferred). Case-study only. |
| gym-coach-ai | PRIVATE | no | Python | 0 | 10 | 2026-10-25 | (none) | Personal AI gym coach Telegram bot for Raspberry Pi (from pyproject) | **MAYBE**: private aiogram 3 + Gemini + FastMCP bot. Strong case study if it can be shown. |
| git-lfs-gui | PRIVATE | no | Python | 0 | 11 | 2024-07-01 | (none) | GUI for Git LFS plugin | **MAYBE**: private desktop tool, 11 commits. Low client relevance. |
| true-tears-quality-bot | PRIVATE | no | Python | 0 | 62 | 2026-06-07 | (none) | Reselling bot for a clothing channel | **HIDE**: archived, private, operational bot for a third-party reseller. |
| skillsync-design | PUBLIC | no | HTML | 0 | 1 | 2026-05-22 | (none) | (no description) | **HIDE**: one commit. |
| little-lemon-app | PUBLIC | no | JavaScript | 0 | 1 | 2026-08-10 | (none) | (no description) | **HIDE**: one commit, course-style project (inferred). |
| nvim | PUBLIC | no | Lua | 0 | 4 | 2026-06-22 | (none) | Just my nvim config | **HIDE**: dotfiles, under 5 commits. |
| test | PRIVATE | no | HTML | 0 | 27 | 2026-03-19 | (none) | A test repo for a Monte lesson | **HIDE**: test or course exercise. |
| rock_paper_scissors | PRIVATE | no | Python | 0 | 11 | 2026-03-19 | (none) | (no description) | **HIDE**: beginner exercise. |
| google-fake | PRIVATE | no | HTML | 0 | 2 | 2026-03-04 | (none) | (no description) | **HIDE**: under 5 commits. Name suggests a copy of a third-party page (inferred). Do not showcase. |
| programmaturas-koda-rakstisana-uzdevums-2 | PUBLIC | fork | HTML | 0 | 7 | 2026-04-07 | (none) | (no description) | **HIDE**: fork, course assignment. |
| programmaturas-koda-rakstisana-uzdevums-1 | PUBLIC | fork | CSS | 0 | 5 | 2026-03-24 | (none) | (no description) | **HIDE**: fork, course assignment. |
| rvt.lv-fake-page | PRIVATE | no | HTML | 0 | 1 | 2026-03-03 | (none) | (no description) | **HIDE**: one commit. Name suggests a mock of a school site (inferred). Do not showcase. |
| angular-start | PUBLIC | no | TypeScript | 0 | 5 | 2026-02-10 | (none) | Angular basics in one repo | **HIDE**: tutorial. |
| 14-february | PRIVATE | no | (none) | 0 | 0 | 2026-02-04 | (none) | (no description) | **HIDE**: empty and archived. |
| react-local-storage | PUBLIC | no | (none) | 0 | 2 | 2026-01-18 | (none) | Typed localStorage with hooks | **HIDE**: under 5 commits. Could be a small library if extended. |
| google-form-blooming | PUBLIC | no | Python | 0 | 2 | 2026-01-05 | (none) | (no description) | **HIDE**: under 5 commits. Committed `form_responses.csv` data file. |
| portfolio | PUBLIC | no | (empty) | 0 | 0 | 2025-12-22 | (none) | Portfolio website. Using ShadCN | **HIDE**: empty repo under the most obvious name. Actual site is in `dmytropolizhai`. |
| rvt | PUBLIC | no | Python | 0 | 8 | 2026-01-20 | (none) | All tasks from rvt | **HIDE**: school coursework (inferred from name and the "rvt" topic on stundio). README is a single character. |
| numerologgi-shop | PRIVATE | no | Python | 1 | 27 | 2025-11-26 | (none) | Backend code for shop.numerologgi.com | **HIDE**: private, probably superseded by org `numerologgi/numerologgi` (inferred). |
| numerologgi-napkin-backend | PRIVATE | no | Python | 0 | 8 | 2025-11-05 | (none) | Python code for napkin.io backing numerologgi.com | **HIDE**: private, under 10 commits, legacy. |
| rust-example | PRIVATE | no | Makefile | 0 | 4 | 2025-11-24 | (none) | My first test project in Rust | **HIDE**: under 5 commits, test project. |
| it-marathon5 | PUBLIC | no | (none) | 0 | 1 | 2025-10-29 | (none) | (omitted) | **HIDE**: one commit, course event; unrelated to web portfolio. |
| job-notifier | PUBLIC | fork | Python | 0 | 164 (upstream) | 2025-07-28 | (none) | Job listings via Telegram or email | **HIDE**: fork of someone else's project. |
| docs | PUBLIC | fork | Markdown | 0 | 65,179 (upstream) | 2025-07-25 | https://docs.docker.com | Source repo for Docker docs | **HIDE**: fork of Docker's docs. |
| inovaciju-centrs | PUBLIC | no | (none) | 0 | 1 | 2025-07-01 | (none) | (no description) | **HIDE**: one commit. |
| .nethuinia | PUBLIC | no | C# | 0 | 1 | 2025-06-27 | (none) | "zalupa" | **HIDE**: one commit, unprofessional description. Public. |
| git-demo | PUBLIC | no | (none) | 0 | 7 | 2025-06-24 | (none) | Course repo for EPAM | **HIDE**: course exercise. |
| git-demo-2 | PRIVATE | no | (none) | 0 | 7 | 2025-06-24 | (none) | Fetch and push demo | **HIDE**: course exercise. |
| ci-cd-test | PRIVATE | no | JavaScript | 0 | 16 | 2025-06-21 | (none) | (no description) | **HIDE**: CI experiment. |
| react-learning | PRIVATE | no | (none) | 0 | 1 | 2025-05-19 | (none) | React learnings | **HIDE**: one commit. |
| MykoobNotifierBot | PRIVATE | no | Python | 1 | 4 | 2025-05-08 | (none) | Telegram bot for Mykoob account activity | **HIDE**: under 5 commits (private). Telegram bot evidence only. |
| MyDiplomas | PUBLIC | no | (none) | 0 | 1 | 2025-03-15 | (none) | Repo containing my diplomas | **HIDE + ACTION REQUIRED (privacy, section 6)**: confirmed PUBLIC, holds one PDF. Make private or delete. |
| TutorialBeginner | PRIVATE | no | TypeScript | 0 | 2 | 2025-03-06 | (none) | (no description) | **HIDE**: tutorial. |
| WordToPresentation | PRIVATE | no | Python | 0 | 1 | 2025-01-26 | (none) | (no description) | **HIDE**: one commit. |
| CamLink | PRIVATE | no | (none) | 0 | 1 | 2025-01-12 | (none) | Camera stream from Android to PC | **HIDE**: one commit. |
| WordGrabber | PRIVATE | no | Python | 0 | 5 | 2025-01-11 | (none) | (no description) | **HIDE**: small script, private. |
| CHG-Source-Code | PRIVATE | no | C++ | 1 | 8 | 2025-01-01 | (none) | (omitted) | **HIDE**: unrelated to web portfolio. |
| StrangeWord | PRIVATE | no | TypeScript | 0 | 2 | 2024-12-31 | (none) | React Native app | **HIDE**: under 5 commits. |
| NewKoob | PUBLIC | no | (none) | 0 | 0 | 2024-10-09 | (none) | Like MyKoob but with better visuals | **HIDE**: empty. |
| VolumeChanger-Windows | PRIVATE | no | Python | 1 | 5 | 2024-04-13 | (none) | (no description) | **HIDE**: small desktop script, private. |
| TypingTest | PRIVATE | no | Python | 0 | 5 | 2024-04-13 | (none) | (no description) | **HIDE**: small console app, private. |
| TypingTest-python | PRIVATE | no | Python | 0 | 2 | 2024-04-12 | (none) | Typing test in console | **HIDE**: under 5 commits. |
| minecraft-server1.20 | PRIVATE | no | Python | 1 | 5 | 2024-03-18 | (none) | (omitted) | **HIDE**: unrelated to web portfolio. |
| BeautifulComputerStatistics | PRIVATE | no | Python | 0 | 3 | 2024-03-14 | (none) | (no description) | **HIDE**: under 5 commits. |
| ValorantTrueStretched | PUBLIC | no | Python | 0 | 3 | 2024-06-19 | (none) | (omitted) | **HIDE**: unrelated to web portfolio. Public, archived. |

Count check (after review): 56 rows = 2 SHOWCASE (stundio, one-to-one), 7 MAYBE (disciplio, dnf, MyKoob-API, stundio-landing, g44hub, gym-coach-ai, git-lfs-gui), 47 HIDE. Org repos are in section 3b. Verdicts for pro-lifts.lv, numerologgi and curio-today/frontend are SHOWCASE in 3b.

### 3b. Member-org repos (13 repos, 5 orgs)

| Repo | Vis | Fork | Lang | Stars | Commits | Last push | Homepage | Description | Verdict and reason |
|---|---|---|---|---:|---:|---|---|---|---|
| curio-today/frontend | PUBLIC | no | TypeScript | 1 | 830 | 2026-03-14 | https://curio.today | Frontend for curio.today | **SHOWCASE (#2)**: live (307 to /en), 830/830 commits by dmytropolizhai (sole contributor), first commit 2025-07-26, latest 2026-03-04, about 1.11 MB TypeScript, 14 test/e2e-named files, Dockerfile. Note: last push 2026-03-14, so activity is 8 months old. |
| pro-lifts/pro-lifts.lv | PRIVATE | no | JavaScript (largest) / TypeScript | 0 | 234 | 2026-11-06 | https://pro-lifts.lv/en | Website for pro-lifts | **SHOWCASE (#3, live site only)**: HTTP 200. Contributors: dmytropolizhai 174, claude 59, vercel[bot] 1. Repo created 2026-08-08. Private: show the live site and a case study, not the code. |
| numerologgi/numerologgi | PRIVATE | no | TypeScript | 0 | 113 | 2026-10-23 | https://numerologgi.vercel.app | (no description) | **SHOWCASE (#4, live site only)**: numerologgi.vercel.app HTTP 200; shop.numerologgi.com returned 401 to a HEAD request (auth wall or bot block, unconfirmed). 113/113 commits by dmytropolizhai. Repo created 2026-10-06. Private. |
| curio-today/cms | PRIVATE | no | TypeScript | 0 | 184 | 2026-02-10 | (none) | Backend API and CMS using Payload CMS | **MAYBE**: private Payload CMS backend for Curio. Case-study material. |
| multilance/landing | PRIVATE | no | TypeScript | 0 | 7 | 2026-10-01 | (none) | Landing page for multilance.eu | **MAYBE**: brand landing page, private. Description says multilance.eu, org blog says multilance.lv. Neither domain was reachable as a live page at check time (see gaps). |
| stundio/stundio | PUBLIC | no | HTML (Flutter/Dart, C++) | 0 | 18 | 2026-04-23 | (none) | Stundio (deprecated Flutter app) | **HIDE**: archived, deprecated predecessor of the current app. |
| stundio/curriculum | PRIVATE | no | (none) | 0 | n/m | 2026-04-23 | (none) | Structured curriculum for programming | **HIDE**: archived, unrelated to the portfolio. |
| stundio/flow | PUBLIC | no | (none) | 0 | n/m | 2026-04-19 | (none) | Flutter design system | **HIDE**: archived. |
| stundio/.github | PUBLIC | no | (none) | 0 | n/m | 2026-04-17 | (none) | Org documentation hub | **HIDE**: archived, org boilerplate. |
| stundio/website | PUBLIC | no | (none) | 0 | n/m | 2026-04-17 | (none) | Website for stundio.org | **HIDE**: archived. |
| curio-today/entrypoint | PRIVATE | no | (none) | 0 | n/m | 2026-01-26 | (none) | Entrypoint to configure server | **HIDE**: infrastructure scripts. |
| multilance/meet-recorder | PRIVATE | no | JavaScript | 0 | 2 | 2026-07-17 | (none) | Call recording and auto-transcription (Groq Whisper) | **HIDE**: under 5 commits. Product idea worth a line in the case-study list if it grows. |
| multilance/entrypoint | PRIVATE | no | (none) | 0 | n/m | 2026-06-19 | (none) | Main repo to deploy all services | **HIDE**: deployment hub, not a showcase item. |

---

## 4. Showcase candidates (top 7, reordered in review)

**1. Stundio (stundio.lv / app.stundio.lv), public repo `stundio`**
- What: a free, open-source timetable app for students at a Riga technical school. It pulls the public EduPage timetable and shows lessons, substitutions and changes. No login.
- Tech: React (version not checked), TypeScript, Vite, Tailwind, Zustand, Capacitor (Android), Tauri (desktop), offline-first with IndexedDB, Web Push, Vitest.
- Live: https://app.stundio.lv (HTTP 200), https://stundio.lv (HTTP 200).
- Impressive, plainly: a real product with live users, shipped as an Android app, a PWA and a desktop target. Four languages. Home-screen widgets. Releases up to v2.1.5-drosma (2026-10-19). 545 commits (exact, checked 2026-11-09). Authorship: dmytropolizhai 442, `claude` 96, reiniskras-lab 5, artdanylenko7 1, dependabot 1. Dmytro is the main author (81%); the `claude` entry is a co-author identity on commits, not a person.
- Caveat: the README claims 200+ users and about 1.1k web visitors. Self-reported, not verified.
- Screenshot-worthy: yes. README has a banner and four phone screenshots.

**2. Curio.today, public repo `curio-today/frontend`**
- What: a news platform with a "smart curiosity" angle. Public frontend; the CMS is a separate private repo.
- Tech: Next.js (App Router, 16 per README), React 19, TypeScript, next-intl (multilingual), TanStack Query, shadcn-style Radix components. Backend is Payload CMS on MongoDB (private repo).
- Live: https://curio.today (responds with a 307 redirect).
- Impressive: 830 commits, all by dmytropolizhai (contributors API returns a single author), Jul 2025 to Mar 2026. Multilingual, with a Payload CMS backend. README documents Jest, Playwright E2E and GitHub Actions CI.
- Screenshot-worthy: yes (live site).

**3. PRO-LIFTS (pro-lifts.lv), private repo `pro-lifts/pro-lifts.lv`**
- What: website for a Baltic elevator installation and maintenance company.
- Tech: Next.js, next-intl, Sanity headless CMS, styled-components, Nodemailer.
- Live: https://pro-lifts.lv/en (HTTP 200).
- Impressive: a business-facing site for a real client, with a CMS, 234 commits (dmytropolizhai 174, `claude` 59), and multilingual routing.
- Screenshot-worthy: yes (live site). Cannot link to the repo.

**4. Numerologgi (numerologgi.vercel.app), private org repo `numerologgi/numerologgi`**
- What: an online shop for numerology planners. The repo homepage points to a Vercel URL, not the shop.numerologgi.com domain in the user's notes.
- Tech: Next.js, Payload CMS on Postgres, Stripe, Zod, react-hook-form, next-intl, Three.js, Leaflet.
- Live: https://numerologgi.vercel.app (HTTP 200). shop.numerologgi.com was not checked.
- Impressive: e-commerce with a CMS, Stripe checkout, and 3D and map components. 113 commits.
- Screenshot-worthy: yes (live site).

**5. one-to-one, public repo `one-to-one` (archived)** (added in review)
- What: an open-source private 1-to-1 chat app with email OTP login.
- Tech: Next.js 16, React 19, Tailwind, Socket.IO websocket service, Express email service (Resend), PostgreSQL 17, Redis 7, Docker Compose, GitHub Actions deploy workflow.
- Live: none. Archived 2026 (read-only).
- Impressive: all 212 commits by Dmytro; README includes a Mermaid system diagram. The best public proof of real-time and backend architecture in the account (Socket.IO, Redis, containers).
- Screenshot-worthy: README logo and the architecture diagram.

**6. DNF, public repo `dnf`**
- What: Rubik's cube timer with a modern UI.
- Tech: Angular (with Angular Material and CDK), Tailwind, Vitest.
- Live: none. Homepage is empty.
- Impressive: shows Angular, which none of the other showcase items use. Small scope, 136 commits.
- Screenshot-worthy: yes (README has a wide hero image).

**7. Disciplio, public repo `disciplio`** (demoted in review)
- What: habit and discipline tracker, mobile app. Early stage: three tabs plus a create-task modal.
- Tech: Expo / React Native, Expo Router, NativeWind (Tailwind), Drizzle ORM with expo-sqlite, Zustand, react-hook-form, i18next.
- Live: none. No store link, no web demo, no release. Last push 2026-01-24.
- Quality: about 62 KB of source, no tests, boilerplate README. Use only as a mobile-stack breadth item, or leave off.
- Screenshot-worthy: README preview image (`assets/previews/readme.webp`).

**Optional (private): Gym Coach AI, repo `gym-coach-ai`**
- What: a personal AI gym coach delivered as a Telegram bot, running on a Raspberry Pi.
- Tech: Python 3.12, aiogram 3, Google Gemini (google-genai), FastMCP (MCP server), aiosqlite, pydantic-settings, Ruff and pytest.
- Live: none (private, local hardware).
- Impressive: an AI agent with an MCP tool layer, a Telegram front end and self-hosted hardware. Matches the "AI + bots" direction.
- Screenshot-worthy: no README images. Would need a demo recording. Keep private unless audited for secrets.

---

## 5. Timeline (for a "coding since 2021" story)

Facts only (re-checked 2026-11-09). Account created 2019-10-06. Across all 69 repos the authenticated API can see (56 owned incl. private, archived and forks, plus 13 org repos) the earliest `created_at` is 2024-02-21. The earliest commit date in the checked early repos is 2024-03-14 (BeautifulComputerStatistics) and 2024-06-19 (the earliest-created repo, which was created 2024-02-21). The public events feed returns 100 events, the oldest 2026-10-24 (the feed is limited to about 90 days). The account has no gists. Code from before 2024 may simply predate GitHub use, live in a deleted repo, or sit elsewhere; GitHub cannot show either way.

- **2019-10**: GitHub account created. No repos from this period are visible.
- **2024**: first visible projects, mostly small Python utilities and desktop tools (2024-02 to 2024-04, mostly private): BeautifulComputerStatistics, VolumeChanger-Windows, TypingTest. MyKoob-API (2024-09, public, reverse-engineered API client) and NewKoob (2024-10, empty).
- **2025**: first full web and bot work. MyDiplomas (2025-03, personal document, see section 6), self-setuper (2025-06, TypeScript, public), git-demo (2025-06, course), Curio org created (2025-07-26), numerologgi repos active (2025-11), dmytropolizhai site repo created (2025-09-19), it-marathon5 (2025-10, EPAM marathon), rvt school tasks (2025-10), disciplio (2025-12-21, Expo app).
- **2026**: the main build year. dnf (2026-02-10, Angular), one-to-one (2026-03, archived), stundio (created 2026-04-29, 545 commits, still active today), stundio org (2026-04-15, now deprecated), cookie-slasher (2026-05), multilance org (2026-06-18), PRO-LIFTS org (2026-09-21), numerologgi org (2026-10-06).

Story suggestion (inferred): 2024 Python utilities, 2025 full-stack web and Telegram bots, 2026 shipped products (Stundio, Curio, PRO-LIFTS, Numerologgi). Earliest GitHub-visible repo is 2024-02-21; the 2021 start is a copy decision for Dmytro and is not testable from GitHub.

---

## 6. Gaps and cleanup recommendations

Recommendations only. Nothing has been changed on GitHub.

**ACTION REQUIRED FOR DMYTRO (privacy): `dmytropolizhai/MyDiplomas` is PUBLIC (confirmed `visibility: public`, created 2025-03-15, not archived). It holds a single 12 MB PDF named `Addendum Polizhai EN.pdf`. Contents were not opened. Make the repo private or delete it. Deleting a repo does not clear forks or cached copies, so also consider whether the document needs to be replaced if it holds sensitive details.**

**Profile**
- Make org memberships public (the profile shows 0 orgs publicly, but 5 are joined). Client work is invisible without this.
- Update the README projects list. It names PRO-LIFTS, Curio and DNF, but not Stundio or Numerologgi, which are more recent and more substantial.
- Reconcile positioning. The GitHub bio says "Full-stack developer", but the polizhai.site page title says "Website Development & Telegram Bots for Small Business". Pick one story for the brand rebuild.
- Remove or verify unsupported claims in the README (Kubernetes, Kafka, Google and Meta certifications).

**Pins (public repos only)**
- Suggested pins: `stundio`, `curio-today/frontend`, `disciplio`, `dnf`. Add the site repo `dmytropolizhai` once its homepage is set and the content is up to date.
- Private repos (PRO-LIFTS, Numerologgi, gym-coach-ai) cannot be pinned to the public profile (inferred). Show them as live links or case studies on the portfolio site instead.

**Archive, delete or privatise**
- `portfolio` (public, empty, named like the site): delete, or put the real site there and retire `dmytropolizhai`'s confusing duplicate.
- `NewKoob` (public, empty): delete or archive.
- `MyDiplomas`: see the ACTION REQUIRED note above (top priority).
- `.nethuinia` (public, one commit, description "zalupa"): delete or rewrite the description.
- Public tutorials and course exercises: angular-start, git-demo, react-local-storage, little-lemon-app, it-marathon5, inovaciju-centrs, skillsync-design, the two programmaturas forks. Archive or hide from the public list.
- Private imitation-named repos google-fake and rvt.lv-fake-page: keep private or delete. Do not show them to clients.
- Stundio org repos (archived, deprecated): leave archived. Remove the org's "deprecated" name only if it will not be reused.

**Missing descriptions and homepages**
- No description: calm-down-the-teacher, cookie-slasher (description is "Just a clicker"), stundio-landing, g44hub, gym-coach-ai (description only in pyproject), numerologgi (org), most tutorial repos.
- No homepage: dnf (add a live demo if one exists), disciplio (add a store or web link), self-setuper, dmytropolizhai (site repo, should be https://polizhai.site once the domain resolves), multilance/landing.
- Stundio is well documented. Use it as the model for the other repos.

**Domain and brand consistency**
- polizhai.site did not respond to a HEAD request from this environment at check time (no DNS or connection). Recheck before publishing links. The domain is set in the CNAME of the `dmytropolizhai` repo.
- multilance.lv returned 403 to a HEAD request (possibly bot blocking, not confirmed down). multilance.eu did not resolve. The landing repo description says multilance.eu, the org blog says multilance.lv. Pick one canonical domain.
- numerologgi org homepage is numerologgi.vercel.app. The user's notes say shop.numerologgi.com. Align the repo homepage with the real shop domain (not checked here).

**Missing from GitHub (possible gaps)**
- No Google Maps scraper repo was found on this account or in the 5 orgs (checked by name and description). It is either not on GitHub or under another account.
- No repos created before 2024-02-21 exist. Fact only; earlier work may predate GitHub use.

**Other review findings**
- The old site shows a "Top 5 GitHub Latvia" stat. The profile README carries a committers.top badge, which is the likely (inferred) source; it is not a verified ranking and should not be reused as a claim.
- The old site repo (`dmytropolizhai`) has no GitHub description and no homepage set; the earlier version of this file said "Profile README and personal site source" (not from the API).

**Private-to-public candidates (after a secrets audit)**
- gym-coach-ai (AI + Telegram + MCP, strong story) and stundio-landing. Review for secrets and tokens before opening.
- The Telegram bot evidence is thin: MykoobNotifierBot (4 commits) and true-tears-quality-bot (archived, private). Consider one clean, public aiogram sample if a bot showcase is wanted.

**Structure**
- The dmytropolizhai site repo is the only live portfolio source, and it contains the profile README. Consider moving the site to its own repo and keeping the profile repo minimal, so the profile README is not coupled to the site build.

---

## Summary (5 lines)

1. Account: 56 repos (28 public, 28 private) plus 13 in 5 member orgs. Earliest repo is 2024-02-21, account created 2019-10-06.
2. Strongest showcase items: Stundio (live, 545 commits, Dmytro 81%, Android + PWA), Curio frontend (live, 830 commits, Next.js 16), PRO-LIFTS and Numerologgi (both live, private repos).
3. Stack by bytes: TypeScript 47.9%, JavaScript 18.2%, HTML 17.7%, Python 11.5%. Hand-written TypeScript dominates the active work.
4. Telegram bots (aiogram) exist, but in private repos only (gym-coach-ai, MykoobNotifierBot, true-tears). No Google Maps scraper repo was found.
5. Cleanup priorities: make org memberships public, fix the empty `portfolio` repo and the public personal-documents repo, reconcile polizhai.site / multilance domains (neither resolved cleanly here), and align the profile README with the current projects.


---

## 7. Old polizhai.site: content inventory

Confirmed 2026-11-09 via `gh api repos/dmytropolizhai/dmytropolizhai/contents/...`. Repo is PUBLIC, created 2025-09-19, last push 2026-09-11, 100 commits, no GitHub description or homepage. The profile README (`README.md`, `cover.jpg`) lives in the same repo.

**Confirmed as the polizhai.site source**
- `CNAME` contains `polizhai.site` (no trailing newline).
- Stack from `package.json` (name `portfolio`): React 18, Vite 5, TanStack Router (file-based, `@tanstack/router-plugin`), i18next 23 + react-i18next, GSAP, Framer Motion, Tailwind 3, Sass, lucide-react, TypeScript 5.
- Deploy: `.github/workflows/deploy.yml`, Node 24, `npm ci && npm run build`, publishes `dist` to GitHub Pages via `peaceiris/actions-gh-pages` on push to `main`. The GitHub Pages API reports `https://dmytropolizhai.github.io/dmytropolizhai/` with no custom domain set (cname null), consistent with the domain having expired.
- `public/robots.txt` points to `https://polizhai.site/sitemap.xml`; no sitemap file exists in the repo.
- polizhai.site: no DNS/connection (curl status 000) on 2026-11-09, matching Dmytro's "domain expired".

**Routes** (`src/routes/`)
- `/` home (`src/pages/home/index.tsx`) with sections: hero, about ("Approach"), projects, cta. Nav anchors `/#about`, `/#projects`, `/#cta`.
- `/projects` (layout only, Outlet) and `/projects/$id` project detail (`src/pages/project-detail/`: details grid, image preview modal, back button, no-project fallback).
- Only two projects are defined (`src/data/projects.ts`): `curio-today` (2025, Next.js / TypeScript / Tailwind CSS / Payload CMS, url https://curio.today, logo + 3 screenshots) and `stundio` (2026, tags Flutter / Dart / Figma, marked in progress, no images).

**i18n**
- Languages: en, ru, lv, uk (`src/i18n/index.ts`). Default `lng: 'en'`, fallback `en`. Switcher component `src/components/language-switcher.tsx`.
- Locale files: `src/i18n/locales/en.json` (6.4 KB), `ru.json` (6.0 KB), `uk.json` (6.0 KB), `lv.json` (4.6 KB, the shortest; it lacks the 19 rotating hero lines and likely the project texts, not diffed key by key).
- Namespaces: `cursor`, `nav`, `hero`, `about`, `projects`, `cta`, `footer`, `meta`, `seo`.

**Copy worth reusing (public, short)**
- Tagline / philosophy: "Make it run, make it right." (hero/about title and README; also "Simplicity is the ultimate sophistication.")
- About body: "A small business doesn't need an agency with a 40-slide deck. It needs a clear website that loads fast, looks professional, and turns visitors into clients." and "I build exactly that - no over-engineering, on time, with an honest price. You describe the task, I solve it."
- Hero rotator pattern: "A website is" + one of 19 endings such as "your business face.", "where trust begins.", "your best salesperson.", closing "Let's make it strong."
- Hero sub: "No fluff - only what works and brings clients."
- CTA: "Got a task? Let's solve it." / "Describe what you need - I'll reply within a few hours. First consultation is free."
- Badge descs: "First version live within 7 days", "Clients & conversions, not just design", "I'm here after launch too", "4 languages: LV, RU, UK, EN".
- All of it exists in 4 languages, so reusable as-is for translation cross-checks (RU/UK/LV are usable drafts; native check by Dmytro).
- README bio: "Full-stack developer with a Linux-first mindset. I build software with a focus on simplicity, maintainability, and solving real-world problems. I value clean architecture over flashy trends and spend my time thinking about how systems fit together."

**Assets (paths in repo)**
- Personal photo: none found. There is no portrait in `src/assets` or `public`.
- Logos: `src/assets/projects/curio-today/logo.png` (10 KB); `src/assets/projects/stundio/logo.png` is a 0-byte (empty) file. `src/components/logo.tsx` is a tiny text/mark component.
- Screenshots: `src/assets/projects/curio-today/screenshot-1.jpg` (283 KB, home with Amazes / Informs / Amuses / Inspires), `screenshot-2.jpg` (66 KB, search), `screenshot-3.jpg` (294 KB, category).
- OG image: none. `index.html` has og:title, og:description and og:type but no `og:image`, no twitter tags, no favicon link.
- `cover.jpg` (113 KB, repo root) is the profile README banner ("Let's talk"), not a site asset.
- Fonts: Instrument Serif, DM Mono, Syne (Google Fonts, `index.html`).

**Contact and social links in the old site (verify before reuse)**
- Email, GitHub, Telegram (`t.me/dmytropolizhai`), LinkedIn `linkedin.com/in/dmytropolizhai/`, and a WhatsApp number (`wa.me/...`, not reproduced here). Note the profile README uses a different LinkedIn slug (`dmytro-polizhai-770a86384`) while profile.md lists `/in/polizhai`. Three different LinkedIn URLs exist; Dmytro must pick the live one.

**Dated or wrong vs confirmed facts**
- Positioning: "Website Development & Telegram Bots for Small Business" (title, meta, `seo.h1`: "Fast Websites for Small Business That Actually Work"), keyword-stuffed meta keywords ("affordable website developer", "build website in 3 days"). Conflicts with the current Multilance boutique-agency and full-stack positioning.
- Stats "150€+ Max order" (hero): undermines current pricing and client level (Prolifts, Numerologgi). Remove.
- Stat "Top 5 GitHub Latvia": unverified, likely from a committers.top badge. Remove or verify.
- Stats on Curio project: "Active Users 2.5k+", "Avg. Session 8.4m", "Curation Rate 94%": not verifiable and read as placeholder numbers. Do not reuse.
- Stundio entry is out of date: "Flutter / Dart / Figma", "Still in development, 3 months", "100+ people waiting". The live product is a React/TypeScript/Vite PWA with Capacitor (Android) and Tauri (desktop), shipped (v2.1.5, app.stundio.lv). The Flutter app is the archived predecessor.
- Stundio problem/solution copy says "teachers" and "collaboration, group projects"; the actual product is a student timetable viewer on top of EduPage.
- Curio copy ("human-curated collections", "Framer Motion tactile experience") is generic; Curio is a news platform, and the project tags omit next-intl, TanStack Query and the Nginx / admin-panel work from LinkedIn.
- Footer: "© 2025 Polizhai.site - Riga, Latvia" is stale (2026). Links to "Open source code" repo.
- Languages shown: LV / RU / UK / EN with "4 lang." as a stat. Confirmed facts (profile.md): Ukrainian and Russian native, Latvian B1, English B1. The old site implies four equal languages; the site language set may stay but the claim "4 languages communication" should follow the confirmed levels.
- Missing: Multilance brand, Prolifts, Numerologgi, any education, any named client quote. No Spanish (consistent with confirmed list).
- Skills tagline on README lists Kubernetes and Kafka (unverified, section 1).

---

## Review notes

Reviewer pass dated 2026-11-09. All GitHub calls were GET only; live URLs via HEAD. No document or private code contents were read or quoted.

**Changes made**
1. Added section 7 (old site content inventory) from `dmytropolizhai/dmytropolizhai`.
2. Stundio commit count: 545 is correct (checked 2026-11-09; contributors sum 442 + 96 + 5 + 1 + 1 = 545). Authorship added. If another file says 535, it is stale. Latest commit on the default branch 2026-11-03; repo last push 2026-11-09; latest release v2.1.5-drosma (2026-10-19).
3. Language byte totals re-summed over the 52 owned non-fork repos: 7,342,321 bytes, TypeScript 3,513,187 (47.85%), identical to the original. Verified.
4. Curio frontend: single contributor, 830/830 commits (first 2025-07-26, latest 2026-03-04). Dmytro is the sole author. README test claims plausible (14 test or e2e-named files).
5. Contributors: stundio 442/545 (81%) Dmytro, 96 `claude`; pro-lifts.lv 174 Dmytro, 59 `claude`, 1 vercel[bot]; numerologgi 113/113 Dmytro; one-to-one 212/212.
6. Showcase reorder: one-to-one promoted to SHOWCASE; disciplio demoted to MAYBE (early-stage, no tests, no live link); self-setuper MAYBE to HIDE (unfinished); numerologgi note that shop.numerologgi.com returned 401 (HEAD) while the vercel URL is 200.
7. Hard rule applied: seven repos judged unrelated to the web portfolio are HIDE with a neutral reason and no descriptive text; wording was removed from the repo table, timeline and caveats. profile.md (read-only, outside this review) still carries content that conflicts with Dmytro's confirmed exclusion and must be scrubbed in the copy phase.
8. Privacy flag for MyDiplomas added prominently in section 6 (public, one 12 MB PDF).
9. Corrections: `dmytropolizhai` repo commits ~100 to 100, description is null (not "Profile README and personal site source"); "Top 5 GitHub Latvia" source flagged as unverified; 2021 note reframed as neutral fact.

**Open questions for Dmytro**
- Make `MyDiplomas` private or delete it now? Does the PDF contain anything sensitive?
- Which LinkedIn URL is live: `/in/polizhai`, `/in/dmytropolizhai/` or `/in/dmytro-polizhai-770a86384`?
- Is shop.numerologgi.com the canonical Numerologgi URL (it returned 401 to HEAD), and is multilance.lv or multilance.eu canonical (lv returned 403, eu did not resolve)?
- Do you want one-to-one (archived) used as a code showcase, and disciplio dropped or kept as a secondary item?
- The 2021 start and the Google Maps scraper: leave as unlinked copy, or is there an older account or repo?
