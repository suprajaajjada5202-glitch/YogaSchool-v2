"use client";
import { useState } from "react";
import { Sheet } from "./Sheet";

/** Video thumbnail that plays the YouTube video in an in-page modal. */
export function VideoButton({ id, title, duration }: { id: string; title: string; duration: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="video__btn" onClick={() => setOpen(true)}>
        <span className="video__thumb">
          <img
            decoding="async"
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            loading="lazy"
          />
          <span className="play" aria-hidden="true">
            <svg>
              <use href="#i-play" />
            </svg>
          </span>
          <span className="video__dur">{duration}</span>
        </span>
        <span className="video__title">
          {title}
          <span className="sr-only"> (play video, {duration})</span>
        </span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} video label="Video player">
        <div className="sheet__video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </Sheet>
    </>
  );
}
