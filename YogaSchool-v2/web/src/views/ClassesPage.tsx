/* Converted from the static page; interactive parts are React components. */
import { Tilt } from "@/components/Tilt";
import { ClassJump, ClassRows } from "@/components/ClassRows";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Wave } from "@/components/Wave";
import { seo } from "@/lib/seo";
import { getClasses } from "@/lib/data";
import { modalities } from "@/data/content";
import type { ClassItem } from "@/lib/types";

export default async function ClassesPage() {
  const [all] = await Promise.all([getClasses()]);
  // Brochure order, matched by class name so it holds whatever sort numbers or web addresses /admin has.
  // Knoff Yoga levels first; everything else goes under "Other styles of yoga" (unlisted classes keep /admin order).
  const KF = [/^level 1\b/i, /^level 2\b/i, /^level 3\b/i, /^all level/i, /^combined/i, /^chair/i];
  const OTHER = [/^general yoga\b(?!.*beginner)/i, /^general yoga\b.*beginner/i, /^yin\b/i];
  const rank = (list: RegExp[], name: string) => {
    const i = list.findIndex((re) => re.test(name));
    return i < 0 ? list.length : i;
  };
  const byRank = (list: RegExp[]) => (a: ClassItem, b: ClassItem) => rank(list, a.name) - rank(list, b.name);
  const kfClasses = all.filter((c) => rank(KF, c.name) < KF.length).sort(byRank(KF));
  const otherClasses = all.filter((c) => rank(KF, c.name) === KF.length).sort(byRank(OTHER));
  const classes = [...kfClasses, ...otherClasses];
  // "Level N" class section, whatever web address name it was given in /admin
  const levelHref = (n: number) =>
    `#class-${classes.find((c) => new RegExp(`^level ${n}\\b`, "i").test(c.name))?.slug ?? `l${n}`}`;
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
                <li aria-current="page">Classes</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">Classes & programs</p>{" "}
            <h1>
              Find your <em>practice</em>
            </h1>{" "}
            <p className="lead">
              We offer 3 levels of study and 24 classes a week for a comprehensive yoga education. Students of all levels of
              experience can benefit from the classes we teach.
            </p>{" "}
            <div className="page-hero__actions">
              <Link className="btn btn--primary" href="/pages/timetable">
                See the timetable{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
              <a
                className="btn btn--outline"
                href="https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989"
                target="_blank"
                rel="noopener"
              >
                New student offer
              </a>
            </div>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="arch">
            {" "}
            <div className="arch__frame">
              <img
                loading="lazy"
                decoding="async"
                src="/images/headers/childs-pose.jpg"
                alt="A teacher gently adjusting a student resting in child's pose"
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
              Beginners always welcome
            </p>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-labelledby="path-title" style={{ paddingBottom: "0" }}>
        {" "}
        <div className="container">
          {" "}
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">Your path</p>
            <h2 id="path-title">
              KNOFF YOGA CLASS LEVELS <em>(KF)</em>
            </h2>
            <p className="lead">A traditional and systematic approach to yoga, combining precise alignment, movement and breath.
            Classes follow a progressive level system developed through decades of teaching and practice.
            </p>
          </Reveal>{" "}
          <Reveal className="path path--3">
            {" "}
            <a href={levelHref(1)}>
              <b>1</b>
              <span>Introduction</span>
              <small>Absolute beginners and a slower practice</small>
            </a>{" "}
            <a href={levelHref(2)}>
              <b>2</b>
              <span>Building</span>
              <small>Vinyasa, heat, strength and focus</small>
            </a>{" "}
            <a href={levelHref(3)}>
              <b>3</b>
              <span>Deepening</span>
              <small>More demanding postures and skill</small>
            </a>{" "}
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section" aria-label="All classes">
        {" "}
        <div className="container">
          {" "}
          <ClassJump classes={classes} /> <ClassRows classes={kfClasses} modalities={modalities} />
          {otherClasses.length > 0 && (
            <>
              <Reveal className="section-head section-head--center" style={{ marginTop: "var(--s-10)" }}>
                <p className="eyebrow">More ways to practise</p>
                <h2 id="other-title">
                  OTHER STYLES <em>OF YOGA</em>
                </h2>
              </Reveal>
              <ClassRows classes={otherClasses} modalities={modalities} />
            </>
          )}
          <Tilt selector=".row__media .arch" />{" "}
        </div>{" "}
      </section>{" "}
      <Wave />{" "}
      <section className="section section--tint" style={{ paddingTop: "var(--s-6)" }} aria-labelledby="prog-title">
        {" "}
        <div className="container split split--even">
          {" "}
          <Reveal>
            {" "}
            <p className="eyebrow">Progression</p>{" "}
            <h2 id="prog-title">
              Challenge days and <em>gentle days</em>
            </h2>{" "}
          </Reveal>{" "}
          <Reveal delay={1} className="prose prose-lg">
            <p>
              As your experience progresses, you can still continue to attend the lower level classes. This has many benefits,
              especially maintaining the poses you have already learnt. You also shouldn’t necessarily work at your edge or
              highest intensity during every practice. Have both challenging and then also less intense practice days. Your body
              and mind will appreciate it. This helps keep you motivated and inspired and also gives you access to a greater
              variety of classes and times to fit your schedule.
            </p>
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <JsonLd data={seo("classes").jsonLd} />
    </>
  );
}
