"use client";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type AllHTMLAttributes,
  type ReactNode,
} from "react";

type Props = AllHTMLAttributes<HTMLElement> & {
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  children?: ReactNode;
  [data: `data-${string}`]: string | undefined;
};

const RepeatContext = createContext(false);

/** Inside this (the home page), revealed content hides again once it has scrolled fully out of view, so it animates
    in every time it comes back, from the edge it left by (data-from="top" or "bottom"). */
export function RevealRepeat({ children }: { children: ReactNode }) {
  return <RepeatContext.Provider value={true}>{children}</RepeatContext.Provider>;
}

/** Fades content in as it scrolls into view (CSS: .reveal / .is-visible). */
export function Reveal({ as = "div", delay, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const repeat = useContext(RepeatContext);
  const [visible, setVisible] = useState(false);
  const [from, setFrom] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The layout's inline script removes "no-js" once; take it off again if a failed hydration put it back, so
    // content keeps animating in
    document.body.classList.remove("no-js");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    if (!repeat) {
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
    }
    // Repeat: shown once a fifth of it is above the bottom 12% of the screen, so the entrance is seen; hidden only
    // when fully off screen, so it never disappears while any of it shows
    const show = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) setVisible(true);
      },
      { threshold: [0, 0.2], rootMargin: "0px 0px -12% 0px" },
    );
    const hide = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) return;
      setVisible(false);
      setFrom(entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0) ? "top" : "bottom");
    });
    show.observe(el);
    hide.observe(el);
    return () => {
      show.disconnect();
      hide.disconnect();
    };
  }, [repeat]);

  const cls = [className, "reveal", visible && "is-visible"].filter(Boolean).join(" ");
  return createElement(
    as,
    { ref, className: cls, "data-delay": delay, "data-from": repeat ? from : undefined, ...rest },
    children,
  );
}
