import Link from "next/link";
import Footer from "@/components/Footer";

// Minimal on-brand placeholder for routes that are built but parked for later
// (the shop and membership live at page.full.tsx and get swapped back in when
// they launch). Reuses the projects-hero layout so it needs no new styles.
export default function ComingSoon({ eyebrow, line }: { eyebrow: string; line: string }) {
  return (
    <div className="page">
      <section className="projects-hero">
        <span className="caption-label">{eyebrow}</span>
        <h1 className="display" data-parallax="0.1" data-letter-hover>
          Coming soon.
        </h1>
        <p className="projects-hero__lede">{line}</p>
        <Link href="/" className="footer__link" data-letter-hover="1">
          Back to the house →
        </Link>
      </section>
      <Footer />
    </div>
  );
}
