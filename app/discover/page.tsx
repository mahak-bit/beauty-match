"use client";

import { useEffect, useState, useCallback } from "react";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

const CATEGORIES = ["all", "skincare", "haircare"] as const;
const SKIN_TYPES = ["oily", "dry", "combination", "sensitive", "normal"];
const HAIR_TYPES = ["straight", "wavy", "curly", "coily"];

export default function DiscoverPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const [skinType, setSkinType] = useState<string | null>(null);
  const [hairType, setHairType] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (skinType) params.set("skinType", skinType);
    if (hairType) params.set("hairType", hairType);
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, [category, skinType, hairType]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">
        Browse
      </span>
      <h1 className="font-display text-4xl mt-4 mb-10">Discover, filtered your way</h1>

      <div className="flex flex-wrap gap-8 mb-12">
        <FilterGroup label="Category">
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </FilterGroup>

        {category !== "haircare" && (
          <FilterGroup label="Skin type">
            {SKIN_TYPES.map((t) => (
              <Chip
                key={t}
                active={skinType === t}
                onClick={() => setSkinType(skinType === t ? null : t)}
              >
                {t}
              </Chip>
            ))}
          </FilterGroup>
        )}

        {category !== "skincare" && (
          <FilterGroup label="Hair type">
            {HAIR_TYPES.map((t) => (
              <Chip
                key={t}
                active={hairType === t}
                onClick={() => setHairType(hairType === t ? null : t)}
              >
                {t}
              </Chip>
            ))}
          </FilterGroup>
        )}
      </div>

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading matches…</p>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-[var(--hairline)] p-12 text-center text-[var(--muted)]">
          <p>No products match yet — this catalog grows as brands are added.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-2">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
        active
          ? "bg-[var(--violet)] border-[var(--violet)] text-[var(--ink)]"
          : "border-[var(--hairline)] text-[var(--muted)] hover:border-[var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}
