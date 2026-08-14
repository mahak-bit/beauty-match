"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCompareList } from "@/lib/client-store";
import { useProductsByIds } from "@/lib/hooks/useProductsByIds";
import { formatPrice } from "@/lib/db/parse";
import type { Product } from "@/lib/types";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/Badge";
import ProductImage from "@/components/ProductImage";

export default function CompareClient() {
  const { compareIds, remove, clear } = useCompareList();
  const { products: items, loading } = useProductsByIds(compareIds);

  const cheapest = items.reduce<Product | null>((min, p) => {
    if (p.price == null) return min;
    if (!min || min.price == null || p.price < min.price) return p;
    return min;
  }, null);

  const rows: Array<{ label: string; render: (p: Product) => React.ReactNode }> = [
    { label: "Brand", render: (p) => p.brandName },
    { label: "Price", render: (p) => formatPrice(p.price, p.currency) ?? "—" },
    { label: "Category", render: (p) => p.productType ?? p.subcategory ?? p.category },
    { label: "Skin types", render: (p) => (p.skinTypes.length ? p.skinTypes.join(", ") : "Not specified") },
    { label: "Concerns", render: (p) => (p.concerns.length ? p.concerns.join(", ") : "—") },
    { label: "Key ingredients", render: (p) => (p.keyIngredients.length ? p.keyIngredients.join(", ") : "—") },
    { label: "Texture", render: (p) => p.texture ?? "—" },
    { label: "Fragrance", render: (p) => (p.fragranceFree === true ? "Fragrance-free" : p.fragrance ?? "Not specified") },
    { label: "SPF", render: (p) => (p.spf != null ? `SPF ${p.spf}` : "—") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Compare</span>
          <h1 className="font-display text-4xl sm:text-5xl italic mt-3 text-[var(--ink)]">Side by side</h1>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] hover:text-[var(--warn)]">
            Clear all
          </button>
        )}
      </div>
      <p className="text-[var(--muted)] max-w-xl mb-12">
        Add up to four products from any product card. We&apos;ll highlight the
        lowest price — that&apos;s not the same as the best fit for your skin.
      </p>

      {loading ? (
        <p className="text-sm text-[var(--muted)] font-mono">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing to compare yet"
          body="Tap the scale icon on any product card to add it here — compare up to four at once."
          action={<Link href="/discover" className="px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-sm">Browse products</Link>}
        />
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left w-40" />
                {items.map((p) => (
                  <th key={p.id} className="text-left align-top pb-6 pr-6 min-w-[200px]">
                    <div className="relative">
                      <button
                        onClick={() => remove(p.id)}
                        aria-label={`Remove ${p.name} from compare`}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--warn)]"
                      >
                        <X size={12} />
                      </button>
                      <ProductImage
                        src={p.imageUrl}
                        alt={`${p.brandName} ${p.name}`}
                        className="relative w-16 h-20 mb-3 rounded-lg"
                        sizes="64px"
                      />
                      <Link href={`/products/${p.id}`} className="font-display italic text-lg text-[var(--ink)] hover:text-[var(--gold-deep)]">
                        {p.name}
                      </Link>
                      {p.id === cheapest?.id && <div className="mt-1"><Badge tone="gold">Lowest price</Badge></div>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-[var(--hairline)]">
                  <td className="py-4 pr-6 text-xs font-mono uppercase tracking-widest text-[var(--muted)] align-top whitespace-nowrap">
                    {row.label}
                  </td>
                  {items.map((p) => (
                    <td key={p.id} className="py-4 pr-6 text-sm text-[var(--ink-soft)] align-top capitalize">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
