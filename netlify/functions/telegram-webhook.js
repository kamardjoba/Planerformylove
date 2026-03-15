const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL =
  process.env.WEB_APP_URL || "https://dailyforsweatheart.netlify.app/";

const bot = new Telegraf(BOT_TOKEN, { telegram: { webhookReply: true } });

bot.start((ctx) => {
  const firstName = ctx.from?.first_name || "друг";
  return ctx.reply(
    `Привет, ${firstName}!\n\nЭто бот DailyFlow — планируй день и следи за задачами в одном месте. Нажми кнопку ниже, чтобы открыть приложение.`,
    Markup.inlineKeyboard([
      [Markup.button.url("Открыть DailyFlow", WEB_APP_URL)],
    ])
  );
});

exports.handler = async (event, context) => {
  if (!BOT_TOKEN) {
    return { statusCode: 500, body: "BOT_TOKEN not set" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const update = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    await bot.handleUpdate(update);
    return { statusCode: 200, body: "" };
  } catch (err) {
    console.error("Webhook error:", err);
    return { statusCode: 200, body: "" };
  }
};
