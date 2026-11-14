"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAssistant } from "@/components/assistant/assistant-context";
import { Mark } from "@/components/ui/mark";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

export function AssistantTrigger() {
  const { showAssistant, t } = useSiteContent();
  const { open, openAssistant } = useAssistant();
  const prefersReducedMotion = useReducedMotion();

  if (!showAssistant) return null;

  return (
    <motion.button
      type="button"
      onClick={openAssistant}
      aria-label={t.a11y.assistant.open}
      aria-expanded={open}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "pointer-events-auto inline-flex size-(--dock-h) shrink-0 cursor-pointer items-center justify-center rounded-pill border text-fg transition-colors duration-(--dur-micro) ease-move focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse",
        open ? "border-fg bg-line" : "border-line-strong bg-raised hover:bg-line",
      )}
    >
      <Mark className="text-base" />
    </motion.button>
  );
}
