import Link from "next/link";
import type { ClassItem, Modality } from "@/lib/types";
import { Use } from "./Icons";
import { Reveal } from "./Reveal";

/** Full class sections on /pages/classes (Supabase "classes" table, or the built-in list). A class that a home page
    modality card links to shows that card's photo, so the visitor lands on the same picture they clicked
    (Shoshin, matched by both Strength and Mobility, shows the first: Strength). */
export function ClassRows({ classes, modalities = [] }: { classes: ClassItem[]; modalities?: Modality[] }) {
  const image = (c: ClassItem) => modalities.find((m) => m.classMatch?.test(c.name))?.image ?? c.image;
  return (
    <div className="rows">
      {classes.map((c) => ({ ...c, image: image(c) })).map((c) => (
        <Reveal as="article" className="row" id={`class-${c.slug}`} key={c.slug}>
          <div className="row__media">
            <div className="arch">
              <div className="arch__frame">
                {c.image && (
                  <img
                    decoding="async"
                    src={c.image.src}
                    alt={c.image.alt}
                    width={c.image.width}
                    height={c.image.height}
                    loading="lazy"
                  />
                )}
              </div>
              {c.tag && (
                <p className="arch__badge">
                  <span>
                    <Use id="i-check" />
                  </span>
                  {c.tag}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="row__sub">{c.level}</p>
            <h2>{c.name}</h2>
            <div className="card__meta">
              <span className="chip">
                <Use id="i-level" />
                {c.level}
              </span>{" "}
              {c.duration && (
                <span className="chip">
                  <Use id="i-clock" />
                  {c.duration}
                </span>
              )}
            </div>
            <div className="prose">
              {c.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="row__actions">
              {c.slug === "private" ? (
                <>
                  <a className="btn btn--primary" href="tel:+61412499700">
                    Call 0412 499 700 to book
                  </a>
                  <Link className="btn btn--outline" href="/pages/contact-us?enquiry=Private%20session">
                    Send an enquiry
                  </Link>
                </>
              ) : (
                <>
                  <Link className="btn btn--primary" href="/pages/timetable">
                    Book on the timetable <Use id="i-arrow" />
                  </Link>
                  <Link className="btn btn--outline" href="/pages/prices">
                    Passes &amp; prices
                  </Link>
                </>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Class cards for the home page slider: same list as /pages/classes, each linking to its section there. */
export function ClassCards({ classes }: { classes: ClassItem[] }) {
  return (
    <>
      {classes.map((c) => (
        <li className="slide" key={c.slug}>
          <article className="card">
            <div className="card__media">
              {c.image && (
                <img
                  decoding="async"
                  src={c.image.src}
                  alt={c.image.alt}
                  width={c.image.width}
                  height={c.image.height}
                  loading="lazy"
                />
              )}
              {c.tag && <span className="card__tag">{c.tag}</span>}
            </div>
            <div className="card__body">
              <h3>{c.name}</h3>
              <p>{c.summary}</p>
              <div className="card__meta">
                <span className="chip">
                  <Use id="i-level" />
                  {c.level}
                </span>{" "}
                {c.duration && (
                  <span className="chip">
                    <Use id="i-clock" />
                    {c.duration}
                  </span>
                )}
              </div>
              <Link className="link-arrow" href={`/pages/classes#class-${c.slug}`}>
                Class details <Use id="i-arrow" />
                <span className="sr-only">: {c.name}</span>
              </Link>
            </div>
          </article>
        </li>
      ))}
    </>
  );
}

/** Home page "Our classes": one card per modality. The title link stretches over the card and goes to the matching
    class section on /pages/classes, found by name so it still works if its web address is changed in /admin. */
export function ModalityCards({ modalities, classes }: { modalities: Modality[]; classes: ClassItem[] }) {
  const href = ({ classMatch }: Modality) => {
    const c = classMatch && classes.find((c) => classMatch.test(c.name));
    return c ? `/pages/classes#class-${c.slug}` : "/pages/classes";
  };
  return (
    <ul className="modalities">
      {modalities.map((m, n) => (
        <Reveal as="li" className="modality" key={m.name} delay={Math.min(n, 3) || undefined}>
          <span className="modality__media">
            <img decoding="async" src={m.image.src} alt={m.image.alt} width={m.image.width} height={m.image.height} loading="lazy" />
          </span>
          <div className="modality__body">
            <h3>
              <Link className="modality__link" href={href(m)}>
                {m.name} <Use id="i-arrow" />
              </Link>
            </h3>
            <p>{m.blurb}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

export function ClassJump({ classes }: { classes: ClassItem[] }) {
  return (
    <Reveal as="nav" className="jump" aria-label="Jump to a class">
      {classes.map((c) => (
        <a key={c.slug} href={`#class-${c.slug}`}>
          {c.name}
        </a>
      ))}
    </Reveal>
  );
}
