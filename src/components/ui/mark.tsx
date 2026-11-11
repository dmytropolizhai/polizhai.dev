import { cn } from "@/lib/utils";

/** The parallelogram as a CSS shape (`.mark` in tokens.css), sized in em. Means "live" or "you are here". */
export function Mark({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("mark", className)} />;
}
