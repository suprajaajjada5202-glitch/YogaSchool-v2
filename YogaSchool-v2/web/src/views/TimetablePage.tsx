/* Converted from the static page; interactive parts are React components. */
import { MomenceWidget } from "@/components/MomenceWidget";
import { Reveal } from "@/components/Reveal";
import { ScheduleMotion } from "@/components/ScheduleMotion";
import { Timetable } from "@/components/Timetable";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { getTimetable } from "@/lib/data";

export default async function TimetablePage() {
  const [timetable] = await Promise.all([getTimetable()]);
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
                <li aria-current="page">Schedule</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Class schedule</p>{" "}
            <h1>
              Find a class that <em>fits your week</em>
            </h1>{" "}
            <p className="lead">Our live timetable. Scroll through the week, pick a class and book your spot online.</p>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00090edit.jpg"
                alt="Students standing with arms raised in prayer overhead"
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
              Live timetable
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="Live timetable">
        {" "}
        <div className="container">
          {" "}
          <Timetable rows={timetable} />{" "}
          <Reveal className="schedule" id="book" tabIndex={0} role="region" aria-label="Live class timetable, scrollable">
            {" "}
            <MomenceWidget />
            <ScheduleMotion />{" "}
            <noscript>
              <p>The live timetable needs JavaScript. Please call 0412 499 700.</p>
            </noscript>{" "}
          </Reveal>{" "}
          <Reveal as="p" className="schedule__help">
            Timetable not loading? Call <a href="tel:+61412499700">0412 499 700</a> and we’ll book you in.
          </Reveal>{" "}
          <div className="info-cards tt-cards">
            {" "}
            <Reveal className="info-card">
              <span className="feature__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3z"
                  />
                </svg>
              </span>
              <h3>New here?</h3>
              <p>30 days of unlimited classes for $99. Conditions apply.</p>
              <a
                className="link-arrow"
                href="https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989"
                target="_blank"
                rel="noopener"
              >
                Claim offer{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
            </Reveal>{" "}
            <Reveal delay={1} className="info-card">
              <span className="feature__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8a3 3 0 1 0 0 .01M3 20a6 6 0 0 1 12 0"
                  />
                </svg>
              </span>
              <h3>Student login</h3>
              <p>Manage your bookings, passes and membership.</p>
              <a className="link-arrow" href="https://momence.com/sign-in" target="_blank" rel="noopener">
                Log in{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
            </Reveal>{" "}
            <Reveal delay={2} className="info-card">
              <span className="feature__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 9.5h.01"
                  />
                </svg>
              </span>
              <h3>Arrive early</h3>
              <p>Please arrive ten minutes before class. Mats and props are provided.</p>
              <Link className="link-arrow" href="/pages/faqs">
                Read the FAQs{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
            </Reveal>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("timetable").jsonLd} />
    </>
  );
}
