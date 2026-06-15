/**
 * Server-only Neon Postgres client.
 *
 * Used by the `/api/*` routes to persist first-party usage signals. The
 * connection string lives in `DATABASE_URL` and must never reach the browser.
 *
 * When `DATABASE_URL` is unset (e.g. local dev without a database, or a
 * preview deploy), `getSql()` returns `null` so callers can no-op gracefully
 * instead of throwing.
 */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null | undefined;

export function getSql(): NeonQueryFunction<false, false> | null {
  if (cached !== undefined) return cached;
  const url = process.env.DATABASE_URL;
  cached = url ? neon(url) : null;
  return cached;
}
