"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useBodyLock } from "@/hooks/useBodyLock";
import { LOGO, OFFER_URL } from "@/lib/site";

const PHOTO = "/images/gallery/DSC00131.jpg";
const SEEN_KEY = "tys-offer-seen";
const DELAY_MS = 1500;
// The home page waits until its hero has built in, so the popup doesn't cover the entrance
const HOME_PATHS = ["/", "/home", "/pages/home"];
const HOME_DELAY_MS = 4500;

/** New-student offer popup: opens shortly after the first page of a visit loads, once per visit
    (browser session), so it doesn't return on every page. Native <dialog>: Esc, focus trap and backdrop built in. */
export function OfferPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useBodyLock(open);
  const delayMs = HOME_PATHS.includes(usePathname() ?? "/") ? HOME_DELAY_MS : DELAY_MS;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* storage blocked: still show it, it just can't be remembered */
    }
    let live = true;
    // Open once the delay has passed and the photo and logo have loaded (or failed), so it never appears half-drawn
    const preload = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });
    const delay = new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    Promise.all([preload(PHOTO), preload(LOGO), delay]).then(() => {
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
  }, [delayMs]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // Start on the dialog itself, not the close button, so it opens without a focus ring; Tab reaches the button
      d.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => setOpen(false);
  return (
    <dialog
      ref={ref}
      className="offer"
      tabIndex={-1}
      aria-labelledby="offer-title"
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <button type="button" className="sheet__close offer__close" aria-label="Close" onClick={close}>
        <svg aria-hidden="true">
          <use href="#i-close" />
        </svg>
      </button>
      {/* Studio photo, clear at the top, with a navy gradient rising from the bottom; the price sits in a circle in the
          bottom corner */}
      <div className="offer__price">
        <img className="offer__price-bg" src={PHOTO} alt="" width={960} height={1200} aria-hidden="true" />
        <p className="offer__badge">
          <b>$99</b>
          <span>30 days</span>
        </p>
      </div>
      <div className="offer__body">
        <div className="offer__brand">
          <img src={LOGO} alt="The Yoga School logo" width={180} height={180} />
          <p className="eyebrow">Introductory offer</p>
        </div>
        <h2 id="offer-title">
          New to <em>The Yoga School?</em>
        </h2>
        <p className="offer__lead">Unlimited classes for 30 days, across:</p>
        <ul className="offer__styles" aria-label="Included classes">
          {["Knoff", "Yin", "Chair", "Strength", "Mobility"].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="offer__actions">
          <a className="btn btn--primary" href={OFFER_URL} target="_blank" rel="noopener" onClick={close}>
            Claim offer
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
          <button type="button" className="offer__later" onClick={close}>
            Maybe later
          </button>
        </div>
        <p className="offer__terms">Conditions apply.</p>
      </div>
    </dialog>
  );
}
