"use client";
import { useEffect, useRef } from "react";

const DURATION = 1100;

/** 1045 → "1,045", 24.5 → "24.50": the same text on the server and in the browser */
function format(n: number, decimals: number) {
  const [whole, cents] = n.toFixed(decimals).split(".");
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (cents ? `.${cents}` : "");
}

/** An amount that counts up from zero each time its voucher card plays in on scroll (Motion.tsx sets data-cm on the
    card, which this watches; the count starts after the card's own stagger and ends with its price bar). A card
    already on screen when the page opens, and anyone who prefers reduced motion, just sees the amount. Screen readers
    get the amount as plain text, not the numbers on the way. */
export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = value % 1 ? 2 : 0;
  const text = (n: number) => prefix + format(n, decimals) + suffix;

  useEffect(() => {
    const el = ref.current;
    const card = el?.closest<HTMLElement>(".vcard");
    const node = el?.firstChild;
    if (!card || !node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let timer = 0;
    let running = false;
    // Written into the text node React made, so React's own updates still reach it
    const show = (n: number) => (node.nodeValue = prefix + format(n, decimals) + suffix);
    const stop = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      running = false;
    };
    const sync = () => {
      const state = card.dataset.cm;
      if (state === "in") {
        stop();
        show(0);
        running = true;
        const delay = Number(card.style.getPropertyValue("--cm-i") || 0) * 90 + 350;
        timer = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / DURATION);
            show(value * (1 - (1 - p) ** 3));
            if (p < 1) raf = requestAnimationFrame(tick);
            else running = false;
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      } else if (state === "below" || state === "above") {
        stop();
        show(0); // off screen: ready to count again
      } else if (!running) show(value); // "shown" arrives while a slow count is still running: let it finish
    };
    const watch = new MutationObserver(sync);
    watch.observe(card, { attributes: true, attributeFilter: ["data-cm"] });
    sync();
    return () => {
      watch.disconnect();
      stop();
      show(value);
    };
  }, [value, prefix, suffix, decimals]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {text(value)}
      </span>
      <span className="sr-only">{text(value)}</span>
    </>
  );
}
