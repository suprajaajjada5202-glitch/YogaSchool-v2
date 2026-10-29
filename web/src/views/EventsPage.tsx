/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { getEvents } from "@/lib/data";

export default async function EventsPage() {
  const [events] = await Promise.all([getEvents()]);
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
              Go <em>deeper</em>
            </h1>{" "}
            <p className="lead">
              Workshops, special classes and events at The Yoga School. See what&rsquo;s coming up below, and book your place
              online.
            </p>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00075edit.jpg"
                alt="Students practising headstands and other inversions"
                width="1000"
                height="714"
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
      <section className="section" style={{ paddingTop: "var(--s-4)" }} aria-label="Upcoming events">
        {" "}
        <div className="container">
          {" "}
          <UpcomingEvents events={events} />{" "}
        </div>{" "}
      </section>{" "}
      <section className="section cta-band" aria-labelledby="cta-title">
        {" "}
        <div className="cta-band__rings" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>{" "}
        <Reveal className="container">
          {" "}
          <p className="breath">Breathe in · Breathe out</p>{" "}
          <h2 id="cta-title">
            Start your <em>journey</em>
          </h2>{" "}
          <p>Yoga is for everyone. Beginners are always welcome. Just bring yourself and a towel.</p>{" "}
          <div className="row-actions">
            {" "}
            <a
              className="btn btn--primary"
              href="https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989"
              target="_blank"
              rel="noopener"
            >
              Claim the New Student Offer{" "}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </a>{" "}
            <Link className="btn btn--outline" href="/pages/timetable">
              See the timetable
            </Link>{" "}
          </div>{" "}
        </Reveal>{" "}
      </section>{" "}
      <JsonLd data={seo("events").jsonLd} />
    </>
  );
}
