require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://dailyforsweatheart.netlify.app/";

if (!BOT_TOKEN) {
  console.error("Укажи BOT_TOKEN в переменных окружения (например в .env)");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const firstName = ctx.from?.first_name || "друг";
  return ctx.reply(
    `Привет, ${firstName}!\n\nЭто бот DailyFlow — планируй день и следи за задачами в одном месте. Нажми кнопку ниже, чтобы открыть приложение.`,
    Markup.inlineKeyboard([
      [Markup.button.url("Открыть DailyFlow", WEB_APP_URL)],
    ])
  );
});

bot.launch().then(() => {
  console.log("Бот запущен. WEB_APP_URL:", WEB_APP_URL);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
