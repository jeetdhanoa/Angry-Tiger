"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import Turnstile from "@/components/Turnstile";
import Icon from "@/components/Icon";

const LINKS = [
  { key: "films", label: "Films", href: "/films" },
  { key: "television", label: "Television", href: "/television" },
  { key: "vertical", label: "Vertical", href: "/vertical" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

const SEARCH_INDEX = [
  { label: "Home", sub: "The house. Don't follow the formula", href: "/" },
  { label: "Films", sub: "Feature films. The first slate is in development", href: "/films" },
  { label: "Television", sub: "Series built to break the pattern", href: "/television" },
  { label: "Vertical", sub: "Vertical series, made for how people watch", href: "/vertical" },
  { label: "About", sub: "Built to break the pattern. What we believe", href: "/about" },
  { label: "Contact", sub: "Talk to the tiger · hello@angrytiger.in", href: "/contact" },
  { label: "Submissions", sub: "Scripts, loglines, reels. Start with a logline", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const auth = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState("");
  // Turnstile tokens are single-use; remount the widget after each attempt.
  const [captchaNonce, setCaptchaNonce] = useState(0);

  const searchRef = useRef<HTMLInputElement>(null);

  const closeAll = useCallback(() => {
    setSearchOpen(false);
    setAccountOpen(false);
    setMenuOpen(false);
  }, []);

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

  // The account dashboard's sign-in gate asks the nav to open the drawer.
  useEffect(() => {
    const open = () => {
      closeAll();
      setAccountOpen(true);
    };
    window.addEventListener("at-open-account", open);
    return () => window.removeEventListener("at-open-account", open);
  }, [closeAll]);

  const openSearch = () => {
    closeAll();
    setQuery("");
    setSearchOpen(true);
  };
  const openMenu = () => {
    closeAll();
    setMenuOpen(true);
  };

  const submitAuth = async () => {
    const em = email.trim();
    if (!em || !pw) {
      setAuthError("Enter your email and password.");
      return;
    }
    setAuthError("");
    setNotice("");
    setBusy(true);
    const res =
      mode === "signup"
        ? await auth.signUp(em, pw, captcha || undefined)
        : await auth.signIn(em, pw, captcha || undefined);
    setBusy(false);
    setCaptcha("");
    setCaptchaNonce((n) => n + 1);
    if (res.error) {
      setAuthError(res.error);
      return;
    }
    setPw("");
    if (res.needsConfirmation) {
      setNotice("Check your email to confirm your account, then sign in.");
      setMode("signin");
    }
    // On success the auth listener flips the drawer to the signed-in view.
  };

  const signOut = async () => {
    await auth.signOut();
    setEmail("");
    setPw("");
    setMode("signin");
  };

  const resetAuthForm = () => {
    setAuthError("");
    setNotice("");
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
          <img src="/logos/at-primary-monogram-red.svg" alt="Angry Tiger, home" />
        </Link>
        <div className="nav__right">
          <nav className="nav__links">
            {LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`nav__link${isActive(link.href) ? " nav__link--active" : ""}`}
                data-letter-hover="1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="nav__divider" />
          <button type="button" className="nav__icon" aria-label="Search" onClick={openSearch}>
            <Icon name="search" size={21} />
          </button>
          <button type="button" className="nav__burger" aria-label="Menu" onClick={openMenu}>
            <Icon name="menu" size={24} />
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
                Nothing matches that. Try &quot;projects&quot;, &quot;notes&quot; or
                &quot;submissions&quot;.
              </p>
            )}
          </div>
        </div>
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
                  resetAuthForm();
                }}
              >
                ×
              </button>
            </div>
            {!auth.user ? (
              <div className="account__body">
                <p className="account__intro">
                  {mode === "signup"
                    ? "Create your Angry Tiger account to stay close to what we're building."
                    : "Sign in to your Angry Tiger account."}
                </p>
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    className="input-dark"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAuth()}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    className="input-dark"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAuth()}
                    placeholder="••••••••"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                </label>
                <Turnstile key={captchaNonce} onToken={setCaptcha} />
                <button
                  type="button"
                  className="account__signin"
                  onClick={submitAuth}
                  disabled={busy}
                >
                  {busy
                    ? "One moment…"
                    : mode === "signup"
                      ? "Create account"
                      : "Sign in"}
                </button>
                {authError && <span className="account__error">{authError}</span>}
                {notice && <span className="account__notice">{notice}</span>}
                <button
                  type="button"
                  className="account__toggle"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    resetAuthForm();
                  }}
                >
                  {mode === "signin"
                    ? "New here? Create an account →"
                    : "Have an account? Sign in →"}
                </button>
              </div>
            ) : (
              <div className="account__in">
                <p className="account__in-title">
                  You&apos;re in<span className="red-period">.</span>
                </p>
                <div className="account__row">
                  <span className="account__row-label">Signed in as</span>
                  <span className="account__row-value">{auth.user.email}</span>
                </div>
                <Link
                  href="/account"
                  className="account__join"
                  style={{ marginTop: 24 }}
                  onClick={() => setAccountOpen(false)}
                >
                  Your account →
                </Link>
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
            <img src="/logos/at-primary-monogram-red.svg" alt="Angry Tiger" />
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
