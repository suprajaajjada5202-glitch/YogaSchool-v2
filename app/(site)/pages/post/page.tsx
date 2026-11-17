import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/data";
import { articleMetadata, pageMetadata } from "@/lib/seo";
import { ArticleView } from "@/views/ArticleView";

/* Articles added in /admin: /pages/post?slug=… */
type Props = { searchParams: Promise<{ slug?: string }> };

export async function generateMetadata({ searchParams }: Props) {
  const { slug } = await searchParams;
  const post = slug ? await getPost(slug) : null;
  if (!post) return pageMetadata("post");
  return articleMetadata(post, post.path ?? `/pages/post?slug=${encodeURIComponent(post.slug)}`);
}

export default async function PostPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  if (!slug) notFound();
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const path = post.path ?? `/pages/post?slug=${encodeURIComponent(post.slug)}`;
  return <ArticleView post={post} path={path} more={all.filter((p) => p.slug !== post.slug).slice(0, 3)} />;
}
