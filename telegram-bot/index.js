require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const { startMessage, buttonLabel } = require("./bot-content.js");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://dailyforsweatheart.netlify.app/";

if (!BOT_TOKEN) {
  console.error("Укажи BOT_TOKEN в переменных окружения (например в .env)");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply(
    startMessage,
    Markup.inlineKeyboard([[Markup.button.url(buttonLabel, WEB_APP_URL)]])
  );
});

bot.launch().then(() => {
  console.log("Бот запущен. WEB_APP_URL:", WEB_APP_URL);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
