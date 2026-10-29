"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/site";
import { TileIcon } from "./Icons";

const isExternal = (href: string) => /^https?:/.test(href);

/** Desktop menu dropdown ("About", "Shop", "More"): opens on hover or click, closes on Esc, outside click, focus leaving
    or page change. With href, the label is itself a link (About page, Momence shop) and the list opens on hover or
    keyboard focus. Links to other sites (Momence) open in a new tab. */
export function NavDrop({
  id,
  label,
  items,
  pathname,
  active,
  isCurrent,
  className,
  href,
}: {
  id: string;
  label: string;
  items: NavItem[];
  pathname: string;
  active: boolean;
  isCurrent: (href: string) => boolean;
  className?: string;
  href?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLLIElement>(null);
  const btn = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  const trigger = {
    ref: (el: HTMLElement | null) => {
      btn.current = el;
    },
    className: `drop-btn${active ? " is-active" : ""}`,
    "aria-expanded": open,
    "aria-controls": id,
  };
  const chevron = (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );

  return (
    <li
      className={`has-drop${className ? " " + className : ""}`}
      ref={wrap}
      onMouseEnter={() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 180);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          btn.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      {!href ? (
        <button
          {...trigger}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          {label} {chevron}
        </button>
      ) : isExternal(href) ? (
        <a {...trigger} href={href} target="_blank" rel="noopener" onFocus={() => setOpen(true)}>
          {label} {chevron}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link {...trigger} href={href} aria-current={isCurrent(href) ? "page" : undefined} onFocus={() => setOpen(true)}>
          {label} {chevron}
        </Link>
      )}
      <div className={`drop${open ? " is-open" : ""}`} id={id}>
        {items.map((n) => {
          const body = (
            <>
              <TileIcon d={n.icon} />
              <span>
                <strong>
                  {n.label}
                  {isExternal(n.href) && <span aria-hidden="true"> ↗</span>}
                </strong>
                <small>{n.sub}</small>
              </span>
            </>
          );
          return isExternal(n.href) ? (
            <a key={n.href} href={n.href} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
              {body}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link key={n.href} href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              {body}
            </Link>
          );
        })}
      </div>
    </li>
  );
}
