import TimetablePage from "@/views/TimetablePage";
import { pageMetadata } from "@/lib/seo";

/* /pages/timetable */
export const metadata = pageMetadata("timetable");
export const revalidate = 60; // refresh Supabase content every minute

export default TimetablePage;
