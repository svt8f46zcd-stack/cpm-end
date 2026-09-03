import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: true });

export const metadata: Metadata = {
  metadataBase: new URL("https://cpm-energie.de"),
  title: {
    default: "CPM Energie | Strom & Gas Tarifcheck",
    template: "%s | CPM Energie",
  },
  description: "Strom und Gas kostenlos prüfen, Einsparpotenzial erkennen und auf Wunsch persönlich beraten lassen. CPM Energie für Privat und Gewerbe.",
  keywords: ["Stromvergleich", "Gasvergleich", "Energieberatung", "Tarifcheck", "Stromtarif", "Gastarif", "Energiekosten sparen"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://cpm-energie.de",
    siteName: "CPM Energie",
    title: "CPM Energie | Strom & Gas Tarifcheck",
    description: "Tarif kostenlos prüfen und Einsparpotenzial entdecken.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPM Energie | Strom & Gas Tarifcheck",
    description: "Kostenloser Tarifcheck für Privat und Gewerbe.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
