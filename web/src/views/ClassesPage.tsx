/* Converted from the static page; interactive parts are React components. */
import { ClassJump, ClassRows } from "@/components/ClassRows";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { getClasses } from "@/lib/data";

export default async function ClassesPage() {
  const [classes] = await Promise.all([getClasses()]);
  // "Level N" class section, whatever web address name it was given in /admin
  const levelHref = (n: number) => `#class-${classes.find((c) => new RegExp(`^level ${n}\\b`, "i").test(c.name))?.slug ?? `l${n}`}`;
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
                <li aria-current="page">Classes</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Classes & programs</p>{" "}
            <h1>
              Find your <em>practice</em>
            </h1>{" "}
            <p className="lead">
              We offer 4 levels of study and 20 classes a week for a comprehensive yoga education. Students of all levels of
              experience can benefit from the classes we teach.
            </p>{" "}
            <div className="page-hero__actions">
              <Link className="btn btn--primary" href="/pages/timetable">
                See the timetable{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
              <a
                className="btn btn--outline"
                href="https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989"
                target="_blank"
                rel="noopener"
              >
                New student offer
              </a>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00131.jpg"
                alt="A mixed class in warrior and triangle poses"
                width="1000"
                height="563"
              />
            </div>{" "}
            <p className="arch__badge">
              <span>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
              </span>
              Beginners always welcome
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-labelledby="path-title" style={{ paddingBottom: "0" }}>
        {" "}
        <div className="container">
          {" "}
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">Your path</p>
            <h2 id="path-title">
              Four levels, <em>one journey</em>
            </h2>
            <p className="lead">Move up whenever you feel ready, or stay at a level for as long as you like.</p>
          </Reveal>{" "}
          <Reveal className="path">
            {" "}
            <a href={levelHref(1)}>
              <b>1</b>
              <span>Introduction</span>
              <small>Absolute beginners and a slower practice</small>
            </a>{" "}
            <a href={levelHref(2)}>
              <b>2</b>
              <span>Building</span>
              <small>Vinyasa, heat, strength and focus</small>
            </a>{" "}
            <a href={levelHref(3)}>
              <b>3</b>
              <span>Deepening</span>
              <small>More demanding postures and skill</small>
            </a>{" "}
            <a href={levelHref(4)}>
              <b>4</b>
              <span>Advanced</span>
              <small>Inversions and stronger Asana groups</small>
            </a>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="All classes">
        {" "}
        <div className="container">
          {" "}
          <ClassJump classes={classes} />{" "}
          <ClassRows classes={classes} />{" "}
        </div>{" "}
      </section>{" "}
      <svg className="wave " viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 48h1440V20c-120 18-240 28-360 20S840 6 720 6 480 30 360 34 120 22 0 12z" />
      </svg>{" "}
      <section className="section section--tint" style={{ paddingTop: "var(--s-6)" }} aria-labelledby="prog-title">
        {" "}
        <div className="container split split--even">
          {" "}
          <Reveal>
            {" "}
            <p className="eyebrow">Progression</p>{" "}
            <h2 id="prog-title">
              Challenge days and <em>gentle days</em>
            </h2>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="prose prose-lg">
            <p>
              As your experience progresses, you can still continue to attend the lower level classes. This has many benefits,
              especially maintaining the poses you have already learnt. You also shouldn’t necessarily work at your edge or
              highest intensity during every practice. Have both challenging and then also less intense practice days. Your body
              and mind will appreciate it. This helps keep you motivated and inspired and also gives you access to a greater
              variety of classes and times to fit your schedule.
            </p>
          </Reveal>{" "}
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
      <JsonLd data={seo("classes").jsonLd} />
    </>
  );
}
