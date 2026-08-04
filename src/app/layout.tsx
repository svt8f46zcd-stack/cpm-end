import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "cpm-energie.de | Unabhängige Energieberatung",
  description: "Schluss mit zu hohen Strom- und Gaspreisen – Wir optimieren Ihre Tarife kostenlos! Unabhängige Beratung für Privat- und Geschäftskunden in Deutschland.",
  keywords: ["Energieberatung", "Stromvergleich", "Gasvergleich", "Tarifoptimierung", "Energiekosten sparen"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
