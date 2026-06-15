import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad — Cartita",
  description:
    "Cómo Cartita cuida tu privacidad: sin cuentas, sin nombres ni correos, solo estadísticas básicas de uso.",
};

export default function PrivacidadPage() {
  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-10">
      <header className="flex items-center justify-between pt-2">
        <Link
          href="/"
          className="flex h-10 items-center gap-2 rounded-full border border-line bg-paper/70 pl-2 pr-3 text-ink/80 transition-colors hover:bg-paper active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="font-serif text-base font-semibold">Volver</span>
        </Link>
      </header>

      <main className="mt-6 animate-fade-up">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
          Privacidad
        </h1>
        <p className="mt-2 font-serif text-lg italic text-muted">
          Sencillo y respetuoso con tus datos.
        </p>

        <div className="mt-7 space-y-4 text-[0.975rem] leading-relaxed text-ink">
          <p>
            Cartita es una app para hablar en español. La hicimos para que sea
            simple y tranquila, también con tu privacidad.
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span aria-hidden="true">🔓</span>
              <span>Cartita no necesita ninguna cuenta para usarse.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true">🙈</span>
              <span>No te pedimos tu nombre ni tu correo.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true">📊</span>
              <span>
                Usamos estadísticas básicas para entender cómo se usa la app.
                Esto puede incluir el modo y el nivel elegidos, los
                identificadores de las cartas y eventos generales de uso.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true">💬</span>
              <span>
                No guardamos lo que dices en tus conversaciones. Las cartas son
                solo una guía para hablar.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true">🎙️</span>
              <span>Cartita no graba audio.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true">🤝</span>
              <span>No vendemos datos personales.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true">📝</span>
              <span>
                Si compartes una idea a través de un formulario externo, ese
                formulario puede recibir lo que tú decidas enviar.
              </span>
            </li>
          </ul>

          <p className="text-sm text-muted">
            Mantenemos esto corto a propósito. Si cambia algo importante, lo
            reflejaremos aquí.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-terracotta px-6 py-3 font-serif text-base font-semibold text-paper shadow-card transition-all active:scale-[0.99]"
        >
          Volver a Cartita
        </Link>
      </main>
    </div>
  );
}
