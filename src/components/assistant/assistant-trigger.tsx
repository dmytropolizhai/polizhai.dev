"use client";

import { useAssistant } from "@/components/assistant/assistant-context";
import { Mark } from "@/components/ui/mark";
import { useSiteContent } from "@/lib/content-context";

export function AssistantTrigger() {
  const { showAssistant, t } = useSiteContent();
  const { open, openAssistant } = useAssistant();

  if (!showAssistant) return null;

  return (
    <button
      type="button"
      onClick={openAssistant}
      aria-label={t.a11y.assistant.open}
      aria-expanded={open}
      className="pointer-events-auto inline-flex size-(--dock-h) shrink-0 cursor-pointer items-center justify-center rounded-pill border border-line-strong bg-raised text-fg transition-colors duration-(--dur-micro) ease-move hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse"
    >
      <Mark className="text-base" />
    </button>
  );
}
