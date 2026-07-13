"use client";

/* Route-level error boundary — catches a thrown render/runtime error in a page
   and shows it in the house voice (same shape as the 404) instead of a blank
   screen. Renders inside the layout, so nav/footer stay. */

import { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface it for logging/monitoring; the user sees the friendly copy below.
    console.error(error);
  }, [error]);

  return (
    <main className="page" id="main-content">
      <section className="nf">
        <img src="/logos/at-brand-symbol-red.svg" alt="" className="nf__mark" />
        <span className="caption-label">Cut · Something broke</span>
        <h1 className="display">
          That take didn&apos;t <span className="red-period">roll.</span>
        </h1>
        <p className="nf__lede">
          Something went wrong on our end. Try the shot again — if it keeps
          breaking, the tiger will hear about it.
        </p>
        <div className="nf__actions">
          <Button variant="primary" size="lg" onClick={reset}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="secondary" size="lg">
              Back to the house
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
