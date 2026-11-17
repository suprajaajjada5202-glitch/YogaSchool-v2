import Link from "next/link";
import { TileIcon, Use } from "./Icons";
import { Reveal } from "./Reveal";

/* The old site's three home buttons (Class timetable, Upcoming events, Student login) as one bar of three columns.
   Each title link stretches over its column. Links starting with http (Momence sign-in) open in a new tab. */
const ITEMS = [
  {
    href: "/pages/timetable",
    title: "Class timetable",
    text: "Scroll through the week, pick a class and book your spot online.",
    cta: "View timetable",
    icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  },
  {
    href: "/pages/events",
    title: "Upcoming events",
    text: "Workshops, special classes and events at The Yoga School.",
    cta: "See events",
    icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4",
  },
  {
    href: "https://momence.com/sign-in",
    title: "Student registration",
    text: "Register as a new student, or log in to manage your bookings and passes.",
    cta: "Register or log in",
    icon: "M9 8a3 3 0 1 0 0 .01M3 20a6 6 0 0 1 12 0M16 11h5M18.5 8.5v5",
  },
];

export function QuickLinks() {
  return (
    <section className="quick" aria-label="Quick links">
      <div className="container">
        <Reveal as="ul" className="quick__bar">
          {ITEMS.map((n) => (
            <li className="quick__item" key={n.href}>
              <TileIcon d={n.icon} className="quick__ic" />
              <h2>
                {n.href.startsWith("http") ? (
                  <a className="quick__link" href={n.href} target="_blank" rel="noopener">
                    {n.title}
                    <span className="sr-only"> (opens Momence in a new tab)</span>
                  </a>
                ) : (
                  <Link className="quick__link" href={n.href}>
                    {n.title}
                  </Link>
                )}
              </h2>
              <p>{n.text}</p>
              <span className="quick__cta" aria-hidden="true">
                {n.cta} {n.href.startsWith("http") ? "↗" : <Use id="i-arrow" />}
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
