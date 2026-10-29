import { notFound } from "next/navigation";
import { posts as builtInPosts } from "@/data/posts";
import { getPostByPath, getPosts } from "@/lib/data";
import { articleMetadata } from "@/lib/seo";
import { ArticleView } from "@/views/ArticleView";

/* Blog articles at their ORIGINAL live URLs, e.g. /blog/2014/03/23/yoga-is-a-complete-system,
   so existing Google results and links keep working. */
export const dynamicParams = false;
export const revalidate = 60;
export function generateStaticParams() {
  return builtInPosts.map((p) => {
    const [, , year, month, day, slug] = p.path!.split("/");
    return { year, month, day, slug };
  });
}

type Props = { params: Promise<{ year: string; month: string; day: string; slug: string }> };
const pathOf = ({ year, month, day, slug }: Awaited<Props["params"]>) => `/blog/${year}/${month}/${day}/${slug}`;

export async function generateMetadata({ params }: Props) {
  const path = pathOf(await params);
  const post = await getPostByPath(path);
  return post ? articleMetadata(post, path) : {};
}

export default async function BlogArticlePage({ params }: Props) {
  const path = pathOf(await params);
  const [post, all] = await Promise.all([getPostByPath(path), getPosts()]);
  if (!post) notFound();
  return <ArticleView post={post} path={path} more={all.filter((p) => p.slug !== post.slug).slice(0, 3)} />;
}
