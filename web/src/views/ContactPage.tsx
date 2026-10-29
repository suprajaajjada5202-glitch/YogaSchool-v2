/* Converted from the static page; interactive parts are React components. */
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";
import { MAP_EMBED } from "@/lib/site";

export default function ContactPage() {
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
                <li aria-current="page">Contact</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Contact</p>{" "}
            <h1>
              Come and <em>visit us</em>
            </h1>{" "}
            <p className="lead">
              Questions about classes, passes, training or private sessions? Send us a message, call, or drop in to the studio.
            </p>{" "}
            <div className="page-hero__actions">
              <a className="btn btn--primary" href="tel:+61412499700">
                Call 0412 499 700
              </a>
              <a className="btn btn--outline" href="mailto:info@theyogaschool.com.au">
                Email us
              </a>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00113.jpg"
                alt="Students settling onto their mats before class, with the studio front desk behind"
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
              Diagonally opposite Edge Hill Post Office
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" style={{ paddingTop: "var(--s-4)" }} aria-labelledby="contact-title">
        {" "}
        <div className="container">
          {" "}
          <h2 id="contact-title" className="sr-only">
            Send us a message
          </h2>{" "}
          <div className="contact">
            {" "}
            {/* CONTACT FORM: validates and shows a success message in the browser.
            To actually receive messages, connect it in assets/js/main.js (Formspree / EmailJS / your backend). */}{" "}
            <ContactForm />{" "}
            <Reveal delay={1}>
              {" "}
              <div className="info-list">
                {" "}
                <div className="info-item">
                  {" "}
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                      </g>
                    </svg>
                  </span>{" "}
                  <div>
                    <h3>Address</h3>
                    <address>
                      Suite 14, 159-161 Pease Street
                      <br />
                      Piccones Village, Edge Hill
                      <br />
                      Cairns, Queensland 4870, Australia
                    </address>
                  </div>{" "}
                </div>{" "}
                <div className="info-item">
                  {" "}
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                      />
                    </svg>
                  </span>{" "}
                  <div>
                    <h3>Phone</h3>
                    <p>
                      <a href="tel:+61412499700">0412 499 700</a>
                    </p>
                  </div>{" "}
                </div>{" "}
                <div className="info-item">
                  {" "}
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </g>
                    </svg>
                  </span>{" "}
                  <div>
                    <h3>Email</h3>
                    <p>
                      <a href="mailto:info@theyogaschool.com.au">info@theyogaschool.com.au</a>
                    </p>
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* PLACEHOLDER: WhatsApp number uses the studio mobile (0412 499 700). Confirm it is on WhatsApp or replace. */}{" "}
              <a className="btn btn--primary" href="https://wa.me/61412499700" target="_blank" rel="noopener">
                <svg aria-hidden="true">
                  <use href="#i-whatsapp" />
                </svg>{" "}
                Chat on WhatsApp
              </a>{" "}
              <div className="map">
                {" "}
                <iframe
                  title="Map showing The Yoga School at Piccones Village, Edge Hill, Cairns"
                  src={MAP_EMBED}
                  width="600"
                  height="300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                ></iframe>{" "}
              </div>{" "}
            </Reveal>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("contact-us").jsonLd} />
    </>
  );
}
