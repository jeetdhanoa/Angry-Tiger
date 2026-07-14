import localFont from "next/font/local";

/* Self-hosted via next/font/local (not a plain @font-face in globals.css)
   so Next automatically injects a <link rel="preload"> for each — these are
   used in the root layout, which is exactly the case Next's docs call out
   for automatic preloading. Source files are pre-converted to woff2
   (see scripts/burn-watermark.py's sibling conversion, done ad hoc via
   fontTools) — Bebas 57.7KB -> 20.7KB, Homemade Apple 109KB -> 49.9KB.
   Inter Variable is further subset (fontTools) to Latin + Latin-ext + the
   punctuation/arrows/rupee the site actually uses, keeping the full 100-900
   weight axis: 349.3KB -> 123.4KB, the largest preloaded asset per page.
   The italic Inter face was dropped entirely: nothing in the codebase ever
   sets font-style: italic. */

export const bebasNeue = localFont({
  src: "../../public/fonts/BebasNeue-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-bebas",
  display: "swap",
});

export const inter = localFont({
  src: "../../public/fonts/Inter-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

export const homemadeApple = localFont({
  src: "../../public/fonts/HomemadeApple-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-homemade-apple",
  display: "swap",
});
