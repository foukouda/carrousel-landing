import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed unsubscribe links.
 *
 * Without a signature, an unsubscribe endpoint that takes an address is an
 * invitation to empty the list: anyone who can guess an address can remove it.
 * The token is an HMAC of the address, so only a link that came from us works.
 *
 * Put the link in every email you send:
 *   https://your-domain/unsubscribe?email=<address>&token=<token>
 */

const SECRET = process.env.UNSUBSCRIBE_SECRET ?? "";

/** A short secret would make the HMAC guessable, so it is treated as absent. */
export const canIssueTokens = SECRET.length >= 32;

export function makeUnsubscribeToken(email: string): string | null {
  if (!canIssueTokens) return null;
  return createHmac("sha256", SECRET)
    .update(email.trim().toLowerCase())
    .digest("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = makeUnsubscribeToken(email);
  if (!expected || !token) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
