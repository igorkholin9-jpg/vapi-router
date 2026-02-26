const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ASSISTANTS = {
  ru: process.env.ASSISTANT_RU_ID,
  en: process.env.ASSISTANT_EN_ID,
  es: process.env.ASSISTANT_ES_ID,
};

function detectLang(text = "") {
  if (/[а-яё]/i.test(text)) return "ru";
  if (text.toLowerCase().includes("hola")) return "es";
  return "en";
}

app.post("/route", (req, res) => {
  const text =
    req.body?.text ||
    req.body?.transcript ||
    req.body?.message ||
    "";

  const lang = detectLang(text);
  const assistantId = ASSISTANTS[lang] || ASSISTANTS.en;

  console.log("Incoming:", text);
  console.log("Detected:", lang);

  res.json({ assistantId });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Router running on port", PORT);
});