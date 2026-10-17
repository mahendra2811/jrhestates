import GoogleAnalytics from "@/components/GoogleAnalytics";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://jrhestates.com"),
  title: "JRH Estates | Your Land. Your Legacy. | Residential Plots in Jodhpur",
  description:
    "Discover thoughtfully planned residential plots in and around Jodhpur. Explore JRH Estates and start your journey towards a place of your own.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "JRH Estates — Your Land. Your Legacy.",
    description: "Rooted in Jodhpur. Planned around your future.",
    images: [{ url: "/images/hero-desktop.webp", width: 1672, height: 941 }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "JRH Estates | Residential Plots in Jodhpur",
    images: ["/images/hero-desktop.webp"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
