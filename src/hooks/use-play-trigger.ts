import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * When a bento tile's animation plays (landing-page.md §2, "When it plays"):
 * - fine pointer: while hovered or while focus is inside;
 * - touch: while 60% of the tile is on screen (or focus is inside), so nothing runs off screen;
 * - reduced motion: never (tiles show their finished state).
 */
export function usePlayTrigger<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  playing: boolean;
  reduced: boolean;
  handlers: {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onFocus: () => void;
    onBlur: (e: React.FocusEvent<T>) => void;
  };
} {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { amount: 0.6 });
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [fine, setFine] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const on = () => setFine(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const playing = !reduced && (fine ? hover || focus : inView || focus);

  return {
    ref,
    playing,
    reduced,
    handlers: {
      onPointerEnter: () => setHover(true),
      onPointerLeave: () => setHover(false),
      onFocus: () => setFocus(true),
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false);
      },
    },
  };
}
