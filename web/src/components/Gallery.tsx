"use client";
import { useEffect, useRef, useState } from "react";
import { gallery } from "@/data/content";
import { useBodyLock } from "@/hooks/useBodyLock";
import { Reveal } from "./Reveal";

/** Masonry photo grid + full-size viewer (arrows, swipe, keyboard). */
export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  useBodyLock(open);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const show = (i: number) => setIndex((i + gallery.length) % gallery.length);
  const close = () => {
    setIndex(null);
    trigger.current?.focus();
  };
  const photo = index !== null ? gallery[index] : null;

  return (
    <>
      <div className="masonry" id="gallery-grid">
        {gallery.map((p, i) => (
          <Reveal
            as="button"
            key={p.full}
            type="button"
            aria-label={`Open image: ${p.alt}`}
            onClick={(e) => {
              trigger.current = e.currentTarget;
              show(i);
            }}
          >
            <img decoding="async" src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" />
          </Reveal>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox on-dark"
        id="lightbox"
        aria-label="Image viewer"
        onClose={close}
        onClick={(e) => (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "FIGURE") && close()}
        onKeyDown={(e) => {
          if (index === null) return;
          if (e.key === "ArrowLeft") show(index - 1);
          if (e.key === "ArrowRight") show(index + 1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null || index === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <figure>
          {photo && <img src={photo.full} alt={photo.alt} />}
          <figcaption>{photo && `${photo.alt} (${index! + 1} of ${gallery.length})`}</figcaption>
        </figure>
        <button className="lb-btn lb-close" type="button" aria-label="Close image viewer" onClick={close}>
          <svg aria-hidden="true">
            <use href="#i-close" />
          </svg>
        </button>
        <button
          className="lb-btn lb-prev"
          type="button"
          aria-label="Previous image"
          onClick={() => index !== null && show(index - 1)}
        >
          <svg aria-hidden="true">
            <use href="#i-left" />
          </svg>
        </button>
        <button
          className="lb-btn lb-next"
          type="button"
          aria-label="Next image"
          onClick={() => index !== null && show(index + 1)}
        >
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
