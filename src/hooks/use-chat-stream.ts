"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTurnstileToken } from "@/lib/turnstile";

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatErrorCode = "offline" | "limit" | "tooLong" | "sendFailed" | null;

const STORAGE_KEY = "polizhai_assistant_chat_v1";
const NO_ANSWER_MARKER = "[[NO_ANSWER]]";

function loadStoredMessages(): AssistantMessage[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is AssistantMessage =>
        typeof m === "object" &&
        m !== null &&
        typeof m.id === "string" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    );
  } catch {
    return [];
  }
}

function saveStoredMessages(messages: AssistantMessage[]) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  } catch {
    // ignore storage errors
  }
}

export function useChatStream(locale: string) {
  const [messages, setMessages] = useState<AssistantMessage[]>(() =>
    typeof window !== "undefined" ? loadStoredMessages() : [],
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<ChatErrorCode>(null);
  const [needsHandoff, setNeedsHandoff] = useState(false);
  const [provider, setProvider] = useState<"groq" | "workers-ai" | "none">("none");
  const abortRef = useRef<AbortController | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    saveStoredMessages(messages);
  }, [messages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
    setNeedsHandoff(false);
    setProvider("none");
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [stop]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isStreaming) return;
      if (text.length > 1000) {
        setError("tooLong");
        return;
      }

      setError(null);
      const userMsg: AssistantMessage = { id: `u-${Date.now()}`, role: "user", content: text };
      const assistantId = `a-${Date.now()}`;
      const historyForApi = [...messages, userMsg].slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const doFetch = async (turnstileToken?: string): Promise<Response> => {
        return fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyForApi,
            locale,
            ...(turnstileToken ? { turnstileToken } : {}),
          }),
          signal: controller.signal,
        });
      };

      const fetchToken = async (): Promise<string | undefined> => {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
        const container = turnstileContainerRef.current;
        if (!siteKey || !container) return undefined;
        return getTurnstileToken(siteKey, container);
      };

      try {
        let res = await doFetch();

        if (res.status === 401) {
          const token = await fetchToken();
          if (!token) {
            throw new Error("turnstile_unavailable");
          }
          res = await doFetch(token);
        }

        if (res.status === 429) {
          setError("limit");
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
          return;
        }
        if (res.status === 400) {
          setError("tooLong");
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
          return;
        }
        if (!res.ok || !res.body) {
          setError("offline");
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
          return;
        }

        const hdr = res.headers.get("X-Assistant-Provider");
        if (hdr === "groq" || hdr === "workers-ai") {
          setProvider(hdr);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });

          // Hold back up to NO_ANSWER_MARKER.length chars at tail while streaming so marker never flashes
          const safeLen = Math.max(0, accumulated.length - NO_ANSWER_MARKER.length);
          const visible = accumulated.slice(0, safeLen);
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: visible } : m)),
          );
        }

        accumulated += decoder.decode();
        const trimmed = accumulated.trimEnd();
        const hasMarker = trimmed.endsWith(NO_ANSWER_MARKER);
        const finalClean = hasMarker
          ? trimmed.slice(0, -NO_ANSWER_MARKER.length).trimEnd()
          : accumulated;

        if (hasMarker) {
          setNeedsHandoff(true);
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: finalClean } : m)),
        );
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") {
          return;
        }
        setError("offline");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [isStreaming, locale, messages],
  );

  return {
    messages,
    isStreaming,
    error,
    needsHandoff,
    provider,
    turnstileContainerRef,
    sendMessage,
    stop,
    reset,
  };
}
