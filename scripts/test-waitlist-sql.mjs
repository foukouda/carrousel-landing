/**
 * Runs the waitlist statements against a real Postgres.
 *
 * PGlite is Postgres itself compiled to WebAssembly, so this exercises the
 * actual planner and the actual constraints: a typo in the schema, a broken
 * ON CONFLICT clause or a wrong column name fails here rather than in
 * production. No server and no Docker needed.
 *
 *   node scripts/test-waitlist-sql.mjs
 */

import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

/* The statements are read out of the TypeScript source rather than copied, so
   this can never drift from what the app actually runs. */
const source = readFileSync(new URL("../src/lib/waitlist-sql.ts", import.meta.url), "utf8");

function extract(name) {
  const match = source.match(new RegExp(`export const ${name} = \`([\\s\\S]*?)\``));
  if (!match) throw new Error(`Could not find ${name} in waitlist-sql.ts`);
  return match[1];
}

const SCHEMA = extract("SCHEMA");
const UPSERT = extract("UPSERT");
const DELETE_BY_EMAIL = extract("DELETE_BY_EMAIL");
const SELECT_ALL = extract("SELECT_ALL");

let failures = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}`);
  if (!ok) console.log(`         attendu ${JSON.stringify(expected)}, obtenu ${JSON.stringify(actual)}`);
}

const db = new PGlite();

console.log("\nschema");
await db.exec(SCHEMA);
const columns = await db.query(`
  select column_name from information_schema.columns
  where table_name = 'waitlist' order by ordinal_position
`);
check(
  "colonnes creees",
  columns.rows.map((r) => r.column_name),
  ["id", "email", "source", "consent_text", "consent_version", "consent_at", "created_at", "updated_at"],
);

console.log("\ninscription");
const first = await db.query(UPSERT, [
  "dimitry@example.com", "hero", "I agree to Serein Design...", "2026-09-a",
]);
check("nouvelle ligne signalee comme nouvelle", first.rows[0].is_new, true);

const afterFirst = await db.query(SELECT_ALL);
check("une seule ligne", afterFirst.rows.length, 1);
check("source enregistree", afterFirst.rows[0].source, "hero");
check("consentement enregistre", afterFirst.rows[0].consent_version, "2026-09-a");

console.log("\nreinscription de la meme adresse");
await new Promise((r) => setTimeout(r, 30));
const second = await db.query(UPSERT, [
  "dimitry@example.com", "closing", "LIBELLE MODIFIE PLUS TARD", "2027-01-z",
]);
check("ligne existante signalee comme existante", second.rows[0].is_new, false);

const afterSecond = await db.query(SELECT_ALL);
check("toujours une seule ligne, pas de doublon", afterSecond.rows.length, 1);
check("source mise a jour", afterSecond.rows[0].source, "closing");
check(
  "libelle de consentement d'origine preserve",
  afterSecond.rows[0].consent_text,
  "I agree to Serein Design...",
);
check("version de consentement d'origine preservee", afterSecond.rows[0].consent_version, "2026-09-a");
check(
  "created_at inchange",
  afterSecond.rows[0].created_at.getTime() === afterFirst.rows[0].created_at.getTime(),
  true,
);
check(
  "updated_at avance",
  afterSecond.rows[0].updated_at.getTime() > afterFirst.rows[0].updated_at.getTime(),
  true,
);

console.log("\ncontrainte d'unicite");
try {
  await db.query(`insert into waitlist (email, source, consent_text, consent_version)
                  values ($1, $2, $3, $4)`,
    ["dimitry@example.com", "hero", "x", "y"]);
  check("insertion brute d'un doublon refusee", "acceptee", "refusee");
} catch (error) {
  check("insertion brute d'un doublon refusee", error.message.includes("duplicate key"), true);
}

console.log("\nsuppression");
await db.query(DELETE_BY_EMAIL, ["dimitry@example.com"]);
const afterDelete = await db.query(SELECT_ALL);
check("ligne reellement supprimee", afterDelete.rows.length, 0);

console.log("\nrelance du schema (idempotence)");
await db.exec(SCHEMA);
check("rejouer le schema ne casse rien", true, true);

await db.close();
console.log(failures === 0 ? "\nTout passe.\n" : `\n${failures} echec(s).\n`);
process.exit(failures === 0 ? 0 : 1);
