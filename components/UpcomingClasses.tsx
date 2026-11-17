import Link from "next/link";
import type { UpcomingClass } from "@/lib/momence";
import { Use } from "./Icons";
import { Reveal } from "./Reveal";
import { SliderBar, SliderNav, SliderTrack } from "./Slider";

const TZ = "Australia/Brisbane"; // Cairns time
const fmt = (d: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-AU", { timeZone: TZ, ...o }).format(new Date(d));
const time = (d: string) => fmt(d, { hour: "numeric", minute: "2-digit" }).replace(" ", "").toLowerCase();
const dayKey = (d: string) => fmt(d, { year: "numeric", month: "2-digit", day: "2-digit" });

function dayLabel(d: string) {
  const today = dayKey(new Date().toISOString());
  const tomorrow = dayKey(new Date(Date.now() + 864e5).toISOString());
  const k = dayKey(d);
  return k === today ? "Today" : k === tomorrow ? "Tomorrow" : fmt(d, { weekday: "long" });
}

/** The next classes from the live Momence timetable, each with a direct booking link. Hidden if none load. */
export function UpcomingClasses({ classes }: { classes: UpcomingClass[] }) {
  if (!classes.length) return null;
  return (
    <section className="section section--white clip-x upcoming" aria-labelledby="upcoming-title">
      <div className="container">
        <Reveal className="section-head section-head--row">
          <div>
            <p className="eyebrow">Upcoming classes</p>
            <h2 id="upcoming-title">
              Find your next <em>class</em>
            </h2>
            <p className="lead">Live from our timetable. Pick a class and book your spot in a few taps.</p>
          </div>
          <SliderNav target="upcoming-track" prevLabel="Previous classes" nextLabel="Next classes">
            <Link className="btn btn--outline btn--sm" href="/pages/timetable">
              Full timetable
            </Link>
          </SliderNav>
        </Reveal>
        <Reveal className="slider slider--4">
          <SliderTrack id="upcoming-track" label="Upcoming classes, scroll horizontally">
            {classes.map((c) => {
              const end = new Date(new Date(c.startsAt).getTime() + c.durationMinutes * 60000).toISOString();
              return (
                <li className="slide" key={c.id}>
                  <article className="upc">
                    <div className="upc__when">
                      <p className="upc__date">
                        <b>{fmt(c.startsAt, { day: "numeric" })}</b>
                        {fmt(c.startsAt, { month: "short" })}
                      </p>
                      <p className="upc__day">
                        {dayLabel(c.startsAt)}
                        <span>
                          {time(c.startsAt)} – {time(end)}
                        </span>
                      </p>
                    </div>
                    <h3>{c.name}</h3>
                    {c.teacher && (
                      <p className="upc__teacher">
                        {c.teacherPicture ? (
                          <img src={c.teacherPicture} alt="" width={32} height={32} loading="lazy" decoding="async" />
                        ) : (
                          <span className="upc__avatar" aria-hidden="true">
                            {c.teacher.charAt(0)}
                          </span>
                        )}
                        {c.teacher}
                      </p>
                    )}
                    <div className="card__meta">
                      <span className="chip">
                        <Use id="i-clock" />
                        {c.durationMinutes} min
                      </span>
                      {c.price != null && <span className="chip">${c.price}</span>}
                      {c.spotsLeft != null && c.spotsLeft <= 5 && (
                        <span className="chip upc__few">{c.spotsLeft === 0 ? "Full" : `${c.spotsLeft} spots left`}</span>
                      )}
                    </div>
                    <a className="btn btn--teal btn--sm" href={c.bookUrl} target="_blank" rel="noopener">
                      Book <Use id="i-arrow" />
                      <span className="sr-only">
                        {" "}
                        {c.name}, {dayLabel(c.startsAt)} {time(c.startsAt)}
                      </span>
                    </a>
                  </article>
                </li>
              );
            })}
          </SliderTrack>
          <div className="slider-foot">
            <SliderBar target="upcoming-track" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
