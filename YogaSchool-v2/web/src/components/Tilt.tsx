"use client";
import { useEffect } from "react";

/** Tilts every element matching `selector` a little toward the pointer (mouse only, and only when motion is welcome).
    Sets --tilt-x / --tilt-y on the element and the page's CSS turns them into a rotation; `x` and `y` are the most it
    turns, in degrees, at the element's edges. */
export function Tilt({ selector, x = 10, y = 8 }: { selector: string; x?: number; y?: number }) {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const offs = [...document.querySelectorAll<HTMLElement>(selector)].map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--tilt-x", `${(((e.clientX - r.left) / r.width - 0.5) * x).toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${((0.5 - (e.clientY - r.top) / r.height) * y).toFixed(2)}deg`);
      };
      const leave = () => {
        el.style.removeProperty("--tilt-x");
        el.style.removeProperty("--tilt-y");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        leave();
      };
    });
    return () => offs.forEach((off) => off());
  }, [selector, x, y]);
  return null;
}
