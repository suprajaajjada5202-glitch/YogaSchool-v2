/* Converted from the static page; interactive parts are React components. */
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { seo } from "@/lib/seo";

export default function FaqsPage() {
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
                <li aria-current="page">FAQs</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">FAQs</p>{" "}
            <h1>
              Good to <em>know</em>
            </h1>{" "}
            <p className="lead">
              Everything you need before your first class, from what to wear to parking and pregnancy yoga.
            </p>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img loading="lazy"
                decoding="async"
                src="/images/headers/empty-studio.jpg"
                alt="The studio set up for class, with mats and blocks laid out in rows"
                width="800"
                height="300"
              />
            </div>{" "}
            <p className="arch__badge">
              <span>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
              </span>
              Beginners welcome
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="Frequently asked questions">
        {" "}
        <div className="container">
          {" "}
          {/* Two separate columns, so opening a question never stretches the one beside it */}
          <div className="faqs">
            <div className="faqs__col">
              {" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  I don't have a yoga mat or equipment.<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  Included in your class passes at The Yoga School are all the mats and equipment (props) that you will need. So all
                  you need to bring is a towel and a bottle of water. All of our equipment is of the highest studio quality with
                  large mats for you to feel comfortable on.
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  What is parking like?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  The parking is free and some of it is undercover. There are lots of options at Piccones Shopping Village. From
                  parking your car to being in the studio the average time is less than 60 seconds, and no parking wardens :)
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  I'm pregnant. Should I do yoga?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  Our teachers are trained in pregnancy yoga and we have many students who attend public classes while pregnant.
                  Please let the teacher know if you are pregnant when signing in. We also offer private pregnancy yoga sessions.
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  My back is stiff and my hips hurt. Should I do yoga?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  Many students have exactly these same issues and enjoy the way that yoga opens the body up to let the energy flow,
                  which helps to ease these pains. If you have severe conditions please call us to make a free appointment to help
                  us understand your challenges.
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  I'm not really into group classes. What are my options?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>We offer private sessions and can also cater for small private groups.</p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  I have trouble climbing stairs.<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  Our studio is street level with easy access for both able and differently abled students. We are fully wheelchair
                  accessible.
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  If I am late, will the door be locked?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  No. But please plan to arrive ten minutes before class starts. We understand not every day runs to plan. If you
                  arrive after class has started, please be mindful of the other students, quietly find a mat and enjoy your
                  practice. The door will be open.
                </p>{" "}
              </Reveal>
            </div>
            <div className="faqs__col">
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  What do I wear?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>Men: loose-fitting shorts and a t-shirt or singlet. Women: active wear works, and so do yoga pants.</p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  What if I need to go to the toilet during class?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  No problem, this is not uncommon in class due to the movements your body will do. Quietly move off your mat and
                  carefully walk to the toilet.
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  How about eating before class?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>A light snack 1 or 2 hours before class should be OK, and it always depends on the student.</p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  What is the history of yoga?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  Yoga started around 5000 years ago in Northern India, which is why the poses (Asanas) are pronounced in both
                  English and Sanskrit.
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  Is yoga religious?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  Yoga is non-religious, more of a belief system. Many of the world's religious leaders practise yoga, and so do
                  many successful business leaders. They say it helps with making clear and non-emotional decisions during their
                  day.
                </p>{" "}
              </Reveal>{" "}
              <Reveal as="details" name="faq" className="faq">
                {" "}
                <summary>
                  How do I become a yoga teacher?<span className="faq__icon" aria-hidden="true"></span>
                </summary>{" "}
                <p>
                  Firstly you must practise yoga and have a keen interest in knowledge development. We run teacher training courses
                  with our Knoff Yoga partners. Teacher training varies from one week to one month and is all conducted at our
                  well-equipped, fully air-conditioned Cairns studio at Piccones Shopping Village on Pease Street.
                </p>{" "}
              </Reveal>
            </div>
          </div>{" "}
          <Reveal className="section-foot">
            <Link className="btn btn--primary" href="/pages/contact-us">
              Still have a question? Contact us{" "}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </Link>
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("faqs").jsonLd} />
    </>
  );
}
