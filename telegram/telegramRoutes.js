// telegram/telegramRoutes.js
const express = require("express");
const { handleTelegramUpdate } = require("./telegramHandlers");

const router = express.Router();

const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// health
router.get("/health", (req, res) => res.json({ ok: true, service: "telegram" }));

// webhook с секретом в URL
router.post("/webhook/:secret", async (req, res) => {
  try {
    if (!TELEGRAM_WEBHOOK_SECRET) {
      return res.status(500).json({ error: "TELEGRAM_WEBHOOK_SECRET is not set" });
    }

    if (req.params.secret !== TELEGRAM_WEBHOOK_SECRET) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Telegram ждёт 200 быстро. Обработку делаем async без долгих зависаний
    const update = req.body;
    res.json({ ok: true });

    await handleTelegramUpdate(update);
  } catch (e) {
    console.error("❌ Telegram webhook error:", e);
    // мы уже ответили 200 выше, но на всякий:
    // res.status(200).send("ok");
  }
});

module.exports = router;