import { db } from "@/lib/db";
import { brands, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [brand] = await db.select().from(brands).where(eq(brands.slug, slug));
  if (!brand) return { title: "Brand not found" };
  return { title: brand.name, description: brand.tagline ?? brand.description ?? undefined };
}

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
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Brand</span>
      <h1 className="font-display text-5xl italic mt-4 text-[var(--ink)]">{brand.name}</h1>
      {brand.tagline && <p className="text-lg text-[var(--muted)] mt-3 max-w-xl">{brand.tagline}</p>}
      {brand.description && (
        <p className="text-[var(--muted)] mt-4 max-w-2xl leading-relaxed">{brand.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-5">
        {brand.originCountry && <Badge tone="neutral">Origin: {brand.originCountry}</Badge>}
        {brand.crueltyFree && <Badge tone="gold">Cruelty-free</Badge>}
        {brand.vegan && <Badge tone="gold">Vegan</Badge>}
      </div>

      <h2 className="font-display text-2xl italic mt-16 mb-6 text-[var(--ink)]">
        Products from {brand.name}
      </h2>
      {brandProducts.length === 0 ? (
        <EmptyState title="No products listed yet" body="Check back soon — this brand's catalogue is still being built." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brandProducts.map((p) => (
            <ProductCard key={p.id} product={{ ...p, brandName: brand.name }} />
          ))}
        </div>
      )}
    </div>
  );
}
