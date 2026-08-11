"use client";

import Link from "next/link";
import { Heart, Clock, ListChecks } from "lucide-react";
import { useSavedProducts, useRecentlyViewed, useRoutines } from "@/lib/client-store";
import { useProductsByIds } from "@/lib/hooks/useProductsByIds";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function SavedClient() {
  const { savedIds } = useSavedProducts();
  const { recentIds } = useRecentlyViewed();
  const { routines, remove } = useRoutines();
  const saved = useProductsByIds(savedIds);
  const recent = useProductsByIds(recentIds);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Your space</span>
      <h1 className="font-display text-4xl sm:text-5xl italic mt-3 mb-12 text-[var(--ink)]">My Beauty Shelf</h1>

      <section className="mb-16">
        <h2 className="flex items-center gap-2 font-medium text-[var(--ink)] mb-6">
          <Heart size={16} className="text-[var(--gold-deep)]" /> Saved products
        </h2>
        {saved.loading ? (
          <ProductGridSkeleton count={3} />
        ) : saved.products.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            body="Tap the heart on any product to add it to your shelf."
            action={<Link href="/discover" className="px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-sm">Browse products</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {saved.products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="mb-16">
        <h2 className="flex items-center gap-2 font-medium text-[var(--ink)] mb-6">
          <ListChecks size={16} className="text-[var(--gold-deep)]" /> Saved routines
        </h2>
        {routines.length === 0 ? (
          <EmptyState
            title="No saved routines"
            body="Build an AM/PM routine on any product page, then save it from the Routines tab."
            action={<Link href="/routines" className="px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-sm">Go to Routines</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {routines.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-display italic text-xl text-[var(--ink)]">{r.name}</h3>
                  <button onClick={() => remove(r.id)} className="text-xs text-[var(--muted)] hover:text-[var(--warn)]">
                    Remove
                  </button>
                </div>
                <p className="text-sm text-[var(--muted)] mt-2">
                  {r.am.length} AM step{r.am.length === 1 ? "" : "s"} · {r.pm.length} PM step{r.pm.length === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="flex items-center gap-2 font-medium text-[var(--ink)] mb-6">
          <Clock size={16} className="text-[var(--gold-deep)]" /> Recently viewed
        </h2>
        {recent.loading ? (
          <ProductGridSkeleton count={4} />
        ) : recent.products.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Products you view will show up here.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
