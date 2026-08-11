import type { Metadata } from "next";
import { Instrument_Serif, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_URL = "https://beautymatch.app";
const SITE_DESCRIPTION =
  "Beauty Match reads your skin type, concerns, and preferences, then matches you to real skincare products with the exact reasoning behind every recommendation — not another generic beauty ecommerce feed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Beauty Match — Skincare matched to your skin, not the other way around",
    template: "%s — Beauty Match",
  },
  description: SITE_DESCRIPTION,
  keywords: ["skincare matching", "skin quiz", "beauty match", "skincare recommendations", "ingredient explorer"],
  openGraph: {
    title: "Beauty Match",
    description: SITE_DESCRIPTION,
    siteName: "Beauty Match",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Match",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[var(--ink)] focus:text-[var(--bg)]"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
