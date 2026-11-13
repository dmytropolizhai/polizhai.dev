"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useSiteContent } from "@/lib/content-context";
import { LeadForm } from "./lead-form";

type AssistantSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AssistantSheet({ open, onOpenChange }: AssistantSheetProps) {
  const { facts, locale, t } = useSiteContent();
  const copy = t.assistant;
  const {
    messages,
    isStreaming,
    error,
    needsHandoff,
    provider,
    turnstileContainerRef,
    sendMessage,
    stop,
    reset,
  } = useChatStream(locale);

  const [input, setInput] = useState("");
  const [showHandoff, setShowHandoff] = useState(false);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const calLink = facts.contact.find((c) => c.id === "call")?.href;

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, showHandoff]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput("");
    void sendMessage(text);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-(--z-overlay) bg-black/80 transition-opacity duration-(--dur-micro) ease-move data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          aria-labelledby="assistant-title"
          className="fixed inset-x-0 bottom-0 z-(--z-overlay) flex h-[85svh] w-full flex-col border-t border-line bg-surface outline-none transition-opacity duration-(--dur-micro) ease-move data-ending-style:opacity-0 data-starting-style:opacity-0 md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-w-md md:border-t-0 md:border-l"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex items-center gap-3">
              <DialogPrimitive.Title id="assistant-title" className="type-h3">
                {copy.title}
              </DialogPrimitive.Title>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowHandoff(false);
                  }}
                  className="cursor-pointer text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  {copy.reset}
                </button>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label={t.common.close}
              className="inline-flex size-10 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-(--dur-micro) ease-move hover:text-fg"
            >
              <XIcon aria-hidden="true" className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-label={t.a11y.assistant.log}
            aria-live="polite"
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4"
          >
            <div className="border border-line bg-raised p-4">
              <p className="type-body text-fg">{copy.greeting}</p>
              <p className="mt-2 text-xs text-fg-subtle">{copy.languagesHint}</p>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-col gap-2">
                {copy.prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="cursor-pointer border border-line bg-bg px-3 py-2.5 text-left text-sm text-fg transition-colors duration-(--dur-micro) ease-move hover:border-line-strong hover:bg-raised"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "ml-8 border border-line-strong bg-bg px-4 py-3 text-sm text-fg"
                    : "mr-4 border border-line bg-raised px-4 py-3 text-sm whitespace-pre-wrap text-fg"
                }
              >
                {m.content || (isStreaming ? t.a11y.assistant.thinking : "")}
              </div>
            ))}

            {error && (
              <div role="alert" className="border border-line-strong bg-raised p-3 text-sm text-fg">
                {copy.error[error]}
              </div>
            )}

            {(needsHandoff || error || messages.length > 0) && !showHandoff && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  type="button"
                  variant={needsHandoff ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setShowHandoff(true)}
                >
                  {copy.handoff.button}
                </Button>
                {calLink && (
                  <a
                    href={calLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                  >
                    {t.contact.labels.call}
                  </a>
                )}
              </div>
            )}

            {showHandoff && (
              <LeadForm
                transcript={messages}
                provider={provider}
                turnstileContainerRef={turnstileContainerRef}
                onCancel={() => setShowHandoff(false)}
              />
            )}

            <div ref={logEndRef} />
          </div>

          {/* Turnstile mount point (hidden unless interaction is required) */}
          <div ref={turnstileContainerRef} className="px-5" />

          {/* Input footer */}
          <form onSubmit={handleSubmit} className="border-t border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={copy.placeholder}
                maxLength={1000}
                disabled={isStreaming}
                className="min-w-0 flex-1 border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:border-line-strong focus:outline-none disabled:opacity-50"
              />
              {isStreaming ? (
                <Button type="button" variant="secondary" size="sm" onClick={stop}>
                  {copy.stop}
                </Button>
              ) : (
                <Button type="submit" variant="primary" size="sm" disabled={!input.trim()}>
                  {copy.send}
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-fg-subtle">{copy.disclaimer}</p>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
