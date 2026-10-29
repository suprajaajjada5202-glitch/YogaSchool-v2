/* Home page (2026 design): hero, classes, why us and memberships; the site footer follows from the layout. */
import { HeroSlider } from "@/components/HeroSlider";
import { TileIcon, Use } from "@/components/Icons";
import Link from "next/link";
import { MembershipTiles, PassesTeaser } from "@/components/Prices";
import { Reveal, RevealRepeat } from "@/components/Reveal";
import { ModalityCards } from "@/components/ClassRows";
import { JsonLd } from "@/components/JsonLd";
import { modalities } from "@/data/content";
import { seo } from "@/lib/seo";
import { getClasses, getMemberships, getPasses } from "@/lib/data";

/* "Why The Yoga School?": outline icon (24 × 24 path), title, text */
const WHY = [
  {
    icon: "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM4 10h16M8 3v4M16 3v4",
    title: "Decades of Experience",
    text: "Over 80 years of combined teaching experience from our Master Teachers.",
  },
  {
    icon: "M9 8a3 3 0 1 0 0 .01M3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-.01M15.5 20a4.5 4.5 0 0 1 5.5-4.4",
    title: "Experienced Teachers",
    text: "Every teacher is trained exclusively by world-renowned Master Teachers Nicky Knoff and James Bryan.",
  },
  {
    icon: "M12 20s-7.5-4.6-9.2-9.3C1.7 7.6 3.6 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.2 0 5.1 3.1 4 6.2C19.5 15.4 12 20 12 20Z",
    title: "Complete Movement",
    text: "Bring together yoga, strength and mobility under one roof.",
  },
  {
    icon: "M5 19C5 10.7 11 4.5 20 4.5c0 8.5-6.2 14.5-15 14.5Zm0 0 9-9",
    title: "All Welcome",
    text: "Classes for all experience levels, age groups and everyday bodies.",
  },
];

export default async function HomePage() {
  const [classes, memberships, passes] = await Promise.all([getClasses(), getMemberships(), getPasses()]);

  // RevealRepeat: every section animates in again each time it scrolls back into view (home page only)
  return (
    <RevealRepeat>
      <HeroSlider />
      <section className="section home-classes" aria-labelledby="classes-title">
        <div className="container">
          <Reveal className="home-head home-head--row">
            <div>
              <p className="home-eyebrow">Our classes</p>
              <h2 id="classes-title">Less Pain, More Gain.</h2>
              <p>Experienced teachers. Welcoming classes. Real results.</p>
            </div>
            <Link className="home-link" href="/pages/classes">
              Explore all classes <Use id="i-arrow" />
            </Link>
          </Reveal>
          <ModalityCards modalities={modalities} classes={classes} />
        </div>
      </section>
      <section className="section section--dark on-dark home-why" aria-labelledby="why-title">
        <div className="container home-why__grid">
          <Reveal className="home-head home-head--left">
            <p className="home-eyebrow">Why The Yoga School?</p>
            <h2 id="why-title">Experience Matters.</h2>
            <p>A trusted studio with a rich teaching heritage and a welcoming community.</p>
            <Link className="btn btn--teal" href="/pages/teachers">
              Meet our teachers <Use id="i-arrow" />
            </Link>
          </Reveal>
          <ul className="why">
            {WHY.map((w, n) => (
              <Reveal as="li" className="why__item" key={w.title} delay={n || undefined}>
                <TileIcon d={w.icon} className="why__ic" pathLength={1} />
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="section home-plans" aria-labelledby="plans-title">
        <div className="container">
          <Reveal className="home-head">
            <p className="home-eyebrow">Memberships</p>
            <h2 id="plans-title">Class Passes and Memberships.</h2>
            <p>Unlimited classes with a membership, or pay as you go with a class pass.</p>
          </Reveal>
          <MembershipTiles plans={memberships} />
          <PassesTeaser groups={passes} />
        </div>
      </section>
      <JsonLd data={seo("home").jsonLd} />
    </RevealRepeat>
  );
}
