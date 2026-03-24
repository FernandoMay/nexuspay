import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Pay | The Global Value Layer",
  description: "Send, earn, and move money globally — instantly, intelligently, invisibly. Powered by Hedera blockchain with AI-optimized remittances and invisible DeFi yield.",
  keywords: ["Nexus Pay", "Remittances", "DeFi", "Hedera", "Cross-border payments", "Stablecoins", "Fintech", "LATAM", "Global payments", "Blockchain"],
  authors: [{ name: "Nexus Pay Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Nexus Pay | The Global Value Layer",
    description: "Instant, low-cost global transfers with invisible DeFi yield. Send money like information.",
    url: "https://nexuspay.io",
    siteName: "Nexus Pay",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nexus Pay - Global Value Layer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Pay | The Global Value Layer",
    description: "Instant, low-cost global transfers with invisible DeFi yield",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
