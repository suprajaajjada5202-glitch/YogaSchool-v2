/* Converted from the static page; interactive parts are React components. */
import { BlogMotion } from "@/components/BlogMotion";
import { PostGrid } from "@/components/PostGrid";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SplitWords } from "@/components/SplitWords";
import { seo } from "@/lib/seo";
import { getPosts } from "@/lib/data";

export default async function BlogPage() {
  const [posts] = await Promise.all([getPosts()]);
  return (
    <>
      {" "}
      <section className="page-hero blog-hero">
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
                <li aria-current="page">Blog</li>
              </ol>
            </nav>{" "}
            <p className="eyebrow">From the blog</p>{" "}
            <h1>
              <SplitWords text="Reflections on" />{" "}
              <em>
                <SplitWords text="practice" start={2} />
              </em>
            </h1>{" "}
            <p className="lead">
              Thoughts on yoga, the body and the mind from Nicky Knoff, James Bryan and The Yoga School.
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
          </Reveal>{" "}
        </div>{" "}
      </section>{" "}
      <section className="section blog-list" aria-label="Articles">
        {" "}
        <div className="container">
          {" "}
          <PostGrid posts={posts} feature />{" "}
        </div>{" "}
      </section>{" "}
      <BlogMotion />
      <JsonLd data={seo("blog1").jsonLd} />
    </>
  );
}
