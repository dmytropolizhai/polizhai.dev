export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ValidatedChatBody = {
  messages: ChatMessage[];
  turnstileToken?: string;
  locale: string;
};

export type ValidatedLeadBody = {
  name: string;
  contact: string;
  message: string;
  transcript: ChatMessage[];
  lang: "en" | "lv" | "ru" | "uk" | "other";
  provider: "groq" | "workers-ai" | "none";
  turnstileToken: string;
};

type ValidationResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const VALID_LOCALES = new Set(["en", "lv", "ru", "uk"]);
const VALID_LANGS = new Set(["en", "lv", "ru", "uk", "other"]);
const VALID_PROVIDERS = new Set(["groq", "workers-ai", "none"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_HANDLE_RE = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
const TELEGRAM_URL_RE = /^(?:https?:\/\/)?t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}\/?$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validateMessagesArray(
  raw: unknown,
  maxItems: number,
  allowEmpty: boolean,
): ValidationResult<ChatMessage[]> {
  if (!Array.isArray(raw)) {
    return { ok: false, status: 400, error: "bad_request" };
  }
  if (!allowEmpty && raw.length === 0) {
    return { ok: false, status: 400, error: "bad_request" };
  }
  if (raw.length > maxItems) {
    return { ok: false, status: 400, error: "too_long" };
  }

  const out: ChatMessage[] = [];
  for (const item of raw) {
    if (!isRecord(item)) {
      return { ok: false, status: 400, error: "bad_request" };
    }
    if (item.role !== "user" && item.role !== "assistant") {
      return { ok: false, status: 400, error: "bad_request" };
    }
    if (typeof item.content !== "string") {
      return { ok: false, status: 400, error: "bad_request" };
    }
    const trimmed = item.content.trim();
    if (trimmed.length === 0) {
      return { ok: false, status: 400, error: "bad_request" };
    }
    if (trimmed.length > 1000) {
      return { ok: false, status: 400, error: "too_long" };
    }
    out.push({ role: item.role, content: trimmed });
  }
  return { ok: true, data: out };
}

export function validateChatBody(raw: unknown): ValidationResult<ValidatedChatBody> {
  if (!isRecord(raw)) {
    return { ok: false, status: 400, error: "bad_request" };
  }

  const msgs = validateMessagesArray(raw.messages, 10, false);
  if (!msgs.ok) return msgs;

  const last = msgs.data[msgs.data.length - 1];
  if (!last || last.role !== "user") {
    return { ok: false, status: 400, error: "bad_request" };
  }

  let turnstileToken: string | undefined;
  if (raw.turnstileToken !== undefined && raw.turnstileToken !== null) {
    if (typeof raw.turnstileToken !== "string" || raw.turnstileToken.length > 4096) {
      return { ok: false, status: 400, error: "bad_request" };
    }
    const trimmed = raw.turnstileToken.trim();
    if (trimmed.length > 0) turnstileToken = trimmed;
  }

  const locale =
    typeof raw.locale === "string" && VALID_LOCALES.has(raw.locale) ? raw.locale : "en";

  return {
    ok: true,
    data: {
      messages: msgs.data,
      turnstileToken,
      locale,
    },
  };
}

export function isValidContact(contact: string): boolean {
  const c = contact.trim();
  if (!c || c.length > 200) return false;
  if (EMAIL_RE.test(c)) return true;
  if (TELEGRAM_HANDLE_RE.test(c) || TELEGRAM_URL_RE.test(c)) return true;
  if (PHONE_RE.test(c) && (c.match(/\d/g)?.length ?? 0) >= 7) return true;
  return false;
}

export function validateLeadBody(raw: unknown): ValidationResult<ValidatedLeadBody> {
  if (!isRecord(raw)) {
    return { ok: false, status: 400, error: "bad_request" };
  }

  let name = "";
  if (raw.name !== undefined && raw.name !== null) {
    if (typeof raw.name !== "string") {
      return { ok: false, status: 400, error: "bad_request" };
    }
    name = raw.name.trim();
    if (name.length > 100) {
      return { ok: false, status: 400, error: "too_long" };
    }
  }

  if (typeof raw.contact !== "string") {
    return { ok: false, status: 400, error: "contact_invalid" };
  }
  const contact = raw.contact.trim();
  if (!isValidContact(contact)) {
    return { ok: false, status: 400, error: "contact_invalid" };
  }

  if (typeof raw.message !== "string") {
    return { ok: false, status: 400, error: "bad_request" };
  }
  const message = raw.message.trim();
  if (message.length === 0) {
    return { ok: false, status: 400, error: "bad_request" };
  }
  if (message.length > 2000) {
    return { ok: false, status: 400, error: "too_long" };
  }

  let transcript: ChatMessage[] = [];
  if (raw.transcript !== undefined && raw.transcript !== null) {
    const parsed = validateMessagesArray(raw.transcript, 20, true);
    if (!parsed.ok) return parsed;
    transcript = parsed.data;
  }

  if (typeof raw.turnstileToken !== "string" || raw.turnstileToken.trim().length === 0) {
    return { ok: false, status: 401, error: "turnstile_required" };
  }
  if (raw.turnstileToken.length > 4096) {
    return { ok: false, status: 400, error: "bad_request" };
  }

  const lang =
    typeof raw.lang === "string" && VALID_LANGS.has(raw.lang)
      ? (raw.lang as ValidatedLeadBody["lang"])
      : "other";

  const provider =
    typeof raw.provider === "string" && VALID_PROVIDERS.has(raw.provider)
      ? (raw.provider as ValidatedLeadBody["provider"])
      : "none";

  return {
    ok: true,
    data: {
      name,
      contact,
      message,
      transcript,
      lang,
      provider,
      turnstileToken: raw.turnstileToken.trim(),
    },
  };
}
