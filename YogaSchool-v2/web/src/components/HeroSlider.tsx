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

  // Scrolled out of view, the slideshow rests (no timer, decorations paused in CSS via is-offscreen)
  const hero = useRef<HTMLElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const el = hero.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => setOffscreen(!entries[entries.length - 1].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Back in view: the slide's progress bar and text start afresh, in step with the restarted timer
  const wasOffscreen = useRef(false);
  useEffect(() => {
    if (wasOffscreen.current && !offscreen) setCycle((c) => c + 1);
    wasOffscreen.current = offscreen;
  }, [offscreen]);

  // With reduced motion the slideshow starts paused; its play button still runs it
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused || offscreen) return;
    const t = setTimeout(() => {
      if (!document.hidden) go(current + 1);
    }, DURATION);
    return () => clearTimeout(t);
  }, [current, paused, offscreen, cycle, go]);

  useEffect(() => {
    const onLoad = () => setLoaded((s) => new Set(s).add(1));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
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
      ref={hero}
      className={`home-hero on-dark${paused ? " is-paused" : ""}${offscreen ? " is-offscreen" : ""}`}
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
      </div>

      {/* Scroll cue down to the classes (large screens only, see .hero__scroll); it targets the section, which never
          moves, so the heading lands clear of the header */}
      <a className="hero__scroll" href="#our-classes" aria-label="Scroll down to our classes"></a>

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
