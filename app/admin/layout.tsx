import type { Metadata, Viewport } from "next";
import { AdminDark } from "@/admin/AdminDark";
import "@/admin/admin.css";

export const metadata: Metadata = { title: "Admin | The Yoga School", robots: { index: false, follow: false } };

export const viewport: Viewport = { themeColor: "#0b1626" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dark before the first paint, so the admin never flashes light */}
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.dataset.theme="dark"' }} />
      <AdminDark />
      <div className="admin-root">{children}</div>
    </>
  );
}
