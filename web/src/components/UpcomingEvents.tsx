import type { EventItem } from "@/lib/types";
import { Use } from "./Icons";
import { Reveal } from "./Reveal";

const TZ = "Australia/Brisbane"; // Cairns time
const fmt = (d: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-AU", { timeZone: TZ, ...o }).format(new Date(d));

/** Text with its web addresses turned into links (e.g. "Book directly through Kat … https://events.humanitix.com/…"). */
const linkify = (text: string) =>
  text.split(/(https?:\/\/[^\s<]*[^\s<.,;:!?)'"])/g).map((part, i) =>
    i % 2 ? (
      <a key={i} href={part} target="_blank" rel="noopener">
        {part}
      </a>
    ) : (
      part
    ),
  );

/** Upcoming events from Supabase, with a short note when there are none. */
export function UpcomingEvents({ events }: { events: EventItem[] }) {
  return (
    <div className="events">
      <h2 className="book-head">Upcoming events</h2>
      {!events.length && (
        <p className="events__empty">
          No events are scheduled right now. Check back soon, or call <a href="tel:+61412499700">0412 499 700</a>.
        </p>
      )}
      <div className="events__list">
        {events.map((e) => {
          const when =
            fmt(e.startsAt, { weekday: "long", hour: "numeric", minute: "2-digit" }) +
            (e.endsAt ? ` – ${fmt(e.endsAt, { hour: "numeric", minute: "2-digit" })}` : "");
          return (
            <Reveal as="article" className="event" key={e.id}>
              <p className="event__date">
                <b>{fmt(e.startsAt, { day: "numeric" })}</b>
                {fmt(e.startsAt, { month: "short" })}
              </p>
              <div className="event__body">
                <h3>{e.title}</h3>
                <p className="event__meta">{[when, e.teacher, e.priceLabel].filter(Boolean).join(" · ")}</p>
                <div className="prose">
                  {(e.description ?? "")
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{linkify(p)}</p>
                    ))}
                </div>
                {e.bookUrl && (
                  <a className="link-arrow" href={e.bookUrl} target="_blank" rel="noopener">
                    More information <Use id="i-arrow" />
                    <span className="sr-only">: {e.title}</span>
                  </a>
                )}
              </div>
              {e.bookUrl && (
                <a className="btn btn--primary btn--sm" href={e.bookUrl} target="_blank" rel="noopener">
                  Book <Use id="i-arrow" />
                </a>
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
