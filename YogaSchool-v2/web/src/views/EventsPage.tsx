/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { getEvents, getSiteEvents } from "@/lib/data";

export default async function EventsPage() {
  const [events] = await Promise.all([getEvents()]);
  const siteEvents = getSiteEvents(events);
  return (
    <>
      {" "}
      <section className="page-hero">
        {" "}
        <svg className="blob blob--a" viewBox="0 0 500 500" aria-hidden="true">
          <path
            fill="currentColor"
            d="M421 316Q387 382 323 413T187 427Q121 381 92 309T79 166Q113 93 186 66T331 74Q402 113 428 181T421 316Z"
          />
        </svg>{" "}
        <svg className="blob blob--b" viewBox="0 0 500 500" aria-hidden="true">
          <path
            fill="currentColor"
            d="M421 316Q387 382 323 413T187 427Q121 381 92 309T79 166Q113 93 186 66T331 74Q402 113 428 181T421 316Z"
          />
        </svg>{" "}
        <div className="container page-hero__grid">
          {" "}
          <Reveal>
            {" "}
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li>
                  <Link href="/pages/home">Home</Link>
                </li>
                <li aria-current="page">Events</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Events & workshops</p>{" "}
            <h1>
              Deepen your <em>practice</em>
            </h1>{" "}
            <p className="lead">
              Workshops with our teachers, special classes and regular community events at the studio. See what&rsquo;s coming
              up, and book workshops and classes online.
            </p>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/headers/empty-studio.jpg"
                alt="The studio set up for class, with mats and blocks laid out in rows"
                width="800"
                height="300"
              />
            </div>{" "}
            <p className="arch__badge">
              <span>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
              </span>
              Book online
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="Upcoming events">
        {" "}
        <div className="container">
          {" "}
          <UpcomingEvents events={events} siteEvents={siteEvents} />{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("events").jsonLd} />
    </>
  );
}
