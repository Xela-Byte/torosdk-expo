import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToroForge — React & React Native SDK for Toronet",
  description:
    "Type-safe React and React Native hooks for every Toronet feature. 100% API coverage, zero boilerplate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="bg-[#0A0A0A] text-white antialiased selection:bg-purple-500/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
