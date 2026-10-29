"use client";
import { useEffect } from "react";

/* Motion for the live Momence timetable on the timetable page (#book; CSS: "TIMETABLE MOTION" in globals.css).
   Momence draws the timetable after the page loads and redraws its cards on every day, filter or page change, so its
   parts are watched as they appear:
   - class cards and day headings are hidden (data-tt "below" / "above") until a sixth of one is in view, inside the
     scrolling box and on the page, then shown ("in"), entering together one after another; hidden again only once
     fully out of view, so they come in again each time they come back, and new cards after a change cascade in;
   - the selected day's position and width are measured, so a highlight can slide under it (none while all show). */
const CARDS = "article.momence-host_schedule-session_list-item, time.momence-host_schedule-session_list-date_label";
const SELECTED = '.momence-day_selection-item[aria-selected="true"]';
const STAGGER_MAX = 6;

export function ScheduleMotion() {
  useEffect(() => {
    const box = document.getElementById("book");
    if (!box) return;
    const animate =
      "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const hide = animate
      ? new IntersectionObserver((entries) => {
          for (const { target, isIntersecting, boundingClientRect, rootBounds } of entries) {
            if (!isIntersecting) (target as HTMLElement).dataset.tt = boundingClientRect.top < (rootBounds?.top ?? 0) ? "above" : "below";
          }
        })
      : null;
    const tracked = new Set<HTMLElement>();
    const track = () => {
      for (const el of tracked) {
        if (el.isConnected) continue;
        show?.unobserve(el);
        hide?.unobserve(el);
        tracked.delete(el);
      }
      if (!show || !hide) return;
      box.querySelectorAll<HTMLElement>(CARDS).forEach((el) => {
        if (tracked.has(el)) return;
        tracked.add(el);
        el.dataset.tt = "below"; // set before the next paint, so a new card never flashes up before it enters
        show.observe(el);
        hide.observe(el);
      });
    };

    let raf = 0;
    const place = () => {
      raf = 0;
      const nav = box.querySelector<HTMLElement>(".momence-day_selection-list");
      if (!nav) return;
      const day = nav.querySelector<HTMLElement>(SELECTED);
      nav.style.setProperty("--tt-on", day ? "1" : "0");
      if (!day) return;
      nav.style.setProperty("--tt-x", `${day.offsetLeft}px`);
      nav.style.setProperty("--tt-w", `${day.offsetWidth}px`);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };

    const mo = new MutationObserver(() => {
      track();
      queue();
    });
    mo.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
    track();
    queue();
    window.addEventListener("resize", queue);
    return () => {
      mo.disconnect();
      show?.disconnect();
      hide?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return null;
}
