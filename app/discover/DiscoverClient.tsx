"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard, { ProductCardData } from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel, { DEFAULT_FILTERS, DiscoverFilters, activeFilterCount } from "@/components/FilterPanel";
import { PRODUCT_CATEGORY_GROUPS } from "@/lib/data/categories";
import EmptyState from "@/components/EmptyState";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";

function DiscoverContent() {
  const params = useSearchParams();
  const initialGroup = params.get("group");

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [group, setGroup] = useState<string | null>(initialGroup);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc" | "name">("relevance");
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (filters.category !== "all") sp.set("category", filters.category);
    if (filters.skinType) sp.set("skinType", filters.skinType);
    if (filters.hairType) sp.set("hairType", filters.hairType);
    if (filters.concern) sp.set("concern", filters.concern);
    if (filters.priceMax) sp.set("priceMax", String(filters.priceMax));
    if (filters.fragranceFree) sp.set("fragranceFree", "true");
    if (filters.sensitiveSkinFriendly) sp.set("sensitiveSkinFriendly", "true");
    if (filters.spfOnly) sp.set("spfOnly", "true");
    if (group) sp.set("group", group);
    if (sort !== "relevance") sp.set("sort", sort);

    const res = await fetch(`/api/products?${sp.toString()}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, [query, filters, group, sort]);

  useEffect(() => {
    // Re-fetches whenever query/filters/group/sort change — the resulting
    // setState calls are the intended "load results for the new query" effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const count = activeFilterCount(filters) + (group ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Discover</span>
      <h1 className="font-display text-4xl sm:text-5xl italic mt-3 mb-8 text-[var(--ink)]">Find what your skin needs</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort products"
            className="bg-[var(--surface)] border border-[var(--hairline)] rounded-full px-4 py-3.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3.5 rounded-full border border-[var(--hairline)] text-sm text-[var(--ink)]"
          >
            <SlidersHorizontal size={15} />
            Filters {count > 0 && `(${count})`}
          </button>
        </div>
      </div>

      {group && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-soft)] flex items-center gap-2">
            {group}
            <button onClick={() => setGroup(null)} aria-label="Remove category filter">
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <p className="text-sm text-[var(--muted)] mb-6 font-mono">
            {loading ? "Searching…" : `${products.length} product${products.length === 1 ? "" : "s"}`}
          </p>

          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <EmptyState
              title="We couldn't find your perfect match yet"
              body="Try loosening a filter — your budget, a skin concern, or the product category — or search a broader term."
              action={
                (query || count > 0) && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setFilters(DEFAULT_FILTERS);
                      setGroup(null);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-sm"
                  >
                    Clear search &amp; filters
                  </button>
                )
              }
            />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-[var(--panel)]/50" onClick={() => setMobileFiltersOpen(false)} />
          <div role="dialog" aria-modal="true" aria-label="Filters" className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[var(--bg)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display italic text-xl">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={setFilters} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-8 py-3.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-sm"
            >
              Show {products.length} results
            </button>
          </div>
        </div>
      )}

      <div className="sr-only" aria-hidden>
        {PRODUCT_CATEGORY_GROUPS.map((g) => g.group).join(", ")}
      </div>
    </div>
  );
}

export default function DiscoverClient() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-16"><ProductGridSkeleton /></div>}>
      <DiscoverContent />
    </Suspense>
  );
}
