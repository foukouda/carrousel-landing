import { isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness, for the container healthcheck and for any uptime monitor.
 *
 * Deliberately does not query the database. A healthcheck that fails when
 * Postgres is briefly unreachable would have the orchestrator restart a
 * perfectly good web server, which fixes nothing and takes the site down while
 * it happens. The database state is reported, not enforced.
 */
export async function GET() {
  return Response.json({
    ok: true,
    database: isDatabaseConfigured ? "configured" : "missing",
    at: new Date().toISOString(),
  });
}
