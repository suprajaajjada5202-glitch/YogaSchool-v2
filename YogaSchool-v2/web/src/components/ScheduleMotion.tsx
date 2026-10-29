"use client";
import { useEffect } from "react";

/* Motion for the live Momence timetable on the timetable page (#book; CSS: "TIMETABLE MOTION" in globals.css).
   Momence draws the timetable after the page loads and redraws its cards on every day, filter or page change, so its
   parts are watched as they appear:
   - class cards and day headings are hidden (data-tt "below" / "above") until a sixth of one is in view, inside the
     scrolling box and on the page, then shown ("in"), entering together one after another, and new cards after a
     change cascade in. They are hidden again once fully out of view, so they come in again each time the page
     brings them back, but never by the box's own scrolling, so scrolling inside it stays smooth;
   - the next class is marked (data-tt-next) for its accent: the first card while the list shows this week, every day,
     from its first page. It keeps the mark on any day or filter that lists it;
   - the selected day's position and width are measured, so a highlight can slide under it (none while all show). */
const CARDS = "article.momence-host_schedule-session_list-item, time.momence-host_schedule-session_list-date_label";
const SESSIONS = "article.momence-host_schedule-session_list-item[data-session_id]";
const SELECTED = '.momence-day_selection-item[aria-selected="true"]';
const STAGGER_MAX = 6;

export function ScheduleMotion() {
  useEffect(() => {
    const box = document.getElementById("book");
    if (!box) return;
    const animate =
      "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tracked = new Set<HTMLElement>();

    // The page's own observer (root: the screen) also sees the scrolling box's edges, as they clip what is in view
    const show = animate
      ? new IntersectionObserver(
          (entries) => {
            let n = 0;
            for (const { target, isIntersecting, intersectionRatio } of entries) {
              const el = target as HTMLElement;
              if (!isIntersecting || intersectionRatio < 0.15 || el.dataset.tt === "in") continue;
              el.style.setProperty("--tt-i", String(Math.min(n++, STAGGER_MAX)));
              el.dataset.tt = "in";
            }
          },
          { threshold: [0, 0.15], rootMargin: "0px 0px -6% 0px" },
        )
      : null;
    // Hidden again once fully out of view, ready to come back from the edge it left by (of the screen or the box, which
    // ever is nearer), but never while the box itself scrolls, so scrolling inside it never fades cards out and in
    let boxScrolled = 0;
    const onBoxScroll = () => (boxScrolled = performance.now());
    box.addEventListener("scroll", onBoxScroll, { passive: true });
    const hide = animate
      ? new IntersectionObserver((entries) => {
          if (performance.now() - boxScrolled < 250) return;
          let edge: number | undefined;
          for (const { target, isIntersecting, boundingClientRect: r, rootBounds } of entries) {
            if (isIntersecting) continue;
            edge ??= Math.max(box.getBoundingClientRect().top + box.clientTop, rootBounds?.top ?? 0);
            (target as HTMLElement).dataset.tt = r.top < edge ? "above" : "below";
          }
        })
      : null;

    const track = () => {
      for (const el of tracked) {
        if (el.isConnected) continue;
        show?.unobserve(el);
        hide?.unobserve(el);
        tracked.delete(el);
      }
      if (!show || !hide) return;
      const fresh = Array.from(box.querySelectorAll<HTMLElement>(CARDS)).filter((el) => !tracked.has(el));
      if (!fresh.length) return;
      // Set before the next paint, so a new card never flashes up before it enters (from above while the box is)
      const side = box.getBoundingClientRect().bottom <= 0 ? "above" : "below";
      for (const el of fresh) {
        tracked.add(el);
        el.dataset.tt = side;
        show.observe(el);
        hide.observe(el);
      }
    };

    // The next class, remembered by its session; today's tab is in the bar only while this week shows
    let next: string | undefined;
    const mark = () => {
      const cards = box.querySelectorAll<HTMLElement>(SESSIONS);
      const page = box.querySelector(".momence-pagination [aria-current]:not([aria-current='false'])");
      const fromNow =
        !box.querySelector(SELECTED) &&
        box.querySelector('.momence-day_selection-item[data-is-today="true"]') &&
        (!page || page.textContent?.trim() === "1");
      if (cards[0] && fromNow) next = cards[0].dataset.session_id;
      cards.forEach((el) => el.toggleAttribute("data-tt-next", el.dataset.session_id === next));
    };

    let raf = 0;
    const place = () => {
      raf = 0;
      const nav = box.querySelector<HTMLElement>(".momence-day_selection-list");
      if (!nav) return;
      const day = nav.querySelector<HTMLElement>(SELECTED);
      // Appearing (no day was selected before), it fades in under the day instead of sliding over from its last place
      const appear = !!day && nav.style.getPropertyValue("--tt-on") !== "1";
      nav.style.setProperty("--tt-on", day ? "1" : "0");
      if (!day) return;
      nav.style.setProperty("--tt-x", `${day.offsetLeft}px`);
      nav.style.setProperty("--tt-w", `${day.offsetWidth}px`);
      // The slide is switched back on once a frame has drawn it in its new place
      if (appear) {
        nav.dataset.ttSnap = "";
        requestAnimationFrame(() => requestAnimationFrame(() => delete nav.dataset.ttSnap));
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };

    const mo = new MutationObserver((records) => {
      track();
      mark();
      // Another day chosen: the highlight moves before the next paint; other changes are measured once a frame
      if (records.some((r) => r.type === "attributes")) {
        cancelAnimationFrame(raf);
        place();
      } else queue();
    });
    mo.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
    track();
    mark();
    queue();
    window.addEventListener("resize", queue);
    return () => {
      mo.disconnect();
      show?.disconnect();
      hide?.disconnect();
      box.removeEventListener("scroll", onBoxScroll);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return null;
}
