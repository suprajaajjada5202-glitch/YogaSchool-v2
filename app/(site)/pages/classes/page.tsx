import ClassesPage from "@/views/ClassesPage";
import { pageMetadata } from "@/lib/seo";

/* /pages/classes */
export const metadata = pageMetadata("classes");
export const revalidate = 60; // refresh Supabase content every minute

export default ClassesPage;
