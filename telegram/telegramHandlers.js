// telegram/telegramHandlers.js
const { sendMessage } = require("./telegramApi");

// сюда позже вставим интеграцию: Vapi / Firebase / твой ассистент
async function handleTelegramUpdate(update) {
  // интересует обычное сообщение
  const msg = update?.message;
  if (!msg) return;

  const chatId = msg.chat?.id;
  const text = (msg.text || "").trim();

  if (!chatId) return;

  // простая логика для теста
  if (!text) {
    await sendMessage(chatId, "Я вижу сообщение, но текста нет 🙂");
    return;
  }

  if (text === "/start") {
    await sendMessage(chatId, "Привет! Я тестовый бот CallTechAI в Telegram ✅\nНапиши любое сообщение — я отвечу.");
    return;
  }

  // пока просто echo (чтобы убедиться что webhook работает)
  await sendMessage(chatId, `✅ Получил: ${text}`);
}

module.exports = { handleTelegramUpdate };