const express = require("express");
const cors = require("cors");
const telegramRoutes = require("./telegram/telegramRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/telegram", telegramRoutes);

const ASSISTANTS = {
  ru: process.env.ASSISTANT_RU_ID,
  en: process.env.ASSISTANT_EN_ID,
  gateway: process.env.ASSISTANT_GATEWAY_ID,
};

// 1) достаём текст максимально безопасно
function extractText(body) {
  if (!body) return "";

  // если уже строка
  if (typeof body === "string") return body;

  // частые варианты
  const candidates = [
    body.text,
    body.transcript,
    body.message,                 // иногда message строкой
    body.message?.text,
    body.message?.transcript,
    body.message?.content,
    body.input,
    body.userText,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }

  // если прилетел объект вместо текста — не падаем
  return "";
}

// 2) детект языка (очень простой)
function detectLang(text) {
  const s = (typeof text === "string" ? text : "").toLowerCase();

  // кириллица => ru
  const hasCyrillic = /[а-яё]/i.test(s);
  if (hasCyrillic) return "ru";

  // иначе en (пока так)
  return "en";
}

app.post("/route", (req, res) => {
  const text = extractText(req.body);
  const lang = detectLang(text);
  const assistantId = lang === "ru" ? ASSISTANTS.ru : ASSISTANTS.en;

  console.log("Incoming body keys:", req.body ? Object.keys(req.body) : null);
  console.log("Extracted text:", text);
  console.log("Detected lang:", lang);
  console.log("Routing to assistantId:", assistantId);

  // важно: не возвращай undefined, иначе Vapi может не принять
  if (!assistantId) {
    return res.status(500).json({
      error: "assistantId is missing. Check env ASSISTANT_RU_ID / ASSISTANT_EN_ID",
    });
  }

  return res.json({ assistantId });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/telegram/webhook", (req, res) => {
  console.log("TELEGRAM UPDATE:", JSON.stringify(req.body));
  return res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Router running on port", PORT));