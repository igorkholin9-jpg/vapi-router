// telegram/telegramRoutes.js
const express = require("express");
const { handleTelegramUpdate } = require("./telegramHandlers");

const router = express.Router();

const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// health
router.get("/health", (req, res) => res.json({ ok: true, service: "telegram" }));

// webhook с секретом в URL
router.post("/webhook", async (req, res) => {
  try {
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