import type { JourneyId } from "@content/site";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { Mark } from "@/components/ui/mark";
import { Section } from "@/components/ui/section";
import { facts, formatWhen, t, visibleProjects } from "@/lib/content";
import { cn } from "@/lib/utils";

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
    if (last && last.when === value.when && last.when !== null) last.entries.push({ id, when: value.when });
    else groups.push({ when: value.when, entries: [{ id, when: value.when }] });
  }
  return groups;
}

const projectIds = new Set<string>(visibleProjects);

function JourneyEntry({ id, when, reduced }: Entry & { reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  // Lit once its top has passed the middle of the screen, including when it is far above it.
  const passed = useInView(ref, { margin: "100000px 0px -50% 0px" });
  const lit = reduced || passed;
  const copy = t.journey.entries[id];
  const date = formatWhen(when);

  return (
    <li ref={ref} className="relative pb-(--space-12) last:pb-0">
      {/* On phones the date sits above the title. */}
      <p className={cn("type-label type-num mb-2 md:hidden", lit ? "text-fg-muted" : "text-fg-subtle")}>
        {date ?? <span aria-hidden="true">&nbsp;</span>}
      </p>
      <h3 className={cn("type-h3 transition-colors duration-(--dur-component)", lit ? "text-fg" : "text-fg-subtle")}>
        {projectIds.has(id) ? (
          <a href={`#work-${id}`} className="underline decoration-control decoration-1 underline-offset-[0.2em] hover:decoration-fg">
            {copy.title}
          </a>
        ) : (
          copy.title
        )}
      </h3>
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
  const [ended, setEnded] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setEnded(v > 0.98));
  const groups = groupByDate();

  return (
    <Section id="journey" title={t.journey.heading} intro={t.journey.intro}>
      <div ref={railRef} role="group" aria-label={t.a11y.timeline} className="relative pl-8 md:pl-0">
        {/* Rail: left edge on phones, after the date column on desktop. */}
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-line md:left-[calc(25%-0.5px)]">
          <motion.div
            className="absolute inset-x-[-0.5px] top-0 h-full origin-top bg-fg"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />
          <Mark
            className={cn(
              "absolute -bottom-3 left-1/2 -translate-x-1/2 text-[1.5rem] text-fg transition-opacity duration-(--dur-component)",
              reduced || ended ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {groups.map((group, gi) => (
          <div key={gi} className="pb-(--space-12) last:pb-0 md:grid md:grid-cols-4 md:gap-6">
            <div className="hidden md:block">
              <p className="type-label type-num sticky top-[45vh] pr-6 text-right text-fg-muted">
                {formatWhen(group.when)}
              </p>
            </div>
            <ol className="md:col-span-3 md:pl-10">
              {group.entries.map((e) => (
                <JourneyEntry key={e.id} {...e} reduced={reduced} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Section>
  );
}
