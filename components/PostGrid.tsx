import Link from "next/link";
import { postHref } from "@/lib/data";
import type { Post } from "@/lib/types";
import { Use } from "./Icons";
import type { CSSProperties } from "react";
import { Reveal } from "./Reveal";

/** Card text: the excerpt, or when it was cut off mid-sentence ("…"), the article's opening sentences in full. */
function cardText(post: Post) {
  const excerpt = post.excerpt.trim();
  if (!/(…|\.\.\.)$/.test(excerpt) || !post.body[0]) return excerpt;
  const sentences = post.body[0].split(/(?<=[.!?])\s+/);
  let text = sentences[0];
  for (const s of sentences.slice(1)) {
    if (text.length + s.length > 220) break;
    text += ` ${s}`;
  }
  return text;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Reveal as="article" className="post__card">
      {/* The whole image shows (many carry text or are portraits); a blurred copy of it fills the frame around it */}
      <div
        className="post__media"
        style={post.image ? ({ "--post-img": `url("${post.image.src}")` } as CSSProperties) : undefined}
      >
        {post.image && (
          <img
            decoding="async"
            src={post.image.src}
            alt={post.image.alt}
            width={post.image.width}
            height={post.image.height}
            loading="lazy"
          />
        )}
      </div>
      <div className="post__body">
        <p className="post__by">{post.author}</p>
        <h3>
          <span className="post__title">{post.title}</span>
        </h3>
        <p>{cardText(post)}</p>
        <Link className="link-arrow stretch" href={postHref(post.slug)}>
          Read article <Use id="i-arrow" />
          <span className="sr-only">: {post.title}</span>
        </Link>
      </div>
    </Reveal>
  );
}

export function PostGrid({ posts, feature }: { posts: Post[]; feature?: boolean }) {
  if (!posts.length)
    return (
      <p className="lead" style={{ textAlign: "center" }}>
        New articles are coming soon.
      </p>
    );
  return (
    <div className={`pgrid${feature ? " pgrid--feature" : ""}`}>
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
