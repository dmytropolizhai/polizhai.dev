import { useCallback, useEffect, useRef, useState } from "react";

export type CopyState = "idle" | "copied" | "failed";

/** Clipboard write with a state that resets itself. On failure the caller falls back to `mailto:`. */
export function useCopy(text: string, resetMs = 2000) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (): Promise<boolean> => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      return true;
    } catch {
      setState("failed");
      return false;
    } finally {
      timer.current = window.setTimeout(() => setState("idle"), resetMs);
    }
  }, [text, resetMs]);

  return { state, copy };
}
