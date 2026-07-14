import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bebasNeue, inter, homemadeApple } from "./fonts";
import { AuthProvider } from "@/lib/auth";
import Nav from "@/components/Nav";
import Splash from "@/components/Splash";
import Motion from "@/components/Motion";
import RouteTransition from "@/components/RouteTransition";

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

// Organization structured data — makes the house eligible for a Google
// knowledge panel and ties the brand to its social profiles. Always the
// canonical production domain, not a preview URL.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Angry Tiger",
  url: "https://angrytiger.in",
  logo: "https://angrytiger.in/logos/at-brand-symbol-red.png",
  description,
  foundingDate: "2026",
  sameAs: [
    "https://instagram.com/angrytigerstudios",
    "https://youtube.com/@angrytigerstudios",
    "https://x.com/AngryTigerX",
  ],
};

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
      // The blocking script below stamps .at-splash-pending on this element
      // before hydration — the same "no-flash" pattern next-themes uses for
      // dark mode. React hydrates <html>'s own attributes too, so without
      // this it logs a (harmless but noisy) mismatch warning every load.
      suppressHydrationWarning
    >
      <body>
        {/* Runs synchronously before the hero paints — pure vanilla JS, no
            React dependency, so it can't be delayed by hydration. Stamps
            .at-splash-pending on <html> only when Splash.tsx is actually
            about to show (first-of-session, motion not reduced); globals.css
            holds the home hero's film-frame reveal closed while that class
            is present, so the two signature animations run in sequence
            instead of racing (the hero was ~73% open by the time the splash
            used to fade away). The 1100ms timeout mirrors Splash.tsx's own
            "show" phase exactly — keep them in sync if either changes. Fails
            open: any error here just skips the gate, hero plays immediately
            as it always has. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var d=document.documentElement;
  try{
    var seen=sessionStorage.getItem('at-splash-seen')==='1';
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!seen&&!reduced){
      d.classList.add('at-splash-pending');
      setTimeout(function(){d.classList.remove('at-splash-pending');},1100);
    }
  }catch(e){d.classList.remove('at-splash-pending');}
})();`,
          }}
        />
        <script
          type="application/ld+json"
          // Static, trusted JSON we control — safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
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
          <RouteTransition>{children}</RouteTransition>
          <Motion />
        </AuthProvider>
      </body>
    </html>
  );
}
