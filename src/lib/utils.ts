import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows the stock theme. Teach it the design-system radii (`rounded-pill`, `rounded-panel`, `rounded-card`),
 * otherwise `cn("rounded-pill", "rounded-none")` keeps both and the pill wins.
 */
const twMerge = extendTailwindMerge({
  extend: { theme: { radius: ["pill", "panel", "card"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
