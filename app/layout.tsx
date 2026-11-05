import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://relyqon.com"),
  title: "RELYQON | Software Development & AI Solutions",
  description:
    "RELYQON transforms ideas into modern digital solutions through web development, mobile applications, custom software, and AI-powered technologies.",
  keywords: [
    "RELYQON",
    "software development",
    "AI solutions",
    "mobile app development",
    "custom software",
    "business automation",
  ],
  openGraph: {
    title: "RELYQON | Software Development & AI Solutions",
    description:
      "RELYQON transforms ideas into modern digital solutions through web development, mobile applications, custom software, and AI-powered technologies.",
    siteName: "RELYQON",
    type: "website",
    images: [
      {
        url: "/relyqon-logo-crop.png",
        width: 402,
        height: 317,
        alt: "RELYQON logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RELYQON | Software Development & AI Solutions",
    description:
      "RELYQON transforms ideas into modern digital solutions through web development, mobile applications, custom software, and AI-powered technologies.",
    images: ["/relyqon-logo-crop.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-black text-white">{children}</body>
    </html>
  );
}
