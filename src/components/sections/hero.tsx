import { ArrowDown } from "@/components/animate-ui/icons/arrow-down";
import { buttonVariants } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { t } from "@/lib/content";
import { lazy, Suspense, useState } from "react";

// WebGL shader code stays out of the first bundle (160 kB JS budget); the H1 is the LCP, not the fluid.
const Ferrofluid = lazy(() => import("@/components/effects/ferrofluid").then((m) => ({ default: m.Ferrofluid })));

const saveData = typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/** §1 The name poster. Full height: the 3D mark is the picture, the H1 is the LCP. */
export function Hero() {
  // Mixed logos and names look broken, so names stand in until every logo exists.
  const [arrowHover, setArrowHover] = useState(false);

  return (
    <header id="top" className="texture-grain relative flex min-h-svh flex-col overflow-hidden">
      {!saveData && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-60 mask-[linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <Suspense fallback={null}>
            <Ferrofluid colors={["#ffffff", "#ffffff", "#ffffff"]} spikeHeight={1} sharpness={2.5} tilt={48} dpr={0.6} />
          </Suspense>
        </div>
      )}
      <div className="container-site relative z-(--z-content) flex flex-1 flex-col pt-[calc(var(--nav-h)+var(--space-32))] pb-[calc(var(--dock-h)+2.5rem)] md:pb-(--space-8)">
        {/*
         * The 3D mark replaced the eagle photo (Dmytro's call, 2026-11-11): the hero's picture and its one moving thing.
         * Sized by width and by viewport height, so short screens keep the actions above the fold.
         */}

        <div className="@container flex flex-col items-center text-center">
          <div className="mt-(--space-6) flex flex-col items-center">
            <p className="type-lede">{t.hero.tagline}</p>
            <p className="rise-in type-body mt-(--space-3) max-w-184 text-fg-muted">{t.hero.subline}</p>
            <div className="mt-(--space-6) flex flex-wrap justify-center gap-3">
              <CopyEmailButton label={t.common.emailMe} icon="mail" />
              <a
                href="#work"
                className={buttonVariants({ variant: "secondary" })}
                onPointerEnter={() => setArrowHover(true)}
                onPointerLeave={() => setArrowHover(false)}
              >
                {t.hero.seeWork}
                <ArrowDown animate={arrowHover} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
