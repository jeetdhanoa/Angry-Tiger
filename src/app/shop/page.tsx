"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import ImageSlot from "@/components/ImageSlot";
import MarkerStroke from "@/components/MarkerStroke";
import { useCart, rupees } from "@/lib/cart";
import { fetchProducts, FALLBACK_PRODUCTS, type Product } from "@/lib/products";

const CATS: [string, string][] = [
  ["all", "All"],
  ["clothing", "Clothing"],
  ["posters", "Posters"],
  ["books", "Books"],
  ["discs", "Discs"],
  ["objects", "Objects"],
];

const catLabel = (key: string) => (CATS.find(([k]) => k === key) ?? CATS[0])[1];

export default function Shop() {
  const cart = useCart();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [size, setSize] = useState("M");
  const [cat, setCat] = useState("all");

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // Drop 001 hero product; the seeded catalog row once Supabase answers.
  const tee = products.find((p) => p.slug === "tiger-tee") ?? products[0];

  const visible = products.filter((p) => cat === "all" || p.category === cat);

  const addToCart = () => {
    cart.add({
      productId: tee.id,
      legacyId: "tee-" + size,
      name: tee.name,
      size,
      price: tee.price,
    });
  };

  return (
    <div className="page">
      <section className="shop-drop">
        <div className="shop-drop__photo">
          <ImageSlot scene="The tiger tee" shot="002" />
        </div>
        <div className="shop-drop__panel">
          <span className="caption-label caption-label--white">The shop · Drop 001</span>
          <h1 className="display" data-parallax="0.08" data-letter-hover>
            The tiger tee.
          </h1>
          <p className="shop-drop__body">
            Heavy 240 gsm cotton, cut to fit everyone. The walking tiger, screen printed
            front and center. Made in India. One drop at a time, and when it&apos;s gone,
            it&apos;s <MarkerStroke variant="underline">gone</MarkerStroke>.
          </p>
          <span className="shop-drop__price">{rupees(tee.price)}</span>
          <div className="shop-sizes">
            <span className="caption-label caption-label--white">Size</span>
            <div className="shop-sizes__row">
              {tee.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`shop-size${size === s ? " shop-size--selected" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="shop-add">
            {!tee.soldOut ? (
              <>
                <Button variant="primary" size="lg" onClick={addToCart}>
                  Add to cart
                </Button>
                <span className="shop-add__note">Pre-order. Ships with our first release.</span>
              </>
            ) : (
              <p
                className="display"
                style={{ fontSize: "var(--text-h2)", textDecoration: "line-through" }}
              >
                Sold out.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="shop-cats">
        <span className="caption-label">Shop by category</span>
        <div className="shop-cats__tabs">
          {CATS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`shop-cat${cat === key ? " shop-cat--active" : ""}`}
              onClick={() => setCat(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {visible.length > 0 ? (
          <div className="shop-grid">
            {visible.map((p) => (
              <div key={p.slug} className="shop-card">
                <span className="shop-card__meta">
                  {catLabel(p.category)} · {p.tag}
                </span>
                <span className="shop-card__name">{p.name}</span>
                <span className="shop-card__price">{rupees(p.price)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <p className="shop-empty__title">Nothing in {catLabel(cat)} yet.</p>
            <p className="shop-empty__sub">
              Every release adds to the shelf. Sign up in the footer to hear first.
            </p>
          </div>
        )}
      </section>

      <section className="shop-strip">
        <span className="shop-strip__title" data-letter-hover="1">
          One drop at a time.
        </span>
        <span className="shop-strip__sub">The full shop opens alongside our first release.</span>
      </section>

      <Footer />
    </div>
  );
}
