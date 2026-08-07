import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.id, id));

  if (rows.length === 0) notFound();
  const { products: product, brands: brand } = rows[0];

  const keyIngredients: string[] = product.keyIngredients
    ? JSON.parse(product.keyIngredients)
    : [];
  const skinTypes: string[] = product.skinTypes ? JSON.parse(product.skinTypes) : [];
  const hairTypes: string[] = product.hairTypes ? JSON.parse(product.hairTypes) : [];
  const concerns: string[] = product.concerns ? JSON.parse(product.concerns) : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href={`/brands/${brand.slug}`}
        className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--violet)]"
      >
        {brand.name}
      </Link>
      <h1 className="font-display text-5xl mt-4">{product.name}</h1>

      <div className="flex items-center gap-4 mt-4">
        {product.price != null && (
          <span className="font-mono text-lg text-[var(--cyan)]">
            {product.currency === "INR" ? "₹" : "$"}
            {product.price}
          </span>
        )}
        <span className="text-sm text-[var(--muted)] capitalize">
          {product.subcategory ?? product.category}
        </span>
      </div>

      {product.shortDescription && (
        <p className="text-lg text-[var(--muted)] mt-6 max-w-2xl">
          {product.shortDescription}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--cyan)] mb-4">
            Full description
          </h2>
          <p className="text-[var(--paper)]/90 leading-relaxed whitespace-pre-line">
            {product.fullDescription || "Description coming soon."}
          </p>

          {product.howToUse && (
            <>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--cyan)] mt-8 mb-4">
                How to use
              </h2>
              <p className="text-[var(--paper)]/90 leading-relaxed whitespace-pre-line">
                {product.howToUse}
              </p>
            </>
          )}
        </div>

        <div className="space-y-8">
          {keyIngredients.length > 0 && (
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--cyan)] mb-3">
                Key ingredients
              </h2>
              <div className="flex flex-wrap gap-2">
                {keyIngredients.map((i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--hairline)] text-[var(--violet)]"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(skinTypes.length > 0 || hairTypes.length > 0) && (
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--cyan)] mb-3">
                Best suited for
              </h2>
              <div className="flex flex-wrap gap-2">
                {[...skinTypes, ...hairTypes].map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--hairline)] capitalize"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {concerns.length > 0 && (
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--cyan)] mb-3">
                Addresses
              </h2>
              <div className="flex flex-wrap gap-2">
                {concerns.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--rose)]/50 text-[var(--rose)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.ingredientsRaw && (
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
                Full ingredient list
              </h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {product.ingredientsRaw}
              </p>
            </div>
          )}

          {product.cautions && (
            <div className="flex gap-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/90">{product.cautions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
