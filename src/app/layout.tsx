import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** metadataBase required for relative OG image paths to resolve correctly in Next.js. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : new URL("https://zukka.com.ar");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "ZUKKA — Indumentaria importada premium",
    template: "%s — ZUKKA",
  },
  description:
    "Prendas importadas originales, elegidas una por una. Envíos a todo el país. Pagá como quieras en el checkout de Tienda Nube.",
  openGraph: {
    siteName: "ZUKKA",
    locale: "es_AR",
    type: "website",
    title: "ZUKKA — Indumentaria importada premium",
    description:
      "Prendas importadas originales, elegidas una por una. Envíos a todo el país.",
    images: [
      {
        url: "/images/zukka-hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "ZUKKA — Indumentaria importada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZUKKA — Indumentaria importada premium",
    description:
      "Prendas importadas originales, elegidas una por una. Envíos a todo el país.",
    images: ["/images/zukka-hero-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
