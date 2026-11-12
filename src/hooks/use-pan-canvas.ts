import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/**
 * An infinite, freely draggable 2D surface. Plain DOM transforms driven by one rAF loop:
 * lerp smoothing toward a target, friction inertia after release, and a per-card wrap.
 * Same conventions as `effects/mark-3d.tsx`: refs only, no React state per frame, and the
 * loop stops when settled, off screen or in a hidden tab.
 *
 * Wrap without duplicates: every card wraps on its own with a Euclidean modulo, over a period
 * of max(layout tile, panel + largest card diagonal). A card leaves one edge fully out of view
 * before it re-enters at the other, so one DOM node per card is enough and none is ever shown twice.
 */

export type CardLayout = {
  /** Card centre in layout units, relative to the tile centre. Within ±tile/2. */
  x: number;
  y: number;
  /** Card size in layout units (1 unit = 1px at full scale). */
  w: number;
  h: number;
  /** Rest rotation in degrees, clockwise. */
  rotate: number;
  /** Parallax factor: 1 moves with the pointer, 0.9 lags, 1.1 leads. */
  depth: number;
};

export type PanCanvasOptions<Id extends string> = {
  layout: Readonly<Record<Id, CardLayout>>;
  /** Width and height of the repeating tile, in layout units. */
  tile: { w: number; h: number };
  /** `prefers-reduced-motion`: drag is 1:1, no lerp, no inertia, no intro, no lean. */
  reduced: boolean;
  /** Pointer pressed on the panel, or released. For the press scale. */
  onPressChange?: (pressed: boolean) => void;
};

export type PanCanvas<Id extends string> = {
  /** Attach to the clipping panel. Pointer, key and focus listeners live on it. */
  panelRef: RefObject<HTMLDivElement | null>;
  /** Attach to each card's positioned element. The engine writes only its `transform`. */
  cardRef: (id: Id) => (el: HTMLElement | null) => void;
  /** Moves the surface so the card sits in the middle of the panel (instantly under reduced motion). */
  centre: (id: Id) => void;
};

export const PAN_TUNING = {
  lerp: 0.12, // share of the remaining distance covered per 60 Hz frame
  friction: 0.94, // velocity kept per 60 Hz frame after release
  minVelocity: 0.01, // px per frame below which inertia stops
  settle: 0.05, // px between current and target below which the loop stops
  dragThreshold: 5, // px of movement before a press becomes a drag
  sampleWindow: 100, // ms of pointer samples used for the release velocity
  maxVelocity: 80, // px per frame, caps a wild flick
  keyStep: 120, // px per arrow key press
  lean: { perPx: 0.18, max: 4 }, // degrees of lean per px/frame of horizontal speed
  scale: { ref: 1000, min: 0.8 }, // cards scale with panel width: k = clamp(width / ref, min, 1)
  intro: { duration: 0.9, distance: 360, spin: 16 }, // s, px (×k) pushed outward, degrees
} as const;

/** Arrow keys move the view: ArrowRight reveals what is to the right, so the surface moves left. */
const KEY_STEPS: Partial<Record<string, readonly [x: number, y: number]>> = {
  ArrowLeft: [1, 0],
  ArrowRight: [-1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
};

type Vec = { x: number; y: number };
type Sample = { x: number; y: number; t: number };

/** Euclidean modulo: always in [0, n). */
const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** The design system's arrive curve, cubic-bezier(0.22, 1, 0.36, 1), approximated as an ease-out quint. */
const arrive = (t: number) => 1 - (1 - t) ** 5;

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };
const saveDataOn = () => typeof navigator !== "undefined" && (navigator as SaveDataNavigator).connection?.saveData === true;

export function usePanCanvas<Id extends string>({ layout, tile, reduced, onPressChange }: PanCanvasOptions<Id>): PanCanvas<Id> {
  const panelRef = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<Id, HTMLElement>());
  const refCallbacks = useRef(new Map<Id, (el: HTMLElement | null) => void>());

  // Latest options, read by long-lived listeners without re-attaching them.
  const opts = useRef({ layout, tile, reduced, onPressChange });
  opts.current = { layout, tile, reduced, onPressChange };

  /** The engine instance; created once the panel mounts. */
  const engine = useRef<{ centre: (id: Id) => void; write: () => void; relayout: () => void } | null>(null);

  const cardRef = useCallback((id: Id) => {
    let cb = refCallbacks.current.get(id);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        if (el) cards.current.set(id, el);
        else cards.current.delete(id);
      };
      refCallbacks.current.set(id, cb);
    }
    return cb;
  }, []);

  const centre = useCallback((id: Id) => engine.current?.centre(id), []);

  // Layout effect: the first frame is written before paint, so the rest layout never flashes unplaced.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const T = PAN_TUNING;

    const target: Vec = { x: 0, y: 0 };
    const current: Vec = { x: 0, y: 0 };
    const velocity: Vec = { x: 0, y: 0 }; // px per 60 Hz frame, inertia after release
    let lean = 0; // degrees, follows on-screen horizontal speed

    // Sizes come from the ResizeObserver only, never from the loop.
    let size = { w: 0, h: 0 };
    let k = 1; // card scale
    let period = { w: tile.w, h: tile.h }; // wrap period in px

    // Intro: -1 not started, 0..1 running, 1 done.
    let intro = opts.current.reduced || saveDataOn() ? 1 : -1;
    let introStart = 0;

    let raf = 0;
    let last = 0;
    let visible = false;

    const press = {
      id: -1,
      dragging: false,
      start: { x: 0, y: 0 },
      from: { x: 0, y: 0 },
      samples: [] as Sample[],
    };
    let suppressClick = false;

    const measure = (w: number, h: number) => {
      const { layout: L, tile: tl } = opts.current;
      size = { w, h };
      k = clamp(w / T.scale.ref, T.scale.min, 1);
      let diag = 0;
      for (const c of Object.values<CardLayout>(L)) diag = Math.max(diag, Math.hypot(c.w, c.h) * k);
      period = { w: Math.max(tl.w * k, w + diag), h: Math.max(tl.h * k, h + diag) };
      panel.style.setProperty("--canvas-k", k.toFixed(4));
    };

    /** On-screen centre of a card (relative to the panel centre) for a given surface offset. */
    const place = (c: CardLayout, at: Vec): Vec => {
      const { tile: tl } = opts.current;
      // Layout positions spread with the period, so density stays even on wide panels.
      const bx = (c.x / tl.w) * period.w;
      const by = (c.y / tl.h) * period.h;
      return {
        x: mod(bx + at.x * c.depth + period.w / 2, period.w) - period.w / 2,
        y: mod(by + at.y * c.depth + period.h / 2, period.h) - period.h / 2,
      };
    };

    const write = () => {
      if (!size.w) return;
      const { layout: L } = opts.current;
      const e = opts.current.reduced || intro >= 1 ? 1 : intro < 0 ? 0 : arrive(intro);
      for (const [id, el] of cards.current) {
        const c = L[id];
        let { x, y } = place(c, current);
        let rot = c.rotate + lean;
        if (e < 1) {
          // Scatter-in: each card starts pushed outward from the panel centre and turned, then gathers.
          const len = Math.hypot(x, y) || 1;
          const push = (1 - e) * T.intro.distance * k;
          x += (x / len) * push;
          y += (y / len) * push;
          rot += (1 - e) * T.intro.spin * (c.depth >= 1 ? 1 : -1);
        }
        const w = c.w * k;
        const h = c.h * k;
        el.style.transform = `translate3d(${(x - w / 2).toFixed(2)}px, ${(y - h / 2).toFixed(2)}px, 0) rotate(${rot.toFixed(3)}deg)`;
      }
    };

    const settled = () =>
      !press.dragging &&
      Math.abs(target.x - current.x) < T.settle &&
      Math.abs(target.y - current.y) < T.settle &&
      Math.abs(velocity.x) < T.minVelocity &&
      Math.abs(velocity.y) < T.minVelocity &&
      Math.abs(lean) < 0.01 &&
      (intro < 0 || intro >= 1);

    const frame = (now: number) => {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
      last = now;
      const f = dt * 60; // frames elapsed at 60 Hz
      const { reduced: r } = opts.current;

      if (!press.dragging && (velocity.x || velocity.y)) {
        target.x += velocity.x * f;
        target.y += velocity.y * f;
        const keep = T.friction ** f;
        velocity.x *= keep;
        velocity.y *= keep;
        if (Math.hypot(velocity.x, velocity.y) < T.minVelocity) velocity.x = velocity.y = 0;
      }

      const prevX = current.x;
      if (r) {
        current.x = target.x;
        current.y = target.y;
      } else {
        const a = 1 - (1 - T.lerp) ** f;
        current.x += (target.x - current.x) * a;
        current.y += (target.y - current.y) * a;
      }

      if (!r && f > 0) {
        const speed = (current.x - prevX) / f;
        const goal = clamp(speed * T.lean.perPx, -T.lean.max, T.lean.max);
        lean += (goal - lean) * (1 - (1 - 0.2) ** f);
      } else lean = 0;

      // Clamped at 0: the rAF timestamp can precede the performance.now() taken when the intro started,
      // and a negative value would read as "not started", stopping the loop with every card scattered.
      if (intro >= 0 && intro < 1) intro = clamp((now - introStart) / 1000 / T.intro.duration, 0, 1);

      if (settled()) {
        current.x = target.x;
        current.y = target.y;
        lean = 0;
        raf = 0;
      } else raf = requestAnimationFrame(frame);
      write();
    };

    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    /** Jump or glide so the card's centre lands in the middle of the panel, by the shortest wrap. */
    const centreCard = (id: Id) => {
      const c = opts.current.layout[id];
      if (!c) return;
      const at = place(c, target);
      velocity.x = velocity.y = 0;
      if (intro < 0) intro = 1; // a deep link lands on the card, without the scatter-in
      target.x -= at.x / c.depth;
      target.y -= at.y / c.depth;
      if (opts.current.reduced || !visible) {
        current.x = target.x;
        current.y = target.y;
        write();
      }
      start();
    };
    /** A different layout or tile (a media-query switch): re-measure, return to the rest view, repaint. */
    const relayout = () => {
      measure(size.w, size.h);
      velocity.x = velocity.y = 0;
      target.x = target.y = current.x = current.y = 0;
      write();
    };
    engine.current = { centre: centreCard, write, relayout };

    // --- Pointer ---------------------------------------------------------------------------------

    const onPointerDown = (e: PointerEvent) => {
      if (press.id !== -1 || (e.pointerType === "mouse" && e.button !== 0)) return;
      press.id = e.pointerId;
      press.dragging = false;
      press.start = { x: e.clientX, y: e.clientY };
      press.from = { x: target.x, y: target.y };
      press.samples = [{ x: e.clientX, y: e.clientY, t: e.timeStamp }];
      velocity.x = velocity.y = 0; // a press catches a gliding surface
      opts.current.onPressChange?.(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== press.id) return;
      const dx = e.clientX - press.start.x;
      const dy = e.clientY - press.start.y;
      if (!press.dragging) {
        if (Math.hypot(dx, dy) < T.dragThreshold) return;
        press.dragging = true;
        panel.setPointerCapture(e.pointerId);
        panel.dataset.dragging = "";
      }
      target.x = press.from.x + dx;
      target.y = press.from.y + dy;
      press.samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
      const cutoff = e.timeStamp - T.sampleWindow;
      while (press.samples.length > 2 && press.samples[0]!.t < cutoff) press.samples.shift();
      start();
    };

    const release = (e: PointerEvent, cancelled: boolean) => {
      if (e.pointerId !== press.id) return;
      if (press.dragging) {
        suppressClick = !cancelled;
        delete panel.dataset.dragging;
        if (panel.hasPointerCapture(e.pointerId)) panel.releasePointerCapture(e.pointerId);
        const first = press.samples[0];
        const lastS = press.samples.at(-1);
        // A pause before letting go means no flick.
        const fresh = lastS && e.timeStamp - lastS.t < T.sampleWindow / 2;
        if (!opts.current.reduced && !cancelled && first && lastS && fresh && lastS.t > first.t) {
          const ms = lastS.t - first.t;
          velocity.x = clamp(((lastS.x - first.x) / ms) * (1000 / 60), -T.maxVelocity, T.maxVelocity);
          velocity.y = clamp(((lastS.y - first.y) / ms) * (1000 / 60), -T.maxVelocity, T.maxVelocity);
        }
        start();
      }
      press.id = -1;
      press.dragging = false;
      opts.current.onPressChange?.(false);
    };
    const onPointerUp = (e: PointerEvent) => release(e, false);
    const onPointerCancel = (e: PointerEvent) => release(e, true);

    // A drag that ends on a card is not a click on it.
    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    // --- Keyboard and focus ------------------------------------------------------------------------

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const step = KEY_STEPS[e.key];
      if (!step) return;
      e.preventDefault();
      velocity.x = velocity.y = 0;
      target.x += step[0] * T.keyStep * k;
      target.y += step[1] * T.keyStep * k;
      if (opts.current.reduced) {
        current.x = target.x;
        current.y = target.y;
        write();
      }
      start();
    };

    // Keyboard focus brings the card into the panel. Pointer focus (a press) does not, or a drag would jump.
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target instanceof HTMLElement ? e.target : null;
      if (!el?.matches(":focus-visible")) return;
      const id = el.closest<HTMLElement>("[data-card-id]")?.dataset.cardId as Id | undefined;
      if (id && id in opts.current.layout) centreCard(id);
    };

    // --- Lifecycle ---------------------------------------------------------------------------------

    const rect = panel.getBoundingClientRect(); // once, before the first paint
    measure(rect.width, rect.height);
    write();

    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      measure(box.width, box.height);
      write();
    });
    ro.observe(panel);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible = entry.isIntersecting;
        if (!visible) return stop();
        if (intro < 0) {
          intro = 0;
          introStart = performance.now();
        }
        if (!settled()) start();
      },
      { threshold: 0.2 },
    );
    io.observe(panel);

    const onVisibility = () => (document.hidden ? stop() : !settled() && start());
    document.addEventListener("visibilitychange", onVisibility);

    panel.addEventListener("pointerdown", onPointerDown);
    panel.addEventListener("pointermove", onPointerMove);
    panel.addEventListener("pointerup", onPointerUp);
    panel.addEventListener("pointercancel", onPointerCancel);
    panel.addEventListener("click", onClickCapture, true);
    panel.addEventListener("keydown", onKeyDown);
    panel.addEventListener("focusin", onFocusIn);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      panel.removeEventListener("pointerdown", onPointerDown);
      panel.removeEventListener("pointermove", onPointerMove);
      panel.removeEventListener("pointerup", onPointerUp);
      panel.removeEventListener("pointercancel", onPointerCancel);
      panel.removeEventListener("click", onClickCapture, true);
      panel.removeEventListener("keydown", onKeyDown);
      panel.removeEventListener("focusin", onFocusIn);
      engine.current = null;
    };
    // The engine is built once per panel; options that change are read through `opts`.
  }, []);

  // A changed layout or tile re-measures the wrap period. Not on mount: the engine measures itself then.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    engine.current?.relayout();
  }, [layout, tile]);

  // Switching reduced motion on mid-session drops the intro and the lean at once.
  useEffect(() => {
    engine.current?.write();
  }, [reduced]);

  return { panelRef, cardRef, centre };
}
