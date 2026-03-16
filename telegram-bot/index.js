require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://dailyforsweatheart.netlify.app/";
const WEB_APP_URL_2 = "https://ru.pikbest.com/video/funny-cat-dancing-meme-green-screen-video_10044028.html";

if (!BOT_TOKEN) {
  console.error("Укажи BOT_TOKEN в переменных окружения (например в .env)");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  //const firstName = ctx.from?.first_name || "друг";
  return ctx.reply(
    `Привет, Любимка!\n\nЯ тут накидав чуть чуть шо придумав, надіюсь тобі сподобається. Передивись шо так шо не так, чого в хотілось більше. Бажаю тобі гарного дня, коли прочитаєш це надіюсь посміхнешся, кохаю тебе дуже сильно мій сексі зайчик♥️. P.S Якщо з першогно разу не відкриється спробуй ще`,
    Markup.inlineKeyboard([
      [Markup.button.url("Торкнися мене своїми пальчиками", WEB_APP_URL)],
    ])
  );
});

bot.launch().then(() => {
  console.log("Бот запущен. WEB_APP_URL:", WEB_APP_URL);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
