import type { Env } from "./env.ts";
import type { ChatMessage } from "./validate.ts";

export type LlmProvider = "groq" | "workers-ai";

const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
const DEFAULT_WORKERS_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const GROQ_TIMEOUT_MS = 15_000;

function resolveGroqEndpoint(env: Env): string {
  if (env.GROQ_BASE_URL?.trim()) {
    return `${env.GROQ_BASE_URL.trim().replace(/\/$/, "")}/chat/completions`;
  }
  if (env.CF_ACCOUNT_ID?.trim() && env.AI_GATEWAY_ID?.trim()) {
    return `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID.trim()}/${env.AI_GATEWAY_ID.trim()}/groq/chat/completions`;
  }
  return "https://api.groq.com/openai/v1/chat/completions";
}

function extractDeltaText(jsonLine: string): string {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonLine) as Record<string, unknown>;
  } catch {
    return "";
  }

  // OpenAI / Groq / newer Workers AI shape: choices[0].delta.content
  const choices = parsed.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const first = choices[0] as Record<string, unknown> | undefined;
    const delta = first?.delta as Record<string, unknown> | undefined;
    if (typeof delta?.content === "string") {
      return delta.content;
    }
    return "";
  }

  // Classic Workers AI SSE shape: { "response": "..." }
  if (typeof parsed.response === "string") {
    return parsed.response;
  }

  return "";
}

/**
 * Normalizes an SSE byte stream (Groq or Workers AI) into a plain UTF-8 text stream.
 * Handles partial lines and multi-byte UTF-8 characters split across chunks.
 */
export function createNormalizedSseStream(
  source: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: false });
  const encoder = new TextEncoder();
  const reader = source.getReader();
  let buffer = "";

  const processLines = (
    lines: string[],
    controller: ReadableStreamDefaultController<Uint8Array>,
  ): boolean => {
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || !line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") {
        return true;
      }
      const text = extractDeltaText(payload);
      if (text.length > 0) {
        controller.enqueue(encoder.encode(text));
      }
    }
    return false;
  };

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            buffer += decoder.decode();
            if (buffer.length > 0) {
              processLines(buffer.split(/\r?\n/), controller);
              buffer = "";
            }
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split(/\r?\n/);
          buffer = parts.pop() ?? "";
          if (parts.length > 0) {
            const finished = processLines(parts, controller);
            if (finished) {
              await reader.cancel();
              controller.close();
              return;
            }
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
    async cancel(reason) {
      await reader.cancel(reason);
    },
  });
}

export async function streamChat(
  env: Env,
  system: string,
  messages: readonly ChatMessage[],
  opts: {
    fetchFn?: typeof fetch;
    maxTokens?: number;
    temperature?: number;
    timeoutMs?: number;
  } = {},
): Promise<{ stream: ReadableStream<Uint8Array>; provider: LlmProvider }> {
  const fetchFn = opts.fetchFn ?? fetch;
  const maxTokens = opts.maxTokens ?? 400;
  const temperature = opts.temperature ?? 0.3;
  const timeoutMs = opts.timeoutMs ?? GROQ_TIMEOUT_MS;

  const fullMessages = [{ role: "system" as const, content: system }, ...messages];
  const groqKey = env.GROQ_API_KEY?.trim();

  if (groqKey) {
    const model = env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;
    const body: Record<string, unknown> = {
      model,
      messages: fullMessages,
      stream: true,
      max_tokens: maxTokens,
      temperature,
    };
    if (model.startsWith("openai/gpt-oss")) {
      body.reasoning_effort = "low";
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetchFn(resolveGroqEndpoint(env), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok && res.body) {
        return {
          stream: createNormalizedSseStream(res.body),
          provider: "groq",
        };
      }
      console.warn(`[llm] Groq returned HTTP ${res.status}, falling back to Workers AI`);
    } catch (err) {
      clearTimeout(timer);
      console.warn(
        "[llm] Groq request failed, falling back to Workers AI:",
        err instanceof Error ? err.message : "unknown",
      );
    }
  }

  if (env.AI) {
    const model = env.WORKERS_AI_MODEL?.trim() || DEFAULT_WORKERS_AI_MODEL;
    const gatewayOpts = env.AI_GATEWAY_ID?.trim()
      ? { gateway: { id: env.AI_GATEWAY_ID.trim() } }
      : undefined;

    const raw = await env.AI.run(
      model as Parameters<Ai["run"]>[0],
      {
        messages: fullMessages,
        stream: true,
        max_tokens: maxTokens,
        temperature,
      },
      gatewayOpts,
    );

    if (raw instanceof ReadableStream) {
      return {
        stream: createNormalizedSseStream(raw as ReadableStream<Uint8Array>),
        provider: "workers-ai",
      };
    }
  }

  throw new Error("All LLM providers unavailable");
}
