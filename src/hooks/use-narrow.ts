import { useSyncExternalStore } from "react";

/** Same breakpoint as Tailwind's `sm`, so `max-sm:` classes and the JS switch together. */
const NARROW_QUERY = "(max-width: 639.98px)";

const subscribe = (notify: () => void) => {
  const mq = matchMedia(NARROW_QUERY);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const getSnapshot = () => matchMedia(NARROW_QUERY).matches;

/** True below 640px. The static HTML is the desktop one (`false`); phones switch on hydration. */
export function useNarrow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
