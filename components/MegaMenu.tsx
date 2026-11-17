"use client";
import Link from "next/link";
import { useRef } from "react";
import { isExternal, type NavGroup, type NavCard, type NavLink } from "@/lib/site";

/** A link in the menus: pages open in place, Momence in a new tab (marked for screen readers and with ↗). */
export function MenuLink({
  link,
  className,
  current,
  onClick,
  children,
}: {
  link: NavLink;
  className: string;
  current: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return isExternal(link.href) ? (
    <a className={className} href={link.href} target="_blank" rel="noopener" onClick={onClick}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link className={className} href={link.href} aria-current={current ? "page" : undefined} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Desktop bar entry with a mega menu ("Classes", "About"): a button that opens a panel of link columns and a card.
    Opens on mouse hover (after a short pause, so passing over the bar doesn't flash it) or on click/tap, Enter, Space
    or the down arrow; closes on Esc, a click outside, focus leaving it, or a link being followed. Header.tsx keeps one
    open at a time. */
export function MegaMenu({
  id,
  label,
  groups,
  card,
  open,
  active,
  isCurrent,
  setOpen,
}: {
  id: string;
  label: string;
  groups: NavGroup[];
  card: NavCard;
  open: boolean;
  active: boolean;
  isCurrent: (href: string) => boolean;
  setOpen: (open: boolean, instant?: boolean) => void;
}) {
  const wrap = useRef<HTMLLIElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panelId = `mega-${id}`;
  const close = () => setOpen(false, true);

  return (
    <li
      className="mega-item"
      ref={wrap}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          close();
          btn.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) close();
      }}
    >
      <button
        ref={btn}
        type="button"
        className={`nav-link nav-link--mega${active ? " is-active" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open, true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true, true);
            // Once the panel is visible, move into its first link
            requestAnimationFrame(() => document.getElementById(panelId)?.querySelector<HTMLElement>("a")?.focus());
          }
        }}
      >
        {label}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className={`mega${open ? " is-open" : ""}`} id={panelId}>
        <div className="mega__inner" style={{ "--cols": groups.length } as React.CSSProperties}>
          {groups.map((g, gi) => (
            <div className="mega__group" key={g.title}>
              <p className="mega__title" id={`${panelId}-${gi}`}>
                {g.title}
              </p>
              <ul aria-labelledby={`${panelId}-${gi}`}>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <MenuLink link={l} className="mega__link" current={isCurrent(l.href)} onClick={close}>
                      <span className="mega__label">
                        {l.label}
                        {isExternal(l.href) && <span aria-hidden="true"> ↗</span>}
                      </span>
                      {l.sub && <span className="mega__sub">{l.sub}</span>}
                    </MenuLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <MenuLink link={{ href: card.href, label: card.title }} className="mega__card" current={isCurrent(card.href)} onClick={close}>
            <img src={card.img} alt="" width={card.width} height={card.height} loading="lazy" decoding="async" />
            <span className="mega__card-body">
              <span className="mega__eyebrow">{card.eyebrow}</span>
              <strong>{card.title}</strong>
              <span className="mega__card-text">{card.text}</span>
              <span className="mega__cta">
                {card.cta} <span aria-hidden="true">{isExternal(card.href) ? "↗" : "→"}</span>
              </span>
            </span>
          </MenuLink>
        </div>
      </div>
    </li>
  );
}
