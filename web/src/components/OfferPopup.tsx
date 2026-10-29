"use client";
import { useEffect, useRef, useState } from "react";
import { useBodyLock } from "@/hooks/useBodyLock";
import { OFFER_URL } from "@/lib/site";

const BANNER = "/images/offer-banner.png";
const SEEN_KEY = "tys-offer-seen";
const DELAY_MS = 1500;

/** New-student offer popup: opens shortly after the first page of a visit loads, once per visit
    (browser session), so it doesn't return on every page. Native <dialog>: Esc, focus trap and backdrop built in. */
export function OfferPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useBodyLock(open);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* storage blocked: still show it, it just can't be remembered */
    }
    let live = true;
    // Open once the delay has passed and the banner has loaded (or failed), so it never appears half-drawn
    const img = new Image();
    const banner = new Promise<void>((resolve) => {
      img.onload = img.onerror = () => resolve();
    });
    img.src = BANNER;
    const delay = new Promise<void>((resolve) => setTimeout(resolve, DELAY_MS));
    Promise.all([banner, delay]).then(() => {
      if (!live) return;
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* see above */
      }
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => setOpen(false);
  return (
    <dialog
      ref={ref}
      className="offer"
      aria-labelledby="offer-title"
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <button type="button" className="sheet__close offer__close" aria-label="Close" onClick={close}>
        <svg aria-hidden="true">
          <use href="#i-close" />
        </svg>
      </button>
      {/* The banner repeats the text below, so it's a mouse shortcut only */}
      <a className="offer__banner" href={OFFER_URL} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" onClick={close}>
        <img src={BANNER} alt="" width={708} height={263} />
      </a>
      <div className="offer__body">
        <h2 id="offer-title">New to The Yoga School?</h2>
        <p>30 days of unlimited classes for $99 across Knoff, Yin, Chair, Strength and Mobility. Conditions apply.</p>
        <div className="offer__actions">
          <a className="btn btn--primary" href={OFFER_URL} target="_blank" rel="noopener" onClick={close}>
            Claim offer
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
          <button type="button" className="btn btn--outline" onClick={close}>
            Maybe later
          </button>
        </div>
      </div>
    </dialog>
  );
}
