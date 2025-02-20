import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Dashboard",
  description: "家用電子紙主控板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
