import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dwi Sinta Maharani",
  description: "Portfolio website."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
