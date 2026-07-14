import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

// ─── Fonts ────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ─── Metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "VoiceCart — AI Voice Shopping Assistant",
    template: "%s | VoiceCart",
  },
  description:
    "Shop smarter with your voice. VoiceCart uses AI to understand natural speech, manage your shopping list, and suggest what you need.",
  keywords: [
    "voice shopping",
    "AI assistant",
    "shopping list",
    "voice commands",
    "smart grocery",
  ],
  authors: [{ name: "VoiceCart Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://voicecart.vercel.app",
    title: "VoiceCart — AI Voice Shopping Assistant",
    description:
      "Shop smarter with your voice. VoiceCart uses AI to understand natural speech.",
    siteName: "VoiceCart",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceCart — AI Voice Shopping Assistant",
    description: "Shop smarter with your voice.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
