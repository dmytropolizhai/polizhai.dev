import { cn } from "@/lib/utils";

/** `▰ POLIZHAI.DEV`. Outlined paths from design/logo, never retyped. Min width 120px. */
export function Lockup({ className, alt = "polizhai.dev" }: { className?: string; alt?: string }) {
  return <img src="/lockup.svg" alt={alt} width={921.578} height={143.34} className={cn("block h-auto", className)} />;
}
