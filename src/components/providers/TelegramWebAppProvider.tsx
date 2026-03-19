"use client";

import { useEffect } from "react";

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
};

type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

export function TelegramWebAppProvider() {
  useEffect(() => {
    const tg = (window as TelegramWindow).Telegram?.WebApp;
    if (!tg) return;

    tg.ready?.();
    tg.expand?.();
    tg.disableVerticalSwipes?.();
  }, []);

  return null;
}
