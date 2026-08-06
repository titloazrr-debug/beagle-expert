import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const tenant = getTenant();

export const metadata: Metadata = buildMetadata({
  title: tenant.name,
  description: tenant.description,
  path: "/",
  image: "/images/beagle/og-default.jpg",
  keywords: [
    "Beagle",
    "guide Beagle",
    "quiz Beagle",
    "santé Beagle",
    "éducation Beagle",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${dmSans.variable} ${fraunces.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotWidget />
        <CookieBanner />
      </body>
    </html>
  );
}
