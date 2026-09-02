import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nationalaiconsortium.org"),
  title: {
    default: "National AI Consortium — Advancing AI Responsibly",
    template: "%s — National AI Consortium",
  },
  description:
    "The National AI Consortium is a nationwide community advancing the understanding, development, and responsible application of artificial intelligence through certification, training, research, and 50 state chapters.",
  keywords: [
    "National AI Consortium",
    "AI certification",
    "AI-CP",
    "AI-SP",
    "AI training",
    "responsible AI",
    "AI leadership",
  ],
  openGraph: {
    title: "National AI Consortium — Advancing AI Responsibly",
    description:
      "A nationwide community advancing the understanding, development, and responsible application of AI.",
    url: "https://nationalaiconsortium.org",
    siteName: "National AI Consortium",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
