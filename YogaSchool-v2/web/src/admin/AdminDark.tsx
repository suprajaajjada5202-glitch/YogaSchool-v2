"use client";

import { useEffect } from "react";

/** The admin is dark only while the website is light: keeps <html data-theme="dark"> on while the admin is open
    (also after arriving from a website page) and takes it off again on leaving for the website */
export function AdminDark() {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = "dark";
    return () => {
      delete html.dataset.theme;
    };
  }, []);
  return null;
}
