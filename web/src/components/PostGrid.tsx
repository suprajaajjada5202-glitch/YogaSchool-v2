import Link from "next/link";
import { postHref } from "@/lib/data";
import type { Post } from "@/lib/types";
import { Use } from "./Icons";
import { Reveal } from "./Reveal";

export function PostCard({ post }: { post: Post }) {
  return (
    <Reveal as="article" className="post__card">
      <div className="post__media">
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
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
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
