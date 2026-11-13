/**
 * Local mock server for Groq SSE and Telegram Bot API on 127.0.0.1:8790.
 * Used for offline local E2E testing with `wrangler pages dev`.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT || 8790);

function readBody(req: import("node:http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const url = req.url ?? "/";

  if (req.method === "POST" && url === "/groq/openai/v1/chat/completions") {
    const raw = await readBody(req);
    let lastUserText = "";
    try {
      const parsed = JSON.parse(raw) as { messages?: { role?: string; content?: string }[] };
      const msgs = parsed.messages ?? [];
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i]?.role === "user") {
          lastUserText = msgs[i]?.content ?? "";
          break;
        }
      }
    } catch {
      // ignore
    }

    if (lastUserText.includes("FAIL429")) {
      res.writeHead(429, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: { message: "Mock rate limit" } }));
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
    });

    const chunks = [
      `data: ${JSON.stringify({ choices: [{ delta: { reasoning: "thinking" } }] })}\n\n`,
      `data: ${JSON.stringify({ choices: [{ delta: { content: "Привет! " } }] })}\n\n`,
      `data: ${JSON.stringify({ choices: [{ delta: { content: "Dmytro builds web apps in Riga." } }] })}\n\n`,
      `data: [DONE]\n\n`,
    ];

    for (const chunk of chunks) {
      res.write(chunk);
    }
    res.end();
    return;
  }

  if (req.method === "POST" && /^\/telegram\/bot[^/]+\/sendMessage$/.test(url)) {
    const raw = await readBody(req);
    console.log("[mock-telegram] sendMessage payload:", raw);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, result: { message_id: 1 } }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[mock-upstreams] listening on http://127.0.0.1:${PORT}`);
});
