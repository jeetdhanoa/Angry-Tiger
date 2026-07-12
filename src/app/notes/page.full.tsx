import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Notes — Angry Tiger",
  description:
    "Letters, conversations and the Angry Tiger podcast. New words land here with our first release.",
};

const ROWS = [
  {
    title: "The letters",
    sub: "Notes from our writers and directors, sent from set and the edit room.",
  },
  {
    title: "The podcast",
    sub: "Long conversations with the people who refuse the formula.",
  },
  {
    title: "Field notes",
    sub: "What the house is watching, reading and arguing about.",
  },
];

export default function Notes() {
  return (
    <main className="page" id="main-content">
      <section className="notes-hero">
        <span className="caption-label">Notes · Coming soon</span>
        <h1 className="display" data-parallax="0.1" data-letter-hover>
          Notes<span className="red-period">.</span>
        </h1>
        <p className="notes-hero__lede">
          Letters, conversations and the Angry Tiger podcast. New words land here with
          our first release.
        </p>
      </section>

      <section className="notes-rows">
        <div className="notes-rows__list">
          {ROWS.map((row) => (
            <div key={row.title} className="notes-row">
              <span className="notes-row__title" data-letter-hover="1">
                {row.title}
              </span>
              <span className="notes-row__sub">{row.sub}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
