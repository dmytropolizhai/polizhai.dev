"use client";

import { useAssistant } from "@/components/assistant/assistant-context";
import { buttonVariants } from "@/components/ui/button";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

export function AssistantTrigger({ scrolled }: { scrolled: boolean }) {
  const { showAssistant, t } = useSiteContent();
  const { openAssistant } = useAssistant();

  if (!showAssistant) return null;

  return (
    <button
      type="button"
      onClick={openAssistant}
      aria-label={t.a11y.assistant.open}
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "pointer-events-auto cursor-pointer transition-[background-color,border-color,border-radius,color] duration-(--dur-component) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse",
        scrolled && "rounded-none border-transparent bg-transparent hover:bg-raised hover:text-fg",
      )}
    >
      {t.assistant.navButton}
    </button>
  );
}
