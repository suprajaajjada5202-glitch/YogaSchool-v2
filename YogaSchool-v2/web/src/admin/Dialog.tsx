"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Admin modal (native <dialog>). Rendered only while open.
    No close() on unmount: removing the element already ends the modal, and calling close() there
    fires a "close" event during React's development double-mount, which shut the form instantly. */
export function Dialog({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog ref={ref} className="a-dialog" onClose={onClose}>
      {children}
    </dialog>
  );
}
