import type { Metadata } from "next";
import "./globals.css";
import { profile } from "../src/content/profile";
import { getFirstParagraph } from "../src/lib/writing";

export const metadata: Metadata = {
  title: "Sinta Maharani Portofolio",
  description: `${getFirstParagraph(profile.about)} With previous experience as a Dental Assistant.`
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen w-full scroll-smooth">
      <body className="min-h-screen w-full m-0">{children}</body>
    </html>
  );
}
