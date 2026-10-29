/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Wave } from "@/components/Wave";
import { seo } from "@/lib/seo";

export default function AboutPage() {
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
                <li aria-current="page">About</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">About the school</p>{" "}
            <h1>
              Steeped in <em>authentic</em> yoga
            </h1>{" "}
            <p className="lead">
              Our passion is to share the physical, mental and spiritual benefits of yoga, the way it has been taught by Master
              Teachers Nicky Knoff and James Bryan for decades.
            </p>{" "}
            <div className="page-hero__actions">
              <Link className="btn btn--primary" href="/pages/classes">
                Explore classes{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
              <Link className="btn btn--outline" href="/pages/teachers">
                Meet the teachers
              </Link>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/hero_DSC00182.jpg"
                alt="A full class practising triangle pose in The Yoga School studio"
                width="1920"
                height="1080"
              />
            </div>{" "}
            <p className="arch__badge">
              <span>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
              </span>
              Trained by Master Teachers
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-labelledby="did-title">
        {" "}
        <div className="container">
          {" "}
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">Did you know…</p>
            <h2 id="did-title">
              Why students <em>choose us</em>
            </h2>
          </Reveal>{" "}
          <ul className="did">
            <Reveal as="li">
              <strong>We are the only yoga school in Cairns to have true Master Teachers</strong>
              <p>Our school is steeped in authenticity and knowledge of traditional yoga.</p>
            </Reveal>
            <Reveal as="li">
              <strong>All our teachers are trained exclusively by these world renowned Master Teachers</strong>
              <p>You are in safe hands</p>
            </Reveal>
            <Reveal as="li">
              <strong>We teach authentic yoga</strong>
              <p>
                You can be confident that the yoga you learn at our school has been tried and tested for decades and is not a fad.
              </p>
            </Reveal>
            <Reveal as="li">
              <strong>We run and host regular workshops and teacher training courses</strong>
              <p>So you can continue with your education.</p>
            </Reveal>
            <Reveal as="li">
              <strong>We use top of the range mats and props during practice</strong>
              <p>No need to bring anything but yourself and a towel.</p>
            </Reveal>
          </ul>{" "}
          <div className="stats-row">
            {" "}
            <Reveal className="tile stat stat--navy">
              <p className="stat__value">20</p>
              <p className="stat__label">Classes every week</p>
            </Reveal>{" "}
            <Reveal delay={1} className="tile stat stat--teal">
              <p className="stat__value">4</p>
              <p className="stat__label">Levels of study, plus Yin, Chair, Strength & Mobility</p>
            </Reveal>{" "}
            <Reveal delay={2} className="tile stat stat--pink">
              <p className="stat__value">
                80<small>+ yrs</small>
              </p>
              <p className="stat__label">Combined teaching experience of our Master Teachers</p>
            </Reveal>{" "}
            <Reveal delay={3} className="tile stat">
              <p className="stat__value">
                99.99<small>%</small>
              </p>
              <p className="stat__label">Of airborne particles removed in our purified studio</p>
            </Reveal>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <Wave />{" "}
      <section className="section section--tint" style={{ paddingTop: "var(--s-6)" }} aria-labelledby="knoff-title">
        {" "}
        <div className="container">
          {" "}
          <div className="split split--even">
            {" "}
            <Reveal>
              {" "}
              <p className="eyebrow">Knoff Yoga definition</p>{" "}
              <h2 id="knoff-title">
                The body and mind are <em>two sides of the same coin</em>
              </h2>{" "}
              <div className="prose prose-lg">
                <p>
                  Knoff Yoga is a traditional style of Hatha Yoga, which utilises the body as a vehicle/tool to increase
                  awareness. All of the techniques—meditation, breath-work, postures, relaxation and philosophy—are designed to
                  turn the mind inwards. The idea is to be in the present moment, not thinking about the past or projecting into
                  the future
                </p>{" "}
                <p>
                  Being aware of our body and breath is a fantastic way to gain insight into our particular emotional and mental
                  states. Using the techniques of Knoff Yoga, we then have the option to make changes in our physical health and
                  mind-states, if we wish.
                </p>
              </div>{" "}
            </Reveal>{" "}
            <Reveal delay={1} className="arch">
              {" "}
              <div className="arch__frame">
                <img
                  decoding="async"
                  src="/images/gallery/DSC00200.jpg"
                  alt="Students sitting cross-legged in meditation"
                  width="1000"
                  height="563"
                  loading="lazy"
                />
              </div>{" "}
            </Reveal>{" "}
          </div>{" "}
          <Reveal as="p" className="statement">
            Knoff Yoga is designed to enhance our wellbeing on every level. More strength, more flexibility, more clarity, more
            energy—and all from a centre of emotional balance.
          </Reveal>{" "}
          <div className="split split--even">
            {" "}
            <Reveal className="prose prose-lg">
              <p>
                The concepts behind Knoff Yoga are simple and easy to understand. The body and mind are two sides of the same
                coin. What we do with one affects the other. You cannot have a thought without it affecting the body and you
                cannot activate the body without it impacting on the mind. They are one.
              </p>{" "}
              <p>
                Increased awareness, combined with increased mobility and vitality, gives you the opportunity to make the most of
                your precious life.
              </p>{" "}
              <p>
                Most people come into Yoga with a physical issue they wish to resolve, e.g. bad back, high levels of stress, or
                starting to feel old, etc. The goal of Knoff Yoga is to give you the tools and encouragement to make positive
                changes in the direction you choose.
              </p>
            </Reveal>{" "}
            <Reveal delay={1}>
              <blockquote className="pull" style={{ margin: 0 }}>
                Life has provided you with a vehicle. Knoff Yoga is the owner’s manual.<cite>The Knoff Yoga philosophy</cite>
              </blockquote>
            </Reveal>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-labelledby="air-title">
        {" "}
        <div className="container split split--rev">
          {" "}
          <Reveal className="media-stack">
            {" "}
            <div className="main">
              <img
                decoding="async"
                src="/images/gallery/DSC00217.jpg"
                alt="The studio with mats and blocks laid out"
                width="1000"
                height="563"
                loading="lazy"
              />
            </div>{" "}
            <div className="float">
              <img
                decoding="async"
                src="/images/gallery/DSC00141.jpg"
                alt="A row of students holding plank pose"
                width="714"
                height="1000"
                loading="lazy"
              />
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1}>
            {" "}
            <p className="eyebrow">Our studio</p>{" "}
            <h2 id="air-title">
              Clean air for <em>better breathing</em>
            </h2>{" "}
            <p className="lead">
              Because breathing is one of the most important aspects of yoga practice, our air-conditioned studio is fitted with
              powerful air purifiers. These units remove up to 99.99% of airborne particles such as dust, allergens, mould spores
              and chemical pollutants. Practicing yoga in this clean air environment leaves you regenerated, energetic and
              healthy.
            </p>{" "}
            <ul className="ticks">
              {" "}
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                <span>Top-of-the-range mats and props provided. Just bring a towel and water.</span>
              </li>{" "}
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                <span>Street-level and fully wheelchair accessible.</span>
              </li>{" "}
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                <span>Free parking at Piccones Shopping Village, some undercover.</span>
              </li>{" "}
            </ul>{" "}
            <div className="row-actions" style={{ justifyContent: "flex-start" }}>
              <Link className="btn btn--primary" href="/pages/contact-us">
                Visit the studio{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
              <Link className="btn btn--outline" href="/pages/teacher-training">
                Learn about our Teacher Training courses
              </Link>
            </div>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("about").jsonLd} />
    </>
  );
}
