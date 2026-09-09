import "server-only";

import postgres from "postgres";

/**
 * The Postgres connection.
 *
 * Two things about this setup are specific to running on Vercel in front of
 * Supabase, and both matter:
 *
 * `prepare: false` is required. Supabase's pooler runs in transaction mode,
 * where each statement can land on a different backend connection, so named
 * prepared statements are not supported. Leaving this on produces errors that
 * only appear under load, once the pool starts reusing connections.
 *
 * `max: 1` because every serverless invocation is its own process. A pool of
 * ten per instance multiplied by the number of warm instances is how a small
 * site exhausts a database's connection limit. The pooler does the pooling;
 * this side just needs one.
 *
 * Returns null when DATABASE_URL is absent, so the site still builds and every
 * page still renders. Only the sign-up route needs the database.
 */

const url = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(url);

/* Kept on globalThis so `next dev` does not open a fresh pool on every hot
   reload, which leaks connections until the database refuses new ones. */
const globalForDb = globalThis as unknown as {
  waitlistSql?: postgres.Sql;
};

function connect(): postgres.Sql | null {
  if (!url) return null;

  return postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    /* Supabase terminates TLS at the pooler with its own certificate chain. */
    ssl: url.includes("localhost") || url.includes("127.0.0.1")
      ? false
      : "require",
  });
}

export function getSql(): postgres.Sql | null {
  if (!url) return null;
  if (!globalForDb.waitlistSql) globalForDb.waitlistSql = connect() ?? undefined;
  return globalForDb.waitlistSql ?? null;
}
