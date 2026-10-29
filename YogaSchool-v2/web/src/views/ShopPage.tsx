/* Converted from the static page; interactive parts are React components. */
import { Products } from "@/components/Products";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { MOMENCE_SHOP_URL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { getProducts } from "@/lib/data";

export default async function ShopPage() {
  const [products] = await Promise.all([getProducts()]);
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
        <div className="container page-hero__grid">
          {" "}
          <Reveal>
            {" "}
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li>
                  <Link href="/pages/home">Home</Link>
                </li>
                <li aria-current="page">Shop</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Shop</p>{" "}
            <h1>
              Props for your <em>practice</em>
            </h1>{" "}
            <p className="lead">
              Meditation seats, yoga props and equipment. Buy online or pick up at the studio in Piccones Village, Edge Hill.
            </p>{" "}
            <div className="page-hero__actions">
              <a className="btn btn--primary" href={MOMENCE_SHOP_URL} target="_blank" rel="noopener">
                Online shop{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
              <Link className="btn btn--outline" href="/gift-vouchers">
                Gift vouchers
              </Link>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                src="/images/gallery/DSC00217.jpg"
                alt="The studio with mats, blocks and props laid out"
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
              Members get 10% off retail
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="Products">
        {" "}
        <div className="container">
          {" "}
          <Products products={products} />{" "}
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
      <JsonLd data={seo("shop").jsonLd} />
    </>
  );
}
