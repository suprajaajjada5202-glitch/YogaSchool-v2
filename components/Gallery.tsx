"use client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { gallery } from "@/data/content";
import { useBodyLock } from "@/hooks/useBodyLock";
import type { GalleryPhoto } from "@/lib/types";

/* Photo mosaic + full-size viewer (arrows, swipe, keyboard). Tiles wipe in as they scroll on screen and tilt toward
   the pointer; a photo grows out of its tile into the viewer and back (View Transitions, where the browser has them).
   The site-wide scroll motion leaves the mosaic alone (data-motion-skip). CSS: .bento and .lightbox in globals.css. */

const MORPH = "gallery-photo";

/** Tile shape: portraits stand two rows tall; among the rest, a large tile every ninth photo and a wide one between */
function shape(p: GalleryPhoto, i: number) {
  if (p.height > p.width) return " bento__tile--tall";
  if (i % 9 === 0) return " bento__tile--big";
  if (i % 9 === 5) return " bento__tile--wide";
  return "";
}

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canMorph = () => "startViewTransition" in document && !calm();

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [dir, setDir] = useState<"next" | "prev" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  useBodyLock(open);

  // Layout effect, so the viewer is already open inside a view transition's update
  useLayoutEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Tiles still below the screen wipe in as they arrive; those arriving together cascade
  useEffect(() => {
    const tiles = [...(grid.current?.children ?? [])] as HTMLElement[];
    if (calm() || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;
          io.unobserve(target);
          const el = target as HTMLElement;
          el.style.setProperty("--d", `${Math.min(n++, 6) * 70}ms`);
          el.classList.replace("is-pending", "is-in");
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of tiles) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue;
      el.classList.add("is-pending");
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const tileImg = (i: number) => grid.current?.children[i]?.querySelector("img") ?? null;

  const openAt = (i: number, tile: HTMLElement) => {
    trigger.current = tile;
    setDir(null);
    const img = tileImg(i);
    if (!canMorph() || !img) return setIndex(i);
    // The tile's photo and the viewer's photo share one name, never at the same time
    img.style.viewTransitionName = MORPH;
    document.startViewTransition(() => {
      img.style.viewTransitionName = "";
      flushSync(() => setIndex(i));
    });
  };

  const close = () => {
    if (index === null) return;
    const img = tileImg(index);
    const box = img?.getBoundingClientRect();
    const onScreen = box && box.bottom > 0 && box.top < window.innerHeight;
    if (canMorph() && img && onScreen) {
      const t = document.startViewTransition(() => {
        flushSync(() => setIndex(null));
        img.style.viewTransitionName = MORPH;
      });
      t.finished.finally(() => (img.style.viewTransitionName = ""));
    } else setIndex(null);
    trigger.current?.focus();
  };

  const step = (by: 1 | -1) => {
    if (index === null) return;
    setDir(by > 0 ? "next" : "prev");
    setIndex((index + by + gallery.length) % gallery.length);
  };

  // Tilt toward the pointer (mouse only)
  const tilt = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || calm()) return;
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ry", `${((e.clientX - b.left) / b.width - 0.5) * 10}deg`);
    e.currentTarget.style.setProperty("--rx", `${((e.clientY - b.top) / b.height - 0.5) * -10}deg`);
  };
  const untilt = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.removeProperty("--rx");
    e.currentTarget.style.removeProperty("--ry");
  };

  const photo = index !== null ? gallery[index] : null;

  return (
    <>
      <div className="bento" id="gallery-grid" ref={grid} data-motion-skip="">
        {gallery.map((p, i) => (
          <button
            key={p.full}
            type="button"
            className={`bento__tile${shape(p, i)}`}
            aria-label={`Open image: ${p.alt}`}
            onClick={(e) => openAt(i, e.currentTarget)}
            onPointerMove={tilt}
            onPointerLeave={untilt}
          >
            <img decoding="async" src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" />
            <span className="bento__cap" aria-hidden="true">
              <span>{p.alt}</span>
              <svg viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20M10.5 8v5M8 10.5h5"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox on-dark"
        id="lightbox"
        aria-label="Image viewer"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => index !== null && setIndex(null)}
        onClick={(e) => (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "FIGURE") && close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <figure>
          {photo && (
            // The small photo shows at once (it is already loaded), the full-size one fades in over it
            <div
              className="lb-photo"
              key={index}
              data-dir={dir ?? undefined}
              style={{ "--r": photo.width / photo.height } as CSSProperties}
            >
              <img className="lb-photo__thumb" src={photo.src} alt="" aria-hidden="true" />
              <img
                className="lb-photo__full"
                src={photo.full}
                alt={photo.alt}
                onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
              />
            </div>
          )}
          <figcaption key={`c-${index}`}>
            {photo && (
              <>
                <span className="lb-count">
                  {index! + 1} / {gallery.length}
                </span>
                {photo.alt}
              </>
            )}
          </figcaption>
        </figure>
        <button className="lb-btn lb-close" type="button" aria-label="Close image viewer" onClick={close}>
          <svg aria-hidden="true">
            <use href="#i-close" />
          </svg>
        </button>
        <button className="lb-btn lb-prev" type="button" aria-label="Previous image" onClick={() => step(-1)}>
          <svg aria-hidden="true">
            <use href="#i-left" />
          </svg>
        </button>
        <button className="lb-btn lb-next" type="button" aria-label="Next image" onClick={() => step(1)}>
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
