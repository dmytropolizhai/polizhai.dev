"use client";

import { useState, type FormEvent } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
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

  const calLink = facts.contact.find((c) => c.id === "call")?.href;
  const latestUserMessage = messages.findLast((m) => m.role === "user")?.content;

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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-(--z-overlay) bg-black/80 transition-opacity duration-(--dur-component) ease-move data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          aria-labelledby="assistant-title"
          className="fixed inset-x-0 bottom-0 z-(--z-overlay) flex h-[85svh] w-full flex-col border-t border-line bg-surface outline-none transition-opacity duration-(--dur-component) ease-move data-ending-style:opacity-0 data-starting-style:opacity-0 md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-w-md md:border-t-0 md:border-l"
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
                  className="min-h-6 cursor-pointer px-1 text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  {copy.reset}
                </button>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label={t.common.close}
              className="inline-flex size-11 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-(--dur-micro) ease-move hover:text-fg"
            >
              <XIcon aria-hidden="true" className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {/* Messages */}
          <Conversation role="log" aria-label={t.a11y.assistant.log} aria-live="polite">
            <ConversationContent className="gap-4 px-5 py-4">
              <div className="border border-line bg-raised p-4">
                <p className="type-body text-fg">{copy.greeting}</p>
                <p className="mt-2 text-sm text-fg-subtle">{copy.languagesHint}</p>
              </div>

              {messages.length === 0 && (
                <Suggestions>
                  {copy.prompts.map((prompt) => (
                    <Suggestion
                      key={prompt}
                      suggestion={prompt}
                      onClick={(selected) => void sendMessage(selected)}
                    />
                  ))}
                </Suggestions>
              )}

              {messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <MessageContent>
                    {m.content ? (
                      <MessageResponse>{m.content}</MessageResponse>
                    ) : isStreaming ? (
                      <Shimmer>{t.a11y.assistant.thinking}</Shimmer>
                    ) : null}
                  </MessageContent>
                </Message>
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
                      className="inline-flex min-h-6 items-center text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline"
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
                  initialMessage={latestUserMessage}
                  onCancel={() => setShowHandoff(false)}
                />
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Turnstile mount point (hidden unless interaction is required) */}
          <div ref={turnstileContainerRef} className="px-5" />

          {/* Input footer */}
          {!showHandoff && (
            <form onSubmit={handleSubmit} className="border-t border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <label htmlFor="assistant-chat-input" className="sr-only">
                  {copy.placeholder}
                </label>
                <input
                  id="assistant-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={copy.placeholder}
                  maxLength={1000}
                  disabled={isStreaming}
                  className="min-w-0 flex-1 border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse disabled:opacity-50"
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
              <p className="mt-2 text-sm text-fg-subtle">{copy.disclaimer}</p>
            </form>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
