import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { site } from "@/lib/content";
import "./globals.css";

/* The only webfont on the page. Display type is drawn as dots from the
   panel's own bitmap font, so it needs no file at all. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Where this site actually lives, in order of confidence: the domain declared
 * in content.ts, then the production domain Vercel is serving, then localhost.
 *
 * Every absolute URL in the metadata is built from this, including the social
 * card. Pointing it at a domain that has not been bought yet is how a launch
 * page ends up with a broken preview everywhere it gets shared.
 */
const origin =
  site.url ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: site.title,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: origin,
    siteName: site.brand,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e6",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
        {/* Grain sits over everything, fixed, so it never repaints on scroll. */}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
