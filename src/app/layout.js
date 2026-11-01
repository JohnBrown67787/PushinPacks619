import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import TelegramFloatingButton from "../components/TelegramFloatingButton";

// Optimize font loading: only latin subset, variable weights
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  preload: true,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  preload: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: "PushinPacks619",
  description: "PushinPacks619 - Premium catalogs and collections",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  robots: {
    index: true,
    follow: true,
  },
  // Performance: Preconnect to external domains
  preconnect: [
    {
      href: "https://fonts.googleapis.com",
      crossOrigin: "anonymous",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Performance: Preconnect to image CDN if used */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body>
        {children}
        <TelegramFloatingButton />
      </body>
    </html>
  );
}
