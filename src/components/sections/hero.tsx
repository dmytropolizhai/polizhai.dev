import { ArrowDown } from "@/components/animate-ui/icons/arrow-down";
import { Mark3D } from "@/components/effects/mark-3d";
import { buttonVariants } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { facts, hrefOf, isTbd, t } from "@/lib/content";
import { useState } from "react";

/** §1 The name poster. Full height: the 3D mark is the picture, the H1 is the LCP. */
export function Hero() {
  const [given, family] = [facts.person.givenName, facts.person.familyName];
  const customers = facts.customers.filter((c) => c.status === "visible");
  // Mixed logos and names look broken, so names stand in until every logo exists.
  const allLogos = customers.every((c) => !isTbd(c.logo));
  const [arrowHover, setArrowHover] = useState(false);

  return (
    <header id="top" className="texture-grain relative flex min-h-svh flex-col overflow-hidden">
      <div className="container-site relative z-(--z-content) flex flex-1 flex-col pt-(--nav-h) pb-[calc(var(--dock-h)+2.5rem)] md:pb-(--space-8)">
        {/*
         * The 3D mark replaced the eagle photo (Dmytro's call, 2026-11-11): the hero's picture and its one moving thing.
         * Sized by width and by viewport height, so short screens keep the actions above the fold.
         */}
        <div className="flex flex-1 items-center justify-center py-(--space-8)">
          <Mark3D className="w-[clamp(170px,min(26vw,38svh),440px)]" />
        </div>

        <div className="@container flex flex-col items-center text-center">

          {/* One line from md up (the reference's single poster word), two lines on phones. */}
          <h1 className="type-display text-[16.5cqw] md:text-[8.3cqw] md:whitespace-nowrap">
            {given}
            <br className="md:hidden" /> {family}
          </h1>

          <div className="mt-(--space-6) flex flex-col items-center">
            <p className="type-lede">{t.hero.tagline}</p>
            <p className="rise-in type-body mt-(--space-3) max-w-[46rem] text-fg-muted">{t.hero.subline}</p>
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

          {/* The bottom edge of the poster: print credits on a hairline. */}
          <div className="mt-(--space-8) flex w-full flex-col gap-3 self-stretch border-t border-line pt-(--space-4) text-left md:flex-row md:items-center md:justify-between">
            <p className="type-label text-fg-muted">{t.hero.customers.label}</p>
            <ul aria-label={t.a11y.customersList} className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {customers.map((c) => {
                const href = hrefOf(c.href);
                const logo = allLogos ? c.logo : null;
                const content = logo ? (
                  <img src={logo} alt={c.name} className="h-5 w-auto" />
                ) : (
                  <span className="text-sm font-black tracking-tight uppercase [font-stretch:125%]">{c.name}</span>
                );
                return (
                  <li key={c.name} className="opacity-60 transition-opacity duration-(--dur-micro) hover:opacity-100">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                        {content}
                        <span className="sr-only"> ({t.a11y.externalLink})</span>
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
