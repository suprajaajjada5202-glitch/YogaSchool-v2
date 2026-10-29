"use client";
import { useEffect, useRef, useState } from "react";
import { sliderTestimonials as quotes } from "@/data/content";
import { Reveal } from "./Reveal";

const DURATION = 7000;

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = (i: number) => setCurrent((i + quotes.length) % quotes.length);

  useEffect(() => {
    if (paused || hover) return;
    const t = setTimeout(() => setCurrent((c) => (c + 1) % quotes.length), DURATION);
    return () => clearTimeout(t);
  }, [current, paused, hover]);

  return (
    <Reveal
      className="tslider"
      aria-roledescription="carousel"
      aria-label="Student testimonials"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <svg className="tslider__mark" aria-hidden="true">
        <use href="#i-quote" />
      </svg>
      <div className="tslider__viewport" aria-live="polite">
        {quotes.map((q, i) => (
          <figure
            key={q.name}
            className={`tslide${i === current ? " is-active" : ""}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${quotes.length}`}
            aria-hidden={i !== current}
          >
            <blockquote>{q.quote}</blockquote>
            <figcaption>
              {q.name}
              <span>{q.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="tslider__controls">
        <button type="button" className="arrow" aria-label="Previous testimonial" onClick={() => go(current - 1)}>
          <svg aria-hidden="true">
            <use href="#i-left" />
          </svg>
        </button>
        <div className="dots" role="group" aria-label="Choose testimonial">
          {quotes.map((q, i) => (
            <button
              key={q.name}
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === current}
              onClick={() => go(i)}
            ></button>
          ))}
        </div>
        <button type="button" className="arrow" aria-label="Next testimonial" onClick={() => go(current + 1)}>
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={paused ? "Play testimonials" : "Pause testimonials"}
          onClick={() => setPaused((p) => !p)}
        >
          <svg aria-hidden="true">
            <use href={paused ? "#i-play" : "#i-pause"} />
          </svg>
        </button>
      </div>
    </Reveal>
  );
}
