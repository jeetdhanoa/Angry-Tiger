import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import Nav from "@/components/Nav";
import Splash from "@/components/Splash";
import Motion from "@/components/Motion";

// Canonical site URL — the custom production domain. Used as the base for
// absolute OG/Twitter image URLs and canonical links. Falls back to the
// per-deploy URL on previews, and localhost in dev.
const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://angrytiger.in"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

const description =
  "Angry Tiger is an independent Bollywood production house making feature films, web series and vertical series. Don't follow the formula. Independent since 2026.";

// Tints browser chrome where supported (Safari's tab bar, Android Chrome's
// URL bar) so the transparent favicon sits on Jet Black, not white.
export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Angry Tiger",
    template: "%s",
  },
  description,
  // Transparent red tiger symbol (no background). ?v=3 busts stubborn caches
  // from the earlier red-square version some browsers still hold.
  icons: {
    icon: [{ url: "/logos/at-brand-symbol-red.png?v=3", type: "image/png" }],
  },
  openGraph: {
    title: "Angry Tiger",
    description,
    siteName: "Angry Tiger",
    type: "website",
    locale: "en_IN",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Angry Tiger",
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Splash />
            <Nav />
            {children}
            <Motion />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
