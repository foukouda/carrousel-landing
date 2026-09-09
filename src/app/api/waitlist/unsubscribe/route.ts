import type { NextRequest } from "next/server";

import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { removeSubscriber } from "@/lib/waitlist-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Withdrawing consent, which Article 7(3) says must be as easy as giving it.
 *
 * POST rather than GET on purpose: mail clients and security scanners follow
 * links in emails automatically, and a GET endpoint here would unsubscribe
 * people who never clicked anything.
 */
export async function POST(request: NextRequest) {
  let payload: { email?: unknown; token?: unknown };

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const token = typeof payload.token === "string" ? payload.token : "";

  if (!email || !verifyUnsubscribeToken(email, token)) {
    /* One message for a bad address and for a bad token, so the endpoint
       cannot be used to work out who is on the list. */
    return Response.json(
      {
        ok: false,
        error:
          "This link is not valid. Please use the link from the email, or write to us and we will remove you by hand.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await removeSubscriber(email);

    if (result === "unavailable") {
      return Response.json(
        { ok: false, error: "We could not reach the list. Please try again shortly." },
        { status: 503 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[waitlist] Could not remove the address:", error);
    return Response.json(
      { ok: false, error: "We could not reach the list. Please try again shortly." },
      { status: 503 },
    );
  }
}
