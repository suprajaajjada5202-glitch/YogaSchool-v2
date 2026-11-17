"use client";
/* Scroll-snap card sliders. The arrows (SliderNav), the track (SliderTrack) and the progress bar
   (SliderBar) sit in different parts of a section, so they share state through a small store keyed by id. */
import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

type State = { canPrev: boolean; canNext: boolean; barWidth: number; barX: number; paused: boolean; hasAuto: boolean };
type Store = { state: State; listeners: Set<() => void>; el: HTMLElement | null };
const INITIAL: State = { canPrev: false, canNext: true, barWidth: 30, barX: 0, paused: false, hasAuto: false };
const stores = new Map<string, Store>();

function store(id: string): Store {
  let s = stores.get(id);
  if (!s) {
    s = { state: INITIAL, listeners: new Set(), el: null };
    stores.set(id, s);
  }
  return s;
}
function set(id: string, patch: Partial<State>) {
  const s = store(id);
  s.state = { ...s.state, ...patch };
  s.listeners.forEach((l) => l());
}
function useSlider(id: string) {
  const s = store(id);
  return useSyncExternalStore(
    (l) => {
      s.listeners.add(l);
      return () => s.listeners.delete(l);
    },
    () => s.state,
    () => INITIAL,
  );
}

function step(el: HTMLElement) {
  const slide = el.querySelector<HTMLElement>(".slide");
  return slide ? slide.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 24) : el.clientWidth * 0.8;
}
function smooth() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}
function scrollStep(id: string, dir: 1 | -1) {
  const el = store(id).el;
  if (el) el.scrollBy({ left: dir * step(el), behavior: smooth() });
}

export function SliderTrack({
  id,
  label,
  className,
  auto,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  auto?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const { paused } = useSlider(id);
  const hold = useRef(false);
  const inView = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const w = Math.max(12, (el.clientWidth / el.scrollWidth) * 100);
    set(id, {
      canPrev: el.scrollLeft > 2,
      canNext: el.scrollLeft < max - 2,
      barWidth: w,
      barX: max > 0 ? (el.scrollLeft / max) * ((100 / w) * 100 - 100) : 0,
    });
  }, [id]);

  const run = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (!auto || store(id).state.paused || hold.current || !inView.current || document.hidden) return;
    timer.current = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: el.scrollLeft >= max - 4 ? 0 : Math.min(max, el.scrollLeft + step(el)), behavior: "smooth" });
    }, auto);
  }, [auto, id]);

  useEffect(() => {
    const el = ref.current!;
    store(id).el = el;
    set(id, { hasAuto: Boolean(auto) });
    update();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    let io: IntersectionObserver | undefined;
    if (auto) {
      io = new IntersectionObserver(
        ([e]) => {
          inView.current = e.isIntersecting;
          run();
        },
        { threshold: 0.3 },
      );
      io.observe(el);
      document.addEventListener("visibilitychange", run);
    }
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", run);
      io?.disconnect();
      if (timer.current) clearInterval(timer.current);
      store(id).el = null;
    };
  }, [id, auto, update, run]);

  useEffect(run, [paused, run]);

  const holdOn = () => {
    hold.current = true;
    run();
  };
  const holdOff = () => {
    hold.current = false;
    run();
  };

  return (
    <ul
      ref={ref}
      className={`slider__track${className ? " " + className : ""}`}
      id={id}
      tabIndex={0}
      aria-label={label}
      onMouseEnter={auto ? holdOn : undefined}
      onMouseLeave={auto ? holdOff : undefined}
      onFocus={auto ? holdOn : undefined}
      onBlur={auto ? holdOff : undefined}
      onTouchStart={auto ? holdOn : undefined}
      onTouchEnd={auto ? () => setTimeout(holdOff, 3000) : undefined}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollStep(id, 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollStep(id, -1);
        }
      }}
    >
      {children}
    </ul>
  );
}

export function SliderNav({
  target,
  prevLabel,
  nextLabel,
  pauseLabel,
  children,
}: {
  target: string;
  prevLabel: string;
  nextLabel: string;
  pauseLabel?: string;
  children?: ReactNode;
}) {
  const s = useSlider(target);
  const what = pauseLabel?.replace(/^Pause /, "") ?? "";
  return (
    <div className="slider__nav" data-for={target}>
      {children}
      <button type="button" className="arrow" aria-label={prevLabel} disabled={!s.canPrev} onClick={() => scrollStep(target, -1)}>
        <svg aria-hidden="true">
          <use href="#i-left" />
        </svg>
      </button>
      <button type="button" className="arrow" aria-label={nextLabel} disabled={!s.canNext} onClick={() => scrollStep(target, 1)}>
        <svg aria-hidden="true">
          <use href="#i-arrow" />
        </svg>
      </button>
      {pauseLabel && (
        <button
          type="button"
          className="arrow arrow--sm"
          aria-label={`${s.paused ? "Play" : "Pause"} ${what}`}
          onClick={() => set(target, { paused: !s.paused })}
        >
          <svg aria-hidden="true">
            <use href={s.paused ? "#i-play" : "#i-pause"} />
          </svg>
        </button>
      )}
    </div>
  );
}

export function SliderBar({ target }: { target: string }) {
  const s = useSlider(target);
  return (
    <div className="slider__bar" data-bar-for={target}>
      <span style={{ width: `${s.barWidth}%`, transform: `translateX(${s.barX}%)` }}></span>
    </div>
  );
}
