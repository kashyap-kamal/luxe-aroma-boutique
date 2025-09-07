import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arome Luxe - Luxury Aroma Boutique",
  description:
    "Premium luxury aromas and fragrances boutique. Discover our exquisite collection of fine perfumes and aromatic experiences.",
  keywords: [
    "luxury perfumes",
    "aroma boutique",
    "fine fragrances",
    "premium scents",
  ],
  authors: [{ name: "Arome Luxe" }],
  creator: "Arome Luxe",
  publisher: "Arome Luxe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aromeluxe.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Arome Luxe - Luxury Aroma Boutique",
    description: "Premium luxury aromas and fragrances boutique",
    url: "https://aromeluxe.com",
    siteName: "Arome Luxe",
    images: [
      {
        url: "/assets/arome-luxe-logo.png",
        width: 1200,
        height: 630,
        alt: "Arome Luxe Logo",
      },
    ],
    locale: "en_US",
    type: "website",
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
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/assets/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/assets/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/assets/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/assets/site.webmanifest",
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
        <div className="min-h-screen flex flex-col">
          <Navbar />
          {children}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
