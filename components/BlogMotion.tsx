"use client";
import { useEffect } from "react";

/* Blog page motion (the site-wide Motion.tsx skips this page). The banner builds in with CSS as the page paints;
   this adds what needs the page: scrolling away lifts the banner text and lets its photo drift (--bm-out), article
   cards play in once as they reach the screen, a batch at a time (data-bm, --bm-d), cards tilt toward the pointer
   with a soft sheen (--rx, --ry, --mx, --my), and the footer settles in the first time it shows.
   CSS: "BLOG PAGE MOTION" in globals.css. With reduced motion nothing here runs and the page shows as designed. */

const CARD_GAP = 110; // ms between cards arriving together
const TILT = 3; // most the card turns toward the pointer, in degrees

export function BlogMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const hero = document.querySelector<HTMLElement>(".blog-hero");
    const cards = [...document.querySelectorAll<HTMLElement>(".blog-list .post__card")];
    const footer = document.querySelector<HTMLElement>(".site-footer");
    document.documentElement.setAttribute("data-bm-page", "");

    // Cards on screen when the page opens follow the banner headline (about a second in); later ones come at once
    let base = Math.max(300, 1100 - performance.now());
    const cardsIn = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          cardsIn.unobserve(el);
          el.style.setProperty("--bm-d", `${Math.round(base + Math.min(n++, 5) * CARD_GAP)}ms`);
          el.dataset.bm = "in";
        }
        base = 0;
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    cards.forEach((c) => cardsIn.observe(c));

    const footerIn = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || !footer) return;
        footer.dataset.bmFooter = "in";
        footerIn.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    if (footer && footer.getBoundingClientRect().top > window.innerHeight) {
      footer.dataset.bmFooter = "wait";
      footerIn.observe(footer);
    }

    // Banner hand-off: 0 at the top of the page, 1 once the banner has scrolled away
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!hero) return;
      const b = hero.getBoundingClientRect();
      const out = Math.max(0, Math.min(1, -b.top / Math.max(1, b.height)));
      hero.style.setProperty("--bm-out", out.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    // Pointer tilt and sheen, only where there is a real hover
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", `${((x - 0.5) * 2 * TILT).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${((0.5 - y) * 2 * TILT).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    };
    const onLeave = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };
    if (fine)
      cards.forEach((c) => {
        c.addEventListener("pointermove", onMove);
        c.addEventListener("pointerleave", onLeave);
      });

    return () => {
      cardsIn.disconnect();
      footerIn.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeAttribute("data-bm-page");
      footer?.removeAttribute("data-bm-footer");
      cards.forEach((c) => {
        c.removeEventListener("pointermove", onMove);
        c.removeEventListener("pointerleave", onLeave);
      });
    };
  }, []);

  return null;
}
