"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useUserProfile } from "@/lib/client-store";
import { scoreProduct } from "@/lib/match/engine";
import type { Product } from "@/lib/types";
import MatchScore from "@/components/MatchScore";

export default function ProductMatchScore({ product, brandSegment }: { product: Product; brandSegment?: string | null }) {
  const { profile, loaded } = useUserProfile();

  if (!loaded) return <div className="h-16" />;

  if (!profile) {
    return (
      <Link
        href="/quiz"
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--hairline)] px-4 py-2.5 text-sm text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--ink)] transition-colors"
      >
        <Sparkles size={14} />
        Take the quiz for your personal match score
      </Link>
    );
  }

  const result = scoreProduct(product, profile, brandSegment);

  return (
    <div className="flex items-start gap-4">
      <MatchScore score={result.score} size={72} />
      <div className="pt-1">
        <p className="text-sm font-medium text-[var(--ink)]">Your Beauty Match</p>
        <ul className="mt-1 space-y-0.5">
          {result.reasons.slice(0, 3).map((r) => (
            <li key={r} className="text-xs text-[var(--muted)]">
              · {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
