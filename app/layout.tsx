import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fingerprint OSS Demo",
  description:
    "A demonstration of the fingerprint-oss npm package capabilities. Free and open-source browser fingerprinting.",
  metadataBase: new URL("https://fingerprint-oss-demo.vercel.app"),
  openGraph: {
    title: "Fingerprint OSS Demo",
    description:
      "Free and open-source browser fingerprinting library for identifying unique visitors.",
    url: "https://fingerprint-oss-demo.vercel.app",
    siteName: "Fingerprint OSS",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Fingerprint OSS Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fingerprint OSS Demo",
    description: "Free and open-source browser fingerprinting library.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "browser fingerprinting",
    "fingerprint js",
    "open source",
    "visitor identification",
    "privacy",
    "web analytics",
    "device identification",
    "fingerprint-oss",
    "npm",
    "frontend security",
  ],
  authors: [{ name: "Global Open Source Softwares (GOSS)" }],
  generator: "Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`bg-background text-foreground font-sans ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
