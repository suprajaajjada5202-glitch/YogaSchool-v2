"use client";
import { useEffect } from "react";

/* Motion for the live Momence timetable on the timetable page (#book; CSS: "TIMETABLE MOTION" in globals.css).
   Momence draws the timetable after the page loads and redraws its cards on every day, filter or page change, so its
   parts are watched as they appear:
   - class cards and day headings are hidden (data-tt "below" / "above") until a sixth of one is in view, inside the
     scrolling box and on the page, then shown ("in"), entering together one after another, and new cards after a
     change cascade in. Shown cards stay while the box is on screen, so scrolling inside it stays smooth; once the
     whole box is off screen they are hidden again, to come in again each time it comes back;
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
    // The whole box off screen: every card is hidden again, set to enter from where it will come back into view (from
    // above or below the box's view, or, with the box, from the edge the box left by)
    const away = animate
      ? new IntersectionObserver((entries) => {
          const { isIntersecting, boundingClientRect, rootBounds } = entries[entries.length - 1];
          if (isIntersecting) return;
          const side = boundingClientRect.top < (rootBounds?.top ?? 0) ? "above" : "below";
          const view = box.getBoundingClientRect();
          for (const el of tracked) {
            const r = el.getBoundingClientRect();
            el.dataset.tt = r.bottom <= view.top ? "above" : r.top >= view.bottom ? "below" : side;
          }
        })
      : null;
    away?.observe(box);

    const track = () => {
      for (const el of tracked) {
        if (el.isConnected) continue;
        show?.unobserve(el);
        tracked.delete(el);
      }
      if (!show) return;
      const fresh = Array.from(box.querySelectorAll<HTMLElement>(CARDS)).filter((el) => !tracked.has(el));
      if (!fresh.length) return;
      // Set before the next paint, so a new card never flashes up before it enters (from above while the box is)
      const side = box.getBoundingClientRect().bottom <= 0 ? "above" : "below";
      for (const el of fresh) {
        tracked.add(el);
        el.dataset.tt = side;
        show.observe(el);
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
      if (appear) nav.dataset.ttSnap = "";
      nav.style.setProperty("--tt-x", `${day.offsetLeft}px`);
      nav.style.setProperty("--tt-w", `${day.offsetWidth}px`);
      if (appear) {
        void getComputedStyle(nav, "::after").opacity; // takes the new place now, before the slide is switched back on
        delete nav.dataset.ttSnap;
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };

    const mo = new MutationObserver(() => {
      track();
      mark();
      queue();
    });
    mo.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
    track();
    mark();
    queue();
    window.addEventListener("resize", queue);
    return () => {
      mo.disconnect();
      show?.disconnect();
      away?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return null;
}
