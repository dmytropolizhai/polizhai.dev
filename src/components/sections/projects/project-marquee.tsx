import { Marquee } from "@/components/ui/marquee";
import type { VisibleProjectId } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
import type { ProjectId } from "@content/site";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { ProjectCard } from "./project-card";

/** Crops for the 16:10 shot, as on the canvas. */
const CROP: Partial<Record<VisibleProjectId, string>> = { prolifts: "left" };

const SPEED = 28; // px per second
const RESUME_MS = 2200; // idle time after a touch before the drift starts again

/**
 * Drift plus manual scroll: the strip is a native horizontal scroller (swipe, momentum, a11y), and a rAF
 * loop nudges it along until the visitor touches it. The two loop copies are one group wide, so
 * jumping by a group width is invisible: that keeps it endless in both directions.
 */
function useDrift(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const group = () => (el.firstElementChild as HTMLElement).offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
    const wrap = () => {
      const w = group();
      // Keep the position in the middle band [0.5w, 1.5w]: a w jump shows identical content, and
      // the band leaves room to scroll either way before the next jump.
      if (el.scrollLeft > w * 1.5) el.scrollLeft -= w;
      else if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
    };
    el.scrollLeft = group(); // start one group in, so a right swipe has content to reveal
    el.addEventListener("scroll", wrap, { passive: true });

    let held = false;
    let resumeAt = 0;
    const hold = () => {
      held = true;
    };
    const release = () => {
      held = false;
      resumeAt = performance.now() + RESUME_MS;
    };
    el.addEventListener("pointerdown", hold, { passive: true });
    el.addEventListener("pointerup", release, { passive: true });
    el.addEventListener("pointercancel", release, { passive: true });
    el.addEventListener("wheel", release, { passive: true });

    let raf = 0;
    let last = 0;
    let pos = el.scrollLeft;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (held || now < resumeAt || Math.abs(pos - el.scrollLeft) > 2) pos = el.scrollLeft; // also after a loop wrap
      else {
        pos += SPEED * dt;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    // Only while on screen and the tab is visible.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (enabled && e?.isIntersecting && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", wrap);
      el.removeEventListener("pointerdown", hold);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("wheel", release);
    };
  }, [ref, enabled]);
}

type Props = { onOpen: (id: ProjectId) => void; className?: string };

/**
 * Phone showcase (below 640px): the projects drift past in a marquee you can also swipe, instead of
 * the draggable canvas. Tapping a card opens the dialog. Reduced motion: no drift, a plain swipeable row.
 */
export function ProjectMarquee({ onOpen, className }: Props) {
  const { t, visibleProjects } = useSiteContent();
  // Deep link: `#work-<id>` (Journey links) scrolls here and opens the project.
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const visibleProjectsRef = useRef(visibleProjects);
  visibleProjectsRef.current = visibleProjects;
  const ref = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  useDrift(stripRef, !reduced);
  useEffect(() => {
    const follow = () => {
      const id = location.hash.slice("#work-".length);
      if (!location.hash.startsWith("#work-") || !(visibleProjectsRef.current as readonly string[]).includes(id)) return;
      ref.current?.scrollIntoView({ block: "center" });
      onOpenRef.current(id as VisibleProjectId);
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, []);

  return (
    <section ref={ref} id="work" tabIndex={-1} aria-labelledby="work-canvas-title" className={cn("relative w-full", className)}>
      <h2 id="work-canvas-title" className="sr-only">
        {t.work.canvasTitle}
      </h2>
      <Marquee
        ref={stripRef}
        repeat={2}
        // Native horizontal scroll; the drift is JS, so the CSS marquee animation is off.
        className="touch-pan-x overflow-x-auto overscroll-x-contain py-(--space-6) [--gap:1rem] [scrollbar-width:none] *:animate-none [&::-webkit-scrollbar]:hidden"
      >
        {visibleProjects.map((id, i) => (
          <div key={id} className="h-84 w-64 shrink-0 [container-type:inline-size]">
            <ProjectCard id={id} onOpen={onOpen} crop={CROP[id]} eager={i < 2} describe />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
