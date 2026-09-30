"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "./LanguageProvider";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export default function ThemeToggle() {
  const { t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const changing = useRef(false);
  useEffect(() => setMounted(true), []);

  const label = mounted ? t.theme[resolvedTheme === "dark" ? "light" : "dark"] : t.theme.toggle;

  async function toggleTheme() {
    if (changing.current) return;
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const doc = document as TransitionDocument;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next);
      return;
    }
    changing.current = true;
    document.documentElement.classList.add("theme-transition");
    try {
      await doc.startViewTransition(() => flushSync(() => setTheme(next))).finished;
    } catch {
      // A skipped snapshot must never prevent changing the theme.
      setTheme(next);
    } finally {
      document.documentElement.classList.remove("theme-transition");
      changing.current = false;
    }
  }

  return (
    <button type="button" aria-label={label} title={label} disabled={!mounted} onClick={toggleTheme}
      className="theme-toggle relative ml-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center self-start rounded-xl text-muted hover:bg-hover hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus disabled:cursor-default">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="theme-sun absolute h-[18px] w-[18px]">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="theme-moon absolute h-[18px] w-[18px]">
        <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
      </svg>
    </button>
  );
}
