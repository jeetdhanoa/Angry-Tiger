/* Angry Tiger — motion layer.
   Motion language: a film title sequence, not a SaaS site. Entrances are long
   and decelerating; interactions stay decisive. The signature is the
   letterbox/film-frame reveal. All timings/easing come from the shared design
   tokens (src/design/motion.ts) so CSS and this engine can't drift.

   - initReveals: sections + [data-reveal] rise-fade in on scroll; [data-seq]
     containers cascade their children in sequence; [data-reveal-frame] stills
     open like a film frame (letterbox clip). FAIL-SAFE: geometry-based, with a
     safety-net timeout so content is never stranded invisible if geometry or
     an observer misbehaves (the old IntersectionObserver version could, and
     did, leave whole pages blank).
   - initParallax: [data-parallax] elements drift on scroll.
   - initLetterHover: [data-letter-hover] text lifts letter by letter.
   All respect prefers-reduced-motion. */

import { easeCut, reveal, frame, letterHover } from "@/design/motion";

const reduced = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initMotion() {
  initReveals();
  initParallax();
  initLetterHover();
  initMarkers();
}

let revealsStarted = false;

type RevealGroup = {
  trigger: HTMLElement; // element whose position gates the group
  members: { el: HTMLElement; frame: boolean }[];
  revealed: boolean;
};

export function initReveals() {
  if (revealsStarted) return;
  revealsStarted = true;
  // Reduced-motion (or no matchMedia): never hide anything — content is shown
  // as-is, no reveal. Nothing is ever prepped to opacity:0, so nothing can be
  // stranded.
  if (reduced()) return;

  const prepped = new WeakSet<Element>();
  const groups: RevealGroup[] = [];

  const prepText = (el: HTMLElement) => {
    const existing = el.style.transition;
    el.style.opacity = "0";
    el.style.transform = "translateY(" + reveal.distancePx + "px)";
    el.style.transition =
      (existing ? existing + ", " : "") +
      "opacity " + reveal.transitionMs + "ms " + reveal.ease +
      ", transform " + reveal.transitionMs + "ms " + reveal.ease;
    el.style.willChange = "opacity, transform";
  };

  const prepFrame = (el: HTMLElement) => {
    // The letterbox slit + its open transition live in CSS (.reveal-frame);
    // JS only toggles the state class so the clip-path can be tuned in one place.
    el.classList.add("reveal-frame");
    el.style.willChange = "clip-path";
  };

  const revealMember = (m: { el: HTMLElement; frame: boolean }, delay: number) => {
    setTimeout(() => {
      if (m.frame) {
        m.el.classList.add("reveal-frame--in");
        setTimeout(() => (m.el.style.willChange = "auto"), frame.transitionMs + 120);
      } else {
        m.el.style.opacity = "1";
        m.el.style.transform = "none";
        setTimeout(() => (m.el.style.willChange = "auto"), reveal.transitionMs + 120);
      }
    }, delay);
  };

  const fire = (g: RevealGroup) => {
    if (g.revealed) return;
    g.revealed = true;
    g.members.forEach((m, i) => revealMember(m, i * reveal.staggerMs));
  };

  // Build a group from an element. A [data-seq] element sequences its direct
  // children; anything else is a group of one. A [data-reveal-frame] member
  // opens as a film frame; otherwise it rises + fades.
  const register = (el: HTMLElement) => {
    if (prepped.has(el)) return;
    prepped.add(el);
    let members: { el: HTMLElement; frame: boolean }[];
    if (el.hasAttribute("data-seq")) {
      const kids = (Array.prototype.slice.call(el.children) as HTMLElement[]).filter(
        // Decorative (aria-hidden) and opted-out children aren't part of the
        // content choreography — e.g. absolutely-positioned graphic marks.
        (k) => k.getAttribute("aria-hidden") !== "true" && !k.hasAttribute("data-no-reveal")
      );
      members = kids.map((k) => ({ el: k, frame: k.hasAttribute("data-reveal-frame") }));
    } else {
      members = [{ el, frame: el.hasAttribute("data-reveal-frame") }];
    }
    members.forEach((m) => (m.frame ? prepFrame(m.el) : prepText(m.el)));
    groups.push({ trigger: el, members, revealed: false });
  };

  const SELECTOR = "section, footer, [data-reveal], [data-reveal-frame], [data-seq]";
  const EXPLICIT = "[data-seq], [data-reveal], [data-reveal-frame]";
  const isExplicit = (n: HTMLElement) =>
    n.hasAttribute("data-seq") ||
    n.hasAttribute("data-reveal") ||
    n.hasAttribute("data-reveal-frame");
  const eligible = (n: HTMLElement) => {
    if (n.hasAttribute("data-no-reveal")) return false;
    // A [data-seq] container owns its children — a child inside one is revealed
    // by that container, not registered on its own (would double-prep it).
    if (n.closest("[data-seq]") && !n.hasAttribute("data-seq")) return false;
    // A bare section matched only by tag defers to any explicit reveal targets
    // inside it — otherwise the section fades as one unit *and* its children
    // choreograph, stacking two entrances on the same content.
    if (!isExplicit(n) && n.querySelector(EXPLICIT)) return false;
    return true;
  };
  const scan = (root: Node) => {
    if (!root || root.nodeType !== 1) return;
    const el = root as HTMLElement;
    if (el.matches && el.matches(SELECTOR) && eligible(el)) register(el);
    if (el.querySelectorAll)
      el.querySelectorAll<HTMLElement>(SELECTOR).forEach((n) => {
        if (eligible(n)) register(n);
      });
  };
  scan(document.body);

  // Geometry-based trigger — reveal a group once its trigger's top clears the
  // bottom ~12% of the viewport. Replaces IntersectionObserver, which did not
  // reliably fire (leaving prepped content permanently invisible).
  let ticking = false;
  const check = () => {
    ticking = false;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!vh) return;
    const line = vh * 0.88;
    for (const g of groups) {
      if (g.revealed) continue;
      const top = g.trigger.getBoundingClientRect().top;
      if (top < line) fire(g);
    }
  };
  // Scroll path is rAF-throttled (cheap under a stream of scroll events).
  const req = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(check);
    }
  };
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);

  // Fail-safe net: reveal whatever is still pending after safetyMs, so content
  // is never stranded invisible (broken geometry, a device that never scrolls,
  // rAF that never fires). Rescheduled on every content change so *client
  // navigations* are covered too, not just the first load — the earlier bug
  // was that late-mounted content had no net and depended entirely on rAF.
  let safetyTimer: ReturnType<typeof setTimeout>;
  const scheduleSafety = () => {
    clearTimeout(safetyTimer);
    safetyTimer = setTimeout(() => groups.forEach(fire), reveal.safetyMs);
  };
  // Direct (non-rAF) settle after any content change: reveals what's in view
  // immediately — this is what makes a client-navigated page's above-fold
  // content appear without waiting on the scroll/rAF path.
  let settleTimer: ReturnType<typeof setTimeout>;
  const settle = () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      check();
      scheduleSafety();
    }, 50);
  };

  settle();

  // Client navigation mounts content progressively — register late arrivals
  // and settle them (immediate in-view reveal + a fresh safety net).
  const mo = new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) scan(n);
    settle();
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
