import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "404 — Angry Tiger",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="page">
      <section className="nf">
        <img src="/logos/at-brand-symbol-red.svg" alt="" className="nf__mark" />
        <span className="caption-label">404 · Scene missing</span>
        <h1 className="display">
          You&apos;ve wandered <span className="red-period">off the set.</span>
        </h1>
        <p className="nf__lede">
          This scene doesn&apos;t exist, or it hasn&apos;t been shot yet. Either way, the
          tiger knows the way back.
        </p>
        <div className="nf__actions">
          <Link href="/">
            <Button variant="primary" size="lg">
              Back to the house
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Talk to the tiger
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
