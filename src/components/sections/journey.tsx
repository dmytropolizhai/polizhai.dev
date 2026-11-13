import type { JourneyId, ProjectId } from "@content/site";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { lazy, Suspense, useRef, useState } from "react";
import { Mark } from "@/components/ui/mark";
import { Section } from "@/components/ui/section";
import { formatWhen } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";
import type { ResolvedJourneyEntry } from "@/sanity/lib/fetch";
import { cn } from "@/lib/utils";

// Lazy-load the project dialog on first user interaction to protect initial bundle budget.
const ProjectDialog = lazy(() =>
  import("@/components/sections/projects/project-dialog").then((m) => ({ default: m.ProjectDialog })),
);

/**
 * §4 Journey: the rail (Aceternity timeline's job, rebuilt in black and white).
 * A 1px --line rail; a 2px white fill grows with scroll, the only scroll-linked motion on the page.
 * Entries above the middle of the screen are lit. The rail ends in the mark. Dates stick on desktop.
 */

/** Consecutive entries with the same date share one sticky date. */
function groupByDate(entries: readonly ResolvedJourneyEntry[]): { when: string | null; entries: ResolvedJourneyEntry[] }[] {
  const groups: { when: string | null; entries: ResolvedJourneyEntry[] }[] = [];
  for (const entry of entries) {
    if (entry.status !== "visible") continue;
    const last = groups.at(-1);
    if (last && last.when === entry.when) last.entries.push(entry);
    else groups.push({ when: entry.when, entries: [entry] });
  }
  return groups;
}

function formatJourneyDate(when: string | null): string {
  if (!when) return "Origin";
  return formatWhen(when) ?? when;
}

/** Verified client-focused proof tags anchored to business outcomes. */
const proofBadges: Partial<Record<JourneyId, { label: string; live?: boolean }>> = {
  "data-pipeline": { label: "Upwork client" },
  systems: { label: "Low-level" },
  curio: { label: "Turnkey frontend" },
  stundio: { label: "Daily users", live: true },
  prolifts: { label: "3 languages · Live", live: true },
  numerologgi: { label: "Shipped early · Live", live: true },
  freelance: { label: "Open for projects" },
};

type JourneyEntryProps = {
  entry: ResolvedJourneyEntry;
  isProject: boolean;
  reduced: boolean;
  displayDate: string;
  onSelectProject: (id: ProjectId) => void;
};

function JourneyEntry({ entry, isProject, reduced, displayDate, onSelectProject }: JourneyEntryProps) {
  const ref = useRef<HTMLLIElement>(null);
  // Lit once its top has passed the middle of the screen, including when it is far above it.
  const passed = useInView(ref, { margin: "100000px 0px -50% 0px" });
  const lit = reduced || passed;
  const proof = proofBadges[entry.id as JourneyId];

  return (
    <li ref={ref} className="relative pb-(--space-12) last:pb-0">
      {/* On phones the date sits above the title. */}
      <time
        className={cn(
          "type-label type-num mb-2 block transition-colors duration-(--dur-component) md:hidden",
          lit ? "text-fg-muted" : "text-fg-subtle",
        )}
      >
        {displayDate}
      </time>
      <h3 className={cn("type-h3 transition-colors duration-(--dur-component)", lit ? "text-fg" : "text-fg-subtle")}>
        <span className="sr-only">{displayDate}: </span>
        {isProject ? (
          <button
            type="button"
            id={`journey-project-${entry.id}`}
            onClick={() => onSelectProject(entry.id as ProjectId)}
            className="cursor-pointer text-left underline decoration-control decoration-1 underline-offset-[0.2em] transition-colors hover:decoration-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
          >
            {entry.title}
          </button>
        ) : (
          entry.title
        )}
      </h3>
      {proof && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "type-label type-num inline-flex items-center gap-1.5 rounded-pill border border-line-strong px-2.5 py-0.5 transition-colors duration-(--dur-component)",
              lit ? "text-fg-muted" : "text-fg-subtle",
            )}
          >
            {proof.live && (
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full transition-colors duration-(--dur-component)",
                  lit ? "bg-fg" : "bg-fg-subtle",
                )}
                aria-hidden="true"
              />
            )}
            {proof.label}
          </span>
        </div>
      )}
      <p className={cn("type-body mt-2 max-w-[56ch] transition-colors duration-(--dur-component)", lit ? "text-fg-muted" : "text-fg-subtle")}>
        {entry.body}
      </p>
    </li>
  );
}

export function Journey() {
  const { journey, t, visibleProjects } = useSiteContent();
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start center", "end center"] });
  const markOpacity = useTransform(scrollYProgress, [0.9, 0.98], [0, 1]);
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);
  const [dialogMounted, setDialogMounted] = useState(false);

  const projectIds = new Set<string>(visibleProjects);
  const groups = groupByDate(journey);

  const handleSelectProject = (id: ProjectId) => {
    setDialogMounted(true);
    setActiveProject(id);
  };

  const handleCloseProject = () => {
    setActiveProject(null);
  };

  return (
    <Section id="journey" title={t.journey.heading} intro={t.journey.intro}>
      <div ref={railRef} className="relative pl-8 md:pl-0">
        {/* Rail: left edge on phones, after the date column on desktop. */}
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-line md:left-[calc(25%-0.5px)]">
          <motion.div
            className="absolute inset-x-[-0.5px] top-0 h-full origin-top bg-fg"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />
          <motion.div
            style={{ opacity: reduced ? 1 : markOpacity }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[1.5rem] text-fg"
          >
            <Mark />
          </motion.div>
        </div>

        <ol aria-label={t.a11y.timeline} className="m-0 list-none p-0">
          {groups.map((group, gi) => {
            const displayDate = formatJourneyDate(group.when);
            return (
              <li key={gi} className="pb-(--space-12) last:pb-0 md:grid md:grid-cols-4 md:gap-6">
                <div className="hidden md:block">
                  <time className="type-label type-num sticky top-[45vh] block pr-6 text-right text-fg-muted">
                    {displayDate}
                  </time>
                </div>
                <ol aria-label={displayDate} className="m-0 list-none p-0 md:col-span-3 md:pl-10">
                  {group.entries.map((entry) => (
                    <JourneyEntry
                      key={entry.id}
                      entry={entry}
                      isProject={projectIds.has(entry.id)}
                      displayDate={displayDate}
                      reduced={reduced}
                      onSelectProject={handleSelectProject}
                    />
                  ))}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>

      {dialogMounted && (
        <Suspense fallback={null}>
          <ProjectDialog
            id={activeProject}
            onClose={handleCloseProject}
            finalFocusTarget={(id) => document.getElementById(`journey-project-${id}`)}
          />
        </Suspense>
      )}
    </Section>
  );
}
