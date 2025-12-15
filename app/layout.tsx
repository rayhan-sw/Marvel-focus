import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import GlobalCurtain from "@/components/GlobalCurtain";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Marvel Focus | Heroic Productivity Timer",
    template: "%s | Marvel Focus",
  },
  description:
    "Transform your daily tasks into an epic saga. Select a Marvel movie as your timer, engage your focus, and defeat distraction with this MCU-themed productivity tool.",
  keywords: [
    "Marvel",
    "Productivity",
    "Focus Timer",
    "Pomodoro",
    "MCU",
    "Avengers",
    "Study Timer",
    "Work Timer",
    "Gamification",
    "Marvel Focus",
  ],
  authors: [{ name: "Rayhansw" }],
  creator: "Rayhansw",
  publisher: "Marvel Focus",
  metadataBase: new URL("https://marvel-focus.vercel.app"),
  openGraph: {
    title: "Marvel Focus | Heroic Productivity Timer",
    description:
      "Transform your daily tasks into an epic saga. Select a Marvel movie as your timer, engage your focus, and defeat distraction.",
    url: "https://marvel-focus.vercel.app",
    siteName: "Marvel Focus",
    images: [
      {
        url: "/Marvel-focus.png",
        width: 1200,
        height: 630,
        alt: "Marvel Focus Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marvel Focus | Heroic Productivity Timer",
    description:
      "Transform your daily tasks into an epic saga. Select a Marvel movie as your timer, engage your focus, and defeat distraction.",
    images: ["/Marvel-focus.png"],
  },
  icons: {
    icon: "/Marvel-focus-transparent.png",
    shortcut: "/Marvel-focus-transparent.png",
    apple: "/Marvel-focus-transparent.png",
  },
  verification: {
    google: "DtDPMvfFD4Ueb138AOkJ8duGG6JFx3zTOj2fgLOy4Wk",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalCurtain />
        {children}
      </body>
      <GoogleAnalytics gaId="G-SE861VNLWC" />
    </html>
  );
}
