import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  /** Stagger index; each step adds 60ms (landing-page.md, bento entrance). */
  index?: number;
  as?: "div" | "li" | "span";
};

/**
 * The one entrance on the page: rise 14px + fade over --dur-section with --motion-arrive, once.
 * CSS does the motion (`.reveal` in index.css); this only flips `data-revealed` on first view.
 * Reduced motion zeroes the tokens, so the content is simply there.
 */
export function Reveal({ index = 0, as: Tag = "div", className, style, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement & HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-revealed={revealed || undefined}
      className={cn("reveal", className)}
      style={{ ...style, "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
      {...props}
    />
  );
}
