"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useBodyLock } from "@/hooks/useBodyLock";
import { flatNav, LOGO, MENU_SECTIONS, MORE, NAV, OFFER_URL, type NavEntry, type NavItem } from "@/lib/site";
import { TileIcon, Use } from "./Icons";
import { NavDrop } from "./NavDrop";
import { ThemeToggle } from "./ThemeToggle";

const HOME_PATHS = ["/", "/home", "/pages/home"];

const TOP_HREFS = new Set(NAV.map((n) => n.href));

/** Floating glass header, "More" dropdown, slide-in menu, scroll progress and back-to-top. */
export function Header() {
  const pathname = usePathname() ?? "/";
  const current = HOME_PATHS.includes(pathname) ? "/pages/home" : pathname;
  const isCurrent = (href: string) => href === current;

  // The bar sits below the top band until the band scrolls away (null until measured: CSS places it then)
  const [shift, setShift] = useState<number | null>(null);
  const topbar = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const navList = useRef<HTMLUListElement>(null);
  // How many bar entries fit; the rest move into "More". null until measured (the bar shows what fits, faded at the edge).
  const [fit, setFit] = useState<number | null>(null);
  // Logo without its name, so more entries fit (used whenever the full logo would push entries into "More")
  const [compact, setCompact] = useState(false);
  useBodyLock(menuOpen);

  // Measure which entries fit the bar (the space between the logo and the buttons, less "More"):
  // on load, on resize and once the web fonts are in
  useLayoutEffect(() => {
    const ul = navList.current;
    const nav = ul?.parentElement;
    const island = nav?.parentElement;
    const brand = island?.querySelector<HTMLElement>(".brand");
    const actions = island?.querySelector<HTMLElement>(".island__actions");
    if (!ul || !nav || !island || !brand || !actions) return;
    const measure = () => {
      if (getComputedStyle(nav).display === "none") {
        setCompact(false); // phones / tablets use the menu button, with the full logo
        return;
      }
      // Lay every entry out, and the logo with and without its name, for a moment (same frame, nothing is
      // painted) to read their widths
      const wasCompact = island.classList.contains("is-compact");
      ul.classList.add("is-sizing");
      const widths = ([...ul.children] as HTMLElement[]).map((li) => li.offsetWidth);
      island.classList.remove("is-compact");
      const fullLogo = brand.offsetWidth;
      island.classList.add("is-compact");
      const smallLogo = brand.offsetWidth;
      island.classList.toggle("is-compact", wasCompact);
      ul.classList.remove("is-sizing");
      const bar = getComputedStyle(island);
      const room =
        island.clientWidth -
        parseFloat(bar.paddingLeft) -
        parseFloat(bar.paddingRight) -
        2 * (parseFloat(bar.columnGap) || 0) -
        actions.offsetWidth -
        (nav.lastElementChild as HTMLElement).offsetWidth; // "More"
      const gap = parseFloat(getComputedStyle(ul).columnGap) || 0;
      const count = (space: number) => {
        let used = 0;
        let n = 0;
        for (const w of widths) {
          if (used + (n ? gap : 0) + w > space - 1) break;
          used += (n ? gap : 0) + w;
          n++;
        }
        return n;
      };
      const full = count(room - fullLogo);
      setCompact(full < widths.length);
      setFit(full < widths.length ? count(room - smallLogo) : full);
    };
    measure();
    // The bar, and everything in it that isn't an entry: if styles arrive late (logo, buttons, "More" change size),
    // the first measurement would wrongly push every entry into "More"
    const ro = new ResizeObserver(measure);
    for (const el of [island, ...island.children, nav.lastElementChild]) if (el && el !== nav) ro.observe(el);
    document.fonts?.ready.then(measure);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", measure);
    };
  }, []);

  // Scroll: progress bar, back-to-top. The header always stays on screen.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShift(Math.max(0, (topbar.current?.offsetHeight ?? 0) - y));
      setProgress(max > 0 ? y / max : 0);
      setShowTop(y > window.innerHeight);
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
  }, [pathname]);

  // Mobile menu: focus, Esc, focus trap, close on wide screens
  useEffect(() => {
    if (!menuOpen) return;
    const t = setTimeout(() => closeBtn.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleBtn.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a, button");
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

  const shown = fit ?? NAV.length;
  const moreItems = flatNav([...NAV.slice(shown), ...MORE]);
  const moreActive = moreItems.some((m) => isCurrent(m.href));
  const navEntry = (n: NavEntry, i: number) => {
    const cls = i >= shown ? "is-overflow" : undefined;
    if (!n.children)
      return (
        <li key={n.href} className={cls}>
          <Link href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
            {n.label}
          </Link>
        </li>
      );
    // A dropdown is active on its own page and on pages that only it links to (About: Teachers, Gallery)
    const active = isCurrent(n.href) || n.children.some((c) => isCurrent(c.href) && !TOP_HREFS.has(c.href));
    return (
      <NavDrop
        key={n.href}
        id={`drop-${n.label.toLowerCase()}`}
        label={n.label}
        items={n.children}
        pathname={pathname}
        active={active}
        isCurrent={isCurrent}
        className={cls}
        href={n.href}
      />
    );
  };
  const menuLink = (n: NavItem) => {
    const body = (
      <>
        <TileIcon d={n.icon} className="menu__icon" />
        <span className="menu__text">{n.label}</span>
      </>
    );
    // Links to other sites (Momence shop, on-demand videos) open in a new tab
    return /^https?:/.test(n.href) ? (
      <a className="menu__link" href={n.href} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)}>
        {body}
        <svg className="menu__ext" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
        </svg>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ) : (
      <Link
        className="menu__link"
        href={n.href}
        aria-current={isCurrent(n.href) ? "page" : undefined}
        onClick={() => setMenuOpen(false)}
      >
        {body}
      </Link>
    );
  };
  // Light, solid bar on every page (the home page photo starts below it, as on the inner pages' light heroes)
  const headerCls = "site-header is-light is-solid";

  return (
    <>
      {/* The old site's top band: tagline, FAQs and the new student offer */}
      <div className="topbar on-dark" ref={topbar}>
        <div className="container topbar__inner">
          <p className="topbar__tagline">Stretch your body, calm your mind</p>
          <nav className="topbar__links" aria-label="Quick links">
            <Link href="/pages/faqs" aria-current={isCurrent("/pages/faqs") ? "page" : undefined}>
              FAQs
            </Link>
            <a href={OFFER_URL} target="_blank" rel="noopener">
              New Student Offer<span className="sr-only"> (opens Momence in a new tab)</span>
            </a>
          </nav>
        </div>
      </div>

      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }}></span>
      </div>

      <header className={headerCls} style={shift === null ? undefined : ({ "--topbar-shift": `${shift}px` } as CSSProperties)}>
        <div className="container">
          <div className={`island${compact ? " is-compact" : ""}`}>
            <Link className="brand" href="/pages/home" aria-label="The Yoga School, home">
              <img src={LOGO} alt="The Yoga School logo" width={180} height={180} />
              <span className="brand-text">
                The Yoga School<small>Cairns · Knoff Yoga</small>
              </span>
            </Link>
            <nav className="nav-desktop" aria-label="Main">
              <ul className={`nav-list${fit === null ? " is-measuring" : ""}`} ref={navList}>
                {NAV.map(navEntry)}
              </ul>
              <ul>
                <NavDrop id="drop-more" label="More" items={moreItems} pathname={pathname} active={moreActive} isCurrent={isCurrent} />
              </ul>
            </nav>
            <div className="island__actions">
              <ThemeToggle />
              <Link className="btn btn--teal btn--sm header-cta" href="/pages/timetable">
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
        <div className="menu__backdrop" onClick={() => setMenuOpen(false)}></div>
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
            <Link className="brand" href="/pages/home" aria-label="The Yoga School, home" onClick={() => setMenuOpen(false)}>
              <img src={LOGO} alt="" width={180} height={180} />
              <span className="brand-text">
                The Yoga School<small>Cairns · Knoff Yoga</small>
              </span>
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
            {MENU_SECTIONS.map((s) => (
              <div className="menu__section" key={s.title}>
                <h2 className="menu__label" id={`menu-${s.title.toLowerCase()}`}>
                  {s.title}
                </h2>
                <ul className="menu__list" aria-labelledby={`menu-${s.title.toLowerCase()}`}>
                  {s.items.map((n) => (
                    <li key={n.href}>{menuLink(n)}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            <Link className="btn btn--primary" href="/pages/timetable" onClick={() => setMenuOpen(false)}>
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
