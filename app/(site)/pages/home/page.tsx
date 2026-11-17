import HomePage from "@/views/HomePage";
import { pageMetadata } from "@/lib/seo";

/* /pages/home */
export const metadata = pageMetadata("home");
export const revalidate = 60; // refresh Supabase content every minute

export default HomePage;
