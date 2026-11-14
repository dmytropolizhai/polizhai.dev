import Link from "next/link";
import { AssistantTrigger } from "@/components/assistant/assistant-trigger";
import { Mark } from "@/components/ui/mark";
import { useActiveSection } from "@/hooks/use-active-section";
import { useSiteContent } from "@/lib/content-context";
import { NAV_CLEAR_SECTIONS, useDockSections } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Phone navigation (design-system §9 Dock, SmoothUI dock's job, rebuilt as text).
 * From md up the links live in the top bar (`SiteNav`). Fixed bottom centre, one pill on --raised. Current section: white label, mark under it,
 * aria-current="location". Present from first paint, never animates in.
 */
export function Dock() {
  const { t } = useSiteContent();
  const dockSections = useDockSections();
  const active = useActiveSection(dockSections, NAV_CLEAR_SECTIONS);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-(--z-dock) flex items-center justify-center gap-2 px-2 md:inset-x-auto md:right-6 md:bottom-6 md:px-0">
      <nav aria-label={t.nav.label} className="pointer-events-auto max-w-full min-w-0 md:hidden">
        <ul className="flex h-(--dock-h) max-w-full items-center overflow-x-auto rounded-pill border border-line-strong bg-raised p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {dockSections.map((id) => {
            const current = active === id;
            return (
              <li key={id} className="shrink-0">
                <Link
                  href={`#${id}`}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "relative flex h-11 items-center rounded-pill px-2 text-[0.8125rem] font-bold whitespace-nowrap text-fg-muted min-[480px]:px-4 min-[480px]:text-sm",
                    "transition-[color,background-color,translate] duration-(--dur-micro) ease-move",
                    "hover:bg-line hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inverse",
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
      <AssistantTrigger />
    </div>
  );
}
