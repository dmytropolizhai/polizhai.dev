import { facts, t } from "@/lib/content";
import { useActiveSection } from "@/hooks/use-active-section";
import { Mark } from "@/components/ui/mark";
import { cn } from "@/lib/utils";

/**
 * The only navigation (design-system §9 Dock, SmoothUI dock's job, rebuilt as text).
 * Fixed bottom centre, one pill on --raised. Current section: white label, mark under it,
 * aria-current="location". Present from first paint, never animates in.
 */
const CLEAR = ["top", "client"] as const;

export function Dock() {
  const active = useActiveSection(facts.dock, CLEAR);

  return (
    <nav
      aria-label={t.nav.label}
      className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-(--z-dock) flex justify-center px-2 md:top-4 md:bottom-auto"
    >
      <ul className="flex h-(--dock-h) items-center rounded-pill border border-line-strong bg-raised p-1">
        {facts.dock.map((id) => {
          const current = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "relative flex h-11 items-center rounded-pill px-2 text-[0.8125rem] font-bold text-fg-muted min-[480px]:px-4 min-[480px]:text-sm",
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
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
