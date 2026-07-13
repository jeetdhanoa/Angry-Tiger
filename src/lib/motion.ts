/* Angry Tiger — motion layer.
   Brand spec: hard cuts and quick fades (120–200ms, --ease-cut). No bounces, no springs.
   - initReveals: sections quick-fade up on viewport entry; batches cascade apart.
   - initParallax: [data-parallax] elements drift on scroll (poster-crop clipping is intended).
   - initLetterHover: [data-letter-hover] text lifts letter by letter, cascading apart.
   All respect prefers-reduced-motion.

   Timings/easing come from the shared design tokens (src/design/motion.ts),
   so CSS custom properties and this engine can't drift apart. */

import { easeCut, reveal, letterHover } from "@/design/motion";

const reduced = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initMotion() {
  initReveals();
  initParallax();
  initLetterHover();
  initMarkers();
}

let revealsStarted = false;

export function initReveals() {
  if (revealsStarted) return;
  revealsStarted = true;
  if (typeof IntersectionObserver === "undefined") return;
  if (reduced()) return;

  const prepped = new WeakSet<Element>();

  const io = new IntersectionObserver(
    (entries) => {
      const batch = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      batch.forEach((e, i) => {
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const extra = parseInt(el.getAttribute("data-reveal") || "0", 10) || 0;
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "none";
          setTimeout(() => {
            el.style.willChange = "auto";
          }, reveal.transitionMs + 80);
        }, i * reveal.staggerMs + extra);
      });
    },
    { threshold: 0.06 }
  );

  const ms = reveal.transitionMs;
  const prep = (el: HTMLElement) => {
    if (prepped.has(el)) return;
    prepped.add(el);
    const existing = el.style.transition;
    el.style.opacity = "0";
    el.style.transform = "translateY(" + reveal.distancePx + "px)";
    el.style.transition =
      (existing ? existing + ", " : "") +
      "opacity " + ms + "ms var(--ease-cut, " + easeCut + "), transform " + ms + "ms var(--ease-cut, " + easeCut + ")";
    el.style.willChange = "opacity, transform";
    io.observe(el);
  };

  const scan = (root: Node) => {
    if (!root || root.nodeType !== 1) return;
    const el = root as HTMLElement;
    if (el.matches && el.matches("section, footer, [data-reveal]")) prep(el);
    if (el.querySelectorAll)
      el.querySelectorAll<HTMLElement>("section, footer, [data-reveal]").forEach(prep);
  };

  scan(document.body);

  // Content mounts progressively (client navigation) — catch sections that mount later.
  const mo = new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) scan(n);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

let parallaxStarted = false;

export function initParallax() {
  if (parallaxStarted) return;
  parallaxStarted = true;
  if (reduced()) return;

  let els: HTMLElement[] = [];
  const collect = () => {
    els = Array.prototype.slice.call(
      document.querySelectorAll("[data-parallax], [data-parallax-rel]")
    );
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const sy = window.scrollY || 0;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    for (const el of els) {
      const rel = el.getAttribute("data-parallax-rel");
      if (rel !== null) {
        // Viewport-relative parallax: 0 when the element is centred, drifting a
        // bounded amount as it passes through — safe for sections far down the
        // page (unlike absolute scrollY, which offsets them enormously).
        if (!vh) continue;
        const f = parseFloat(rel) || 0.08;
        const r = el.getBoundingClientRect();
        const offset = (vh / 2 - (r.top + r.height / 2)) * f;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      } else {
        const f = parseFloat(el.getAttribute("data-parallax") || "") || 0.12;
        el.style.transform = "translate3d(0," + (sy * f).toFixed(1) + "px,0)";
      }
    }
  };
  const req = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  collect();
  update();
  window.addEventListener("scroll", req, { passive: true });
  const mo = new MutationObserver(() => {
    collect();
    req();
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

let markersStarted = false;

// §5.03 Expressive Marks — by default a marker stroke just renders solid
// (the CSS never sets a dasharray, so untouched paths are simply drawn). Only
// markers opted in via <MarkerStroke scrub> get scroll behaviour: hidden until
// the word rises past the viewport's middle, fully drawn near the top,
// retracting on scroll back up. Today that's just the Home page's "formula" —
// every other marker (About's "fearless", etc.) is a plain static stroke.
// Paths carry pathLength=1, so dashoffset runs 0 (drawn) .. 1 (hidden).
type MkPath = SVGPathElement & { _mk?: "dyn" };

export function initMarkers() {
  if (markersStarted) return;
  markersStarted = true;

  const paths = () =>
    Array.prototype.slice.call(
      document.querySelectorAll<MkPath>('.marker[data-marker-scrub] .marker__stroke path')
    );

  if (reduced()) {
    const show = () =>
      paths().forEach((p: MkPath) => {
        p.style.strokeDasharray = "none";
        p.style.strokeDashoffset = "0";
      });
    show();
    new MutationObserver(show).observe(document.body, { childList: true, subtree: true });
    return;
  }

  const centerOf = (p: MkPath) => {
    const host = p.closest(".marker") as HTMLElement | null;
    if (!host) return null;
    const r = host.getBoundingClientRect();
    return r.top + r.height / 2;
  };

  const prep = (p: MkPath) => {
    if (p._mk) return;
    p._mk = "dyn";
    p.style.transition = "none"; // track scroll exactly, no easing between frames
    p.style.strokeDasharray = "1";
    p.style.strokeDashoffset = "1"; // hidden until scrolled into range
  };

  let els: MkPath[] = [];
  const collect = () => {
    els = paths();
    els.forEach(prep);
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!vh) return;
    for (const p of els) {
      const center = centerOf(p);
      if (center == null) continue;
      // Hidden until the word rises past the middle; fully drawn near the top.
      const start = vh * 0.55;
      const end = vh * 0.12;
      let prog = (start - center) / (start - end);
      prog = prog < 0 ? 0 : prog > 1 ? 1 : prog;
      p.style.strokeDashoffset = String(1 - prog);
    }
  };
  const req = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  collect();
  update();
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  const mo = new MutationObserver(() => {
    collect();
    req();
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

let letterHoverStarted = false;

type LhSpan = HTMLSpanElement & { _i?: number };
type LhHost = HTMLElement & { _lhDone?: boolean };

// Splits [data-letter-hover] text into inline-block letters that lift + scale on
// hover, cascading 24ms apart with an overshoot ease. Recurses through child
// elements so nested colored spans and arrow glyphs are preserved. Only touches
// STATIC text (React never reconciles unchanged text nodes, so the split survives
// re-renders); dynamic labels must not carry the attribute.
export function initLetterHover() {
  if (letterHoverStarted) return;
  letterHoverStarted = true;
  if (reduced()) return;

  const split = (host: LhHost) => {
    if (host._lhDone) return;
    host._lhDone = true;
    // Screen readers would spell out the per-letter spans; expose the
    // original text instead.
    const label = (host.textContent || "").replace(/\s+/g, " ").trim();
    if (label && !host.hasAttribute("aria-label")) host.setAttribute("aria-label", label);
    const spans: LhSpan[] = [];
    const recur = (node: Node) => {
      const kids = Array.prototype.slice.call(node.childNodes) as Node[];
      for (const child of kids) {
        if (child.nodeType === 3) {
          const text = child.nodeValue;
          if (!text || !text.trim()) continue;
          const frag = document.createDocumentFragment();
          // Letters are grouped inside per-word inline-blocks so the browser
          // still wraps between words, never mid-word.
          for (const token of text.split(/(\s+)/)) {
            if (!token) continue;
            if (/^\s+$/.test(token)) {
              frag.appendChild(document.createTextNode(" "));
              continue;
            }
            const word = document.createElement("span");
            word.setAttribute("data-lh", "1");
            word.style.display = "inline-block";
            word.style.whiteSpace = "nowrap";
            Array.prototype.forEach.call(token, (ch: string) => {
              const s = document.createElement("span") as LhSpan;
              s.setAttribute("data-lh", "1");
              s.textContent = ch;
              s.style.display = "inline-block";
              // Brand's hard-cut ease, not the old overshoot spring.
              s.style.transition = "transform " + letterHover.transitionMs + "ms " + letterHover.ease;
              // will-change is set only while hovering (see set()), not
              // permanently — otherwise every letter on the page keeps a
              // compositor layer alive for a hover that may never happen.
              s._i = spans.length;
              spans.push(s);
              word.appendChild(s);
            });
            frag.appendChild(word);
          }
          node.replaceChild(frag, child);
        } else if (
          child.nodeType === 1 &&
          (child as Element).getAttribute("data-lh") !== "1"
        ) {
          recur(child);
        }
      }
    };
    recur(host);
    if (!spans.length) return;
    const n = spans.length;
    let clearTimer: ReturnType<typeof setTimeout> | undefined;
    const set = (hover: boolean) => {
      if (clearTimer) clearTimeout(clearTimer);
      if (hover) spans.forEach((s) => (s.style.willChange = "transform"));
      spans.forEach((s) => {
        s.style.transitionDelay = (hover ? s._i! : n - 1 - s._i!) * letterHover.cascadeMs + "ms";
        s.style.transform = hover ? "translateY(-3px) scale(1.08)" : "none";
      });
      // Drop the compositor layers once the cascade finishes settling back.
      if (!hover) {
        const settle = letterHover.transitionMs + (n - 1) * letterHover.cascadeMs + 40;
        clearTimer = setTimeout(() => {
          spans.forEach((s) => (s.style.willChange = "auto"));
        }, settle);
      }
    };
    host.addEventListener("mouseenter", () => set(true));
    host.addEventListener("mouseleave", () => set(false));
  };

  const scan = (root: Node) => {
    if (!root || root.nodeType !== 1) return;
    const el = root as HTMLElement;
    if (el.matches && el.matches("[data-letter-hover]")) split(el);
    if (el.querySelectorAll)
      el.querySelectorAll<HTMLElement>("[data-letter-hover]").forEach(split);
  };
  scan(document.body);

  const mo = new MutationObserver((muts) => {
    for (const m of muts) for (const nd of m.addedNodes) scan(nd);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}
