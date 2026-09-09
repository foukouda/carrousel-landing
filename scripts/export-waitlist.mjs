/**
 * Writes the list to a CSV, for the day you send the launch email.
 *
 *   npm run db:export              -> waitlist.csv
 *   npm run db:export -- liste.csv
 *
 * The file contains personal data. Do not commit it, do not put it in a shared
 * drive, and delete it once the campaign email has gone out.
 */

import { writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("\nDATABASE_URL n'est pas defini. Voir .env.example.\n");
  process.exit(1);
}

const source = readFileSync(
  new URL("../src/lib/waitlist-sql.ts", import.meta.url),
  "utf8",
);
const query = source.match(/export const SELECT_ALL = `([\s\S]*?)`/)?.[1];

const out = process.argv[2] ?? "waitlist.csv";
const local = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, { max: 1, prepare: false, ssl: local ? false : "require" });

/** Quotes a field the way RFC 4180 wants it, so Excel opens it correctly. */
function cell(value) {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

try {
  const rows = await sql.unsafe(query);

  if (rows.length === 0) {
    console.log("\nLa liste est vide, aucun fichier ecrit.\n");
  } else {
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => cell(row[h])).join(",")),
    ].join("\n");

    writeFileSync(out, `﻿${csv}`, "utf8"); // BOM, sinon Excel casse les accents
    console.log(`\n${rows.length} inscrit(s) ecrits dans ${out}\n`);
    console.log("Ce fichier contient des donnees personnelles. Ne le commite pas,");
    console.log("et supprime-le une fois l'email de lancement parti.\n");
  }
} catch (error) {
  console.error("\nL'export a echoue :", error.message, "\n");
  process.exitCode = 1;
} finally {
  await sql.end();
}
