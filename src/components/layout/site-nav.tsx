import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Lockup } from "@/components/ui/lockup";
import { Mark } from "@/components/ui/mark";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled } from "@/hooks/use-scrolled";
import { useSiteContent } from "@/lib/content-context";
import { NAV_CLEAR_SECTIONS, useDockSections } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

/**
 * Top bar: lockup · section links · action (Dmytro, 2026-11-11).
 * At the top the bar is transparent and its parts are pills. Once the page scrolls, the bar turns
 * solid (--bg + hairline) and every part inside it goes flat: transparent fill, square corners.
 * Links live here from md up; phones keep the bottom dock for them.
 */
export function SiteNav() {
  const { letsTalkLabel, t } = useSiteContent();
  const dockSections = useDockSections();
  const links = dockSections.filter((id) => id !== "contact");
  const { scrolled, sentinel } = useScrolled();
  const active = useActiveSection(dockSections, NAV_CLEAR_SECTIONS);

  return (
    <>
      {sentinel}
      <header
        data-scrolled={scrolled || undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-(--z-dock) border-b transition-[background-color,border-color] duration-(--dur-component) ease-move",
          // Transparent at the top: the empty parts of the bar let the pointer through to the hero
          // canvas beneath it (drag works up to the edge). The solid bar, once scrolled, blocks as it looks.
          scrolled ? "border-line bg-bg" : "pointer-events-none border-transparent bg-transparent",
        )}
      >
        <div className="container-site flex h-(--nav-h) items-center justify-between gap-2 min-[360px]:gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          <Link
            href="#top"
            aria-label={t.nav.sections.top.label}
            className="pointer-events-auto inline-flex min-h-11 shrink-0 items-center justify-self-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse"
          >
            <Lockup className="h-[1.125rem] w-auto min-[360px]:h-5 sm:h-6" />
          </Link>

          <nav aria-label={t.nav.label} className="pointer-events-auto hidden justify-self-center md:block">
            <ul
              className={cn(
                "flex h-(--dock-h) items-center border p-1 transition-[background-color,border-color,border-radius] duration-(--dur-component) ease-move",
                scrolled ? "rounded-none border-transparent bg-transparent" : "rounded-pill border-line-strong bg-raised",
              )}
            >
              {links.map((id) => {
                const current = active === id;
                return (
                  <li key={id}>
                    <Link
                      href={`#${id}`}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "relative flex h-11 items-center px-3 text-sm font-bold whitespace-nowrap text-fg-muted transition-[color,background-color,border-radius] duration-(--dur-micro) ease-move hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse lg:px-4",
                        scrolled ? "rounded-none hover:bg-raised" : "rounded-pill hover:bg-line",
                        current && "text-fg",
                      )}
                    >
                      {t.nav.sections[id].short}
                      {current && (
                        <>
                          <Mark className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[0.625rem]" />
                          <span className="sr-only">, {t.a11y.currentSection}</span>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Dock surface at the top; on scroll it flattens to square corners while keeping a visible border as the primary conversion CTA. */}
          <div className="flex items-center gap-1.5 justify-self-end md:gap-2">
            <LanguageSwitcher scrolled={scrolled} />
            <Link
              href="#contact"
              aria-current={active === "contact" ? "location" : undefined}
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "pointer-events-auto relative px-3.5 transition-[background-color,border-color,border-radius,color] duration-(--dur-component) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse min-[360px]:px-4 sm:px-6",
                scrolled && "rounded-none border-control bg-transparent text-fg hover:bg-raised hover:text-fg",
                active === "contact" && "text-fg",
              )}
            >
              {letsTalkLabel}
              {active === "contact" && (
                <>
                  <Mark className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[0.625rem]" />
                  <span className="sr-only">, {t.a11y.currentSection}</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
