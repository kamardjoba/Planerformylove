const { Telegraf, Markup } = require("telegraf");
const { startMessage, buttonLabel, buttonUrl } = require("../../telegram-bot/bot-content.js");

const BOT_TOKEN = process.env.BOT_TOKEN;
const buttonLink = process.env.WEB_APP_URL || buttonUrl;

const bot = new Telegraf(BOT_TOKEN, { telegram: { webhookReply: true } });

bot.start((ctx) => {
  return ctx.reply(
    startMessage,
    Markup.inlineKeyboard([[Markup.button.url(buttonLabel, buttonLink)]])
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
