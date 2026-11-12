import { ArrowDown } from "@/components/animate-ui/icons/arrow-down";
import { buttonVariants } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { ProjectExplorer } from "@/components/sections/work";
import { t } from "@/lib/content";
import { lazy, Suspense, useState, type MouseEvent } from "react";

// WebGL shader code stays out of the first bundle (160 kB JS budget); the headline is the LCP, not the fluid.
const LiquidEther = lazy(() => import("@/components/effects/liquid-ether").then((m) => ({ default: m.LiquidEther })));

const saveData = typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

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

/** §1 The hero: the motto, a subline and two actions over the ferrofluid, then the full-bleed project canvas. */
export function Hero() {
  const [arrowHover, setArrowHover] = useState(false);
  // The fluid ignores the pointer while it is over the canvas (dragging there is not a gesture for it).
  const [overCanvas, setOverCanvas] = useState(false);

  return (
    <header id="top" className="texture-grain relative flex flex-col overflow-hidden">
      {!saveData && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-svh opacity-70 mask-[linear-gradient(to_bottom,black_60%,transparent)]"
        >
          <Suspense fallback={null}>
            <LiquidEther
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              mouseForce={overCanvas ? 0 : 20}
              cursorSize={100}
              persistence={0.75}
              autoDemo={true}
              autoSpeed={0.5}
              autoIntensity={2.2}
            />
          </Suspense>
        </div>
      )}

      <div className="container-site relative z-(--z-content) flex flex-col items-center pt-[calc(var(--nav-h)+clamp(var(--space-8),6svh,var(--space-16)))] text-center">
        <h1 className="type-display type-display-poster max-w-[15em] text-[clamp(1.75rem,min(8.8vw,10.7svh),6rem)] text-fg">{t.hero.headline}</h1>
        <p className="rise-in type-body mt-(--space-6) max-w-184 text-fg-muted">{t.hero.subline}</p>
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
          <CopyEmailButton label={t.common.emailMe} icon="mail" variant="primary" />
        </div>
      </div>

      {/* Full-bleed: outside container-site, edge to edge of the viewport. */}
      <ProjectExplorer onHoverChange={setOverCanvas} className="relative mt-(--space-4) sm:mt-[clamp(var(--space-4),3svh,var(--space-12))] overflow-visible z-(--z-content)" />
    </header>
  );
}
