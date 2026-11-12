import { ArrowDown } from "@/components/animate-ui/icons/arrow-down";
import { buttonVariants } from "@/components/ui/button";
import { ProjectExplorer } from "@/components/sections/work";
import { facts, hrefOf, t } from "@/lib/content";
import { Calendar } from "lucide-react";
import { useState, type MouseEvent } from "react";

/**
 * "See the work": bring the canvas into view so it fills the screen under the top bar (centred in
 * that space when it fits, top-aligned under the bar when it does not), then hand it keyboard focus.
 */
function showCanvas(e: MouseEvent<HTMLAnchorElement>) {
  const canvas = document.getElementById("work");
  if (!canvas) return; // the plain #work anchor still works
  e.preventDefault();
  const nav = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const box = canvas.getBoundingClientRect();
  const room = window.innerHeight - nav;
  const top = window.scrollY + box.top - nav - Math.max(0, (room - box.height) / 2);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
  canvas.focus({ preventScroll: true });
}

/** §1 The hero: the motto, a subline and two actions, then the full-bleed project canvas. */
export function Hero() {
  const [arrowHover, setArrowHover] = useState(false);
  const call = facts.contact.find((c) => c.id === "call");
  const callHref = hrefOf(call?.href);

  return (
    <header id="top" className="texture-grain relative flex flex-col overflow-hidden">
      <div className="container-site relative z-(--z-content) flex flex-col items-center pt-[calc(var(--nav-h)+clamp(var(--space-8),6svh,var(--space-16)))] text-center">
        <h1 className="type-display type-display-poster max-w-[15em] text-[clamp(1.75rem,min(8.8vw,10.7svh),6rem)] text-fg">{t.hero.headline}</h1>
        <div className="rise-in mt-(--space-6) flex flex-col items-center gap-(--space-2)">
          <p className="type-lede font-medium tracking-tight text-fg">
            {t.hero.identity}
          </p>
          <p className="type-body max-w-[54ch] text-fg-muted">{t.hero.subline}</p>
        </div>
        <div className="mt-(--space-8) flex flex-wrap justify-center gap-3">
          <a
            href="#work"
            onClick={showCanvas}
            className={buttonVariants({ variant: "secondary" })}
            onPointerEnter={() => setArrowHover(true)}
            onPointerLeave={() => setArrowHover(false)}
          >
            {t.hero.seeWork}
            <ArrowDown animate={arrowHover} aria-hidden="true" />
          </a>
          {callHref && (
            <a
              href={callHref}
              className={buttonVariants({ variant: "primary" })}
              data-cal-link="dmytropolizhai/briefing"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
            >
              <Calendar className="size-4" aria-hidden="true" />
              <span>{t.contact.labels.call}</span>
            </a>
          )}
        </div>
      </div>

      {/* Full-bleed: outside container-site, edge to edge of the viewport. */}
      <ProjectExplorer className="relative mt-(--space-4) sm:mt-[clamp(var(--space-4),3svh,var(--space-12))] overflow-visible z-(--z-content)" />
    </header>
  );
}
