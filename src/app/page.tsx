import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-moss text-cream">
      {/* Radial glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #C4963A2E 0%, transparent 65%)",
        }}
      />

      <main className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="font-display text-6xl font-normal tracking-tight md:text-8xl">
          Machi<em className="italic text-gold">kado</em>
        </h1>
        <p className="text-lg text-cream/70">
          街角 — Beautiful travel guide pages, built from your phone.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/g/portland-2026"
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
          >
            View Sample Guide
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-cream/30 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream/10"
          >
            Get Started
          </Link>
        </div>

        <p className="mt-8 text-xs text-cream/40">
          Create guides like the Portland Guide — with sections, spots, events, routes, and schedules.
        </p>
      </main>
    </div>
  );
}
