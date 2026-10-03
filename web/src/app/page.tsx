import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(11,18,32,0.88), rgba(11,18,32,0.55)), url('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[var(--amber)]/30 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[var(--mint)]/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 text-white">
        <header className="flex items-center justify-between animate-rise">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--amber)] text-[var(--ink)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
              Tubelens
            </span>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/20"
          >
            Open app
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center pb-16 pt-20">
          <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl animate-rise">
            Tubelens
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80 md:text-xl animate-rise-delay">
            YouTube growth intelligence with Max-parity tools — keyword demand, competitor gaps, AI
            coaching, and packaging systems in one lens.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise-delay-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--amber)] px-5 py-3 font-semibold text-[var(--ink)] transition hover:bg-[var(--amber-2)]"
            >
              Enter Max workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/coach"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Talk to AI Coach
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
