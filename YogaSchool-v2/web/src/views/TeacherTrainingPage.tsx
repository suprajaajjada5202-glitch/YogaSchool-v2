/* Converted from the static page; interactive parts are React components. */
import { InlineYouTube } from "@/components/InlineYouTube";
import { Reveal } from "@/components/Reveal";
import { SliderBar, SliderNav, SliderTrack } from "@/components/Slider";
import { VideoButton } from "@/components/VideoButton";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";

export default function TeacherTrainingPage() {
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
                <li aria-current="page">Teacher training</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Teacher training</p>{" "}
            <h1>
              Train with the <em>Masters</em>
            </h1>{" "}
            <p className="lead">
              Study exclusively with world-renowned Master Teachers Nicky Knoff and James Bryan. Teacher training is provided by
              The Yoga School’s sister company, Knoff Yoga.
            </p>{" "}
            <div className="page-hero__actions">
              <a className="btn btn--primary" href="http://www.knoffyoga.com" target="_blank" rel="noopener">
                Courses at Knoff Yoga{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
              <Link className="btn btn--outline" href="/pages/contact-us?enquiry=Teacher%20training">
                Ask about training
              </Link>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/gallery/DSC00019edit.jpg"
                alt="A teacher giving a student a hands-on adjustment"
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
              Yoga Alliance RYS200 · RYS300
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section section--dark on-dark clip-x" aria-labelledby="training-title">
        {" "}
        <div className="container">
          {" "}
          <div className="split">
            {" "}
            <Reveal>
              {" "}
              <p className="eyebrow">Teacher training</p>{" "}
              <h2 id="training-title">
                Train with the <em>Masters</em>
              </h2>{" "}
              <p className="lead">
                Study exclusively with world-renowned Master Teachers Nicky Knoff and James Bryan. Teacher training is provided by
                The Yoga School’s sister company, Knoff Yoga.
              </p>{" "}
              <ul className="facts">
                {" "}
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  <span>Over 21 years combined teacher training experience and over 8 decades teaching yoga</span>
                </li>{" "}
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  <span>Yoga Alliance registered (RYS200 and RYS300)</span>
                </li>{" "}
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  <span>9 levels of training, from Discovery to Master</span>
                </li>{" "}
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  <span>Intelligent, systematic and comprehensive training</span>
                </li>{" "}
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  <span>Courses conducted nationally and internationally</span>
                </li>{" "}
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  <span>Early-bird discount for registrations</span>
                </li>{" "}
              </ul>{" "}
              <div className="hero__actions">
                {" "}
                <a className="btn btn--teal" href="http://www.knoffyoga.com" target="_blank" rel="noopener">
                  Explore courses at Knoff Yoga{" "}
                  <svg aria-hidden="true">
                    <use href="#i-arrow" />
                  </svg>
                </a>{" "}
                <Link className="btn btn--glass" href="/pages/contact-us?enquiry=Teacher%20training">
                  Ask about training
                </Link>{" "}
              </div>{" "}
            </Reveal>{" "}
            <Reveal as="figure" delay={1} className="masters">
              <img
                decoding="async"
                src="/images/master-teachers.jpg"
                alt="Master Teachers Nicky Knoff and James Bryan"
                width="684"
                height="629"
                loading="lazy"
              />
              <figcaption>Master Teachers, Nicky Knoff and James Bryan</figcaption>
            </Reveal>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section section--tint" aria-label="Knoff Yoga and Yoga Alliance">
        <div className="container partners">
          <Reveal className="partner">
            <img
              className="partner__logo"
              decoding="async"
              src="/images/training/knoff-yoga-logo.png"
              alt="Knoff Yoga logo"
              width="306"
              height="127"
              loading="lazy"
            />
            <p className="eyebrow">Knoff Yoga</p>
            <h2 className="partner__title">Teacher Training is provided by The Yoga School’s sister company, Knoff Yoga</h2>
            <a className="btn btn--primary" href="http://www.knoffyoga.com" target="_blank" rel="noopener">
              Learn more about our Teacher Training courses{" "}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </a>
          </Reveal>
          <Reveal delay={1} className="partner">
            <div className="partner__badges">
              <img
                className="partner__ya"
                decoding="async"
                src="/images/training/yoga-alliance-logo.png"
                alt="Yoga Alliance logo"
                width="448"
                height="206"
                loading="lazy"
              />
              <img
                decoding="async"
                src="/images/training/rys-200.png"
                alt="Yoga Alliance Registered Yoga School RYS 200"
                width="155"
                height="155"
                loading="lazy"
              />
              <img
                decoding="async"
                src="/images/training/rys-300.png"
                alt="Yoga Alliance Registered Yoga School RYS 300"
                width="155"
                height="155"
                loading="lazy"
              />
            </div>
            <p className="eyebrow">Yoga Alliance</p>
            <h2 className="partner__title">Knoff Yoga is registered with Yoga Alliance (RYS200 and RYS300)</h2>
          </Reveal>
        </div>
      </section>{" "}
      <section className="section section--dark on-dark clip-x" aria-labelledby="yt-title">
        {" "}
        <div className="container">
          {" "}
          <div className="split">
            {" "}
            <Reveal>
              <svg className="yt-logo" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3-5.2 3Z"
                />
              </svg>
              <p className="eyebrow">YouTube</p>
              <h2 id="yt-title">Visit our YouTube channel for a look inside Yoga Teacher Training</h2>
              <a
                className="btn btn--teal"
                href="https://www.youtube.com/channel/UCabYu3TNwmNGifZa-zml5Eg"
                target="_blank"
                rel="noopener"
              >
                Visit our YouTube channel{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
            </Reveal>{" "}
            <Reveal delay={1}>
              {" "}
              <InlineYouTube
                id="X9W4SDA4m8Q"
                label="Play video: Knoff Yoga Overview (8 minutes 50 seconds)"
                caption="▶ Knoff Yoga Overview · 8:50"
                thumb="https://i.ytimg.com/vi/X9W4SDA4m8Q/maxresdefault.jpg"
              />{" "}
            </Reveal>{" "}
          </div>{" "}
          <Reveal className="videos-head">
            {" "}
            <div>
              {" "}
              <p className="eyebrow">Video library</p> <h3>Practise with us at home</h3>{" "}
            </div>{" "}
            <SliderNav target="videos-track" prevLabel="Previous videos" nextLabel="Next videos">
              {" "}
              <a className="btn btn--glass btn--sm" href="https://momence.com/video/plugin/23652" target="_blank" rel="noopener">
                On-demand classes
              </a>{" "}
            </SliderNav>{" "}
          </Reveal>{" "}
          <Reveal className="slider">
            {" "}
            <SliderTrack id="videos-track" label="Videos, scroll horizontally">
              {" "}
              <li className="slide video">
                {" "}
                <VideoButton id="u3OwQ7D3w_s" title="Dolphin Pose 1" duration="4:54" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="0jfrJDWnG58" title="Dolphin Pose 2 & 3" duration="4:31" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="w4iJZ4BJVKY" title="Wall and Chair Dolphin Pose" duration="5:26" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="_D1ygLJdrIM" title="Dolphin Full Sequence" duration="8:03" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="fIjRTF4TXps" title="Chakra Meditation Preview" duration="8:32" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="hItQ3Ojq_DE" title="Chair Yoga 1" duration="2:48" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="OWZ_ywgyOtE" title="Chair Yoga 2" duration="3:01" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="udAbwLafzNM" title="Tadasana" duration="2:14" />{" "}
              </li>{" "}
              <li className="slide video">
                {" "}
                <VideoButton id="RciVFQigvHE" title="Bhumi Namaskar" duration="5:18" />{" "}
              </li>{" "}
            </SliderTrack>{" "}
            <div className="slider-foot">
              <SliderBar target="videos-track" />
            </div>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-labelledby="how-title">
        {" "}
        <div className="container split split--even">
          {" "}
          <Reveal>
            {" "}
            <p className="eyebrow">How to become a yoga teacher</p>{" "}
            <h2 id="how-title">
              Start on the mat, <em>keep learning</em>
            </h2>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="prose prose-lg">
            {" "}
            <p>
              Firstly you must practise yoga and have a keen interest in knowledge development. We run teacher training courses
              with our Knoff Yoga partners.
            </p>{" "}
            <p>
              Teacher training varies from one week to one month and is all conducted at our well-equipped, fully air-conditioned
              Cairns studio at Piccones Shopping Village on Pease Street.
            </p>{" "}
            <Link className="btn btn--primary" href="/pages/contact-us?enquiry=Teacher%20training">
              Enquire about training{" "}
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
      <JsonLd data={seo("teacher-training").jsonLd} />
    </>
  );
}
