import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

// Whitelists — anything outside these is rejected or coerced to null so the
// table only ever holds known, low-cardinality values.
const TYPES = new Set(["session_started", "card_viewed", "feedback_response"]);
const LEVELS = new Set(["principiante", "intermedio", "avanzado"]);
const MODES = new Set([
  "mezcla",
  "rompehielos",
  "amigos",
  "conocerse",
  "cita",
  "mas-profundo",
  "debate",
  "practica",
]);
const RESPONSES = new Set(["yes", "okay", "idea", "dismissed"]);

function clean(value: unknown, allowed: Set<string>): string | null {
  return typeof value === "string" && allowed.has(value) ? value : null;
}

/** Records one usage event. Never throws to the client; no-ops if unconfigured. */
export async function POST(request: Request) {
  try {
    const sql = getSql();
    if (!sql) return new NextResponse(null, { status: 204 });

    const body = (await request.json()) as Record<string, unknown>;

    const sessionId =
      typeof body.session_id === "string" ? body.session_id.slice(0, 64) : "";
    const type = typeof body.type === "string" ? body.type : "";
    if (!sessionId || !TYPES.has(type)) {
      return new NextResponse(null, { status: 204 });
    }

    const level = clean(body.level, LEVELS);
    const mode = clean(body.mode, MODES);
    const cardId =
      typeof body.card_id === "string" ? body.card_id.slice(0, 64) : null;
    const intensity =
      typeof body.intensity === "number" && Number.isInteger(body.intensity)
        ? body.intensity
        : null;
    const response = clean(body.response, RESPONSES);

    await sql`
      insert into events (session_id, type, level, mode, card_id, intensity, response)
      values (${sessionId}, ${type}, ${level}, ${mode}, ${cardId}, ${intensity}, ${response})
    `;
  } catch {
    // Telemetry must never surface an error to the client.
  }
  return new NextResponse(null, { status: 204 });
}
