/* Converted from the static page; interactive parts are React components. */
import { MembershipCards, PassesList } from "@/components/Prices";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { getMemberships, getPasses } from "@/lib/data";
import { MEMBERSHIP_TERMS_PDF } from "@/lib/site";

export default async function PricesPage() {
  const [memberships, passes] = await Promise.all([getMemberships(), getPasses()]);
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
                <li aria-current="page">Pricing</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Pricing</p>{" "}
            <h1>
              Affordable, <em>unlimited</em> yoga
            </h1>{" "}
            <p className="lead">
              Cairns’ most affordable and friendly yoga studio. Memberships, class passes, casual drop-ins and private sessions.
            </p>{" "}
            <div className="page-hero__actions">
              <a
                className="btn btn--primary"
                href="https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989"
                target="_blank"
                rel="noopener"
              >
                New student offer{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00090edit.jpg"
                alt="Students with arms raised overhead"
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
              30 days for $99
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section id="memberships" className="section" aria-labelledby="mem-title">
        {" "}
        <div className="container">
          {" "}
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">Memberships</p>
            <h2 id="mem-title">
              Unlimited classes, <em>one simple price</em>
            </h2>
            <p className="lead">Fortnightly direct debit with a minimum 12-week commitment.</p>
          </Reveal>{" "}
          <MembershipCards plans={memberships} />{" "}
          <div className="promo">
            {" "}
            <Reveal className="promo__card">
              {" "}
              <img
                decoding="async"
                src="/images/offer-banner.png"
                alt="Introduction offer, 30 days for $99. Knoff Yoga, Yin Yoga, Chair Yoga, Strength and Mobility classes"
                width="708"
                height="263"
                loading="lazy"
              />{" "}
              <div>
                {" "}
                <h3>New to The Yoga School?</h3>{" "}
                <p>30 days of unlimited classes for $99 across Knoff, Yin, Chair, Strength and Mobility. Conditions apply.</p>{" "}
                <a
                  className="btn btn--primary btn--sm"
                  href="https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989"
                  target="_blank"
                  rel="noopener"
                >
                  Claim offer{" "}
                  <svg aria-hidden="true">
                    <use href="#i-arrow" />
                  </svg>
                </a>{" "}
              </div>{" "}
            </Reveal>{" "}
            <Reveal delay={1} className="promo__card promo__gift">
              {" "}
              <span className="gift-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="13" rx="2" />
                    <path d="M12 8v13M3 12h18M12 8S10.5 3 8 3.8C5.8 4.5 7 8 12 8Zm0 0s1.5-5 4-4.2C18.2 4.5 17 8 12 8Z" />
                  </g>
                </svg>
              </span>{" "}
              <div>
                {" "}
                <h3>Gift vouchers</h3>{" "}
                <p>
                  Give the gift of yoga. Buy online or at the studio in Piccones Village, diagonally opposite the Edge Hill Post
                  Office.
                </p>{" "}
                <a className="btn btn--outline btn--sm" href="https://momence.com/gcc/23652" target="_blank" rel="noopener">
                  Buy a gift voucher
                </a>{" "}
              </div>{" "}
            </Reveal>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <svg className="wave " viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 48h1440V20c-120 18-240 28-360 20S840 6 720 6 480 30 360 34 120 22 0 12z" />
      </svg>{" "}
      <section id="passes" className="section section--tint" style={{ paddingTop: "var(--s-6)" }} aria-labelledby="passes-title">
        {" "}
        <div className="container">
          {" "}
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">Passes</p>
            <h2 id="passes-title">
              Class passes, casual & <em>private sessions</em>
            </h2>
          </Reveal>{" "}
          <PassesList groups={passes}>
            <Reveal className="pass-terms">
              <h3>Good to know</h3>
              <ul>
                <li>
                  Class passes start from date of first use. They can’t be shared, but may be transferred to another student ($35
                  admin fee per transfer).
                </li>
                <li>All fees are non-refundable.</li>
                <li>
                  All students must sign the TYS Waiver form and tell us about any health issues or injuries before attending
                  class.
                </li>
                <li>TYS reserves the right to make changes to the public class timetable as necessary.</li>
                <li>
                  12- and 6-monthly memberships can only be renewed within 2 months of their expiry date, to ensure fair access for
                  all students. Thank you for your understanding.
                </li>
                <li>
                  Memberships are subject to our{" "}
                  <a href={MEMBERSHIP_TERMS_PDF} target="_blank" rel="noopener">
                    Terms &amp; Conditions<span className="sr-only"> (PDF, opens in a new tab)</span>
                  </a>
                  .
                </li>
              </ul>
            </Reveal>
          </PassesList>{" "}
          <Reveal className="section-foot">
            <Link className="btn btn--outline" href="/pages/teacher-training">
              Learn about our Teacher Training courses{" "}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </Link>
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
      <JsonLd data={seo("prices").jsonLd} />
    </>
  );
}
