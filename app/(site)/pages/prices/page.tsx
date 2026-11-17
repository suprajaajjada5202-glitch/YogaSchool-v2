import PricesPage from "@/views/PricesPage";
import { pageMetadata } from "@/lib/seo";

/* /pages/prices */
export const metadata = pageMetadata("prices");
export const revalidate = 60; // refresh Supabase content every minute

export default PricesPage;
