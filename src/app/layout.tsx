import type { Metadata, Viewport } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://voice-ai-iu7q.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aura Voice AI — AI Voice Receptionist & Dynamic Workflow Platform",
    template: "%s | Aura Voice AI",
  },
  description: "Industry-agnostic AI receptionist with dynamic workflow builder, missed-call automated callbacks, Google Calendar sync, and multi-tenant voice orchestration.",
  keywords: [
    "Aura Voice AI",
    "Voice AI Receptionist",
    "AI Receptionist",
    "Missed Call Automation",
    "Google Calendar Integration",
    "Voice AI Assistant",
    "Automated Callbacks",
    "Custom AI Workflows",
  ],
  authors: [{ name: "Aura Voice AI Team" }],
  creator: "Aura Voice AI",
  publisher: "Aura Voice AI",
  applicationName: "Aura Voice AI",
  openGraph: {
    title: "Aura Voice AI — AI Voice Receptionist & Dynamic Workflow Platform",
    description: "Never lose a customer lead again. Intelligent AI receptionist that calls back missed calls, collects custom data fields, and books appointments on Google Calendar.",
    url: siteUrl,
    siteName: "Aura Voice AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aura Voice AI Receptionist Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Voice AI — AI Voice Receptionist & Dynamic Workflow Platform",
    description: "Automate missed-call callbacks, dynamic field extractions, and Google Calendar scheduling with AI voice agents.",
    images: ["/og-image.png"],
    creator: "@auravoiceai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
