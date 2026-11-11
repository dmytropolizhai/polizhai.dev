import { cn } from "@/lib/utils";

/**
 * Underline sweep (the Animate UI "highlight" job): 2px white, left to right over 560ms.
 * Shown fully when `on` or under reduced motion; the sweep is a scaleX on a pseudo line.
 */
export function HighlightText({ on, children, className }: { on: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span data-on={on || undefined} className={cn("highlight-sweep", className)}>
      {children}
    </span>
  );
}
