import { SectionTitle } from "@/components/ui/section";
import { usePanCanvas, type CardLayout } from "@/hooks/use-pan-canvas";
import { facts, t } from "@/lib/content";
import { pendingCopy, shots } from "@/lib/pending";
import { cn } from "@/lib/utils";
import type { ProjectId, ProjectStatus } from "@content/site";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";

/**
 * "Explore the projects": a rounded panel holding a surface the visitor drags in any direction,
 * wrapping forever, with tilted project cards on it. The site's signature element.
 * Named exception to the design system: tilt, sideways motion and a rounded panel (approved by Dmytro).
 * The engine is `hooks/use-pan-canvas.ts`; this file owns the layout, the faces and the feel.
 */

/** Repeating tile in layout units. Cards are placed inside ±tile/2; it is centred on the panel at rest. */
const TILE = { w: 1700, h: 1200 } as const;

/**
 * One entry per project, so a new project fails to compile until it is placed.
 * Cards lie on the surface like papers on a table: small, mixed rotations so the text stays readable.
 * The rest view (about 1170 × 640 at 1280px wide) shows prolifts, stundio and curio side by side;
 * stundio sits at the centre so a phone sees it whole. The other three wait around the edges.
 */
const LAYOUT = {
  prolifts: { x: -380, y: 70, w: 330, h: 280, rotate: -7, depth: 1 },
  stundio: { x: 0, y: -30, w: 330, h: 280, rotate: 4, depth: 0.96 },
  curio: { x: 380, y: 60, w: 330, h: 280, rotate: -3, depth: 1.04 },
  numerologgi: { x: -150, y: -480, w: 330, h: 280, rotate: 6, depth: 0.93 },
  "one-to-one": { x: 650, y: -400, w: 330, h: 280, rotate: -5, depth: 1.07 },
  dnf: { x: 250, y: 480, w: 330, h: 280, rotate: 8, depth: 0.98 },
} as const satisfies Record<ProjectId, CardLayout>;

const PRESS_SPRING = { stiffness: 380, damping: 38 } as const; // the system's spring

const projects = (Object.keys(facts.projects) as ProjectId[]).filter(
  (id) => (facts.projects[id].status as ProjectStatus) !== "hidden",
);

/** A single screenshot for the face, when one exists. Multi-shot projects use the first. */
function faceShot(id: ProjectId): string | null {
  const shot: unknown = (shots as Record<string, unknown>)[id];
  if (typeof shot === "string") return shot;
  if (Array.isArray(shot) && typeof shot[0] === "string") return shot[0];
  return null;
}

type Props = {
  onOpen: (id: ProjectId) => void;
  onHoverChange?: (over: boolean) => void;
  className?: string;
};

export function ProjectCanvas({ onOpen, onHoverChange, className }: Props) {
  const reduced = useReducedMotion() ?? false;
  const scale = useSpring(1, PRESS_SPRING);

  const { panelRef, cardRef, centre } = usePanCanvas({
    layout: LAYOUT,
    tile: TILE,
    reduced,
    onPressChange: (pressed) => {
      if (reduced) return;
      scale.set(pressed ? 0.97 : 1);
    },
  });

  // Deep link: `#work-<id>` (Journey links) brings the panel into view, centres the card and opens it.
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  useEffect(() => {
    const follow = () => {
      const id = location.hash.slice("#work-".length) as ProjectId;
      if (!location.hash.startsWith("#work-") || !projects.includes(id)) return;
      panelRef.current?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
      centre(id);
      onOpenRef.current(id);
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, [centre, panelRef, reduced]);

  return (
    <section
      ref={panelRef}
      id="work"
      aria-labelledby="work-canvas-title"
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      className={cn(
        "group/canvas relative h-[clamp(28rem,80svh,48rem)] w-full overflow-clip rounded-panel bg-raised select-none",
        // Touch: vertical swipes scroll the page, horizontal swipes pan. Fine pointers: full 2D drag.
        "touch-pan-y pointer-fine:touch-none",
        "pointer-fine:cursor-grab pointer-fine:data-dragging:cursor-grabbing",
        className,
      )}
    >
      <SectionTitle
        id="work-canvas-title"
        className="pointer-events-none absolute top-(--space-6) left-(--space-6) z-10 max-w-[9ch] text-left mix-blend-difference md:top-(--space-8) md:left-(--space-12)"
      >
        {t.work.canvasTitle}
      </SectionTitle>

      <motion.ul style={{ scale }} className="absolute inset-0 m-0 list-none p-0">
        {projects.map((id) => (
          <Card key={id} id={id} layout={LAYOUT[id]} cardRef={cardRef(id)} onOpen={onOpen} />
        ))}
      </motion.ul>

      <CursorPill />
    </section>
  );
}

function Card({
  id,
  layout,
  cardRef,
  onOpen,
}: {
  id: ProjectId;
  layout: CardLayout;
  cardRef: (el: HTMLElement | null) => void;
  onOpen: (id: ProjectId) => void;
}) {
  const shot = faceShot(id);
  const name = facts.projects[id].name;
  const copy = t.work.projects[id];
  const showOutcome = pendingCopy.projectOutcome.show;
  // Size follows the panel through --canvas-k, written by the engine on resize.
  // The <li> is the size container, so the face's cqw units (padding included) follow the card.
  const size = {
    width: `calc(${layout.w}px * var(--canvas-k, 1))`,
    height: `calc(${layout.h}px * var(--canvas-k, 1))`,
    containerType: "inline-size",
  } satisfies CSSProperties;

  return (
    <li ref={cardRef} className="absolute top-1/2 left-1/2 will-change-transform" style={size}>
      <button
        type="button"
        id={`work-${id}`}
        data-card-id={id}
        onClick={() => onOpen(id)}
        // A card lying on the surface: flat paper, a soft contact shadow and a wider cast one.
        className="relative flex size-full cursor-[inherit] flex-col overflow-hidden bg-canvas-card p-[6cqw] text-left text-black shadow-[0_1px_2px_rgb(0_0_0/0.35),0_18px_36px_-14px_rgb(0_0_0/0.7)] outline-offset-4"
      >
        {shot && <img src={shot} alt="" draggable={false} className="-mx-[6cqw] -mt-[6cqw] mb-[4cqw] aspect-16/9 w-[calc(100%+12cqw)] object-cover" />}
        <span className="type-label block text-[max(0.6875rem,3.8cqw)] text-black/60">{copy.kindLabel}</span>
        <span className="mt-[1.5cqw] block text-[max(1.25rem,8.5cqw)] leading-none font-bold tracking-[-0.03em]">{name}</span>
        <span className="mt-[3cqw] line-clamp-4 block text-[max(0.75rem,4.4cqw)] leading-[1.35] text-black/75">{copy.oneLiner}</span>
        {showOutcome && (
          <span className="mt-auto block border-t border-black/15 pt-[3cqw]">
            <span className="type-label block text-[max(0.6875rem,3.6cqw)] text-black/60">{t.work.outcomeLabel}</span>
            <span className="mt-[1cqw] line-clamp-2 block text-[max(0.75rem,4.4cqw)] leading-[1.3] font-semibold">{copy.outcome}</span>
          </span>
        )}
      </button>
    </li>
  );
}

/**
 * "Drag" over empty space, "View" over a card. Fine hover pointers only; follows the pointer by
 * writing its transform directly, no React state. Decorative: the cards carry their own names.
 */
function CursorPill() {
  const ref = useRef<HTMLDivElement>(null);

  const attach = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
    const panel = el?.parentElement;
    if (!el || !panel) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");

    const move = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== "mouse") return;
      const box = panel.getBoundingClientRect(); // pointer events only, never in the canvas loop
      el.style.transform = `translate3d(${e.clientX - box.left}px, ${e.clientY - box.top}px, 0) translate(0.75rem, 0.75rem)`;
      el.dataset.on = "";
      const overCard = e.target instanceof Element && e.target.closest("[data-card-id]") !== null;
      if (overCard) el.dataset.card = "";
      else delete el.dataset.card;
    };
    const leave = () => delete el.dataset.on;

    panel.addEventListener("pointermove", move);
    panel.addEventListener("pointerleave", leave);
    return () => {
      panel.removeEventListener("pointermove", move);
      panel.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={attach}
      aria-hidden="true"
      className="group/pill pointer-events-none absolute top-0 left-0 z-20 hidden rounded-pill bg-inverse px-3 py-1.5 text-label font-bold text-on-inverse opacity-0 transition-opacity duration-(--dur-micro) data-on:opacity-100 pointer-fine:block"
    >
      <span className="group-data-card/pill:hidden">{t.work.cursor.drag}</span>
      <span className="hidden group-data-card/pill:inline">{t.work.cursor.view}</span>
    </div>
  );
}
