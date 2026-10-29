"use client";
import { useEffect } from "react";

/** Locks page scroll while a menu or modal is open (adds .is-locked to <body>). */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    document.body.classList.add("is-locked");
    return () => document.body.classList.remove("is-locked");
  }, [locked]);
}
