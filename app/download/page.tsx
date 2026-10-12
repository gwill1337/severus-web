import { Metadata } from "next";
import DownloadClient from "./DownloadClient";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download Severus for Windows, macOS and Linux. Private end-to-end encrypted P2P chat.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Download Severus",
    description:
      "Download Severus for Windows, macOS and Linux. Private end-to-end encrypted P2P chat.",
    url: "/download",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Severus" }],
  },
};

export default function page() {
    return <DownloadClient />;
}