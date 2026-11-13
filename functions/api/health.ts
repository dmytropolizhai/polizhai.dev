import type { PagesFunction } from "@cloudflare/workers-types";
import type { Env } from "../_lib/env";

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
