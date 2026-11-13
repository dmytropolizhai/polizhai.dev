"use client";

import { createContext, lazy, Suspense, useContext, useState, type ReactNode } from "react";
import { useSiteContent } from "@/lib/content-context";

const AssistantSheet = lazy(() => import("./assistant-sheet"));

type AssistantContextValue = {
  open: boolean;
  openAssistant: () => void;
};

const AssistantContext = createContext<AssistantContextValue>({
  open: false,
  openAssistant: () => {},
});

export function useAssistant() {
  return useContext(AssistantContext);
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const { showAssistant } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const openAssistant = () => {
    if (!showAssistant) return;
    setHasLoaded(true);
    setOpen(true);
  };

  return (
    <AssistantContext.Provider value={{ open, openAssistant }}>
      {children}
      {showAssistant && hasLoaded && (
        <Suspense fallback={null}>
          <AssistantSheet open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </AssistantContext.Provider>
  );
}
