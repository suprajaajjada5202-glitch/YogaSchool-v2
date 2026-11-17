"use client";
import { useState } from "react";

/** Video poster that swaps to the YouTube player when clicked (no YouTube load until then). */
export function InlineYouTube({ id, label, caption, thumb }: { id: string; label: string; caption: string; thumb: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="yt" id="training-video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={caption.replace(/^▶\s*/, "")}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          <button type="button" aria-label={label} onClick={() => setPlaying(true)}>
            <img decoding="async" src={thumb} alt="" width={1280} height={720} loading="lazy" />
            <span className="play" aria-hidden="true">
              <svg>
                <use href="#i-play" />
              </svg>
            </span>
          </button>
          <span className="yt__label">{caption}</span>
        </>
      )}
    </div>
  );
}
