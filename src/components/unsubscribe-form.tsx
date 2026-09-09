"use client";

import { useState } from "react";
import { CheckCircle, CircleNotch } from "@phosphor-icons/react";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Withdrawing consent takes one deliberate click.
 *
 * The removal is a POST behind a button rather than something the page does on
 * load, because mail clients and link scanners open URLs in emails by
 * themselves. A page that unsubscribed on arrival would drop people who never
 * touched the link.
 */
export function UnsubscribeForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function remove() {
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
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
        className="mt-10 flex items-start gap-3 border border-[color:var(--secondary)]/30 bg-secondary-soft p-5"
      >
        <CheckCircle
          size={22}
          weight="fill"
          className="mt-px shrink-0 text-secondary"
          aria-hidden
        />
        <p className="text-[15px] leading-relaxed text-foreground">
          <span className="font-semibold">Done.</span> Your address has been
          deleted from the list. You will not hear from us again.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={remove}
        disabled={status === "sending"}
        className="inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-interactive)] bg-accent px-8 text-[12px] font-semibold tracking-[0.12em] whitespace-nowrap text-accent-foreground uppercase transition-[background-color,box-shadow,transform] duration-300 ease-out hover:bg-accent-hover hover:shadow-[var(--shadow-accent-hover)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <CircleNotch size={17} className="animate-spin" aria-hidden />
            Removing
          </>
        ) : (
          "Remove me"
        )}
      </button>

      {status === "error" ? (
        <p role="alert" className="mt-4 max-w-[52ch] text-[13px] text-accent-hover">
          {message}
        </p>
      ) : null}
    </div>
  );
}
