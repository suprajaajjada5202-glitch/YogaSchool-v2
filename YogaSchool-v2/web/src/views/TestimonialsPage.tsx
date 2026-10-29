/* Student stories, grouped by what changed for each person (data: featuredTestimonial and testimonialChapters in
   src/data/content.ts). */
import Link from "next/link";
import { Use } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { StoryText } from "@/components/StoryText";
import { featuredTestimonial as cecelia, testimonialChapters as chapters } from "@/data/content";
import { seo } from "@/lib/seo";
import type { Testimonial } from "@/lib/types";
import type { CSSProperties } from "react";

/** Two letters for the name badge: first and last word, skipping "and" ("Tanya and Quinn" → TQ) */
function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => w && w.toLowerCase() !== "and");
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

/** Short stories are shown whole as the quote; long ones open with their highlight line, then the story. Each is a
    card: a large quote mark, the words, then a name badge. */
function Story({ story }: { story: Testimonial }) {
  return (
    <figure className="story">
      <span className="story__mark" aria-hidden="true">
        “
      </span>
      {story.highlight ? (
        <>
          <p className="story__pull" aria-hidden="true">
            “{story.highlight}”
          </p>
          <blockquote>
            <StoryText paragraphs={story.paragraphs} />
          </blockquote>
        </>
      ) : (
        <blockquote>
          {story.paragraphs.map((p, i) => (
            <p className="story__voice" key={i}>
              “{p}”
            </p>
          ))}
        </blockquote>
      )}
      <figcaption>
        <span className="story__avatar" aria-hidden="true">
          {initials(story.name)}
        </span>
        <span className="story__who">
          {story.name}
          <span>{story.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <section className="voices-hero on-dark" aria-labelledby="voices-title">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/pages/home">Home</Link>
              </li>
              <li aria-current="page">Testimonials</li>
            </ol>
          </nav>
          <p className="eyebrow">Testimonials</p>
          <h1 id="voices-title">Student stories</h1>
          <figure className="voices-hero__quote">
            <blockquote>
              {/* Words fill in one after another (--w: each word's place) */}
              <p>
                <span className="voices-hero__mark">“</span>
                {`${cecelia.highlight}”`.split(" ").map((w, i, all) => (
                  <span className="voices-hero__word" style={{ "--w": i } as CSSProperties} key={i}>
                    {w}
                    {i < all.length - 1 ? " " : ""}
                  </span>
                ))}
              </p>
            </blockquote>
            <figcaption>
              {cecelia.name}, <a href="#cecelia">read her story</a>
            </figcaption>
          </figure>
          <nav className="voices-index" aria-labelledby="voices-index-title">
            <h2 id="voices-index-title">Find a story like yours</h2>
            <ul>
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>
                    {c.title}
                    <span>{c.stories.length} stories</span>
                    <Use id="i-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className="section section--tint feature-story" id="cecelia" aria-labelledby="cecelia-title">
        <div className="container feature-story__grid">
          <div className="feature-story__text">
            <h2 id="cecelia-title">CeCelia’s story</h2>
            {cecelia.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <figure className="feature-story__close">
              <blockquote>
                <p>“{cecelia.closing[1]}”</p>
              </blockquote>
              <figcaption>
                {cecelia.name}
                <span>{cecelia.role}</span>
              </figcaption>
            </figure>
          </div>
          <div className="feature-story__list">
            <h3>Some benefits I have enjoyed include</h3>
            <ul>
              {cecelia.benefits.map((b) => (
                <li key={b}>
                  <Use id="i-check" />
                  {b}
                </li>
              ))}
            </ul>
            <p>{cecelia.closing[0]}</p>
          </div>
        </div>
      </section>

      {chapters.map((c, n) => (
        <section className="chapter" id={c.id} aria-labelledby={`${c.id}-title`} key={c.id}>
          <div className="container chapter__grid">
            <header className="chapter__head">
              <p className="chapter__count">
                <span>{String(n + 1).padStart(2, "0")}</span> {c.stories.length} stories
              </p>
              <h2 id={`${c.id}-title`}>{c.title}</h2>
              <p>{c.intro}</p>
              <div className="arch chapter__photo">
                <div className="arch__frame">
                  <img loading="lazy" decoding="async" src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height} />
                </div>
              </div>
            </header>
            <div className="chapter__stories">
              {c.stories.map((s) => (
                <Story story={s} key={s.name} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <JsonLd data={seo("testimonials").jsonLd} />
    </>
  );
}
