import ShopPage from "@/views/ShopPage";
import { pageMetadata } from "@/lib/seo";

/* /pages/shop */
export const metadata = pageMetadata("shop");
export const revalidate = 60; // refresh Supabase content every minute

export default ShopPage;
