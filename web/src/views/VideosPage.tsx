/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import { VideoButton } from "@/components/VideoButton";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";

export default function VideosPage() {
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
                <li aria-current="page">Videos</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Videos</p>{" "}
            <h1>
              Practise with us <em>at home</em>
            </h1>{" "}
            <p className="lead">Free videos from Knoff Yoga and The Yoga School. Tap a video to play it here.</p>{" "}
            <div className="page-hero__actions">
              <a className="btn btn--primary" href="https://momence.com/video/plugin/23652" target="_blank" rel="noopener">
                On-demand classes{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
              <a
                className="btn btn--outline"
                href="https://www.youtube.com/@theyogaschoolcairns5508"
                target="_blank"
                rel="noopener"
              >
                YouTube channel
              </a>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00134.jpg"
                alt="Students reaching into a side stretch"
                width="1000"
                height="563"
              />
            </div>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section section--dark on-dark" aria-label="Video library">
        {" "}
        <div className="container">
          {" "}
          <div className="vgrid">
            {" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="X9W4SDA4m8Q" title="Knoff Yoga Overview" duration="8:50" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="u3OwQ7D3w_s" title="Dolphin Pose 1" duration="4:54" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="0jfrJDWnG58" title="Dolphin Pose 2 & 3" duration="4:31" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="w4iJZ4BJVKY" title="Wall and Chair Dolphin Pose" duration="5:26" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="_D1ygLJdrIM" title="Dolphin Full Sequence" duration="8:03" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="fIjRTF4TXps" title="Chakra Meditation Preview" duration="8:32" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="hItQ3Ojq_DE" title="Chair Yoga 1" duration="2:48" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="OWZ_ywgyOtE" title="Chair Yoga 2" duration="3:01" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="udAbwLafzNM" title="Tadasana" duration="2:14" />{" "}
            </Reveal>{" "}
            <Reveal className="video">
              {" "}
              <VideoButton id="RciVFQigvHE" title="Bhumi Namaskar" duration="5:18" />{" "}
            </Reveal>{" "}
          </div>{" "}
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
      <JsonLd data={seo("videos").jsonLd} />
    </>
  );
}
