import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotWidgetLazy } from "@/components/ChatbotWidgetLazy";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { JsonLd } from "@/components/JsonLd";
import {
  buildMetadata,
  HOME_META_DESCRIPTION,
  organizationJsonLd,
} from "@/lib/seo";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontDisplay = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

const tenant = getTenant();

export const metadata: Metadata = buildMetadata({
  title: tenant.name,
  description: HOME_META_DESCRIPTION,
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
        className={`${dmSans.variable} ${fontDisplay.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotWidgetLazy />
        <CookieBanner />
      </body>
    </html>
  );
}
