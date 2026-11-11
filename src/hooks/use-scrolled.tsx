import { useEffect, useRef, useState } from "react";

/**
 * True once the page has scrolled past `offset` px. One IntersectionObserver on a sentinel
 * pinned to the top of the document, no scroll listener. Render `sentinel` once.
 */
export function useScrolled(offset = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(entry ? !entry.isIntersecting : false));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sentinel = (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0" style={{ height: offset }} />
  );

  return { scrolled, sentinel };
}
