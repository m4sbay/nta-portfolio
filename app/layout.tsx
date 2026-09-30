import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dwi Sinta Maharani — Dentistry Professional Student",
  description: "Dentistry Professional Student at Universitas Baiturrahmah, currently completing clinical training at RSGMP Baiturrahmah, with previous experience as a Dental Assistant."
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
