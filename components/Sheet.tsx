"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useBodyLock } from "@/hooks/useBodyLock";

type Props = {
  open: boolean;
  onClose: () => void;
  video?: boolean;
  label?: string;
  labelledBy?: string;
  children: ReactNode;
};

/** In-page modal panel (bottom sheet on phones). Native <dialog>: Esc, focus trap and backdrop built in. */
export function Sheet({ open, onClose, video, label, labelledBy, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  useBodyLock(open);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open && scroller.current) scroller.current.scrollTop = 0;
  }, [open, children]);

  return (
    <dialog
      ref={ref}
      className={`sheet${video ? " sheet--video" : ""}`}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet__bar">
        <button type="button" className="sheet__close" aria-label="Close" onClick={onClose}>
          <svg aria-hidden="true">
            <use href="#i-close" />
          </svg>
        </button>
      </div>
      <div className="sheet__scroll" ref={scroller}>
        <div className="sheet__content">{open ? children : null}</div>
      </div>
    </dialog>
  );
}
