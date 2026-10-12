import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const manropeSans = Manrope({
  variable: "--font-manrope-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://severus-gwill1337.vercel.app";
const DESCRIPTION =
  "Private, decentralized chat with end-to-end encryption (Noise Protocol + TLS). Connect directly or peer-to-peer over QUIC, with rooms and direct messages. No sign-up, no cloud.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Severus — Private P2P Chat with End-to-End Encryption",
    template: "%s | Severus",
  },
  description: DESCRIPTION,
  applicationName: "Severus",
  keywords: [
    "encrypted chat",
    "P2P messenger",
    "end-to-end encryption",
    "Noise Protocol",
    "QUIC",
    "decentralized chat",
    "private messenger",
    "Tauri",
    "Rust",
  ],
  authors: [{ name: "gwill1337", url: "https://github.com/gwill1337" }],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "yWfmJFF-8Q8Id4lXFXfH2d_vEMZ10owh7bYGAeQdimk"
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Severus",
    title: "Severus — Private P2P Chat",
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Severus — private encrypted chat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Severus — Private P2P Chat",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", manropeSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="flex min-h-dvh flex-col font-sans bg-[#050505]">
        <Header />
        <main className="flex-1 ">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
