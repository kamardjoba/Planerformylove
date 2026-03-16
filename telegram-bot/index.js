require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const { startMessage, buttonLabel, buttonUrl } = require("./bot-content.js");

const BOT_TOKEN = process.env.BOT_TOKEN;
//const WEB_APP_URL = process.env.WEB_APP_URL || buttonUrl;

if (!BOT_TOKEN) {
  console.error("Укажи BOT_TOKEN в переменных окружения (например в .env)");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const url = process.env.WEB_APP_URL || buttonUrl;
  return ctx.reply(
    startMessage,
    Markup.inlineKeyboard([[Markup.button.url(buttonLabel, url)]])
  );
});

bot.launch().then(() => {
  console.log("Бот запущен. Ссылка кнопки:", process.env.WEB_APP_URL || buttonUrl);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
