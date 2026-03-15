# DailyFlow Telegram Bot

Бот отвечает на команду **Start** текстом и показывает инлайн-кнопку для открытия веб-приложения DailyFlow.

## Настройка

1. Создай бота в Telegram через [@BotFather](https://t.me/BotFather): команда `/newbot`, получи токен.
2. Скопируй пример конфига и заполни значения:
   ```bash
   cp .env.example .env
   ```
3. В `.env` укажи:
   - `BOT_TOKEN` — токен от BotFather
   - `WEB_APP_URL` — ссылка на приложение (например `https://your-dailyflow.vercel.app` или `http://localhost:3000` для разработки)

## Запуск

```bash
cd telegram-bot
npm install
npm start
```

Для разработки с автоперезапуском:

```bash
npm run dev
```

После запуска при нажатии **Start** в боте пользователь увидит приветствие и кнопку **«Открыть DailyFlow»**, которая открывает твоё веб-приложение.
