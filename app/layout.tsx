import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Nav from "@/components/Nav";
import Splash from "@/components/Splash";
import Motion from "@/components/Motion";

export const metadata: Metadata = {
  title: "Angry Tiger",
  description:
    "Angry Tiger is an independent Bollywood production house making feature films, web series and vertical series. Don't follow the formula. Independent since 2026.",
  icons: { icon: "/logos/at-brand-symbol-red.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Splash />
          <Nav />
          {children}
          <Motion />
        </CartProvider>
      </body>
    </html>
  );
}
