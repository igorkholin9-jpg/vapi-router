// telegram/telegramApi.js
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.warn("⚠️ TELEGRAM_BOT_TOKEN is not set");
}

async function tgRequest(method, payload) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    console.error("❌ Telegram API error:", res.status, data);
    throw new Error(`Telegram API error: ${res.status}`);
  }

  return data.result;
}

async function sendMessage(chatId, text, extra = {}) {
  return tgRequest("sendMessage", {
    chat_id: chatId,
    text,
    ...extra,
  });
}

module.exports = { sendMessage };