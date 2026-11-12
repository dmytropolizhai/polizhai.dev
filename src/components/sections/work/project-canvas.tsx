import { usePanCanvas, type CardLayout } from "@/hooks/use-pan-canvas";
import { Mark } from "@/components/ui/mark";
import { facts, t, visibleProjects, type VisibleProjectId } from "@/lib/content";
import { shots } from "@/lib/pending";
import { cn } from "@/lib/utils";
import type { ProjectId } from "@content/site";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { ShotPlaceholder } from "./project-parts";

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

/**
 * Phone tile (below 640px, where the engine's k is its 0.8 floor and the panel is a fixed 32.5rem tall):
 * sized so the period equals the tile, i.e. layout units map to px / 0.8 with no spreading.
 * w: 1300 * 0.8 = 1040 >= 640 + diagonal. h: (520 + hypot(320, 290) * 0.8) / 0.8 = 1082.
 */
const TILE_NARROW = { w: 1300, h: 1082 } as const;

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

/**
 * Phone rest view (390px wide: a card is 256px): one card whole and centred right under the CTAs,
 * a second peeking below it, the other three waiting out to the sides (beyond +-335px from the centre).
 */
const LAYOUT_NARROW = {
  prolifts: { x: 0, y: -155, ...CARD, rotate: -4, depth: 1, firstScreen: true, crop: "left" },
  curio: { x: 22, y: 190, ...CARD, rotate: 3, depth: 1.04, firstScreen: true },
  numerologgi: { x: 600, y: -40, ...CARD, rotate: -3, depth: 0.95, firstScreen: false },
  stundio: { x: 600, y: 330, ...CARD, rotate: 3, depth: 0.97, firstScreen: false },
  zinly: { x: -600, y: 80, ...CARD, rotate: 5, depth: 1.02, firstScreen: false },
} as const satisfies Record<VisibleProjectId, Placement>;

/** Same breakpoint as Tailwind's `sm`, so `max-sm:` classes and the layout switch together. */
const NARROW_QUERY = "(max-width: 639.98px)";
const subscribeNarrow = (notify: () => void) => {
  const mq = matchMedia(NARROW_QUERY);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const isNarrow = () => matchMedia(NARROW_QUERY).matches;

const PRESS_SPRING = { stiffness: 380, damping: 38 } as const; // the system's spring

const isVisibleProject = (id: string): id is VisibleProjectId => (visibleProjects as readonly string[]).includes(id);

type Props = {
  onOpen: (id: ProjectId) => void;
  onHoverChange?: (over: boolean) => void;
  className?: string;
};

export function ProjectCanvas({ onOpen, onHoverChange, className }: Props) {
  const reduced = useReducedMotion() ?? false;
  const scale = useSpring(1, PRESS_SPRING);

  const narrow = useSyncExternalStore(subscribeNarrow, isNarrow, () => false);
  const layout: Readonly<Record<VisibleProjectId, Placement>> = narrow ? LAYOUT_NARROW : LAYOUT;

  const { panelRef, cardRef, centre } = usePanCanvas({
    layout,
    tile: narrow ? TILE_NARROW : TILE,
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
  useEffect(() => {
    const follow = () => {
      const id = location.hash.slice("#work-".length);
      if (!location.hash.startsWith("#work-") || !isVisibleProject(id)) return;
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
      tabIndex={-1}
      aria-labelledby="work-canvas-title"
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      className={cn(
        "group/canvas relative h-[clamp(32rem,85svh,60rem)] w-full max-sm:h-[32.5rem] overflow-clip select-none",
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
        {visibleProjects.map((id) => (
          <Card key={id} id={id} layout={layout[id]} cardRef={cardRef(id)} onOpen={onOpen} />
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
  const shot = shots.projects[id];
  const project = facts.projects[id];
  // Size follows the panel through --canvas-k, written by the engine on resize.
  // The <li> is the size container, so the face's cqw units (padding included) follow the card.
  const size = {
    width: `calc(${layout.w}px * var(--canvas-k, 1))`,
    height: `calc(${layout.h}px * var(--canvas-k, 1))`,
    containerType: "inline-size",
  } satisfies CSSProperties;
  const lazy = !layout.firstScreen;

  return (
    <li ref={cardRef} className="absolute top-1/2 left-1/2 will-change-transform" style={size}>
      <button
        type="button"
        id={`work-${id}`}
        data-card-id={id}
        onClick={() => onOpen(id)}
        // Liquid Glass (Dmytro, 2026-11-12): see .glass-card in index.css.
        className="glass-card size-full cursor-[inherit] text-left outline-offset-4"
      >
        {shot ? (
          <picture className="glass-shot">
            <source type="image/avif" srcSet={`${shot}.avif`} />
            <img
              src={`${shot}.webp`}
              alt=""
              width={shots.projectSize.w}
              height={shots.projectSize.h}
              draggable={false}
              loading={lazy ? "lazy" : "eager"}
              decoding="async"
              className="size-full object-cover"
              style={layout.crop ? { objectPosition: layout.crop } : undefined}
            />
          </picture>
        ) : (
          <ShotPlaceholder label="screenshot · 16:10" className="glass-shot" />
        )}
        <span className="glass-plate flex flex-col justify-center px-[4.5cqw] py-[3cqw]">
          <span className="block truncate text-[max(1.125rem,8.5cqw)] leading-none font-bold tracking-[-0.03em] text-white">
            {project.name}
          </span>
          <span className="mt-[2.5cqw] flex min-w-0 items-center gap-[2cqw] text-[max(0.75rem,4.2cqw)] leading-[1.3] text-white">
            {project.status === "live" && (
              <>
                <Mark className="text-white" />
                <span className="sr-only">{t.common.statusLabels.live}, </span>
              </>
            )}
            <span className="truncate">{project.display}</span>
          </span>
        </span>
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
