import type { NextRequest } from "next/server";

import { consent } from "@/lib/content";
import { saveSubscriber } from "@/lib/waitlist-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Deliberately permissive. The point is to catch typos, not to police the
   address space. Anything that survives this gets verified by the send. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Held in memory and never written down. An IP address is personal data, so
   the one place it is used is this counter, which forgets it within the
   minute. It is not stored with the sign-up and not sent anywhere. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (at) => now - at < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: NextRequest) {
  let payload: {
    email?: unknown;
    source?: unknown;
    company?: unknown;
    consent?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Malformed request." }, 400);
  }

  /* The honeypot is invisible to people, so anything in it is a bot. Answer
     with a success so the bot does not learn to try again differently. */
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return json({ ok: true });
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!EMAIL.test(email) || email.length > 254) {
    return json(
      { ok: false, error: "That does not look like an email address." },
      400,
    );
  }

  /* Consent is the lawful basis for this processing, so without it there is
     nothing to fall back on and the address must not be stored. Checked on the
     server as well as in the form: the form can be bypassed. */
  if (payload.consent !== true) {
    return json(
      { ok: false, error: "Please tick the box so we may keep your address." },
      400,
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return json(
      { ok: false, error: "Too many attempts. Please try again in a minute." },
      429,
    );
  }

  try {
    /* Nothing beyond this is kept. The referrer and the browser's language
       were dropped: neither is needed to send one email at launch, and
       Article 5(1)(c) says collect only what the purpose requires. */
    const result = await saveSubscriber({
      email,
      source: typeof payload.source === "string" ? payload.source : "unknown",
      consentText: consent.text,
      consentVersion: consent.version,
    });

    if (result === "unavailable") {
      return json(
        { ok: false, error: "Sign-up is temporarily unavailable." },
        503,
      );
    }

    return json({ ok: true });
  } catch (error) {
    console.error("[waitlist] Could not store the address:", error);
    return json({ ok: false, error: "Sign-up is temporarily unavailable." }, 503);
  }
}
