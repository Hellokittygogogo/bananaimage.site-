"use client";
import React from 'react';

export type Messages = Record<string, string>;

const Ctx = React.createContext<{
  locale: string;
  t: (k: string) => string;
} | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Messages;
  children: React.ReactNode;
}) {
  const t = React.useCallback((k: string) => messages[k] ?? k, [messages]);
  return <Ctx.Provider value={{ locale, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = React.useContext(Ctx);
  if (!v) return { locale: 'en', t: (k: string) => k } as const;
  return v;
}
