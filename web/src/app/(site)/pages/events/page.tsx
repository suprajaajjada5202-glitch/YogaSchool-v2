import EventsPage from "@/views/EventsPage";
import { pageMetadata } from "@/lib/seo";

/* /pages/events */
export const metadata = pageMetadata("events");
export const revalidate = 60; // refresh Supabase content every minute

export default EventsPage;
