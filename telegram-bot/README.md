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

---

## Деплой на Netlify (вместе с сайтом)

Бот может работать на Netlify как serverless-функция (вебхук). Код функции: `netlify/functions/telegram-webhook.js`.

### Что сделать один раз после деплоя

1. **Переменные в Netlify**  
   В Netlify: Site → Settings → Environment variables добавь:
   - `BOT_TOKEN` — токен от @BotFather  
   - `WEB_APP_URL` — ссылка на приложение (например `https://dailyforsweatheart.netlify.app`)

2. **Включить вебхук в Telegram (один раз)**  
   Telegram должен знать, куда слать сообщения для бота — на твой Netlify.

   **Вариант А — скрипт (проще всего)**  
   - В папке `telegram-bot` создай файл `.env` и напиши в нему одну строку:  
     `BOT_TOKEN=твой_токен_от_BotFather`  
   - Если сайт не `dailyforsweatheart.netlify.app`, добавь вторую строку:  
     `WEB_APP_URL=https://твой-сайт.netlify.app`  
   - Открой **Терминал** (на Mac: Программы → Утилиты → Терминал; или в Cursor/VS Code внизу вкладка Terminal).  
   - Перейди в папку бота и запусти скрипт:
     ```bash
     cd telegram-bot
     node set-webhook.js
     ```
   - Должно появиться «Готово. Вебхук включён.»

   **Вариант Б — вручную через браузер**  
   - Открой в браузере ссылку (подставь вместо `ТВОЙ_ТОКЕН` свой токен от BotFather, вместо `твой-сайт` — свой домен Netlify):
     ```
     https://api.telegram.org/botТВОЙ_ТОКЕН/setWebhook?url=https://твой-сайт.netlify.app/.netlify/functions/telegram-webhook
     ```
   - Пример: если токен `123456789:ABCdefGHI`, сайт `dailyforsweatheart.netlify.app`, то ссылка:
     ```
     https://api.telegram.org/bot123456789:ABCdefGHI/setWebhook?url=https://dailyforsweatheart.netlify.app/.netlify/functions/telegram-webhook
     ```
   - На странице должно быть что-то вроде `{"ok":true,"result":true,...}`.

   После этого напиши боту в Telegram **Start** — он должен ответить и показать кнопку.
