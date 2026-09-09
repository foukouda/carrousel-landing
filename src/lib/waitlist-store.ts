import "server-only";

import { getSql } from "./db";
import { DELETE_BY_EMAIL, UPSERT } from "./waitlist-sql";

/**
 * Where a waitlist address is kept: one row in Postgres.
 *
 * There is no local-file fallback. An earlier version wrote to a JSONL file
 * when the database was missing, which was convenient and wrong: it meant a
 * misconfigured deploy looked healthy while dropping every sign-up into a
 * container filesystem that vanished on the next push. Now a missing database
 * is reported as a failure, in development as in production.
 */

export type Subscriber = {
  email: string;
  source: string;
  /* Article 7(1): the controller must be able to demonstrate that consent was
     given. The exact wording is stored alongside it, because proving consent
     means proving what was consented to. */
  consentText: string;
  consentVersion: string;
};

export type StoreResult = "saved" | "unavailable";

let warned = false;

function warnOnce() {
  if (warned) return;
  warned = true;
  console.error(
    "[waitlist] DATABASE_URL is not set, so sign-ups cannot be stored. " +
      "Copy .env.example to .env.local and paste your Supabase connection " +
      "string, then run `npm run db:migrate`. See README.md.",
  );
}

export async function saveSubscriber(record: Subscriber): Promise<StoreResult> {
  const sql = getSql();
  if (!sql) {
    warnOnce();
    return "unavailable";
  }

  await sql.unsafe(UPSERT, [
    record.email,
    record.source,
    record.consentText,
    record.consentVersion,
  ]);

  return "saved";
}

export async function removeSubscriber(email: string): Promise<StoreResult> {
  const sql = getSql();
  if (!sql) {
    warnOnce();
    return "unavailable";
  }

  await sql.unsafe(DELETE_BY_EMAIL, [email]);
  return "saved";
}
