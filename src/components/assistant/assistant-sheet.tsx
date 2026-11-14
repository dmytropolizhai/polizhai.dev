"use client";

import { useState, type FormEvent } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  const prefersReducedMotion = useReducedMotion();
  const arriveEase = [0.22, 1, 0.36, 1] as const;

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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-(--z-overlay) bg-black/80 transition-opacity duration-(--dur-component) ease-arrive data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          aria-labelledby="assistant-title"
          className="fixed inset-x-0 bottom-0 z-(--z-overlay) flex h-[85svh] w-full flex-col rounded-t-panel border-t border-line bg-surface outline-none transition-[opacity,transform] duration-(--dur-component) ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:translate-y-6 data-ending-style:opacity-0 data-starting-style:translate-y-6 data-starting-style:opacity-0 motion-reduce:data-ending-style:translate-0 motion-reduce:data-starting-style:translate-0 md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-w-md md:rounded-t-none md:rounded-l-panel md:border-t-0 md:border-l md:data-ending-style:translate-x-8 md:data-ending-style:translate-y-0 md:data-starting-style:translate-x-8 md:data-starting-style:translate-y-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex items-center gap-3">
              <DialogPrimitive.Title id="assistant-title" className="type-h3">
                {copy.title}
              </DialogPrimitive.Title>
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.button
                    key="assistant-reset"
                    type="button"
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: arriveEase }}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                    onClick={() => {
                      reset();
                      setShowHandoff(false);
                    }}
                    className="min-h-6 cursor-pointer px-1 text-xs text-fg-muted underline-offset-4 transition-colors duration-(--dur-micro) hover:text-fg hover:underline"
                  >
                    {copy.reset}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <DialogPrimitive.Close
              aria-label={t.common.close}
              className="inline-flex size-11 cursor-pointer items-center justify-center text-fg-muted transition-[color,transform] duration-(--dur-micro) ease-move hover:scale-105 hover:text-fg active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            >
              <XIcon aria-hidden="true" className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {/* Messages */}
          <Conversation role="log" aria-label={t.a11y.assistant.log} aria-live="polite">
            <ConversationContent className="gap-4 px-5 py-4">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: arriveEase }}
                className="rounded-card border border-line bg-raised p-4"
              >
                <p className="type-body text-fg">{copy.greeting}</p>
                <p className="mt-2 text-sm text-fg-subtle">{copy.languagesHint}</p>
              </motion.div>

              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    key="assistant-suggestions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: arriveEase }}
                  >
                    <Suggestions>
                      {copy.prompts.map((prompt, index) => (
                        <motion.div
                          key={prompt}
                          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.24,
                            delay: prefersReducedMotion ? 0 : Math.min(index * 0.04, 0.2),
                            ease: arriveEase,
                          }}
                        >
                          <Suggestion
                            suggestion={prompt}
                            onClick={(selected) => void sendMessage(selected)}
                          />
                        </motion.div>
                      ))}
                    </Suggestions>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 10, x: m.role === "user" ? 8 : -8 }
                    }
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: arriveEase }}
                    className="flex w-full"
                  >
                    <Message from={m.role}>
                      <MessageContent>
                        {m.content ? (
                          <MessageResponse>{m.content}</MessageResponse>
                        ) : isStreaming ? (
                          <Shimmer>{t.a11y.assistant.thinking}</Shimmer>
                        ) : null}
                      </MessageContent>
                    </Message>
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    key="assistant-error"
                    role="alert"
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: arriveEase }}
                    className="rounded-card border border-line-strong bg-raised p-3 text-sm text-fg"
                  >
                    {copy.error[error]}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {showHandoff ? (
                  <motion.div
                    key="handoff-form"
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: arriveEase }}
                  >
                    <LeadForm
                      transcript={messages}
                      provider={provider}
                      turnstileContainerRef={turnstileContainerRef}
                      initialMessage={latestUserMessage}
                      onCancel={() => setShowHandoff(false)}
                    />
                  </motion.div>
                ) : (
                  (needsHandoff || error) && (
                    <motion.div
                      key="handoff-cta"
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: arriveEase }}
                      className="flex flex-wrap items-center gap-3 pt-1"
                    >
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
                          className="inline-flex min-h-6 items-center text-xs text-fg-muted underline-offset-4 transition-colors duration-(--dur-micro) hover:text-fg hover:underline"
                        >
                          {t.contact.labels.call}
                        </a>
                      )}
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Turnstile mount point (hidden unless interaction is required) */}
          <div ref={turnstileContainerRef} className="px-5" />

          {/* Input footer */}
          <AnimatePresence initial={false}>
            {!showHandoff && (
              <motion.form
                key="assistant-input-form"
                onSubmit={handleSubmit}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: arriveEase }}
                className="border-t border-line px-5 py-4"
              >
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
                    className="min-w-0 flex-1 rounded-card border border-line bg-bg px-3 py-2.5 text-sm text-fg transition-[border-color,opacity] duration-(--dur-micro) ease-move placeholder:text-fg-subtle focus-visible:border-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse disabled:opacity-50"
                  />
                  <AnimatePresence mode="popLayout" initial={false}>
                    {isStreaming ? (
                      <motion.div
                        key="stop"
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: arriveEase }}
                      >
                        <Button type="button" variant="secondary" size="sm" onClick={stop}>
                          {copy.stop}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: arriveEase }}
                      >
                        <Button type="submit" variant="primary" size="sm" disabled={!input.trim()}>
                          {copy.send}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="mt-2 text-sm text-fg-subtle">{copy.disclaimer}</p>
              </motion.form>
            )}
          </AnimatePresence>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
