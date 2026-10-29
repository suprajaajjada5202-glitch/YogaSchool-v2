"use client";
import { createElement, useEffect, useRef, useState, type AllHTMLAttributes, type ReactNode } from "react";

type Props = AllHTMLAttributes<HTMLElement> & {
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  children?: ReactNode;
  [data: `data-${string}`]: string | undefined;
};

/** Fades content in as it scrolls into view (CSS: .reveal / .is-visible). */
export function Reveal({ as = "div", delay, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [className, "reveal", visible && "is-visible"].filter(Boolean).join(" ");
  return createElement(as, { ref, className: cls, "data-delay": delay, ...rest }, children);
}
