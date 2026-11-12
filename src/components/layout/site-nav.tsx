import { buttonVariants } from "@/components/ui/button";
import { Lockup } from "@/components/ui/lockup";
import { Mark } from "@/components/ui/mark";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled } from "@/hooks/use-scrolled";
import { facts, letsTalkLabel, t } from "@/lib/content";
import { cn } from "@/lib/utils";

const CLEAR = ["top", "client"] as const;
/** The action button covers Contact, so the bar links stop at About. */
const LINKS = facts.dock.filter((id) => id !== "contact");

/**
 * Top bar: lockup · section links · action (Dmytro, 2026-11-11).
 * At the top the bar is transparent and its parts are pills. Once the page scrolls, the bar turns
 * solid (--bg + hairline) and every part inside it goes flat: transparent fill, square corners.
 * Links live here from md up; phones keep the bottom dock for them.
 */
export function SiteNav() {
  const { scrolled, sentinel } = useScrolled();
  const active = useActiveSection(facts.dock, CLEAR);

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
        <div className="container-site flex h-(--nav-h) items-center justify-between gap-4">
          <a href="#top" className="pointer-events-auto inline-flex min-h-11 shrink-0 items-center">
            <Lockup className="h-[18px] w-auto" />
          </a>

          <nav aria-label={t.nav.label} className="pointer-events-auto hidden md:block">
            <ul
              className={cn(
                "flex h-(--dock-h) items-center border p-1 transition-[background-color,border-color,border-radius] duration-(--dur-component) ease-move",
                scrolled ? "rounded-none border-transparent bg-transparent" : "rounded-pill border-line-strong bg-raised",
              )}
            >
              {LINKS.map((id) => {
                const current = active === id;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "relative flex h-11 items-center px-4 text-sm font-bold text-fg-muted transition-[color,background-color,border-radius] duration-(--dur-micro) ease-move hover:text-fg",
                        scrolled ? "rounded-none" : "rounded-pill hover:bg-line",
                        current && "text-fg",
                      )}
                    >
                      {t.nav.sections[id].short}
                      {current && (
                        <>
                          <Mark className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[0.75rem]" />
                          <span className="sr-only">, {t.a11y.currentSection}</span>
                        </>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Dock surface at the top; on scroll it drops its fill like everything else in the bar. */}
          <a
            href="#contact"
            aria-current={active === "contact" ? "location" : undefined}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "pointer-events-auto transition-[background-color,border-color,border-radius,color] duration-(--dur-component)",
              scrolled && "bg-transparent hover:bg-transparent",
            )}
          >
            {letsTalkLabel}
          </a>
        </div>
      </header>
    </>
  );
}
