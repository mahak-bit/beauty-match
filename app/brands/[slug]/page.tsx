import { db } from "@/lib/db";
import { brands, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [brand] = await db.select().from(brands).where(eq(brands.slug, slug));
  if (!brand) notFound();

  const brandProducts = await db
    .select()
    .from(products)
    .where(eq(products.brandId, brand.id));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">
        Brand
      </span>
      <h1 className="font-display text-5xl italic mt-4">{brand.name}</h1>
      {brand.tagline && (
        <p className="text-lg text-[var(--muted)] mt-3 max-w-xl">{brand.tagline}</p>
      )}
      {brand.description && (
        <p className="text-[var(--muted)] mt-4 max-w-2xl leading-relaxed">
          {brand.description}
        </p>
      )}

      <h2 className="font-display text-2xl italic mt-16 mb-6">
        Products from {brand.name}
      </h2>
      {brandProducts.length === 0 ? (
        <p className="text-[var(--muted)]">No products listed yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brandProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, brandName: brand.name }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
