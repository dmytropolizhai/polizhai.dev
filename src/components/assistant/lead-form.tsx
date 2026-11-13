"use client";

import { useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import type { AssistantMessage } from "@/hooks/use-chat-stream";
import { useSiteContent } from "@/lib/content-context";
import { getTurnstileToken } from "@/lib/turnstile";

type LeadFormProps = {
  transcript: readonly AssistantMessage[];
  provider: "groq" | "workers-ai" | "none";
  turnstileContainerRef: RefObject<HTMLDivElement | null>;
  onCancel: () => void;
};

export function LeadForm({
  transcript,
  provider,
  turnstileContainerRef,
  onCancel,
}: LeadFormProps) {
  const { locale, t } = useSiteContent();
  const copy = t.assistant.handoff;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    const trimmedContact = contact.trim();
    const trimmedMessage = message.trim();
    if (!trimmedContact) {
      setError(copy.contactInvalid);
      return;
    }
    if (!trimmedMessage) {
      setError(t.assistant.error.sendFailed);
      return;
    }

    setSubmitting(true);
    try {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      const container = turnstileContainerRef.current;
      if (!siteKey || !container) {
        setError(t.assistant.error.sendFailed);
        return;
      }

      const turnstileToken = await getTurnstileToken(siteKey, container);

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: trimmedContact,
          message: trimmedMessage,
          transcript: transcript.slice(-20).map((m) => ({
            role: m.role,
            content: m.content.slice(0, 1000),
          })),
          lang: locale,
          provider,
          turnstileToken,
        }),
      });

      if (res.status === 400) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error === "contact_invalid" ? copy.contactInvalid : t.assistant.error.sendFailed);
        return;
      }
      if (res.status === 429) {
        setError(t.assistant.error.limit);
        return;
      }
      if (!res.ok) {
        setError(t.assistant.error.sendFailed);
        return;
      }

      setSent(true);
    } catch {
      setError(t.assistant.error.sendFailed);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-line bg-raised p-4">
        <p className="type-body text-fg">{copy.sent}</p>
        <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={onCancel}>
          {t.common.close}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-line bg-raised p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="type-label text-fg">{copy.title}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          {t.common.close}
        </button>
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={copy.name}
        maxLength={100}
        className="w-full border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:border-line-strong focus:outline-none"
      />

      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder={copy.contact}
        maxLength={200}
        required
        className="w-full border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:border-line-strong focus:outline-none"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={copy.message}
        maxLength={2000}
        rows={3}
        required
        className="w-full resize-none border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:border-line-strong focus:outline-none"
      />

      {error && (
        <p role="alert" className="text-xs text-fg">
          {error}
        </p>
      )}

      <p className="text-xs text-fg-subtle">{copy.privacy}</p>

      <Button type="submit" variant="primary" size="sm" disabled={submitting} className="self-start">
        {copy.submit}
      </Button>
    </form>
  );
}
