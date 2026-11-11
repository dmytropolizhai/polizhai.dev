# Phase 1 brief: polizhai.site rebuild

Status: research complete, all four files reviewed (PASS WITH FIXES). This brief is what Phase 2 (brand strategy) builds on.
Sources: [profile.md](profile.md) · [github.md](github.md) · [market.md](market.md) · [stack.md](stack.md)

## Hard rules (from Dmytro)
- Brand = **Dmytro Polizhai, the person**, not Multilance the agency.
- **Never mention game development.**
- Education: RVT (Riga State Technical School). Languages: Ukrainian & Russian native, Latvian B1, English B1.
- Requested UI: shadcn, React Bits, Aceternity, Animate UI, SmoothUI. It must feel like a modern, beautiful landing page.
- Host: Cloudflare, static.
- LinkedIn canonical URL: linkedin.com/in/dmytropolizhai

## Proof (verified)
| # | Project | Role and evidence | Live |
|---|---|---|---|
| 1 | Stundio | Open-source RVT timetable app. React 19, Vite, Tailwind 4, Zustand, Framer Motion; Android (Capacitor), desktop (Tauri), web app; 442/545 commits by Dmytro | app.stundio.lv |
| 2 | Prolifts | Client site for Pro-lifts SIA. Next.js 16, Sanity, LV/RU/EN; scroll-scrubbed AI-video "lift shaft" hero (no GSAP) | pro-lifts.lv |
| 3 | Curio | News feed. Next.js; 830/830 commits; credited in the footer | curio.today |
| 4 | Numerologgi | Shop: Next 16, Payload, Stripe, three.js; 113/113 commits; not public yet | (pending) |
| 5 | one-to-one | Real-time app: Next 16, Socket.IO, Redis, Postgres, Docker, CI; 212/212 commits; archived | repo only |

## Positioning (market.md, Opus-reviewed)
- Angle: **"Shipped, in motion."** Proof first, plus ONE signature motion moment: the Prolifts frame sequence plays as you scroll.
- Tagline candidates: "Built in Riga. Used every day." / "Shipped first. Animated on purpose."
- Avoid: stacking effects everywhere, skill bars, "passionate developer" copy.

## Stack (stack.md, Opus-reviewed)
- Vite 8, React 19.3, TS strict, Tailwind 4.3, shadcn (Base UI), `motion` pinned to 14.11.1, no GSAP.
- Prerender at build; deploy to Cloudflare Workers Static Assets.
- Budgets: JS ≤160 kB gz total; mobile LCP ≤1.8 s.
- ⚠ The reviewer limited v1 to shadcn + Animate UI only. This **conflicts with Dmytro's requested libraries**; decision pending.

## Old site (dmytropolizhai/dmytropolizhai)
- Reuse: "Make it run, make it right", the hero rotator idea, en/ru/lv/uk locale structure.
- Drop: "150€+ Max order", "Top 5 GitHub Latvia", invented Curio stats, Stundio described as Flutter, © 2025.

## Decisions (Dmytro, 2026-11-09)
- **Effects: one job per library.** This overrides stack.md decision 5. Section map:
  - React Bits: hero background (lazy-loaded WebGL; static or CSS on mobile and under reduced motion)
  - SmoothUI: dock nav
  - Aceternity: timeline (about / journey)
  - Animate UI: micro-interactions (copy email, counters, highlight)
  - shadcn: base primitives
  - Prolifts frame sequence remains the signature moment
  - JS budget stays ≤160 kB gz, with heavy effects in lazy chunks
- **Domain: polizhai.com.**
- **Title: Full-Stack Developer.**
- **Prolifts:** hero frames may be reused; a client quote is coming.

- Surname in Ukrainian: **Поліжай**, stressed on the last syllable: по-лі-ЖАЙ (poh-lee-ZHAI).
- Stundio: **400+ daily users** (confirmed).
- Curio is owned by **Alexander Shunin**; the "10% faster load time" figure comes from analytics.
- **DNF** = a timer app for Rubik's cube speedsolvers. Can be listed as a side project.
- **Disciplio: dropped.**
- "Coding since 2021": **change the label** to truthful wording that doesn't rely on GitHub dates.
- MyDiplomas: Dmytro says it holds only marks and dates; he's fine with it public. No action.

- Numerologgi has **launched**, so it can be shown.
- Prolifts went live in **September 2026**. The client edits content in Sanity but not the footer.
- Stundio loads from the browser cache after the first request. Don't claim offline support or a service worker.
- Contact: **Telegram, Gmail, "Book a call"**.
- Keep "I'm 18." (once, in About).
- Certificates (Coursera): e8cdc0a9…, 010471fb…, ac4663aa… (mapping to be verified by the reviewer).

## Still open
- Telegram handle; booking link (Cal.com?) or phone number
- Remaining customer names and logos for "More than 5 happy customers"
- Prolifts quote text, plus name and role
- Stress in "Polizhai" (for the pronunciation line)
- Numerologgi canonical URL; multilance domain
