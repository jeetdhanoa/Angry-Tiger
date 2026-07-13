import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bebasNeue, inter, homemadeApple } from "./fonts";
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
  // "./" resolves against the current route at render time, so every page
  // gets a self-referencing canonical without per-page boilerplate.
  alternates: {
    canonical: "./",
  },
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
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${homemadeApple.variable}`}
    >
      <body>
        {/* Keyboard/screen-reader users can skip the nav straight to the
            page's <main id="main-content">. Visually hidden until focused. */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {/* CartProvider is parked with the shop — every signed-in page view
            was paying a Supabase cart query for a cart no UI can open.
            Restore it around the tree when the shop un-parks with a drawer. */}
        <AuthProvider>
          <Splash />
          <Nav />
          {children}
          <Motion />
        </AuthProvider>
      </body>
    </html>
  );
}
