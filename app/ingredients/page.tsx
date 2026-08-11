import Link from "next/link";
import type { Metadata } from "next";
import { INGREDIENTS } from "@/lib/data/ingredients";

export const metadata: Metadata = {
  title: "Ingredient Explorer",
  description: "Educational, plain-language guides to the skincare ingredients behind every Beauty Match product.",
};

const ROLE_LABELS: Record<string, string> = {
  hydrator: "Hydrating",
  exfoliant: "Exfoliating",
  brightening: "Brightening",
  "barrier-support": "Barrier support",
  soothing: "Soothing",
  "oil-control": "Oil control",
  "anti-aging": "Anti-aging",
  "sun-protection": "Sun protection",
};

export default function IngredientsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Ingredient explorer</span>
      <h1 className="font-display text-4xl sm:text-5xl italic mt-3 mb-4 text-[var(--ink)]">
        What&apos;s actually in your skincare
      </h1>
      <p className="text-[var(--muted)] max-w-2xl leading-relaxed mb-12">
        Plain-language, educational notes on common skincare ingredients —
        what they&apos;re commonly used for, who tends to reach for them, and
        which Beauty Match products contain them. This is general education,
        not medical advice.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INGREDIENTS.map((ing) => (
          <Link
            key={ing.slug}
            href={`/ingredients/${ing.slug}`}
            className="group rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-6 hover:border-[var(--gold)] transition-colors"
          >
            <h2 className="font-display italic text-xl text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors">
              {ing.name}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed line-clamp-2">{ing.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {ing.role.slice(0, 2).map((r) => (
                <span key={r} className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full border border-[var(--hairline)] text-[var(--gold-deep)]">
                  {ROLE_LABELS[r] ?? r}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
