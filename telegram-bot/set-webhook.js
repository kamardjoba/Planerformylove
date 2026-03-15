/**
 * Один раз запусти этот скрипт после деплоя на Netlify,
 * чтобы Telegram слал сообщения бота на твой сайт.
 *
 * Как запустить:
 * 1. В папке telegram-bot создай .env с BOT_TOKEN=твой_токен
 * 2. Подставь свой домен Netlify в WEBHOOK_BASE ниже (или в .env как WEB_APP_URL)
 * 3. В терминале: cd telegram-bot && node set-webhook.js
 */

require("dotenv").config();

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
