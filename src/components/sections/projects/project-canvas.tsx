import { usePanCanvas, type CardLayout } from "@/hooks/use-pan-canvas";
import type { VisibleProjectId } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
import type { ProjectId } from "@content/site";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { ProjectCard } from "./project-card";

/**
 * The project canvas: a full-bleed surface under the hero band that the visitor drags in any
 * direction, wrapping forever, with tilted Liquid Glass screenshot cards on it. The site's signature
 * element. Named exceptions to the design system: tilt, free 2D drag and the rounded glass cards
 * (approved by Dmytro, 2026-11-11 and 2026-11-12). No frame.
 * The engine is `hooks/use-pan-canvas.ts`; this file owns the layout, the faces and the feel.
 */

/**
 * Repeating tile in layout units. The engine spreads positions by period / tile, where the period is
 * at least panel + card diagonal. A wide tile keeps horizontal spacing close to 1:1 px on desktop;
 * a short tile makes vertical spacing follow the panel height, so the ring fits 720px and 900px screens alike.
 */
const TILE = { w: 1900, h: 2000 } as const;

/** Every card is the same size, so none reads as the lead. Inset 16:10 shot plus the two-line caption plate. */
const CARD = { w: 320, h: 290 } as const;

type Placement = CardLayout & {
  /** Visible on the first screen at rest: the shot loads eagerly. */
  firstScreen: boolean;
  /** `object-position` for the 16:10 crop of a 2:1 shot (it only trims left and right). */
  crop?: string;
};

/**
 * One entry per visible project, so a newly visible project fails to compile until it is placed.
 * A loose ring around the empty centre of the rest view: two cards above it, one at each side and
 * one below. The upper pair shows whole at the fold, the side pair peeks, the lower card is one drag away.
 */
const LAYOUT = {
  prolifts: { x: -200, y: -155, ...CARD, rotate: -5, depth: 1, firstScreen: true, crop: "left" }, // headline starts at the left edge
  curio: { x: 200, y: -155, ...CARD, rotate: 4, depth: 1.04, firstScreen: true },
  numerologgi: { x: 560, y: 40, ...CARD, rotate: -3, depth: 0.95, firstScreen: false },
  stundio: { x: 0, y: 180, ...CARD, rotate: 3, depth: 0.97, firstScreen: false },
  zinly: { x: -560, y: 40, ...CARD, rotate: 5, depth: 1.02, firstScreen: false },
} as const satisfies Record<VisibleProjectId, Placement>;

const PRESS_SPRING = { stiffness: 380, damping: 38 } as const; // the system's spring

type Props = {
  onOpen: (id: ProjectId) => void;
  onHoverChange?: (over: boolean) => void;
  className?: string;
};

export function ProjectCanvas({ onOpen, onHoverChange, className }: Props) {
  const { t, visibleProjects } = useSiteContent();
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

  // Glare: writes --mx/--my on the hovered card from pointer events, never from the pan loop.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || reduced) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const move = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== "mouse") return;
      const card = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-card-id]") : null;
      if (!card) return;
      const box = card.getBoundingClientRect(); // the tilted card's bounds: close enough for a soft glare
      card.style.setProperty("--mx", `${(((e.clientX - box.left) / box.width) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(((e.clientY - box.top) / box.height) * 100).toFixed(1)}%`);
    };
    panel.addEventListener("pointermove", move);
    return () => panel.removeEventListener("pointermove", move);
  }, [panelRef, reduced]);

  // Deep link: `#work-<id>` (Journey links) brings the canvas into view, centres the card and opens it.
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const visibleProjectsRef = useRef(visibleProjects);
  visibleProjectsRef.current = visibleProjects;
  useEffect(() => {
    const follow = () => {
      const id = location.hash.slice("#work-".length);
      if (!location.hash.startsWith("#work-") || !(visibleProjectsRef.current as readonly string[]).includes(id)) return;
      panelRef.current?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
      centre(id as VisibleProjectId);
      onOpenRef.current(id as VisibleProjectId);
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, [centre, panelRef, reduced]);

  return (
    <section
      ref={panelRef}
      id="work"
      tabIndex={-1}
      aria-labelledby="work-canvas-title"
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      className={cn(
        "group/canvas relative h-[clamp(32rem,85svh,60rem)] w-full overflow-clip select-none",
        // Touch: vertical swipes scroll the page, horizontal swipes pan. Fine pointers: full 2D drag.
        "touch-pan-y pointer-fine:touch-none",
        "pointer-fine:cursor-grab pointer-fine:data-dragging:cursor-grabbing",
        className,
      )}
    >
      <h2 id="work-canvas-title" className="sr-only">
        {t.work.canvasTitle}
      </h2>

      <motion.ul style={{ scale }} className="absolute inset-0 m-0 list-none p-0">
        {visibleProjects.filter((id) => id in LAYOUT).map((id) => (
          <Card key={id} id={id} layout={LAYOUT[id]} cardRef={cardRef(id)} onOpen={onOpen} />
        ))}
      </motion.ul>

      {/* Bottom edge fades into the page (an overlay, not a mask: a mask would make the panel a backdrop
          root and blind the glass). No top fade: the band above carries grain, so a --bg fade drew a seam. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-(--space-12) bg-linear-to-t from-bg to-transparent" />

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
  id: VisibleProjectId;
  layout: Placement;
  cardRef: (el: HTMLElement | null) => void;
  onOpen: (id: ProjectId) => void;
}) {
  // Size follows the panel through --canvas-k, written by the engine on resize.
  // The <li> is the size container, so the face's cqw units (padding included) follow the card.
  const size = {
    width: `calc(${layout.w}px * var(--canvas-k, 1))`,
    height: `calc(${layout.h}px * var(--canvas-k, 1))`,
    containerType: "inline-size",
  } satisfies CSSProperties;
  return (
    <li ref={cardRef} className="absolute top-1/2 left-1/2 will-change-transform" style={size}>
      <ProjectCard
        id={id}
        anchorId={`work-${id}`}
        onOpen={onOpen}
        crop={layout.crop}
        eager={layout.firstScreen}
        className="cursor-[inherit]"
      />
    </li>
  );
}

/**
 * "Drag" over empty space, "View" over a card. Fine hover pointers only; follows the pointer by
 * writing its transform directly, no React state. Decorative: the cards carry their own names.
 */
function CursorPill() {
  const { t } = useSiteContent();
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
