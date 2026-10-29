import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SimpleHero } from "@/components/SimpleHero";
import { seo } from "@/lib/seo";

const EMAIL = "info@theyogaschool.com.au";

/* Membership terms, migrated word for word from the live site (/terms-and-conditions). */
const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Membership terms",
    items: [
      "This agreement is entered into as 12 weeks.",
      "You may attend unlimited public classes at The Yoga School.",
      "The public classes need to be appropriate for your level of practice, i.e. if you are a beginner, it would not be sensible or safe for you to attend advanced classes.",
      "Your Membership is transferrable, but can only be used by one person at a time, and only transferred once. There is a $35 administrative fee for the transfer.",
      "Your Membership may be put on hold (during which time payment will not be debited to your credit/debit card) for a minimum period of 2 weeks and we require a 2 week notice prior to your next billing date.",
      "The hold is a maximum of 2 weeks.",
      "If your credit/debit card details change, you must update them and advise us.",
      "For ease of administration, your membership will automatically renew under the initial term.",
      `If you do not wish to renew, we require 2 weeks prior notice in writing addressed to The Yoga School via email: ${EMAIL}`,
      "If there has been a fee increase, your renewed membership will be based on the new fee.",
      "The Yoga School reserves the right to make changes to the public class Timetable.",
    ],
  },
  {
    title: "Cancellation",
    items: [
      "We honour the Australian Direct Marketing Code of Practice and offer a 7 day cooling off period.",
      "You may cancel your Membership during the 7 day cooling off period and request a full refund, which will be provided within 14 days of the request.",
      "If you have attended any public classes during this time, you will be charged the Single Pass fee for each class attended.",
      `If during your Membership term of 12 weeks a medical problem arises, you may provide The Yoga School with documentary proof from a qualified medical practitioner evidencing that you are unable to undertake any exercise regime and stating the expected duration of your incapacity. Then you may put your Membership on hold for the expected duration of the incapacity, or if the incapacity is permanent or expected to continue for a period longer than 8 weeks, you may cancel your membership immediately upon giving notice in writing to The Yoga School via email: ${EMAIL}`,
      `Otherwise, you may cancel your Membership by paying a cancellation fee of $100. We require 2 weeks prior notice in writing addressed to The Yoga School via email: ${EMAIL}`,
    ],
  },
  {
    title: "Membership conduct",
    items: [
      "Consideration and respect must always be shown for other students.",
      "You must not use abusive/bad language, or behave in a disruptive manner.",
      "You must not bring, use, or be under the influence of illegal drugs in any part of The Yoga School premises.",
      "Sexual harassment will not be tolerated.",
      "If you do not follow the Membership Conduct requirements, then The Yoga School reserves the right to cancel your Membership immediately, and you will be required to continue your payment option for the duration of your Membership.",
    ],
  },
];

/** Turns the studio email address inside a sentence into a mail link. */
function withEmail(text: string) {
  const [before, after] = text.split(EMAIL);
  if (after === undefined) return text;
  return (
    <>
      {before}
      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      {after}
    </>
  );
}

export default function TermsPage() {
  return (
    <>
      <SimpleHero
        crumb="Terms & Conditions"
        image={{ src: "/images/gallery/DSC00125.jpg", alt: "A class seated quietly on their mats", width: 1000, height: 563 }}
        eyebrow="Memberships"
        title={
          <>
            Terms &amp; <em>Conditions</em>
          </>
        }
        lead="The terms for The Yoga School memberships: what’s included, holds, renewals, cancellation and conduct."
      />
      <section className="section" style={{ paddingTop: "var(--s-2)" }}>
        <div className="container">
          <div className="article">
            {SECTIONS.map((s) => (
              <Reveal key={s.title} className="prose" style={{ marginBottom: "var(--s-6)" }}>
                <h2 style={{ fontSize: "var(--fs-xl)" }}>{s.title}</h2>
                <ul className="ticks">
                  {s.items.map((item) => (
                    <li key={item.slice(0, 40)}>
                      <svg aria-hidden="true">
                        <use href="#i-check" />
                      </svg>
                      <span>{withEmail(item)}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <p className="lead" style={{ fontSize: "var(--fs-sm)" }}>
              Questions about your membership? Call <a href="tel:+61412499700">0412 499 700</a> or email{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
          </div>
        </div>
      </section>
      <JsonLd data={seo("terms-and-conditions").jsonLd} />
    </>
  );
}
