"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Every section of the inner pages plays in as it scrolls on screen, in both directions (the home page has its own
   motion). A block rises in when it enters from below, drops in when it comes back from above, and quietly resets once
   it is fully off screen, so it plays again whichever way you scroll. Each section is walked from the top: cards and
   list items animate one by one, text columns line by line, other blocks (headings, text, photos, buttons, embeds) as
   a whole. <Reveal> wrappers are taken over (data-cm-host) so they don't also fade in once. Photos wipe up inside their
   frame and settle from a gentle zoom; arch photos also drift slowly as they pass (--cm-p, parallax). Blocks already on
   screen when the page opens start shown, so nothing blinks (unless marked data-cm-intro, which plays in on load, like
   the first cards under a banner); blocks React adds later simply show.
   CSS: [data-cm] in globals.css. */

/** Cards and list items: always animated on their own */
const ITEMS = [
  ".info-card",
  ".feature",
  ".why__item",
  ".stat",
  ".tile",
  ".story",
  ".teacher",
  ".plan",
  ".plan-tile",
  ".pass-card",
  ".product",
  ".vcard",
  ".event",
  ".modality",
  ".partner",
  ".info-item",
  ".shop-card",
  ".quick__item",
  ".pass-terms__group",
  ".path > a",
  ".benefits > li",
  ".facts > li",
  ".ticks > li",
  ".voices-index li",
  ".faq",
  "details",
].join(",");

/** Bars that scroll sideways: watched as one, their links cascade in inside them */
const GROUPS = ".jump";

/** Photo frames that clip their image, so it can wipe in and zoom without spilling out */
const PHOTOS = ".arch__frame, .teacher__photo, .card__media, .post__media, .shop-card__media, .product__media";

/** Sections the walk starts from (banners animate on load in CSS, and replay when scrolled back to: data-cm-hero) */
const SECTIONS = "#main section:not(.page-hero, .voices-hero, .hero), #main .quick";
const HEROES = "#main .page-hero, #main .voices-hero";

const HOME = ["/", "/home", "/pages/home"];
/** Pages with motion of their own: home, and the blog (BlogMotion.tsx) */
const OWN = [...HOME, "/pages/blog1"];

/** Time for the slowest entrance (photo zoom) to finish, before a block hands its transitions back (hover etc.) */
const SETTLE = 1500;
const STAGGER_MAX = 5;

type State = "in" | "shown" | "above" | "below";

/** Decorations, screen-reader text, popups and hidden parts are never touched */
function skip(el: HTMLElement, cs: CSSStyleDeclaration) {
  return (
    el.getAttribute("aria-hidden") === "true" ||
    el.hidden ||
    cs.display === "none" ||
    cs.position === "absolute" ||
    cs.position === "fixed" ||
    el.matches("script, style, template, dialog, .sr-only") ||
    el.hasAttribute("data-motion-skip") // a block with motion of its own (the gallery mosaic)
  );
}

/** Sliders and tracks that scroll sideways: their parts can sit off to the side while on screen, so they move as one */
function scrollsSideways(el: HTMLElement, cs: CSSStyleDeclaration) {
  return /auto|scroll|hidden/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1;
}

/** Layout wrappers and text columns are walked into, so their children can stagger instead of moving as one slab */
function isWrapper(el: HTMLElement, cs: CSSStyleDeclaration) {
  return (
    el.matches("section, .container, .prose, .chapter__grid") ||
    cs.display === "contents" ||
    (cs.display === "grid" && el.childElementCount > 1) ||
    (el.childElementCount > 2 && el.querySelector(":scope > h2, :scope > h3") !== null)
  );
}

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (OWN.includes(pathname) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets: HTMLElement[] = [];
    const hosts: HTMLElement[] = [];
    const walk = (el: HTMLElement) => {
      if (el.hasAttribute("data-cm")) return;
      const cs = getComputedStyle(el);
      if (skip(el, cs)) return;
      if (el.matches(`${ITEMS}, ${GROUPS}`) || scrollsSideways(el, cs)) {
        targets.push(el);
        return;
      }
      if (el.classList.contains("reveal")) {
        el.setAttribute("data-cm-host", "");
        hosts.push(el);
      }
      if (el.classList.contains("reveal") || isWrapper(el, cs) || el.querySelector(`.reveal, ${ITEMS}, ${GROUPS}`)) {
        for (const child of el.children) walk(child as HTMLElement);
        return;
      }
      targets.push(el);
    };

    let shownAt = new WeakMap<HTMLElement, number>();
    const set = (el: HTMLElement, s: State) => {
      if (el.dataset.cm === s) return;
      el.dataset.cm = s;
      el.querySelectorAll<HTMLElement>("[data-cm-photo]").forEach((p) => (p.dataset.cmPhoto = s));
      if (el.matches("[data-cm-photo]")) el.dataset.cmPhoto = s;
      window.clearTimeout(shownAt.get(el));
      // Once settled, hand the block its own transitions back (hover lifts) without the entrance timing
      if (s === "in")
        shownAt.set(
          el,
          window.setTimeout(() => set(el, "shown"), SETTLE),
        );
    };

    // Shown a little before the bottom edge; hidden again only when completely off screen, so no one sees it fade out
    const show = new IntersectionObserver(
      (entries) => {
        // Blocks entering together stagger (a row of cards on desktop); one at a time on phones, so no wait there
        let n = 0;
        for (const { isIntersecting, target } of entries) {
          const el = target as HTMLElement;
          if (!isIntersecting || el.dataset.cm === "in" || el.dataset.cm === "shown") continue;
          el.style.setProperty("--cm-i", String(Math.min(n++, STAGGER_MAX)));
          set(el, "in");
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const hide = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target, boundingClientRect } of entries) {
        if (!isIntersecting) set(target as HTMLElement, boundingClientRect.top < 0 ? "above" : "below");
      }
    });

    // Banners: once scrolled fully away, their load animation is switched off, so it plays again when they come back
    const heroes = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting, intersectionRatio } of entries) {
          if (!isIntersecting) target.setAttribute("data-cm-hero", "off");
          else if (intersectionRatio >= 0.25) target.removeAttribute("data-cm-hero");
        }
      },
      { threshold: [0, 0.25] },
    );

    // Parallax for arch photos: -1 while the photo's row (or the photo) is a screen below the middle, 1 above
    const frames: HTMLElement[] = [];
    const near = new Set<HTMLElement>();
    const watch = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? near.add(e.target as HTMLElement) : near.delete(e.target as HTMLElement);
        onScroll();
      },
      { rootMargin: "25% 0px" },
    );
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      // Read every position first, then write, so the browser lays out once per frame
      const ps = [...near].map((f) => {
        const b = (f.closest<HTMLElement>(".row") ?? f).getBoundingClientRect();
        return [f, Math.max(-1, Math.min(1, (h / 2 - (b.top + b.height / 2)) / (h / 2 + b.height / 2)))] as const;
      });
      for (const [f, p] of ps) f.style.setProperty("--cm-p", p.toFixed(3));
    };
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    const frame = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(SECTIONS).forEach((s) => {
        for (const child of s.children) walk(child as HTMLElement);
      });
      const vh = window.innerHeight;
      for (const el of targets) {
        el.querySelectorAll<HTMLElement>(PHOTOS).forEach((p) => p.setAttribute("data-cm-photo", ""));
        if (el.matches(PHOTOS)) el.setAttribute("data-cm-photo", "");
        if (el.matches(GROUPS))
          el.querySelectorAll<HTMLElement>(":scope > a").forEach((a, i) => a.style.setProperty("--cm-i", String(Math.min(i, 8))));
        const b = el.getBoundingClientRect();
        const onScreen = b.bottom > 0 && b.top < vh;
        set(el, !onScreen ? (b.bottom <= 0 ? "above" : "below") : el.hasAttribute("data-cm-intro") ? "below" : "shown");
        show.observe(el);
        hide.observe(el);
      }
      document.querySelectorAll<HTMLElement>("#main .arch__frame[data-cm-photo]").forEach((f) => {
        f.setAttribute("data-cm-par", "");
        frames.push(f);
        watch.observe(f);
      });
      document.querySelectorAll(HEROES).forEach((h) => heroes.observe(h));
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(raf);
      show.disconnect();
      hide.disconnect();
      watch.disconnect();
      heroes.disconnect();
      document.querySelectorAll("[data-cm-hero]").forEach((h) => h.removeAttribute("data-cm-hero"));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const el of targets) window.clearTimeout(shownAt.get(el));
      shownAt = new WeakMap();
      document.querySelectorAll<HTMLElement>("[data-cm], [data-cm-host], [data-cm-photo], [data-cm-par]").forEach((el) => {
        el.removeAttribute("data-cm");
        el.removeAttribute("data-cm-host");
        el.removeAttribute("data-cm-photo");
        el.removeAttribute("data-cm-par");
        el.style.removeProperty("--cm-i");
        el.style.removeProperty("--cm-p");
      });
      document.querySelectorAll<HTMLElement>(".jump > a").forEach((a) => a.style.removeProperty("--cm-i"));
    };
  }, [pathname]);

  return null;
}
