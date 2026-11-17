"use client";
import Link from "next/link";
import { useState } from "react";
import { moments } from "@/data/content";
import { Reveal } from "./Reveal";

/** Continuously moving photo strip (CSS animation); the button pauses it. Every photo opens the Gallery page
    (by mouse; keyboard users get the one "View gallery" link instead of a dozen identical ones). */
export function MomentsStrip() {
  const [paused, setPaused] = useState(false);
  const row = (copy: boolean) => (
    <ul aria-hidden={copy || undefined}>
      {moments.map((m) => (
        <li className="moment" key={m.src}>
          <Link href="/pages/photo-gallery" tabIndex={-1}>
            <img decoding="async" src={m.src} alt={copy ? "" : m.alt} width={m.width} height={m.height} loading="lazy" />
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <Reveal className={`moments${paused ? " is-paused" : ""}`}>
      <div className="moments__head">
        <p className="eyebrow">Studio moments</p>
        <Link className="link-arrow moments__all" href="/pages/photo-gallery">
          View gallery
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </Link>
        <button
          type="button"
          className="arrow arrow--sm"
          aria-label={paused ? "Play photo strip" : "Pause photo strip"}
          onClick={() => setPaused((p) => !p)}
        >
          <svg aria-hidden="true">
            <use href={paused ? "#i-play" : "#i-pause"} />
          </svg>
        </button>
      </div>
      <div className="moments__viewport" aria-label="Studio photos">
        <div className="moments__track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </Reveal>
  );
}
