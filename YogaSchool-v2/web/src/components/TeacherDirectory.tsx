"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { teachers } from "@/data/content";
import { Reveal } from "./Reveal";
import { Sheet } from "./Sheet";

/** Teacher grid; tapping a portrait opens the full profile (with previous / next).
    Each profile has its own address, e.g. /pages/teachers#rossipostler */
export function TeacherDirectory() {
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const openSlug = useCallback((slug: string) => {
    const i = teachers.findIndex((t) => t.slug === slug);
    if (i < 0) return;
    setIndex(i);
    history.replaceState(null, "", `#${slug}`);
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const slug = location.hash.slice(1);
      if (slug) openSlug(slug);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [openSlug]);

  const close = () => {
    setIndex(null);
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    trigger.current?.focus();
  };

  const t = index !== null ? teachers[index] : null;
  const prev = index !== null ? teachers[(index - 1 + teachers.length) % teachers.length] : null;
  const next = index !== null ? teachers[(index + 1) % teachers.length] : null;

  return (
    <>
      <div className="tgrid">
        {teachers.map((p) => (
          <Reveal
            as="a"
            key={p.slug}
            className="teacher"
            href={`#${p.slug}`}
            onClick={(e) => {
              e.preventDefault();
              trigger.current = e.currentTarget;
              openSlug(p.slug);
            }}
          >
            <span className="teacher__photo">
              <img
                decoding="async"
                src={p.photo.src}
                alt={p.photo.alt}
                width={p.photo.width}
                height={p.photo.height}
                loading="lazy"
              />
            </span>
            <h3>{p.name}</h3>
            <p className="teacher__role">{p.role}</p>
          </Reveal>
        ))}
      </div>

      <Sheet open={t !== null} onClose={close} labelledBy="sheet-title">
        {t && prev && next && (
          <>
            <div className="sheet__profile">
              <img src={t.photo.src} alt={t.photo.alt} width={t.photo.width} height={t.photo.height} />
              <div>
                <p className="eyebrow">{t.role}</p>
                <h2 className="sheet__title" id="sheet-title">
                  {t.name}
                </h2>
                <p className="sheet__lede">{t.spec}</p>
              </div>
            </div>
            <div className="prose">
              {t.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="sheet__actions">
              <Link className="btn btn--primary" href="/pages/timetable">
                Book a class{" "}
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </Link>
            </div>
            <nav className="sheet__nav" aria-label="Other teachers">
              <button type="button" onClick={() => openSlug(prev.slug)}>
                <svg aria-hidden="true">
                  <use href="#i-left" />
                </svg>
                <span>
                  <small>Previous</small>
                  {prev.name}
                </span>
              </button>
              <button type="button" onClick={() => openSlug(next.slug)}>
                <span>
                  <small>Next</small>
                  {next.name}
                </span>
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </button>
            </nav>
          </>
        )}
      </Sheet>
    </>
  );
}
