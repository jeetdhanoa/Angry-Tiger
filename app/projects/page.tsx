import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Projects — Angry Tiger",
  description:
    "Our first slate is in development. New Angry Tiger projects get announced here first.",
};

export default function Projects() {
  return (
    <div className="page">
      <section className="projects-hero">
        <span className="caption-label">Projects</span>
        <h1 className="display" data-parallax="0.1" data-letter-hover>
          Coming soon.
        </h1>
        <p className="projects-hero__lede">
          Our first slate is in development. No titles yet. New projects get announced
          here first.
        </p>
        <div className="projects-hero__actions">
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Send us your story
            </Button>
          </Link>
          <Link href="/membership">
            <Button variant="secondary" size="lg">
              Join The Ambush
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
