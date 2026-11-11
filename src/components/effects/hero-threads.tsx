import { lazy, Suspense, useEffect, useState } from "react";

const Threads = lazy(() => import("./threads"));

/**
 * React Bits Threads, the hero background (design-system §10). White only, vertical, drifting.
 * The wrapper opacity is the 15% brightness cap: white × 0.15 = #262626, the background ceiling.
 * Desktop only: no lines on phones, under reduced motion or with Save-Data. Loaded lazily so the
 * WebGL code stays out of the LCP path.
 */
export function HeroThreads() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches && !saveData);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-15">
      <Suspense fallback={null}>
        <Threads color={[1, 1, 1]} angle={90} speed={0.25} amplitude={1.2} lineCount={60} thickness={0.5} fade={0.4} />
      </Suspense>
    </div>
  );
}
