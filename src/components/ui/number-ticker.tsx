import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Magic UI NumberTicker, adapted:
 * - the HTML ships with the final value (no-JS, crawlers and reduced motion all read "400");
 * - it counts from `startValue` each time `play` turns true, instead of on first view;
 * - spring per design-system §8 (stiffness 380, damping 38 is too fast for a count, so it is softened).
 */
interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  play: boolean;
  startValue?: number;
  decimalPlaces?: number;
  onDone?: () => void;
}

export function NumberTicker({
  value,
  play,
  startValue = 0,
  decimalPlaces = 0,
  onDone,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { damping: 40, stiffness: 120 });
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!play || reduced) return;
    spring.jump(startValue);
    motionValue.jump(startValue);
    motionValue.set(value);
  }, [play, reduced, startValue, value, motionValue, spring]);

  useEffect(() => {
    const format = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
    const offChange = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = format.format(Number(latest.toFixed(decimalPlaces)));
    });
    const offEnd = spring.on("animationComplete", () => done.current?.());
    return () => {
      offChange();
      offEnd();
    };
  }, [spring, decimalPlaces]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {value}
    </span>
  );
}
