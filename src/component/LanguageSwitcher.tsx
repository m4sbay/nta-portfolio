"use client";

import { locales } from "../i18n/translations";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div role="group" aria-label={t.language} className="relative -top-5 mb-6 flex items-center gap-2 text-xs leading-6">
      {locales.map((language, index) => (
        <span key={language} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true" className="text-muted">/</span>}
          <button type="button" lang={language} aria-label={t.languages[language]} aria-pressed={locale === language}
            onClick={() => setLocale(language)}
            className="cursor-pointer rounded-sm py-1 font-normal text-muted hover:text-foreground aria-pressed:text-foreground aria-pressed:font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
            {language.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
