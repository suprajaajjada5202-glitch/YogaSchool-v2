/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import { Vouchers } from "@/components/Vouchers";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { getVouchers } from "@/lib/data";

export default async function GiftVouchersPage() {
  const [vouchers] = await Promise.all([getVouchers()]);
  return (
    <>
      {" "}
      <section className="page-hero page-hero--gift">
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
                <li aria-current="page">Gift vouchers</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Gift vouchers</p>{" "}
            <h1>
              Give the gift of <em>yoga</em>
            </h1>{" "}
            <p className="lead">
              Gift vouchers are available online, or at the studio in Piccones Village on Pease Street, Edge Hill (diagonally
              opposite the Edge Hill Post Office).
            </p>{" "}
            <div className="page-hero__actions">
              <a className="btn btn--primary" href="https://momence.com/gcc/23652" target="_blank" rel="noopener">
                Buy a gift voucher online{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
              <a className="btn btn--outline" href="tel:+61412499700">
                Call 0412 499 700
              </a>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00185.jpg"
                alt="A full class in warrior pose"
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
              Buy online or in studio
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="Gift voucher options">
        {" "}
        <div className="container">
          {" "}
          <Vouchers vouchers={vouchers}>
            <div className="info-cards gift-cards">
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
                      pathLength={1}
                      d="M4 8h16v12H4zM12 8v12M4 12h16"
                    />
                  </svg>
                </span>
                <h3>Class vouchers</h3>
                <p>Single classes and class packs for friends and family.</p>
                <a className="link-arrow" href="https://momence.com/gcc/23652" target="_blank" rel="noopener">
                  Buy online{" "}
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
                      pathLength={1}
                      d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3z"
                    />
                  </svg>
                </span>
                <h3>New student offer</h3>
                <p>30 days of unlimited classes for $99, for new students only.</p>
                <a
                  className="link-arrow"
                  href="https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989"
                  target="_blank"
                  rel="noopener"
                >
                  See offer{" "}
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
                      pathLength={1}
                      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                    />
                  </svg>
                </span>
                <h3>Questions?</h3>
                <p>Ask us about gift vouchers, classes or beginner programs.</p>
                <a className="link-arrow" href="tel:+61412499700">
                  0412 499 700{" "}
                  <svg aria-hidden="true">
                    <use href="#i-arrow" />
                  </svg>
                </a>
              </Reveal>{" "}
            </div>
          </Vouchers>{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("gift-vouchers").jsonLd} />
    </>
  );
}
