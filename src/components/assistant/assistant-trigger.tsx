"use client";

import { useCallback, useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAssistant } from "@/components/assistant/assistant-context";
import { Mark } from "@/components/ui/mark";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "polizhai_assistant_intro_dismissed_v1";
const arriveEase = [0.22, 1, 0.36, 1] as const;

export function AssistantTrigger() {
  const { showAssistant, t } = useSiteContent();
  const { open, openAssistant } = useAssistant();
  const prefersReducedMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(false);

  const dismissIntro = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setShowIntro(false);
  }, []);

  const handleOpenFromIntro = useCallback(() => {
    dismissIntro();
    openAssistant();
  }, [dismissIntro, openAssistant]);

  const handleTriggerClick = useCallback(() => {
    dismissIntro();
    openAssistant();
  }, [dismissIntro, openAssistant]);

  useEffect(() => {
    if (open) {
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        // ignore
      }
      setShowIntro(false);
      return;
    }

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = true;
    }

    if (dismissed) return;

    const timer = setTimeout(() => {
      setShowIntro(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [open]);

  if (!showAssistant) return null;

  return (
    <div className="relative flex items-center">
      <AnimatePresence>
        {showIntro && !open && (
          <motion.div
            key="assistant-intro"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: arriveEase }}
            className={cn(
              "pointer-events-auto absolute bottom-full right-0 mb-3 flex items-center gap-2 rounded-card border border-line-strong bg-raised px-3.5 py-2.5 text-fg",
              "md:bottom-auto md:right-full md:top-1/2 md:mr-3 md:mb-0 md:-translate-y-1/2",
              "w-max max-w-[calc(100vw-2rem)] sm:max-w-xs",
            )}
          >
            <button
              type="button"
              onClick={handleOpenFromIntro}
              className="cursor-pointer text-left text-sm leading-snug text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse"
            >
              {t.assistant.contactLine}
            </button>
            <button
              type="button"
              onClick={dismissIntro}
              aria-label={t.common.close}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-(--dur-micro) ease-move hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={handleTriggerClick}
        aria-label={t.a11y.assistant.open}
        aria-expanded={open}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: arriveEase }}
        className={cn(
          "pointer-events-auto inline-flex size-(--dock-h) shrink-0 cursor-pointer items-center justify-center rounded-pill border text-fg transition-colors duration-(--dur-micro) ease-move focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse",
          open ? "border-fg bg-line" : "border-line-strong bg-raised hover:bg-line",
        )}
      >
        <Mark className="text-base" />
      </motion.button>
    </div>
  );
}
