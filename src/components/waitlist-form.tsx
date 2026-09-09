"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { CheckCircle, CircleNotch } from "@phosphor-icons/react";

import { consent, nav } from "@/lib/content";

type Status = "idle" | "sending" | "done" | "error";

export function WaitlistForm({
  label,
  placeholder,
  help,
  source,
}: {
  label: string;
  placeholder: string;
  help: string;
  source: string;
}) {
  const fieldId = useId();
  const consentId = `${fieldId}-consent`;
  const helpId = `${fieldId}-help`;
  const errorId = `${fieldId}-error`;

  const [email, setEmail] = useState("");
  /* Unticked to start with, and never pre-ticked: consent that was not given
     by a deliberate act is not consent (Article 4(11), Recital 32). */
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  /* Bots fill every field they find. A real visitor never sees this one. */
  const trap = useRef<HTMLInputElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    if (!agreed) {
      setStatus("error");
      setMessage("Please tick the box so we may keep your address.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          consent: agreed,
          company: trap.current?.value ?? "",
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-[var(--radius-surface)] border border-[color:var(--secondary)]/30 bg-secondary-soft p-5"
      >
        <CheckCircle
          size={22}
          weight="fill"
          className="mt-px shrink-0 text-secondary"
          aria-hidden
        />
        <p className="text-[15px] leading-relaxed text-foreground">
          <span className="font-semibold">You are on the list.</span> We will
          write once, the day the campaign opens. Nothing before that, and every
          email carries a one-click way off the list.
        </p>
      </div>
    );
  }

  const failed = status === "error";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label
        htmlFor={fieldId}
        className="block text-[11px] font-semibold tracking-[0.22em] text-foreground uppercase"
      >
        {label}
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={fieldId}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (failed) setStatus("idle");
          }}
          aria-describedby={failed ? errorId : helpId}
          aria-invalid={failed}
          disabled={status === "sending"}
          className={`h-12 min-h-[44px] flex-1 rounded-[var(--radius-interactive)] border bg-surface px-4 text-[15px] text-foreground transition-[border-color,box-shadow] duration-200 ease-out placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60 ${
            failed ? "border-accent-hover" : "border-border"
          }`}
        />

        {/* Honeypot. Off screen rather than display:none, which some bots skip. */}
        <input
          ref={trap}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-[var(--radius-interactive)] bg-accent px-8 text-[12px] font-semibold tracking-[0.12em] whitespace-nowrap text-accent-foreground uppercase transition-[background-color,box-shadow,transform] duration-300 ease-out hover:bg-accent-hover hover:shadow-[var(--shadow-accent-hover)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? (
            <>
              <CircleNotch size={17} className="animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            nav.cta
          )}
        </button>
      </div>

      {/* The lawful basis for keeping the address, asked for in plain words
          rather than buried in a link. */}
      {/* -my-2 py-2 gives the row a 44px tall hit area without adding visible
          space: the whole line, label included, is tappable. */}
      <div className="-my-2 mt-2 flex items-start gap-3 py-2">
        <input
          id={consentId}
          type="checkbox"
          checked={agreed}
          onChange={(event) => {
            setAgreed(event.target.checked);
            if (failed) setStatus("idle");
          }}
          disabled={status === "sending"}
          className="h-[24px] w-[24px] shrink-0 accent-[var(--accent)]"
        />
        <label
          htmlFor={consentId}
          className="max-w-[52ch] text-[13px] leading-relaxed text-muted"
        >
          {consent.text}{" "}
          <Link
            href="/privacy"
            className="text-accent-hover underline underline-offset-2"
          >
            What we do with it
          </Link>
          .
        </label>
      </div>

      {failed ? (
        <p id={errorId} role="alert" className="mt-3 text-[13px] text-accent-hover">
          {message}
        </p>
      ) : (
        <p id={helpId} className="mt-3 max-w-[52ch] text-[13px] text-muted">
          {help}
        </p>
      )}
    </form>
  );
}
