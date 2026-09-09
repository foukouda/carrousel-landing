/**
 * Creates the waitlist table.
 *
 *   npm run db:migrate
 *
 * Safe to run as often as you like: every statement is CREATE ... IF NOT
 * EXISTS, so re-running it on a live database changes nothing and destroys
 * nothing.
 */

import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error(
    "\nDATABASE_URL n'est pas defini.\n\n" +
      "  1. Copie .env.example vers .env.local\n" +
      "  2. Colle la connection string Supabase (Connect > ORMs / Session pooler)\n" +
      "  3. Relance : npm run db:migrate\n",
  );
  process.exit(1);
}

/* Read from the TypeScript source so the schema has exactly one definition. */
const source = readFileSync(
  new URL("../src/lib/waitlist-sql.ts", import.meta.url),
  "utf8",
);
const schema = source.match(/export const SCHEMA = `([\s\S]*?)`/)?.[1];

if (!schema) {
  console.error("Impossible de lire SCHEMA dans src/lib/waitlist-sql.ts");
  process.exit(1);
}

const local = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, { max: 1, prepare: false, ssl: local ? false : "require" });

try {
  await sql.unsafe(schema);

  const [{ count }] = await sql`select count(*)::int as count from waitlist`;
  console.log(`\nTable waitlist prete. ${count} inscrit(s) actuellement.\n`);
} catch (error) {
  console.error("\nLa migration a echoue :", error.message, "\n");
  process.exitCode = 1;
} finally {
  await sql.end();
}
