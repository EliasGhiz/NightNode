import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NightNode — Real-time Nightlife Intel",
  description:
    "City-by-city nightlife companion for monitoring lines, cover, and safety signals in real time.",
  metadataBase: new URL("https://nightnode.vercel.app"),
  openGraph: {
    title: "NightNode",
    description: "Choose the right venue with live lines, cover, and safety intel.",
    url: "https://nightnode.vercel.app",
    siteName: "NightNode",
  },
  keywords: [
    "nightlife",
    "supabase",
    "mapbox",
    "line tracker",
    "wait times",
    "college nightlife",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-white antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
