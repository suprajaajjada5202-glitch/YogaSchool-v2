/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import { TeacherDirectory } from "@/components/TeacherDirectory";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";

export default function TeachersPage() {
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
                <li aria-current="page">Teachers</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Our teachers</p>{" "}
            <h1>
              Guided by <em>Master Teachers</em>
            </h1>{" "}
            <p className="lead">
              All our teachers are trained exclusively by world-renowned Master Teachers Nicky Knoff and James Bryan. You are in
              safe hands.
            </p>{" "}
            <div className="page-hero__actions">
              <Link className="btn btn--primary" href="/pages/timetable">
                Book a class{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
              <Link className="btn btn--outline" href="/pages/teacher-training">
                Teacher training
              </Link>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/headers/shoulder-stand.jpg"
                alt="A full class in shoulder stand in The Yoga School studio"
                width="960"
                height="360"
              />
            </div>{" "}
            <p className="arch__badge">
              <span>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
              </span>
              Knoff Yoga trained
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-labelledby="team-title">
        {" "}
        <div className="container">
          {" "}
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">The team</p>
            <h2 id="team-title">
              Meet our <em>teachers</em>
            </h2>
            <p className="lead">Tap a teacher to read their story.</p>
          </Reveal>{" "}
          <TeacherDirectory />{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("teachers").jsonLd} />
    </>
  );
}
