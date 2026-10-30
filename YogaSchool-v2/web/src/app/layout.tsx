import type { Metadata, Viewport } from "next";
import { LOGO, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: LOGO, apple: LOGO },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1626",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The site is dark only: <html data-theme="dark"> switches on the dark palette in globals.css everywhere
  return (
    <html lang="en-AU" data-theme="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400;1,9..40,500&display=swap"
        />
      </head>
      {/* "no-js" keeps scroll-reveal content visible when JavaScript is off; removed immediately otherwise */}
      <body className="no-js" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: "document.body.classList.remove('no-js')" }} />
        {children}
      </body>
    </html>
  );
}
