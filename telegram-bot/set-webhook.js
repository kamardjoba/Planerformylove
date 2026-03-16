/**
 * Один раз запусти этот скрипт после деплоя на Netlify,
 * чтобы Telegram слал сообщения бота на твой сайт.
 *
 * Как запустить:
 * 1. В папке telegram-bot: npm install  (один раз)
 * 2. Создай .env с BOT_TOKEN=твой_токен и при необходимости WEB_APP_URL=...
 * 3. node set-webhook.js
 */

try {
  require("dotenv").config();
} catch (e) {
  if (e.code === "MODULE_NOT_FOUND") {
    console.error("Сначала установи зависимости: npm install");
    process.exit(1);
  }
  throw e;
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_BASE =
  process.env.WEB_APP_URL || "https://dailyforsweatheart.netlify.app";
const WEBHOOK_PATH = "/.netlify/functions/telegram-webhook";
const WEBHOOK_URL = WEBHOOK_BASE.replace(/\/$/, "") + WEBHOOK_PATH;

if (!BOT_TOKEN) {
  console.error(
    "Нужен BOT_TOKEN. Создай файл .env в папке telegram-bot и напиши: BOT_TOKEN=твой_токен_от_BotFather"
  );
  process.exit(1);
}

async function setWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(WEBHOOK_URL)}`;
  console.log("Отправляю запрос в Telegram...");
  console.log("URL вебхука:", WEBHOOK_URL);
  const res = await fetch(url);
  const data = await res.json();
  if (data.ok) {
    console.log("Готово. Вебхук включён. Можно писать боту /start в Telegram.");
  } else {
    console.error("Ошибка:", data.description || data);
    process.exit(1);
  }
}

setWebhook();
