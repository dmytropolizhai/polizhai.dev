import type { JourneyId, ProjectId } from "@content/site";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { lazy, Suspense, useRef, useState } from "react";
import { Mark } from "@/components/ui/mark";
import { Section } from "@/components/ui/section";
import { facts, formatWhen, t, visibleProjects } from "@/lib/content";
import { cn } from "@/lib/utils";

// Lazy-load the project dialog on first user interaction to protect initial bundle budget.
const ProjectDialog = lazy(() =>
  import("@/components/sections/work/project-dialog").then((m) => ({ default: m.ProjectDialog })),
);

/**
 * §4 Journey: the rail (Aceternity timeline's job, rebuilt in black and white).
 * A 1px --line rail; a 2px white fill grows with scroll, the only scroll-linked motion on the page.
 * Entries above the middle of the screen are lit. The rail ends in the mark. Dates stick on desktop.
 */

type Entry = { id: JourneyId; when: string | null };

/** Consecutive entries with the same date share one sticky date. */
function groupByDate(): { when: string | null; entries: Entry[] }[] {
  const groups: { when: string | null; entries: Entry[] }[] = [];
  for (const [id, value] of Object.entries(facts.journey) as [JourneyId, (typeof facts.journey)[JourneyId]][]) {
    if (value.status !== "visible") continue;
    const last = groups.at(-1);
    if (last && last.when === value.when) last.entries.push({ id, when: value.when });
    else groups.push({ when: value.when, entries: [{ id, when: value.when }] });
  }
  return groups;
}

const projectIds = new Set<string>(visibleProjects);

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

type JourneyEntryProps = Entry & {
  reduced: boolean;
  displayDate: string;
  onSelectProject: (id: ProjectId) => void;
};

function JourneyEntry({ id, reduced, displayDate, onSelectProject }: JourneyEntryProps) {
  const ref = useRef<HTMLLIElement>(null);
  // Lit once its top has passed the middle of the screen, including when it is far above it.
  const passed = useInView(ref, { margin: "100000px 0px -50% 0px" });
  const lit = reduced || passed;
  const copy = t.journey.entries[id];
  const isProject = projectIds.has(id);
  const proof = proofBadges[id];

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
            id={`journey-project-${id}`}
            onClick={() => onSelectProject(id as ProjectId)}
            className="cursor-pointer text-left underline decoration-control decoration-1 underline-offset-[0.2em] transition-colors hover:decoration-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
          >
            {copy.title}
          </button>
        ) : (
          copy.title
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
      <p className={cn("type-body mt-2 transition-colors duration-(--dur-component)", lit ? "text-fg-muted" : "text-fg-subtle")}>
        {copy.body}
      </p>
    </li>
  );
}

export function Journey() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start center", "end center"] });
  const markOpacity = useTransform(scrollYProgress, [0.9, 0.98], [0, 1]);
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);
  const [dialogMounted, setDialogMounted] = useState(false);

  const groups = groupByDate();

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
                  {group.entries.map((e) => (
                    <JourneyEntry
                      key={e.id}
                      {...e}
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
