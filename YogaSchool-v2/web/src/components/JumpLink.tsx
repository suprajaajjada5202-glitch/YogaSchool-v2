"use client";

import type { ReactNode } from "react";

/* Class shortcut button. Phones have no hover (and iPhones skip :active/:focus on links), so the button just touched
   is marked .is-on: it fills navy like the desktop hover and stays filled, showing which class was picked. */
export function JumpLink({ href, children }: { href: string; children: ReactNode }) {
  const mark = (a: HTMLAnchorElement) => {
    a.closest(".jump")
      ?.querySelectorAll("a.is-on")
      .forEach((x) => x.classList.remove("is-on"));
    a.classList.add("is-on");
  };
  return (
    <a href={href} onPointerDown={(e) => mark(e.currentTarget)} onClick={(e) => mark(e.currentTarget)}>
      {children}
    </a>
  );
}
