"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart, rupees } from "@/lib/cart";

const LINKS = [
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "about", label: "About", href: "/about" },
  { key: "shop", label: "Shop", href: "/shop" },
  { key: "notes", label: "Notes", href: "/notes" },
  { key: "membership", label: "Membership", href: "/membership" },
  { key: "contact", label: "Contact", href: "/contact" },
];

const SEARCH_INDEX = [
  { label: "Home", sub: "The house. Don't follow the formula", href: "/" },
  { label: "Notes", sub: "Letters, conversations and the podcast", href: "/notes" },
  { label: "Projects", sub: "Coming soon. The first slate is in development", href: "/projects" },
  { label: "About", sub: "Built to break the pattern. What we believe", href: "/about" },
  { label: "The tiger tee", sub: "The shop · Drop 001 · ₹1,499", href: "/shop" },
  { label: "The shop", sub: "One drop at a time", href: "/shop" },
  { label: "The Ambush", sub: "Membership · ₹999 a month · founding members", href: "/membership" },
  { label: "Contact", sub: "Talk to the tiger · hello@angrytiger.in", href: "/contact" },
  { label: "Submissions", sub: "Scripts, loglines, reels. Start with a logline", href: "/contact" },
];

const ACCOUNT_KEY = "at-account-v1";

export default function Nav() {
  const pathname = usePathname();
  const cart = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [signInError, setSignInError] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const acc = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
      if (acc && acc.email) setAuthEmail(acc.email);
    } catch {}
  }, []);

  const closeAll = useCallback(() => {
    setSearchOpen(false);
    setAccountOpen(false);
    setMenuOpen(false);
    cart.closeCart();
    setCheckoutNote(false);
  }, [cart]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [closeAll]);

  // Route change closes overlays.
  useEffect(() => {
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  const openSearch = () => {
    closeAll();
    setQuery("");
    setSearchOpen(true);
  };
  const openAccount = () => {
    closeAll();
    setAccountOpen(true);
  };
  const openCart = () => {
    closeAll();
    cart.openCart();
  };
  const openMenu = () => {
    closeAll();
    setMenuOpen(true);
  };

  const signIn = () => {
    const em = email.trim();
    if (!em || !pw) {
      setSignInError(true);
      return;
    }
    try {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ email: em }));
    } catch {}
    setAuthEmail(em);
    setSignInError(false);
    setPw("");
  };

  const signOut = () => {
    try {
      localStorage.removeItem(ACCOUNT_KEY);
    } catch {}
    setAuthEmail("");
    setEmail("");
  };

  const q = query.trim().toLowerCase();
  const results = q
    ? SEARCH_INDEX.filter((r) => (r.label + " " + r.sub).toLowerCase().includes(q))
    : SEARCH_INDEX;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="nav">
        <Link href="/" className="nav__logo">
          <img src="/logos/at-primary-monogram-red.png" alt="Angry Tiger — home" />
        </Link>
        <div className="nav__right">
          <nav className="nav__links">
            {LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`nav__link${isActive(link.href) ? " nav__link--active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="nav__divider" />
          <button type="button" className="nav__icon" aria-label="Search" onClick={openSearch}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="10.5" cy="10.5" r="7" />
              <line x1="15.8" y1="15.8" x2="22" y2="22" />
            </svg>
          </button>
          <button type="button" className="nav__icon" aria-label="Account" onClick={openAccount}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7.5" r="4" />
              <path d="M4 21c1.4-4.2 4.8-6.2 8-6.2s6.6 2 8 6.2" />
            </svg>
          </button>
          <button
            type="button"
            className="nav__icon"
            aria-label={`Cart (${cart.count})`}
            onClick={openCart}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1.5 3.5h3l2.6 12h11.4l2.6-9H6" />
              <circle cx="9.5" cy="19.5" r="1.7" />
              <circle cx="16.8" cy="19.5" r="1.7" />
            </svg>
            {cart.count > 0 && <span className="nav__cart-count">{cart.count}</span>}
          </button>
          <button type="button" className="nav__burger" aria-label="Menu" onClick={openMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search">
          <div className="search__top">
            <span className="caption-label">Search</span>
            <button
              type="button"
              className="search__close"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              ×
            </button>
          </div>
          <input
            ref={searchRef}
            className="search__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search"
            aria-label="Search the site"
          />
          <div className="search__results">
            {results.map((r, i) => (
              <Link key={i} href={r.href} className="search__result">
                <span className="search__result-label">{r.label}</span>
                <span className="search__result-sub">{r.sub}</span>
              </Link>
            ))}
            {q.length > 0 && results.length === 0 && (
              <p className="search__empty">
                Nothing matches that. Try &quot;tee&quot;, &quot;membership&quot; or
                &quot;submissions&quot;.
              </p>
            )}
          </div>
        </div>
      )}

      {cart.cartOpen && (
        <>
          <button
            className="drawer-backdrop"
            aria-label="Close cart"
            onClick={() => cart.closeCart()}
          />
          <aside className="drawer">
            <div className="drawer__head">
              <span className="drawer__title">Cart</span>
              <button
                type="button"
                className="drawer__close"
                aria-label="Close cart"
                onClick={() => {
                  cart.closeCart();
                  setCheckoutNote(false);
                }}
              >
                ×
              </button>
            </div>
            {cart.items.length > 0 ? (
              <>
                <div className="cart__items">
                  {cart.items.map((it) => (
                    <div key={it.id} className="cart__item">
                      <div className="cart__item-top">
                        <span className="cart__item-name">{it.name}</span>
                        <button
                          type="button"
                          className="cart__item-remove"
                          aria-label="Remove item"
                          onClick={() => cart.remove(it.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="cart__item-bottom">
                        <span className="cart__item-size">Size {it.size}</span>
                        <div className="cart__qty">
                          <button
                            type="button"
                            className="cart__step"
                            aria-label="Decrease quantity"
                            onClick={() => cart.dec(it.id)}
                          >
                            −
                          </button>
                          <span className="cart__qty-n">{it.qty}</span>
                          <button
                            type="button"
                            className="cart__step"
                            aria-label="Increase quantity"
                            onClick={() => cart.inc(it.id)}
                          >
                            +
                          </button>
                          <span className="cart__line">{rupees(it.price * it.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart__subtotal">
                  <span className="cart__subtotal-label">Subtotal</span>
                  <span className="cart__subtotal-n">{rupees(cart.subtotal)}</span>
                </div>
                <button
                  type="button"
                  className="cart__checkout"
                  onClick={() => setCheckoutNote(true)}
                >
                  Checkout
                </button>
                {checkoutNote && (
                  <p className="cart__note">
                    Pre-orders are charged closer to release. Your cart is saved.
                  </p>
                )}
              </>
            ) : (
              <div className="cart__empty">
                <p className="cart__empty-title">Your cart is empty.</p>
                <Link href="/shop" className="underline-link" style={{ fontSize: 22 }}>
                  The shop →
                </Link>
              </div>
            )}
          </aside>
        </>
      )}

      {accountOpen && (
        <>
          <button
            className="drawer-backdrop"
            aria-label="Close account"
            onClick={() => setAccountOpen(false)}
          />
          <aside className="drawer">
            <div className="drawer__head">
              <span className="drawer__title">Account</span>
              <button
                type="button"
                className="drawer__close"
                aria-label="Close account"
                onClick={() => {
                  setAccountOpen(false);
                  setSignInError(false);
                }}
              >
                ×
              </button>
            </div>
            {!authEmail ? (
              <div className="account__body">
                <p className="account__intro">
                  Ambush members and shoppers sign in here. Your cart and orders follow you.
                </p>
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    className="input-dark"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    className="input-dark"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="••••••••"
                  />
                </label>
                <button type="button" className="account__signin" onClick={signIn}>
                  Sign in
                </button>
                {signInError && (
                  <span className="account__error">Enter your email and password.</span>
                )}
                <Link href="/membership" className="account__join">
                  Not a member? Join The Ambush →
                </Link>
              </div>
            ) : (
              <div className="account__in">
                <p className="account__in-title">
                  You&apos;re in<span className="red-period">.</span>
                </p>
                <div className="account__row">
                  <span className="account__row-label">Signed in as</span>
                  <span className="account__row-value">{authEmail}</span>
                </div>
                <div className="account__row">
                  <span className="account__row-label">Membership</span>
                  <span className="account__row-value">
                    The Ambush opens with our first release
                  </span>
                </div>
                <div className="account__row">
                  <span className="account__row-label">Orders</span>
                  <span className="account__row-value">Nothing yet</span>
                </div>
                <button type="button" className="account__signout" onClick={signOut}>
                  Sign out
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {menuOpen && (
        <div className="menu">
          <div className="menu__top">
            <img src="/logos/at-primary-monogram-red.png" alt="Angry Tiger" />
            <button
              type="button"
              className="menu__close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
          </div>
          <nav className="menu__nav">
            <Link href="/" className="menu__link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            {LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`menu__link${isActive(link.href) ? " menu__link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="menu__copyright">© 2026 Angry Tiger</span>
        </div>
      )}
    </>
  );
}
