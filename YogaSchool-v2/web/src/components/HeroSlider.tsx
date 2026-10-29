"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { heroSlides } from "@/data/content";
import { OFFER_URL } from "@/lib/site";

const DURATION = 3500; // time per hero slide (ms)
const pad = (n: number) => String(n).padStart(2, "0");

/** Home page hero: headline and buttons over a slideshow of photos or videos (heroSlides in data/content.ts),
    with one bar per slide and a pause button. Only the first photo loads with the page. */
export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const [cycle, setCycle] = useState(0); // restarts the progress-bar animation
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const go = useCallback(
    (i: number) => {
      const next = (i + heroSlides.length) % heroSlides.length;
      setLeaving(current !== next ? current : null);
      setCurrent(next);
      setLoaded((s) => new Set(s).add(next).add((next + 1) % heroSlides.length));
      setCycle((c) => c + 1);
    },
    [current],
  );

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      if (!document.hidden) go(current + 1);
    }, DURATION);
    return () => clearTimeout(t);
  }, [current, paused, cycle, go]);

  useEffect(() => {
    const onLoad = () => setLoaded((s) => new Set(s).add(1));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // The text builds in once the first photo is decoded and on screen, so the entrance is seen instead of being spent
  // while the page is still loading (CSS holds it until "is-ready"; a timer makes sure it never waits long)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>(".home-hero .hero__slide.is-active img");
    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    };
    (img?.decode ? img.decode() : Promise.resolve()).then(start, start);
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, []);

  // A video plays only while its slide shows and the slideshow runs; with reduced motion its photo stays instead
  useEffect(() => {
    const still = paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === current && !still) v.play().catch(() => {});
      else v.pause();
    });
  }, [current, paused, loaded]);

  return (
    <section
      className={`home-hero on-dark${paused ? " is-paused" : ""}${ready ? " is-ready" : ""}`}
      aria-roledescription="carousel"
      aria-label="The Yoga School studio"
      style={{ "--hero-dur": `${DURATION}ms` } as CSSProperties}
    >
      <div className="hero__slides">
        {heroSlides.map((s, i) => (
          <figure
            key={s.src}
            className={`hero__slide${i === current ? " is-active" : ""}${i === leaving ? " is-leaving" : ""}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${heroSlides.length}`}
            aria-hidden={i !== current}
            style={s.position ? ({ "--pos": s.position } as CSSProperties) : undefined}
          >
            {s.video ? (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                src={loaded.has(i) ? s.video : undefined}
                poster={loaded.has(i) ? s.src : undefined}
                width={s.width}
                height={s.height}
                aria-label={s.alt}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                decoding="async"
                src={loaded.has(i) ? s.src : undefined}
                alt={s.alt}
                width={s.width}
                height={s.height}
                fetchPriority={i === 0 ? "high" : undefined}
              />
            )}
          </figure>
        ))}
      </div>

      <div className="container">
        {/* With each new photo the heading, tagline and line play in again (keyed by cycle, so they remount; the
            buttons keep their place and focus) */}
        <div className={`home-hero__text${cycle ? " is-swap" : ""}`}>
          {/* Each line rises out from behind its own edge (.home-hero__line clips, the inner span moves) */}
          <h1 id="home-title" key={`h-${cycle}`}>
            <span className="home-hero__line">
              <span>
                <em>Move</em> Better.
              </span>
            </span>{" "}
            <span className="home-hero__line">
              <span>
                Feel <em>Stronger.</em>
              </span>
            </span>
          </h1>
          <p className="home-hero__tagline" key={`t-${cycle}`}>
            Yoga. Strength. Mobility. Wellbeing.
          </p>
          <p className="home-hero__sub" key={`s-${cycle}`}>
            <span>One studio. 5 approaches.</span> <span>More ways to move better.</span>
          </p>
          <div className="home-hero__actions">
            <Link className="btn btn--light" href="/pages/timetable">
              Book a Class
            </Link>
            <a className="btn btn--azure" href={OFFER_URL} target="_blank" rel="noopener">
              30 Days Unlimited Offer $99<span className="sr-only"> (opens Momence in a new tab)</span>
            </a>
          </div>
        </div>
        {/* Scroll cue down to the classes (large screens only, see .hero__scroll) */}
        <a className="hero__scroll" href="#classes-title" aria-label="Scroll down to our classes"></a>
      </div>

      <div className="home-hero__controls">
        {/* Announced only when paused, not on every automatic change */}
        <span className="hero__count" aria-live={paused ? "polite" : "off"}>
          <span>{pad(current + 1)}</span> / {pad(heroSlides.length)}
        </span>
        <div className="hero__bars" role="group" aria-label="Choose slide">
          {heroSlides.map((_, i) => (
            <button
              key={i === current ? `active-${cycle}` : i}
              type="button"
              className={i === current ? "is-active" : i < current ? "is-done" : undefined}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === current}
              onClick={() => go(i)}
            >
              <span></span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          onClick={() => setPaused((p) => !p)}
        >
          <svg aria-hidden="true">
            <use href={paused ? "#i-play" : "#i-pause"} />
          </svg>
        </button>
      </div>
    </section>
  );
}
