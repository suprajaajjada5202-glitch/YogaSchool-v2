/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";

export default function WorkplacePage() {
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
                <li aria-current="page">Workplace wellbeing</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Workplace wellbeing</p>{" "}
            <h1>
              Wellbeing for your <em>whole team</em>
            </h1>{" "}
            <p className="lead">
              Looking for help with your staff wellbeing program, or an alternative staff Christmas party? The Yoga School has the
              answer.
            </p>{" "}
            <div className="page-hero__actions">
              <Link className="btn btn--primary" href="/pages/contact-us?enquiry=Workplace%20wellbeing">
                Request a quote{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00128.jpg"
                alt="A large group practising triangle pose together"
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
              Qualified & fully insured
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-labelledby="wp-title">
        {" "}
        <div className="container split split--even">
          {" "}
          <Reveal>
            {" "}
            <p className="eyebrow">How we help</p>{" "}
            <h2 id="wp-title">
              Breath work, yoga and <em>meditation</em>
            </h2>{" "}
            <p className="lead">
              The Yoga School works with many local companies, government bodies and private groups, assisting with their
              wellbeing programs.
            </p>{" "}
            <ul className="benefits">
              {" "}
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12h4l3-8 4 16 3-8h4"
                  />
                </svg>
                Fewer sick days
              </li>{" "}
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6"
                  />
                </svg>
                Increased productivity
              </li>{" "}
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="9" cy="8" r="3" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M3 20a6 6 0 0 1 12 0M15 20a4.5 4.5 0 0 1 6-4.2" />
                  </g>
                </svg>
                Better team dynamics
              </li>{" "}
            </ul>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="prose prose-lg">
            {" "}
            <p>What is yoga anyway? Yoga is for the mind and, as they say, the body is not stiff, the mind is!</p>{" "}
            <p>
              Yoga dates back 5000 years and is non-religious, more of a belief system. The healing properties of yoga are being
              noted more and more, with some doctors prescribing yoga for depression, anxiety and stress. Health funds are also
              starting to recognise the remedial powers of yoga.
            </p>{" "}
            <p>
              Our qualified and fully insured yoga teachers can come to you, or you can bring your staff to our large studio in
              Piccones Shopping Village on Pease Street, Edge Hill. We can tailor a session or create an ongoing wellbeing program
              to suit your organisation’s individual requirements.
            </p>{" "}
            <p>
              <strong>See you on the mat!</strong>
            </p>{" "}
            <Link className="btn btn--primary" href="/pages/contact-us?enquiry=Workplace%20wellbeing">
              Request a quote{" "}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </Link>{" "}
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
      <JsonLd data={seo("workplace-wellbeing").jsonLd} />
    </>
  );
}
