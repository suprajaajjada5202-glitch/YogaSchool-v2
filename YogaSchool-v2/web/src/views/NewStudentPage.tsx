import { TileIcon, Use } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SimpleHero } from "@/components/SimpleHero";
import { Word } from "@/components/Word";
import { seo } from "@/lib/seo";
import { OFFER_URL } from "@/lib/site";

/* Migrated from the live site (/NewStudentRegistration). Sign-up and sign-in happen on Momence. */
const STEPS = [
  {
    n: 1,
    icon: "M4 6h16v12H4zM4 7l8 6 8-6",
    title: "Create your login",
    text: "Enter your email address and create a password. This gives you access to the Momence app for booking into classes and workshops, and connects your account to The Yoga School.",
  },
  {
    n: 2,
    icon: "M9 8a3 3 0 1 0 0 .01M3 20a6 6 0 0 1 12 0M16 11h5M18.5 8.5v5",
    title: "Complete your profile",
    text: "Once you have access you can complete your profile, including your phone number and contact preferences.",
  },
  {
    n: 3,
    icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4",
    title: "Book your classes",
    text: "When you have credit on your account you can book into classes and start planning your yoga journey. You do not have to book into class: feel free to turn up and we can check you into class through your profile. We also do not charge a cancellation fee.",
  },
];

export default function NewStudentPage() {
  return (
    <>
      <SimpleHero
        className="page-hero--motion"
        crumb="New Student Registration"
        image={{
          src: "/images/gallery/DSC00112.jpg",
          alt: "Students kneeling on their mats at the start of a class",
          width: 1000,
          height: 563,
        }}
        eyebrow="New students"
        title={
          <>
            <Word n={0}>Welcome</Word> <Word n={1}>to</Word>{" "}
            <em>
              <Word n={2}>The</Word> <Word n={3}>Yoga</Word> <Word n={4}>School</Word>
            </em>
          </>
        }
        lead="To begin your yoga journey with us, first a profile needs to be created. Follow these 3 simple steps."
      >
        <div className="page-hero__actions">
          <a className="btn btn--primary" href="https://momence.com/sign-up" target="_blank" rel="noopener">
            Sign up <Use id="i-arrow" />
          </a>
          <a className="btn btn--outline" href="https://momence.com/sign-in" target="_blank" rel="noopener">
            Sign in
          </a>
        </div>
      </SimpleHero>
      <section className="section">
        <div className="container">
          <div className="info-cards steps">
            {STEPS.map((s, i) => (
              <Reveal className="info-card" key={s.title} delay={i || undefined} data-cm-intro="">
                <TileIcon d={s.icon} className="feature__icon" />
                <h3>
                  <span className="step__n">{s.n}.</span> {s.title}
                </h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="section-foot steps__foot">
            <a className="btn btn--primary" href="https://momence.com/sign-up" target="_blank" rel="noopener" data-cm-intro="">
              Sign up to begin <Use id="i-arrow" />
            </a>
            <a className="btn btn--outline" href={OFFER_URL} target="_blank" rel="noopener" data-cm-intro="">
              New student offer: 30 days for $99
            </a>
          </Reveal>
        </div>
      </section>
      <JsonLd data={seo("NewStudentRegistration").jsonLd} />
    </>
  );
}
