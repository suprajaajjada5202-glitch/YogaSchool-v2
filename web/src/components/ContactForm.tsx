"use client";
import { useEffect, useRef, useState, type FocusEvent, type FormEvent } from "react";
import { Reveal } from "./Reveal";

const ENQUIRIES = [
  "Level 1 (Introduction to Yoga)",
  "Level 2",
  "Level 3",
  "Level 4",
  "All Levels / Combined",
  "Yin Yoga",
  "Chair Yoga",
  "Shoshin strength & mobility",
  "Private session",
  "Yoga Only membership",
  "Everything membership",
  "Shoshin Only membership",
  "Teacher training",
  "Workplace wellbeing",
  "Gift vouchers",
];
type Field = "name" | "phone" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "error";

function valid(el: HTMLInputElement | HTMLTextAreaElement) {
  if (!el.checkValidity()) return false;
  if (el.name === "name" && el.value.trim().length < 2) return false;
  if (el.name === "message" && el.value.trim().length < 10) return false;
  return true;
}

/** Contact form: validates in the browser, sends to /api/contact (Supabase). ?enquiry=… preselects the enquiry type. */
export function ContactForm() {
  const [invalid, setInvalid] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [enquiry, setEnquiry] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const want = new URLSearchParams(window.location.search).get("enquiry");
    if (want && ENQUIRIES.includes(want)) setEnquiry(want);
  }, []);
  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  const check = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const ok = valid(el);
    setInvalid((s) => ({ ...s, [el.name]: !ok }));
    return ok;
  };
  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value) check(e.target);
  };
  const onInput = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (invalid[el.name as Field]) check(el);
  };

  async function submit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fields = (["name", "phone", "email", "message"] as Field[]).map((n) => form.elements.namedItem(n) as HTMLInputElement);
    const bad = fields.filter((f) => !check(f));
    if (bad.length) {
      bad[0].focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setEnquiry("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const err = (f: Field) => (invalid[f] ? "field is-invalid" : "field");
  return (
    <Reveal as="form" className={`form${status === "sent" ? " is-sent" : ""}`} id="contact-form" noValidate onSubmit={submit}>
      <div className="form__fields">
        <div className="form__grid">
          <div className={err("name")}>
            <label htmlFor="f-name">Name</label>
            <input
              id="f-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-describedby="e-name"
              aria-invalid={invalid.name || undefined}
              onBlur={onBlur}
              onInput={onInput}
            />
            <p className="field__error" id="e-name">
              Please enter your name.
            </p>
          </div>
          <div className={err("phone")}>
            <label htmlFor="f-phone">Phone</label>
            <input
              id="f-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              pattern="^[+()\d\s-]{8,}$"
              aria-describedby="e-phone"
              aria-invalid={invalid.phone || undefined}
              onBlur={onBlur}
              onInput={onInput}
            />
            <p className="field__error" id="e-phone">
              Please enter a valid phone number.
            </p>
          </div>
          <div className={`${err("email")} field--full`}>
            <label htmlFor="f-email">Email</label>
            <input
              id="f-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-describedby="e-email"
              aria-invalid={invalid.email || undefined}
              onBlur={onBlur}
              onInput={onInput}
            />
            <p className="field__error" id="e-email">
              Please enter a valid email address.
            </p>
          </div>
          <div className="field field--full">
            <label htmlFor="f-class">
              Preferred class or enquiry <span className="opt">(optional)</span>
            </label>
            <select id="f-class" name="preferred_class" value={enquiry} onChange={(e) => setEnquiry(e.target.value)}>
              <option value="">Not sure yet, please advise</option>
              {ENQUIRIES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className={`${err("message")} field--full`}>
            <label htmlFor="f-message">Message</label>
            <textarea
              id="f-message"
              name="message"
              required
              minLength={10}
              aria-describedby="e-message"
              aria-invalid={invalid.message || undefined}
              onBlur={onBlur}
              onInput={onInput}
            ></textarea>
            <p className="field__error" id="e-message">
              Please write a short message (at least 10 characters).
            </p>
          </div>
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-website">Leave this empty</label>
          <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <p className="form__error" role="alert" tabIndex={-1} hidden={status !== "error"} ref={errorRef}>
          Sorry, your message could not be sent. Please try again, or call us on <a href="tel:+61412499700">0412 499 700</a>.
        </p>
        <div className="form__footer">
          <small>We’ll only use your details to reply to you.</small>
          <button
            className="btn btn--primary"
            type="submit"
            disabled={status === "sending"}
            aria-busy={status === "sending" || undefined}
          >
            {status === "sending" ? "Sending…" : "Send message"}{" "}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </button>
        </div>
      </div>
      <div className="form__success" role="status" aria-live="polite" tabIndex={-1} ref={successRef}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12 3 3 5-6" />
          </g>
        </svg>
        <h3>Thank you!</h3>
        <p>Your message has been sent. We’ll be in touch soon.</p>
      </div>
    </Reveal>
  );
}
