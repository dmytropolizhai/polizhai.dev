import type { Env } from "./env.ts";
import type { ChatMessage } from "./validate.ts";

const MAX_TELEGRAM_LENGTH = 4096;

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatRigaTimestamp(date = new Date()): string {
  const formatted = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Riga",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${formatted} EET`;
}

export function formatLeadMessage(input: {
  name?: string;
  contact: string;
  message: string;
  transcript: readonly ChatMessage[];
  lang: string;
  provider: string;
  now?: Date;
}): string {
  const safeName = input.name?.trim() ? escapeHtml(input.name.trim()) : "—";
  const safeContact = escapeHtml(input.contact.trim());
  const safeMessage = escapeHtml(input.message.trim());
  const footer = `Язык: ${escapeHtml(input.lang)} · Модель: ${escapeHtml(input.provider)} · ${formatRigaTimestamp(input.now)}`;

  const recentTurns = input.transcript.slice(-6).map((m) => {
    const label = m.role === "user" ? "Гость" : "AI";
    return `${label}: ${escapeHtml(m.content)}`;
  });

  const build = (turns: string[], msg: string) => {
    const parts = [
      "🆕 <b>Заявка с polizhai.dev</b>",
      `Имя: ${safeName}  Контакт: ${safeContact}`,
      `Вопрос: ${msg}`,
    ];
    if (turns.length > 0) {
      parts.push(`— переписка (последние ${turns.length} реплик) —`);
      parts.push(...turns);
    }
    parts.push(footer);
    return parts.join("\n");
  };

  // Trim oldest transcript turns first if message exceeds 4096 chars
  const turns = [...recentTurns];
  let output = build(turns, safeMessage);
  while (output.length > MAX_TELEGRAM_LENGTH && turns.length > 0) {
    turns.shift();
    output = build(turns, safeMessage);
  }

  if (output.length > MAX_TELEGRAM_LENGTH) {
    const overhead = build([], "").length;
    const allowedMsgLen = Math.max(0, MAX_TELEGRAM_LENGTH - overhead - 1);
    output = build([], `${safeMessage.slice(0, allowedMsgLen)}…`);
  }

  return output;
}

export async function sendTelegramMessage(
  env: Env,
  htmlText: string,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    return false;
  }

  const base = (env.TELEGRAM_API_BASE?.trim() || "https://api.telegram.org").replace(/\/$/, "");
  const url = `${base}/bot${token}/sendMessage`;

  try {
    const res = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error(`[telegram] sendMessage failed with HTTP ${res.status}`);
      return false;
    }
    const data = (await res.json()) as { ok?: unknown };
    return data?.ok === true;
  } catch (err) {
    console.error(
      "[telegram] sendMessage network error:",
      err instanceof Error ? err.message : "unknown",
    );
    return false;
  }
}
