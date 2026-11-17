import BlogPage from "@/views/BlogPage";
import { pageMetadata } from "@/lib/seo";

/* /pages/blog1 */
export const metadata = pageMetadata("blog1");
export const revalidate = 60; // refresh Supabase content every minute

export default BlogPage;
