import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "../src/component/ThemeProvider";
import { cookies } from "next/headers";
import LanguageProvider from "../src/component/LanguageProvider";
import { localeCookie, parseLocale, translations } from "../src/i18n/translations";

function getLocale() {
  return parseLocale(cookies().get(localeCookie)?.value);
}

export function generateMetadata(): Metadata {
  return translations[getLocale()].metadata;
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();
  return (
    <html suppressHydrationWarning lang={locale} className="min-h-screen w-full scroll-smooth">
      <body className="min-h-screen w-full m-0"><ThemeProvider><LanguageProvider initialLocale={locale}>{children}</LanguageProvider></ThemeProvider></body>
    </html>
  );
}
