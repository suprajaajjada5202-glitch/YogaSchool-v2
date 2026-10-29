import GiftVouchersPage from "@/views/GiftVouchersPage";
import { pageMetadata } from "@/lib/seo";

/* /gift-vouchers */
export const metadata = pageMetadata("gift-vouchers");
export const revalidate = 60; // refresh Supabase content every minute

export default GiftVouchersPage;
