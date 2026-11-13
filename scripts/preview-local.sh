#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOCAL_DIR="/tmp/polizhai-wrangler-local"
PORT="${PORT:-8788}"

rm -rf "$LOCAL_DIR"
mkdir -p "$LOCAL_DIR"

# Strip the [ai] binding so wrangler pages dev runs purely locally without Cloudflare OAuth.
awk '
  /^\[ai\]/ { skip=1; next }
  skip && /^\[/ { skip=0 }
  skip && /^binding[[:space:]]*=/ { next }
  !skip { print }
' "$ROOT_DIR/wrangler.toml" > "$LOCAL_DIR/wrangler.toml"

cp -a "$ROOT_DIR/out" "$LOCAL_DIR/out"
cp -a "$ROOT_DIR/functions" "$LOCAL_DIR/functions"

if [ -f "$ROOT_DIR/.dev.vars" ]; then
  cp "$ROOT_DIR/.dev.vars" "$LOCAL_DIR/.dev.vars"
else
  # Copy .dev.vars.example and enable local mock upstream overrides
  sed -e 's/^# GROQ_BASE_URL=/GROQ_BASE_URL=/' \
      -e 's/^# TELEGRAM_API_BASE=/TELEGRAM_API_BASE=/' \
      -e 's/^GROQ_API_KEY=.*/GROQ_API_KEY=mock-groq-key/' \
      -e 's/^TELEGRAM_BOT_TOKEN=.*/TELEGRAM_BOT_TOKEN=mock-bot-token/' \
      -e 's/^TELEGRAM_CHAT_ID=.*/TELEGRAM_CHAT_ID=123456/' \
      "$ROOT_DIR/.dev.vars.example" > "$LOCAL_DIR/.dev.vars"
fi

cd "$LOCAL_DIR"
exec "$ROOT_DIR/node_modules/.bin/wrangler" pages dev out --port "$PORT"
