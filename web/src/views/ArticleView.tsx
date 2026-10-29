import Link from "next/link";
import { Use } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PostGrid } from "@/components/PostGrid";
import { Reveal } from "@/components/Reveal";
import { LOGO, SITE_URL } from "@/lib/site";
import type { Post } from "@/lib/types";

const BLOB = "M421 316Q387 382 323 413T187 427Q121 381 92 309T79 166Q113 93 186 66T331 74Q402 113 428 181T421 316Z";

/** Blog article (built-in articles at /pages/blog-… and new ones at /pages/post?slug=…). */
export function ArticleView({ post, path, more }: { post: Post; path: string; more: Post[] }) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Brisbane", day: "numeric", month: "long", year: "numeric" }).format(
        new Date(post.publishedAt),
      )
    : "The Yoga School";
  return (
    <>
      <section className="page-hero" style={{ paddingBottom: "var(--s-5)" }}>
        <svg className="blob blob--a" viewBox="0 0 500 500" aria-hidden="true">
          <path fill="currentColor" d={BLOB} />
        </svg>
        <Reveal className="container article" style={{ position: "relative", zIndex: 1 }}>
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/pages/home">Home</Link>
              </li>
              <li>
                <Link href="/pages/blog1">Blog</Link>
              </li>
              <li aria-current="page">{post.title}</li>
            </ol>
          </nav>
          <p className="eyebrow">From the blog</p>
          <h1>{post.title}</h1>
          <div className="article__meta">
            <img loading="lazy" decoding="async" src={LOGO} alt="" width={44} height={44} />
            <span>
              By <strong>{post.author}</strong> · {date}
            </span>
          </div>
        </Reveal>
      </section>
      <section className="section" style={{ paddingTop: "var(--s-2)" }}>
        <div className="container">
          {post.image && (
            <Reveal as="figure" className="article__hero">
              <img loading="lazy"
                decoding="async"
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
              />
            </Reveal>
          )}
          <article className="article">
            <div className="prose">
              {post.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="article__end">
              <Link className="btn btn--outline" href="/pages/blog1">
                ← All articles
              </Link>
              <Link className="btn btn--primary" href="/pages/timetable">
                Book a class <Use id="i-arrow" />
              </Link>
            </div>
          </article>
        </div>
      </section>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            image: post.image?.src,
            datePublished: post.publishedAt,
            author: { "@type": post.author === "The Yoga School" ? "Organization" : "Person", name: post.author },
            publisher: { "@type": "Organization", name: "The Yoga School", logo: { "@type": "ImageObject", url: LOGO } },
            mainEntityOfPage: SITE_URL + path,
          },
        ]}
      />
      {more.length > 0 && (
        <section className="section section--tint" aria-labelledby="more-title">
          <div className="container">
            <Reveal className="section-head section-head--center">
              <p className="eyebrow">Keep reading</p>
              <h2 id="more-title">
                More from the <em>blog</em>
              </h2>
            </Reveal>
            <PostGrid posts={more} />
          </div>
        </section>
      )}
    </>
  );
}
