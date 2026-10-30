"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useBodyLock } from "@/hooks/useBodyLock";
import { BOOK_URL, isExternal, LOGO, NAV, OFFER_URL, type NavEntry } from "@/lib/site";
import { Use } from "./Icons";
import { MegaMenu, MenuLink } from "./MegaMenu";

const HOME_PATHS = ["/", "/home", "/pages/home"];

const chevron = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
  </svg>
);

/** Header bar with the Classes and About mega menus, slide-in phone menu, scroll progress and back-to-top. */
export function Header() {
  const pathname = usePathname() ?? "/";
  const current = HOME_PATHS.includes(pathname) ? "/pages/home" : pathname;
  const isCurrent = (href: string) => href === current;
  // A mega menu is "active" (marked in the bar) on any page it links to
  const megaActive = (n: NavEntry) =>
    "groups" in n && (n.groups.some((g) => g.links.some((l) => isCurrent(l.href))) || isCurrent(n.card.href));

  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  // Once the page has moved: the bar can firm up (styled on the home page only)
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Desktop: the open mega menu (one at a time). Phone menu: the open section.
  const [mega, setMega] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useBodyLock(menuOpen);

  /* Open or close a mega menu. Clicks and keys act at once; mouse hover waits a moment (opening: so the pointer
     crossing the bar doesn't flash a panel; closing: so a slip off the edge doesn't shut it). Moving from one open
     menu to the other switches straight away. */
  const setMegaOpen = (id: string) => (open: boolean, instant = false) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    if (open) {
      if (instant || mega) setMega(id);
      else megaTimer.current = setTimeout(() => setMega(id), 90);
    } else if (instant) setMega((m) => (m === id ? null : m));
    else megaTimer.current = setTimeout(() => setMega((m) => (m === id ? null : m)), 220);
  };

  // Scroll: progress bar, back-to-top. The header always stays on screen.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
      setShowTop(y > window.innerHeight);
      setScrolled(y > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the page changes
  useEffect(() => {
    setMenuOpen(false);
    setMega(null);
  }, [pathname]);

  // Desktop mega menu: a click or tap outside the bar closes it
  useEffect(() => {
    if (!mega) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMega(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [mega]);

  // Phone menu: opens with the section holding the current page expanded
  useEffect(() => {
    if (!menuOpen) return;
    const holder = NAV.find(megaActive);
    setSection(holder && "id" in holder ? holder.id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  // Phone menu: focus, Esc, focus trap, close on wide screens
  useEffect(() => {
    if (!menuOpen) return;
    const t = setTimeout(() => closeBtn.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleBtn.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        // Links inside a closed section are inert, so they're skipped
        const f = [...panel.current.querySelectorAll<HTMLElement>("a, button")].filter((el) => !el.closest("[inert]"));
        const first = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  // Light, solid bar on every page (the home page photo starts below it, as on the inner pages' light heroes)
  const headerCls = `site-header is-light is-solid${scrolled ? " is-scrolled" : ""}`;

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }}></span>
      </div>

      <header className={headerCls}>
        <div className="container">
          <div className="island">
            <Link className="brand" href="/pages/home" aria-label="The Yoga School, home">
              <img src={LOGO} alt="The Yoga School logo" width={180} height={180} />
              <span className="brand-text">The Yoga School</span>
            </Link>
            <nav className="nav-desktop" aria-label="Main" ref={navRef}>
              <ul className="nav-list">
                {NAV.map((n) =>
                  "groups" in n ? (
                    <MegaMenu
                      key={n.id}
                      id={n.id}
                      label={n.label}
                      groups={n.groups}
                      card={n.card}
                      open={mega === n.id}
                      active={megaActive(n)}
                      isCurrent={isCurrent}
                      setOpen={setMegaOpen(n.id)}
                    />
                  ) : (
                    <li key={n.href}>
                      <MenuLink link={n} className="nav-link" current={isCurrent(n.href)}>
                        {n.label}
                      </MenuLink>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <div className="island__actions">
              <Link className="btn btn--primary btn--sm header-cta" href={BOOK_URL}>
                Book a Class
              </Link>
              <button
                ref={toggleBtn}
                className="nav-toggle"
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen(true)}
              >
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`menu${menuOpen ? " is-open" : ""}`}
        id="mobile-menu"
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
      >
        <div className="menu__backdrop" onClick={closeMenu}></div>
        <figure className="menu__photo on-dark">
          <img
            src="/images/gallery/DSC00180.jpg"
            alt="Students balancing in tree pose at The Yoga School"
            width={1000}
            height={714}
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <p>Stretch your body, calm your mind.</p>
            <p>
              New students:{" "}
              <a href={OFFER_URL} target="_blank" rel="noopener">
                30 days of unlimited classes for $99 →
              </a>
            </p>
          </figcaption>
        </figure>
        <div className="menu__panel" ref={panel}>
          <div className="menu__top">
            <Link className="brand" href="/pages/home" aria-label="The Yoga School, home" onClick={closeMenu}>
              <img src={LOGO} alt="" width={180} height={180} />
              <span className="brand-text">The Yoga School</span>
            </Link>
            <button
              ref={closeBtn}
              className="menu__close"
              type="button"
              aria-label="Close menu"
              onClick={() => {
                setMenuOpen(false);
                toggleBtn.current?.focus();
              }}
            >
              <Use id="i-close" />
            </button>
          </div>
          <nav className="menu__nav" aria-label="Mobile">
            <ul className="menu__list">
              <li style={{ "--i": 0 } as CSSProperties}>
                <MenuLink link={{ href: "/pages/home", label: "Home" }} className="menu__link" current={isCurrent("/pages/home")} onClick={closeMenu}>
                  Home
                </MenuLink>
              </li>
              {NAV.map((n, i) => {
                const style = { "--i": i + 1 } as CSSProperties;
                if (!("groups" in n))
                  return (
                    <li key={n.href} style={style}>
                      <MenuLink link={n} className="menu__link" current={isCurrent(n.href)} onClick={closeMenu}>
                        {n.label}
                      </MenuLink>
                    </li>
                  );
                const open = section === n.id;
                return (
                  <li key={n.id} style={style} className={`menu__acc${open ? " is-open" : ""}`}>
                    <button
                      type="button"
                      className={`menu__link menu__acc-btn${megaActive(n) ? " is-active" : ""}`}
                      aria-expanded={open}
                      aria-controls={`menu-${n.id}`}
                      onClick={() => setSection(open ? null : n.id)}
                    >
                      {n.label}
                      {chevron}
                    </button>
                    <div className="menu__sub" id={`menu-${n.id}`} inert={!open}>
                      <div className="menu__sub-inner">
                        {n.groups.map((g, gi) => (
                          <div className="menu__group" key={g.title}>
                            <p className="menu__group-title" id={`menu-${n.id}-${gi}`}>
                              {g.title}
                            </p>
                            <ul aria-labelledby={`menu-${n.id}-${gi}`}>
                              {g.links.map((l) => (
                                <li key={l.href}>
                                  <MenuLink link={l} className="menu__sublink" current={isCurrent(l.href)} onClick={closeMenu}>
                                    {l.label}
                                    {isExternal(l.href) && (
                                      <svg className="menu__ext" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.6"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M7 17 17 7M9 7h8v8"
                                        />
                                      </svg>
                                    )}
                                  </MenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <MenuLink
                          link={{ href: n.card.href, label: n.card.title }}
                          className="menu__card"
                          current={isCurrent(n.card.href)}
                          onClick={closeMenu}
                        >
                          <span className="menu__card-eyebrow">{n.card.eyebrow}</span>
                          <strong>{n.card.title}</strong>
                          <span className="menu__card-cta">
                            {n.card.cta} <span aria-hidden="true">{isExternal(n.card.href) ? "↗" : "→"}</span>
                          </span>
                        </MenuLink>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="menu__foot">
            <div className="menu__reach">
              <a href="tel:+61412499700">Call us</a>
              <a href="https://wa.me/61412499700" target="_blank" rel="noopener">
                <Use id="i-whatsapp" /> WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <p>Suite 14, 159-161 Pease Street, Piccones Village, Edge Hill, Cairns QLD 4870</p>
            <div className="socials">
              <a href="https://www.facebook.com/theyogaschoolaustralia/" target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z"
                  />
                </svg>
              </a>
              <a href="https://www.instagram.com/theyogaschoolcairns/" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                  </g>
                </svg>
              </a>
              <a href="https://www.youtube.com/@theyogaschoolcairns5508" target="_blank" rel="noopener" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3-5.2 3Z"
                  />
                </svg>
              </a>
            </div>
          </div>
          {/* Pinned to the bottom of the panel, in thumb reach */}
          <div className="menu__cta">
            <Link className="btn btn--primary" href={BOOK_URL} onClick={closeMenu}>
              Book a Class
            </Link>
          </div>
        </div>
      </div>

      <div className="fab">
        <a
          className={`fab__top${showTop ? " is-visible" : ""}`}
          href="#"
          aria-label="Back to top"
          style={{ "--progress": progress } as CSSProperties}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            });
          }}
        >
          <Use id="i-up" />
        </a>
        {/* PLACEHOLDER: confirm WhatsApp number */}
        <a
          className="fab__wa"
          href="https://wa.me/61412499700"
          target="_blank"
          rel="noopener"
          aria-label="Chat with The Yoga School on WhatsApp"
        >
          <Use id="i-whatsapp" />
        </a>
      </div>
    </>
  );
}
