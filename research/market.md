# Market research: "Dmytro Polizhai" personal-brand portfolio

Date: 2026-11-09. Audience: international clients/startups hiring a freelance frontend dev, plus tech recruiters.

Method and honesty notes:
- All 12 reference URLs below returned HTTP 200 on 2026-11-09. Content was read via text extraction, so motion/hover/scroll behavior is **not verified** unless I say so. Items marked "(inferred)" come from structure or element names, not from seeing the animation. Open each in a browser before copying anything.
- Dropped as dead or unsuitable: anthonyfu.dev and bartoszkaszuba.dev (no connection), kuba.dev (404), paaatrick.com (a blog, not a portfolio), cassie.codes (now a farewell page: "Thanks for reading", site retired).
- Pattern claims in section 2 mix what I observed in the 12 sites with roundups of mostly low-authority blogs (dev.to, template vendors). Treat those as opinion, not data.
- polizhai.site does **not resolve in DNS at all** (`polizhai.site` and `www`, re-checked 2026-11-09; confirmed by the orchestrator). Dmytro confirms the domain has **expired**; the old code is on GitHub. The earlier note in this file ("empty body to curl, likely a client-rendered SPA") was wrong and has been removed: nothing was served, so nothing can be concluded about rendering. See section 6.
- Reviewer re-check 2026-11-09: all 12 URLs again returned HTTP 200, and quoted copy was spot-checked in raw HTML for 9 of them (see Review notes).

---

## 1. Reference portfolios (12)

Two clusters: (A) the "quiet craft" text-first sites that signal taste by restraint, (B) the "show-off" sites that signal range by spectacle. Dmytro's target stack (React Bits, Aceternity, Animate UI) naturally pushes toward B, so the risk is looking generic. The best move is B's polish with A's restraint and copy.

### 1. Brittany Chiang: https://brittanychiang.com
- Hero concept: name, "Frontend Engineer", one outcome line ("I build accessible, pixel-perfect experiences for the web"). Single column.
- Signature interaction: sticky left nav with scroll-spy (inferred from the well-known layout); a "Click to time travel" TARDIS easter egg in the footer (observed in text).
- Structure: About, Experience (numbered timeline, tech tags), Projects (cards with image, tags, a proof stat like "100k+ Installs"), Writing, footer crediting the tools used.
- Memorable: the template that thousands copy. Dense with credible proof, zero fluff.
- Steal: tech tags per entry; one hard number on a project; footer "built with" credit; skip-to-content link.
- Avoid: copying the layout wholesale. It is the most cloned portfolio on the web, so it reads as "template".

### 2. Rauno Freiberg: https://rauno.me
- Hero concept: one sentence of identity ("Estonian interaction designer", Vercel, Devouring Details) and then links. No scroll hero.
- Signature interaction: click-to-copy email with a "Copied" confirmation (observed); closing manifesto of "Make it ..." lines (observed).
- Structure: Craft, Projects, Field Notes, archive links for past years (2022, 2023).
- Memorable: an opinion as a design system. Every pixel is intentional; he is Eastern European, which is relevant to Dmytro's positioning.
- Steal: copy-email micro-interaction; a short manifesto line set; yearly archive of past site versions (shows long-term craft).
- Avoid: pure minimalism only works with a famous name behind it. Dmytro lacks that signal, so he needs more explicit proof.

### 3. Emil Kowalski: https://emilkowal.ski
- Hero concept: "Design Engineer", a "Today" status block, and a live banner for his course (observed).
- Signature interaction: the site is plain; the proof is the products linked (Sonner, Vaul, animations.dev).
- Structure: Today, Projects (4, one line each), Writing, More.
- Memorable: shipped open-source that people actually use (Sonner is in shadcn/ui) outranks any visual flourish.
- Steal: a "Today/Now" status line (availability); one-line project descriptions; the idea that distribution beats decoration.
- Avoid: copying the sparseness without the distribution.

### 4. Paco Coursey: https://paco.me
- Hero concept: name, "Crafting interfaces", a two-line bio with employer names (observed).
- Signature interaction: none visible. Text-only; the credibility is cmdk, Next Themes (observed).
- Structure: Building, Projects, Writing, Now, Connect.
- Memorable: a name that is short and spelled easily, plus a domain that is his first name. Brand = first name + one craft word.
- Steal: the "Connect" block with one handle and one email; the "Now" section; naming (short domain is a brand lesson for polizhai.site).
- Avoid: no visuals means no help for an unknown name.

### 5. Josh W Comeau: https://www.joshwcomeau.com
- Hero concept: no tagline; the feed of articles is the hero (observed).
- Signature interaction: sound toggle, dark mode toggle, whimsical animation tied to content (observed in text; "Whimsical Animations" is his course).
- Structure: articles, categories, popular, newsletter, courses.
- Memorable: warmth and teaching voice ("friggin' cool"); delight as a brand, not decoration.
- Steal: sound toggle off by default; personality in microcopy; one signature delight element.
- Avoid: a content-first site needs content volume. Dmytro would need a writing pipeline to benefit, so skip the feed layout.

### 6. Lee Robinson: https://leerob.com
- Hero concept: a plain paragraph of identity and history (observed): "coded for 15 years", teaching, advising.
- Signature interaction: none. Its authority comes from employers and writing.
- Structure: bio, Notes, Blogs.
- Memorable: the mission line "make technology easy to understand and interesting to learn about" is a brand in one sentence.
- Steal: a single mission sentence that reframes the work as a purpose.
- Avoid: authority that comes from employers is not available to him yet.

### 7. Julien Thibeaut (ibelick): https://ibelick.com
- Hero concept: name, "Design Engineer", X and GitHub links (observed).
- Structure: Building (Mesurer, UI Skills), Writing, Everyday (runs, playlists). The "Everyday" section adds personality in two lines.
- Memorable: small footprint, clear "I build tools" identity. He is a relevant peer because his work lives in the same UI-component ecosystem Dmytro wants to use.
- Steal: a tiny "Everyday" human-side section (Riga, chess, whatever is real).
- Avoid: same as Paco, no help for an unknown name.

### 8. Dennis Snellenberg: https://dennissnellenberg.com
- Hero concept: giant name, "Freelance Designer & Developer", "Helping brands to stand out in the digital era" (observed).
- Signature interaction: multilingual greeting intro (Hello, Bonjour, Ciao; observed in text, likely animated, inferred); local time in the footer (observed); menu toggle.
- Structure: Recent work grid (title, discipline, year), More work (11 total), "Let's work together" block with email/phone/button, footer with edition year.
- Memorable: a freelancer who looks like a studio. Awwwards-style motion, one-person scale.
- Steal: local-time footer (fits "Riga" story), "Edition 2026" footer, discipline labels such as "Interaction & Development", a big contact block with a single button, and a multilingual greeting that suits Dmytro's UA/RU/EN/LV/ES (a real, non-generic reason to use it).
- Avoid: "Helping brands to stand out in the digital era" is a generic tagline; the polish carries it, the words do not.

### 9. Bruno Simon: https://bruno-simon.com
- Hero concept: a playable 3D driving world (observed).
- Signature interaction: drive with keyboard/gamepad, achievements, timed circuit with leaderboards, "whisper wall" for visitor messages, "Behind the scene" section with open source and devlogs (all observed).
- Memorable: the portfolio is the product. Warm tone: "And don't break anything!"
- Steal: an honest "Behind the scene" section (stack, devlog); self-aware microcopy.
- Avoid: do not attempt a game. It would cost months, hurt performance on recruiter laptops, and Bruno owns that lane.

### 10. Oleg Frolov: https://www.olegfrolov.design
- Hero concept: "Product Designer & Design Engineer", with an experiments grid as the home page (observed).
- Signature interaction: 16 interaction-concept cards linking to Dribbble shots (observed); AR/VR bent.
- Structure: Experiments, spatial, Works, Publications, Tools, Blog.
- Memorable: the lab is the front door. It signals range through many small things instead of a few big case studies.
- Steal: a small "Lab" row of 6 to 8 micro-interactions that Dmytro already makes (shows motion skill without a client brief).
- Avoid: no case-study depth on the home page; and external-only cards leak visitors to Dribbble.

### 11. Artem Shcherban: https://artemshcherban.com
- Hero concept: digital designer portfolio. Awwwards Site of the Day, Apr 5, 2026 (reviewer verified on the Awwwards page awwwards.com/sites/artem-shcherban-portfolio, which links artemshcherban.com). The earlier "based in Kazakhstan" claim could not be verified on either page and was removed.
- Signature interaction (inferred from Awwwards element names): loader, video on menu/contact/showreel, "Next Work" navigation, filterable portfolio (All & Selected), custom 404.
- Memorable: showreel plus sound and motion as the lead.
- Steal: custom loader that is on-brand and under 1.5 s; "Next Work" nav at the end of each case study; custom 404; showreel idea (30 s reel of Dmytro's client sites).
- Avoid: video-heavy pages can wreck LCP; poster images plus lazy video.

### 12. William Banham: https://banham-info.vercel.app
- Hero concept: name with pronunciation "[bˈanəm]", then "A 19 yr old self-taught full stack developer based out of England, UK ... since 2018" (observed).
- Structure: Hero, Previous/Current Work, Certifications, Education, footer.
- Memorable: the pronunciation guide in the hero and age + "since 2018" as the hook. Directly comparable to Dmytro.
- Steal: pronunciation line (see section 3, only once Dmytro confirms the pronunciation); "since 2021" as a duration claim.
- Avoid: no metrics, testimonials or case-study links; typos ("a easily followable format"); "to perfection" is an unsupported claim. This is what a young dev's portfolio looks like when proof is missing, and the gap Dmytro can win in.

---

## 2. Patterns in 2025-2026 personal-brand dev portfolios

### What strong ones share
1. **Hero = name + role + one outcome line + one CTA.** Brittany, Dennis, Emil, Paco all follow it. Name is the largest element. A role noun ("Frontend Engineer", "Design Engineer") beats a skill list.
2. **Proof above the fold or one scroll away.** Employer names (Paco, Lee, Emil), usage numbers (Brittany's 100k+ installs), or shipped open source. Without a famous employer, client logos and named results play that role.
3. **Few projects, deep.** Roundups agree: three real write-ups beat fifteen screenshots. Case study format that recurs: problem, constraints, approach, trade-offs, outcome.
4. **One signature delight, not ten.** Brittany's TARDIS, Josh's sound toggle, Rauno's copy-email, Bruno's car. Each site has exactly one thing people remember.
5. **Human layer.** "Now", "Everyday", local time, pronunciation, playlists. Cheap and effective.
6. **A single, repeated contact path.** Email copy button, one calendar link, one social handle. No contact form with six fields.
7. **Visible craft details:** skip link, reduced-motion respect, dark mode, fast load. For recruiters who view source, this is a proof element.

### Section order that recurs
Hero, selected work, (about/story), (writing or lab), contact, footer. Experience timeline only when there is a real employer history.

### CTA patterns
- Primary: "Email me" with copy-to-clipboard or "Book a 20-min call".
- Secondary: "View work" (anchor).
- Availability pill ("Booking Jan 2027") near the CTA creates scarcity honestly.
- Avoid "Let's Connect" as the only label; it names no action.

### Clichés to avoid (flag these to the builder)
- "Hi, I'm X, a passionate developer", "Welcome to my portfolio".
- Skill-bar charts or percentage rings. Replace with tools-in-context per project.
- Purple/blue gradient hero, floating 3D globe, generic particle background.
- Stacking Aceternity effects: spotlight + beams + sparkles + 3D card + text generate + infinite-moving cards on one page. Pick at most two and use them for one job each. Your component sources (Aceternity, React Bits, Animate UI, SmoothUI) are the most-seen set in 2026, so *how* you combine them is the only differentiator.
- Todo/weather/calculator projects, lorem-style filler copy, "100% responsive" badges.
- Testimonials with no name, photo or company.
- Custom cursor that blocks reading, scroll-jacking the entire page, loaders over 2 s.
- AI-generated generic copy. Recruiters in 2026 pattern-match on "delve", "crafting seamless", "elevate".

### Library-specific rules for the 5 component sources (reviewer addition)
Component names below are as commonly listed in each library; confirm the current names in each catalogue before building.

| Library | Use it for | Do not | Tell-tale "template" signal to avoid |
|---|---|---|---|
| **shadcn/ui** | The primitive layer: button, dialog, tooltip, tabs, sheet, form. Accessibility and focus handling for free. | Ship the default theme. Change at least: font, radius scale, color tokens (no stock zinc/slate + Inter), focus ring color. | The default card grid with a lucide icon, bold title and grey text for "Services". Write services as plain rows instead. |
| **React Bits** | At most **one** text effect (e.g. a single split/blur reveal on the H1) and nothing else above the fold. | Stack text effects (SplitText + ShinyText + GradientText on one page). Use its full-screen backgrounds (Aurora, Silk, Hyperspeed, Particles-style) as the hero. Use cursor effects (SplashCursor, ClickSpark). | Animated WebGL background behind a centered name: the single most recognisable 2025-26 template hero. |
| **Aceternity UI** | At most **one** effect, with one job: e.g. a hover reveal / image preview on the Selected work list. | Spotlight, Background Beams, Sparkles, Lamp, Meteors, 3D Card, Text Generate, Infinite Moving Cards (testimonials), Floating Dock, the Bento Grid template. Any two of these together read as "Aceternity demo page". | Infinite-scrolling logo or testimonial marquee with fake or unnamed entries. |
| **Animate UI** | Micro-interactions on shadcn primitives that already exist on the page: the copy-email button (copied state), tabs indicator in case studies, accordion in FAQ. | Animate every primitive. Default durations everywhere; tune to one shared spring/duration token. | Every button bouncing on hover. |
| **SmoothUI** | One or two small stateful widgets with a real job: e.g. the availability pill or a number transition for the Stundio user count. | Use it for layout or as a second source of hero effects. | Widgets that show nothing true (fake live counters, decorative "status" chips). |

Global budget: 1 signature motion moment (see section 5), at most 1 text effect, at most 1 card hover effect, micro-interactions only on interactive elements. Every effect: `prefers-reduced-motion` fallback, lazy-loaded below the fold, no layout shift, no WebGL on the critical path. If an effect cannot be tied to a sentence of proof or an action, cut it.

---

## 3. Name-brand angles for "Dmytro Polizhai"

### Name analysis
- "Polizhai" is distinctive (almost no collisions), which is great for SERP ownership but hard to pronounce for non-Slavic readers. **Unconfirmed guess**: poh-lee-ZHAI ("zh" as in "measure"); the syllable stress is also a guess. Neither the pronunciation nor the original Cyrillic spelling is sourced anywhere: Dmytro must supply both before any pronunciation line is published. A pronunciation line like William Banham's is a legitimate brand device: `Dmytro Polizhai [poh-lee-zhai]` plus a small audio button (plays 1 s of his voice).
- Spelling risk: "Dmytro" (Ukrainian transliteration) vs "Dmitry/Dmitri". Use "Dmytro" everywhere, never vary it, to keep search matching.
- Short forms: "DP" is crowded and meaningless (a logomark only, never a handle). "Polizhai" alone is brandable and unique: use as handle and wordmark (`polizhai`), while the H1 keeps the full name. "Dmytro P." is fine in UI chrome.
- Domain: polizhai.site has **expired and does not resolve**. This is a decision point, not just a fix: either re-register polizhai.site (check it has not been taken; an expired `.site` may be in a redemption period or already re-registered) or move to polizhai.dev / polizhai.com, which read more credibly than `.site`. Pick one canonical host and 301 any others to it (see section 6).

### Angle A: "Shipped at 18" (proof-first)
- Positioning: A frontend developer whose work is already in production and in daily use: an open-source app students open every school day (Stundio), a live client site (Prolifts), a live Next.js product (Curio), and an e-commerce build in progress (Numerologgi).
- Taglines (reviewer-corrected): the original "Four live client sites" was not supportable. Publicly verifiable today: one client site (pro-lifts.lv), one own product (stundio.lv), one credited product of unclear ownership (curio.today); Numerologgi is behind a 401. "Four industries" likewise has no source. Use instead: (1) "Real users. Real launches. Since 2021." (2) "Frontend that ships." (generic: see section 5 critique).
- Tone: plain, specific, a little dry. Numbers over adjectives.
- Visual: near-black or warm off-white base, one saturated accent (acid lime or signal orange). Type: Geist Sans / Inter Tight for body, a grotesque display such as "Instrument Sans" or "Space Grotesk" for the H1, Geist Mono for numbers. Motion: crisp, short springs, number count-ups, nothing floaty.
- Hero: huge name; right side a stack of live-site thumbnails that lift on hover; a ticker line built only from real projects: "Elevators / Edtech / Media / E-commerce" (Prolifts, Stundio, Curio, Numerologgi; drop "E-commerce" until Numerologgi is public and approved). The earlier "Design studio" entry had no matching project and was removed.
- Risk: wholly depends on proof being visible and verified. If clients refuse to be named, it collapses into a claim. Also leans on age as the hook, which can read as a gimmick if overplayed.

### Angle B: "Motion-first frontend engineer"
- Positioning: Frontend engineer who treats animation as part of the product, not paint.
- Taglines: (1) "Interfaces that move with intent." (2) "Frontend, with motion built in." (3) "Smooth is a feature."
- Tone: craft-obsessed, measured, a few technical specifics (60 fps, reduced-motion, bundle size).
- Visual: dark, high-contrast, restrained gradient; display serif italic accent (Instrument Serif or Fraunces) against Geist; GSAP-scale scroll choreography plus Framer Motion micro-interactions. This is the closest to the stack Dmytro already uses (GSAP, Framer Motion).
- Hero: the name animates letter by letter into place; a live "motion playground" slider (easing/duration) that changes the page feel.
- Risk: crowded lane (Emil, Josh, Dennis all own pieces of it). Easy to slide into effect-stacking. A motion-first claim invites scrutiny of performance and accessibility; the site must be flawless itself.

### Angle C: "Builder from Riga" (place and story)
- Positioning: An independent builder in Riga working with teams across timezones; the Baltic/Eastern-European craft, English-speaking, EU-based.
- Taglines: (1) "Built in Riga, shipped worldwide." (2) "One developer. Riga. Your product, live." (3) "From Riga with code."
- Tone: warm, direct, a little wry.
- Visual: cool northern palette (graphite, fog, a Baltic amber accent); type pairing Inter Tight + a humanist serif such as Newsreader; slow, calm motion; live Riga local time and weather widget; subtle map.
- Hero: name, a live "Riga 14:32 / available" line, one CTA.
- Risk: a location is weak positioning by itself. Recruiters want skill, clients want proof. "Ukrainian in Riga" invites assumptions he may not want to carry in a client-facing context. Works only as a *supporting* layer. Note: two of his strongest projects are Riga-rooted (Stundio for a Riga school, Prolifts a Riga contractor), which makes "Riga" a true supporting line rather than decoration.

### Angle D: "Polizhai, the product engineer" (client outcomes, product thinking)
- Positioning: Frontend developer who thinks in business outcomes (he runs commercial packages and contracts himself). Speaks to startups: conversion, load speed, shipped in weeks.
- Taglines: (1) "I build frontends that earn their keep." (2) "Design-aware frontend for startups." (3) "From brief to production in weeks."
- Tone: confident, business-literate, concise.
- Visual: light mode default, editorial grid, mono labels, one electric accent (cobalt); Geist + Geist Mono; motion low-key (reveal on scroll, number tickers).
- Hero: sentence-style hero with inline chips ("for [startups] who need [speed]"); case-study results as the first scroll.
- Risk: requires real metrics from clients, which he may not have; promises about outcomes he does not control; reads as agency-ish, which conflicts with a person-first brand.

---

## 4. Age framing: strength without sounding junior

What others do (observed or reported):
- William Banham leads with age + "self-taught" + "since 2018" (observed). It works as a hook, but with no metrics or client names the claim floats; the framing is fine, the proof is missing.
- Roundup articles on teenage developers (Frontend Mentor's "first developer job at 17", DEV posts like "7 production apps in 7 days as a 17-year-old") frame age as velocity and are content-marketing-grade; treat as anecdotes.
- Established names (Paco, Rauno, Emil) never state age. They let work speak. That is the target end state.

Rules for Dmytro:
1. **Convert age into years of experience.** "Coding since 2021" is worth more than "18". Five years of building is a fact; "18" is a label. Put "since 2021" in the hero; put 18 in the About, once, as a fact with a date: "Started with a Google Maps scraper in 2021, age 12."
2. **Never apologize or qualify.** No "aspiring", "junior", "learning", "passionate". Use "frontend developer".
3. **Lead with outputs, then origin.** Order: shipped clients, then stack, then story. The story (self-taught, the scraper) is a compelling hook for recruiters, but only after the proof.
4. **Make speed the strength, with evidence.** "Ships in weeks" only if true; show a timeline from one real project (kickoff, launch).
5. **Let a client say it.** One named quote that addresses reliability (communication, deadlines) neutralizes the age doubt faster than any copy.
6. **Keep student status out of client copy** (per Dmytro's own guideline). On the recruiter-facing About/CV a single line is fine.
7. **Avoid "young talent" and "prodigy" language.** It invites discounting. "Self-taught" and "freelance since X" are better.

---

## 5. Recommendation

**Reviewer-revised. Pick "Shipped, in motion": Angle A (proof-first) as the spine, plus exactly one signature motion moment that is itself proof, with C (Riga) as the human layer.** The researcher's original pick (A + "B as visual execution" + C) is kept in direction; what changes is how motion is used: one moment with a job instead of "polish" spread across the page.

### Stress test of the original pick ("Frontend that ships.")
- **Is proof-first right? Yes.** Both audiences ask "has this person shipped real things?" first, and he has unusually concrete answers for his age: Stundio has real daily users (200+ per README, 400+ per stundio.lv), is open source (MIT) and ships on web, Android (Capacitor) and desktop (Tauri), with 535 commits; Prolifts is a live production client site. Few 18-year-old portfolios can show a public repo plus a live client site plus daily users.
- **Is "Frontend that ships." the right line? No.** It is a phrase any developer could use, it names no proof, and it says nothing about the part of his work that is distinctive (the motion and product scope). It fails the "could a competitor put this on their site unchanged?" test.
- **Does pure A justify the requested stack?** Not well. A pure proof-first site (Paco/Emil style) needs shadcn and little else; React Bits, Aceternity, Animate UI and SmoothUI would be unjustified weight. The stack is only defensible if motion has a job.
- **Why not B (motion-first)?** Still rejected as the spine: crowded lane, the 2026 default look for this exact toolkit, and his strongest motion piece (Prolifts) is custom scroll code, not library effects, so a "motion engineer" claim would rest on one project.
- **Why not D?** Still no client metrics; the only number (Curio's 10% load-time drop) is LinkedIn-only and unsourced.

### The hybrid, concretely
- **Spine (A):** hero and first scroll are proof: names of real projects, Stundio's user count, live links, public repo.
- **One signature motion moment (from Prolifts, so motion = proof):** in Selected work, the Prolifts entry scroll-scrubs a short frame sequence from the real lift-shaft hero (a few dozen compressed frames, poster image first, static image under reduced motion). The visitor experiences the client work instead of reading about it. This is the one place GSAP/custom scroll code is used, and the reason the site is allowed to be animated at all.
- **Supporting micro-interactions (libraries):** only where an action happens (copy email, tabs in case studies, availability pill, the user-count number). Budget and per-library rules in section 2.
- **Human layer (C):** Riga local time, pronunciation line (once confirmed), real photo, "Everyday" lines.

### Tagline options (sharpened)
Ranked; all are built on verifiable facts, not adjectives.
1. **"Built in Riga. Used every day."** Ties location (C) to the strongest proof (Stundio daily users; Prolifts is a Riga contractor). Hard for a competitor to reuse unchanged.
2. **"Shipped first. Animated on purpose."** States the hybrid in five words and pre-justifies the motion; works as the hero sub-line under the name.
3. **"[N]+ students open my app every school day."** Most concrete; use only with a confirmed current figure (200+ vs 400+ conflict must be resolved) and as a proof line, not the role line.

Alternates: "Real users. Real launches. Since 2021." (safe, slightly generic). Retired: "Frontend that ships." (generic), "Four live client sites..." (not supportable).

Role line under the H1 stays plain: "Frontend developer, Riga" (or "Frontend & product developer" if Dmytro wants Stundio's full-stack scope reflected; his LinkedIn currently says "Full-Stack Developer (Next.js/Node.js)", so align the two).

### Must-have sections, in order (mapped to available proof)
1. **Nav + availability pill + copy-email.** Work, About, Contact. Skip link. (Animate UI copy button; SmoothUI pill.)
2. **Hero.** H1 `Dmytro Polizhai` (pronunciation line only once confirmed), role line, tagline #1 or #2, CTA pair (Email / View work), proof strip: "Stundio · Prolifts · Curio" with live-link icons, "coding since 2021". At most one text effect on the H1. No background effect.
3. **Selected work (3, plus 1 when cleared).**
   1. **Prolifts** (pro-lifts.lv; client: Pro-lifts SIA, Riga). Flagship and home of the signature scroll moment. Line: scroll-scrubbed lift-shaft hero with AI-generated video, Next.js 16, Sanity, LV/RU/EN. Needs client approval. Say "scroll-scrubbed", not "scroll-jacking".
   2. **Stundio** (stundio.lv; own open-source product). Line: offline-first timetable app used by [N]+ RVT students daily; PWA + Android + Linux desktop. Stack: React 19, Vite, Tailwind 4, Framer Motion, Capacitor, Tauri. Link to GitHub. This is the strongest proof for recruiters.
   3. **Curio** (curio.today). Line: Next.js news-feed frontend. Ownership and the 10% load-time figure must be confirmed before any number is shown; if unconfirmed, keep it as a short entry without metrics.
   4. **Numerologgi** (shop). Only after it is public (currently 401) and the client approves. Next 16, Payload, Stripe, three.js.
4. **Case studies (2 full pages): Prolifts and Stundio.** Format: context, problem, constraints, approach (one technical decision explained: Prolifts frame-sequence loading/perf on mobile; Stundio offline sync and EduPage parsing), trade-offs, outcome, tools, "Next work" link.
5. **How I work.** Three or four plain rows (design + build solo, performance/accessibility, motion, handoff/CMS), a real timeline from Prolifts (first commit 2026-08-08 to launch) as the process example. No icon-card grid.
6. **Lab strip (optional, v1.1).** 4 to 6 micro-interactions only if he has real ones; otherwise skip rather than pad.
7. **About / story.** Scraper at 12, self-taught, Riga, languages (Ukrainian & Russian native, Latvian B1, English B1), "Everyday" two lines, real photo. Student status (RVT) on the recruiter-facing CV/About line only, not in client copy.
8. **Social proof.** One named quote (Prolifts client is the natural candidate). Skip if not real.
9. **Contact.** Email with copy, booking link, GitHub/LinkedIn.
10. **Footer.** Built-with credit, "Edition 2026", Riga time, custom 404.

Quality floor (the invisible must-have): prefers-reduced-motion respected, LCP under 2.5 s on a mid phone (the Prolifts frame sequence must not be on the critical path), no layout shift, light/dark, English only for v1; add other languages only when maintained (an unmaintained 4-language site is worse than a clean English one).

---

## 6. Personal SEO: owning "Dmytro Polizhai"

The name is rare, so this is easy once a site exists. **Current state: there is no site to index.** polizhai.site does not resolve in DNS (expired domain, confirmed by Dmytro); any indexed pages from the old site will drop out of Google over the coming weeks, so step 0 is urgent.

Checklist:
0. **Restore the domain first.** Check the registrar for polizhai.site: renew if still in grace/redemption, or re-register if released (and check nobody else has taken it). If it is gone, decide on polizhai.dev / polizhai.com now (section 3). Then add the domain to Cloudflare, switch the registrar's nameservers to Cloudflare, and point apex + `www` at the host (Vercel or Hetzner). Turn on auto-renew. Until this is done, nothing below matters.
1. **Server-render or statically generate** the homepage (Next.js static export or SSG; a Vite SPA with no prerender is the weak spot). No evidence either way about the old site's rendering (it was never fetched); build the new one SSG/SSR from the start. After launch, verify with `curl -s https://<canonical-host> | grep "Dmytro Polizhai"`.
2. **One canonical host.** Pick the restored/chosen domain and 301 all others and `www` to it (Cloudflare redirect rule). Set `<link rel="canonical">`.
3. **Title/H1/meta.** Title: `Dmytro Polizhai | Frontend Developer in Riga`. Single H1 = the full name. Meta description includes name, role, location.
4. **Person JSON-LD** on the home page: `@type: Person`, `name`, `givenName`, `familyName`, `url`, `image`, `jobTitle`, `address` (Riga, LV), `knowsAbout`, `knowsLanguage`, and `sameAs` with every profile URL (GitHub, LinkedIn, X, Dribbble/Read.cv if used, Behance, Product Hunt, dev.to). Add `WebSite` schema too. Validate in Google's Rich Results / Schema validator.
5. **Consistent identity everywhere.** The same display name "Dmytro Polizhai", the same photo, the same one-line bio, and one handle (`polizhai`) on GitHub, LinkedIn, X, Dribbble, npm, Telegram, Bluesky. Spell "Dmytro" the same everywhere. Link back to the site from each profile; the two-way link is what lets Google merge them into one entity.
6. **Third-party mentions.** Client sites with a credit "Site by Dmytro Polizhai" in the footer, linking home, are the strongest and most natural backlinks. Add open-source repos with the name in the README and package author fields (`author` in package.json). One or two guest posts or launches (Product Hunt, dev.to, a Codrops/Awwwards submission) add authority.
7. **Technical basics.** sitemap.xml, robots.txt, OG image (generated with name), Search Console and Bing Webmaster verified, submit the sitemap. Fast and accessible pages.
8. **Content that includes the name:** an About page and 2 case-study pages with the full name in H1/alt/credits. A /now or /writing page helps refresh signals.
9. **Name variants.** Mention "Dmytro Polizhai" in Latin and optionally in Cyrillic once in About. The Ukrainian given name is "Дмитро"; the surname spelling ("Поліжай"? "Полижай" in Russian?) is an **unconfirmed guess** and must come from Dmytro, not from transliteration to capture UA/RU searches. Do not stuff.
10. **Agent readiness (optional).** `llms.txt` is optional and Google ignores it; low cost, low priority.

Timeline: once the domain resolves again and the site is crawlable, with Person schema and sameAs links, expect the exact-name SERP to be mostly owned within weeks, not months, given the near-zero competition for "Polizhai". Verify by searching the name in an incognito window after indexing.

---

## Summary

1. 12 reference portfolios verified to load (HTTP 200): Brittany Chiang, Rauno, Emil Kowalski, Paco, Josh Comeau, Lee Robinson, ibelick, Dennis Snellenberg, Bruno Simon, Oleg Frolov, Artem Shcherban, William Banham. Motion behavior was inferred from text for most of them.
2. Winning pattern: name + role + outcome in the hero, proof before decoration, 3 to 4 deep case studies, one signature delight, one contact path.
3. Biggest cliche risk for this stack: stacking Aceternity, React Bits and Animate UI effects everywhere. Budget: 1 signature motion moment, at most 1 text effect, 1 card hover effect; per-library rules in section 2.
4. Age: convert "18" into "coding since 2021", put proof first, never apologize, and use one named client quote.
5. Recommended angle (reviewer-revised): **"Shipped, in motion"**: proof-first spine (Stundio, Prolifts, Curio), one signature motion moment that is itself proof (Prolifts scroll-scrubbed lift shaft in Selected work), Riga human layer. Taglines: "Built in Riga. Used every day." / "Shipped first. Animated on purpose." / "[N]+ students open my app every school day." ("Frontend that ships." retired as generic.)
6. SEO: restore the expired domain (polizhai.site does not resolve) and point it at Cloudflare first; then ship a server-rendered/static home page, add Person JSON-LD with sameAs, use the same handle and name everywhere, and get "Site by Dmytro Polizhai" credits on client sites.

---

## Review notes

Reviewer pass, 2026-11-09 (brand strategy + UI/UX). profile.md read only, not edited.

**Fact check**
- All 12 reference URLs re-fetched: HTTP 200 for all 12.
- Quoted copy confirmed in raw HTML for 9 sites: Brittany ("accessible, pixel-perfect experiences", "100k+ Installs", "time travel"), Rauno ("interaction designer", "Devouring Details", the "Make it ..." lines), Emil ("Design Engineer", Sonner, Vaul, animations.dev), Paco ("Crafting interfaces", Next Themes, command menu), Lee ("15 years", mission line), ibelick (Design Engineer, Mesurer, UI Skills, Everyday), Dennis ("Freelance Designer & Developer", "Helping brands to stand out in the digital era", Bonjour, Local time), Banham ("19 yr old self-taught full stack developer", "since 2018", [bˈanəm], "easily followable", "to perfection"), Artem (showreel). Motion/hover behaviour remains unverified (text only).
- Artem Shcherban: the Awwwards SOTD claim, previously sourced only to a search snippet, is now verified on the Awwwards page itself (Site of the Day, Apr 5, 2026). "Based in Kazakhstan" was unverifiable and removed.

**Changes made**
1. polizhai.site: removed the wrong "empty body to curl / client-rendered SPA" claim everywhere (method notes, section 6 intro and step 1, summary). Replaced with: does not resolve in DNS; domain expired (Dmytro); old code on GitHub.
2. SEO section: added step 0 (restore or replace the domain, nameservers to Cloudflare, apex + www to host, auto-renew), made canonical-host and verification steps host-agnostic, noted old indexed pages are dropping out.
3. Section 3 domain bullet: now a decision point (re-register .site vs move to .dev/.com).
4. Name: pronunciation and stress marked as unconfirmed guesses; Cyrillic surname spelling marked as a guess to be supplied by Dmytro (only "Дмитро" as the Ukrainian given name is standard). Banham "steal" gated on confirmation.
5. Angle A: removed unsupportable "Four live client sites" / "four industries" and the "Design studio" ticker entry; positioning re-based on Stundio, Prolifts, Curio, Numerologgi.
6. Angle D: removed "studies entrepreneurship" (education is RVT, and studies stay out of client copy).
7. Section 5 rewritten: stress test of "Frontend that ships." (kept proof-first; retired the tagline as generic); new hybrid "Shipped, in motion" with one signature motion moment (Prolifts scroll-scrubbed frame sequence inside Selected work) that justifies the animated stack; three sharpened taglines; must-have section order mapped to the four real projects, with approval/publication gates; two named case studies (Prolifts, Stundio) with the technical decision to explain for each.
8. About languages corrected to Ukrainian & Russian native, Latvian B1, English B1 (Spanish dropped).
9. Section 2: added a per-library table (shadcn, React Bits, Aceternity, Animate UI, SmoothUI) with use / do-not / tell-tale signals and a global motion budget.
10. Per instruction from Dmytro, game-development work is not mentioned or used as justification anywhere in this file (the only "game" references are to Bruno Simon's site).
11. Summary lines 3, 5, 6 updated to match.

**Open questions for Dmytro**
1. Domain: is polizhai.site still recoverable (grace/redemption) or should the rebuild launch on polizhai.dev / .com?
2. Name: exact Cyrillic surname spelling (UA and RU) and the pronunciation/stress of "Polizhai"?
3. Stundio user figure to publish: 200+ (README) or 400+ daily (stundio.lv), and since when?
4. Approvals: can Prolifts be a full case study (incl. reusing hero frames on the portfolio), and will Pro-lifts give a named quote? Can Numerologgi be shown once live?
5. Curio: is it yours, a client's or an employer's product, and is the 10% load-time figure sourced? Also: role line "Frontend developer" vs LinkedIn's "Full-Stack Developer (Next.js/Node.js)": which one?
