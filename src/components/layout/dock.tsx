import Link from "next/link";
import { useSiteContent } from "@/lib/content-context";
import { useActiveSection } from "@/hooks/use-active-section";
import { Mark } from "@/components/ui/mark";
import { cn } from "@/lib/utils";

/**
 * Phone navigation (design-system §9 Dock, SmoothUI dock's job, rebuilt as text).
 * From md up the links live in the top bar (`SiteNav`). Fixed bottom centre, one pill on --raised. Current section: white label, mark under it,
 * aria-current="location". Present from first paint, never animates in.
 */
const CLEAR = ["top"] as const;

export function Dock() {
  const { facts, t, showClientQuote } = useSiteContent();
  const dockSections = showClientQuote
    ? facts.dock
    : facts.dock.filter((id) => id !== "reviews");
  const active = useActiveSection(dockSections, CLEAR);

  return (
    <nav
      aria-label={t.nav.label}
      className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-(--z-dock) flex justify-center px-2 md:hidden"
    >
      <ul className="flex h-(--dock-h) max-w-full items-center rounded-pill border border-line-strong bg-raised p-1">
        {dockSections.map((id) => {
          const current = active === id;
          return (
            <li key={id}>
              <Link
                href={`#${id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "relative flex h-11 items-center rounded-pill px-1.5 min-[360px]:px-2 text-[0.8125rem] font-bold text-fg-muted min-[480px]:px-4 min-[480px]:text-sm",
                  "transition-[color,background-color,translate] duration-(--dur-micro) ease-move",
                  "hover:bg-line hover:text-fg",
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
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
