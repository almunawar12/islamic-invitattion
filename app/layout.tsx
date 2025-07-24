import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Undangan 1 Muharram 1447 H & Reuni IKASAN ke-3",
  description:
    "Undangan peringatan 1 Muharram 1447 H dan Reuni Akbar IKASAN ke-3",
  keywords: ["1 Muharram", "IKASAN", "Reuni", "Tahun Baru Islam", "Undangan"],
  authors: [{ name: "IKASAN" }],
  openGraph: {
    title: "Undangan 1 Muharram 1447 H & Reuni IKASAN ke-3",
    description:
      "Undangan peringatan 1 Muharram 1447 H dan Reuni Akbar IKASAN ke-3",
    type: "website",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
