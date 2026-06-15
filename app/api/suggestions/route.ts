import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

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
const MAX_MESSAGE = 2000;

function clean(value: unknown, allowed: Set<string>): string | null {
  return typeof value === "string" && allowed.has(value) ? value : null;
}

/** Stores a free-text idea/suggestion. No-ops gracefully when unconfigured. */
export async function POST(request: Request) {
  try {
    const sql = getSql();
    if (!sql) return new NextResponse(null, { status: 204 });

    const body = (await request.json()) as Record<string, unknown>;

    const message =
      typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";
    if (!message) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const sessionId =
      typeof body.session_id === "string" ? body.session_id.slice(0, 64) : null;
    const level = clean(body.level, LEVELS);
    const mode = clean(body.mode, MODES);

    await sql`
      insert into suggestions (session_id, message, level, mode)
      values (${sessionId}, ${message}, ${level}, ${mode})
    `;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
