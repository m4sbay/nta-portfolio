"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { localeCookie, translations, type Locale } from "../i18n/translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations[Locale];
};
const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, updateLocale] = useState(initialLocale);
  const t = translations[locale];

  function setLocale(next: Locale) {
    document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    updateLocale(next);
  }

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.metadata.description);
  }, [locale, t]);

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires LanguageProvider");
  return context;
}
