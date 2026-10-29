/* Converted from the static page; interactive parts are React components. */
import { Gallery } from "@/components/Gallery";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";

export default function GalleryPage() {
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
                <li aria-current="page">Gallery</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Gallery</p>{" "}
            <h1>
              Inside the <em>studio</em>
            </h1>{" "}
            <p className="lead">
              Moments from our classes at Piccones Village, Edge Hill. Tap any photo to view it full size.
            </p>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/headers/arms-overhead.jpg"
                alt="Students stretching their arms overhead"
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
              46 photos
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="Photo gallery">
        {" "}
        <div className="container">
          {" "}
          <Gallery />{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("photo-gallery").jsonLd} />
    </>
  );
}
