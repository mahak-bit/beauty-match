import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Sun, Moon } from "lucide-react";
import type { Metadata } from "next";
import { parseProduct, formatPrice } from "@/lib/db/parse";
import { findIngredientByName } from "@/lib/data/ingredients";
import { productTypeLabel } from "@/lib/data/categories";
import { Badge, SkinTypeBadge, ConcernBadge } from "@/components/Badge";
import ProductActions from "@/components/ProductActions";
import ProductMatchScore from "@/components/ProductMatchScore";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";

export const dynamic = "force-dynamic";

async function getProduct(id: string) {
  const rows = await db
    .select({
      product: products,
      brandName: brands.name,
      brandSlug: brands.slug,
      brandSegment: brands.segment,
      brandId: brands.id,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.id, id));
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const row = await getProduct(id);
  if (!row) return { title: "Product not found" };
  const title = `${row.product.name} by ${row.brandName}`;
  return {
    title,
    description: row.product.shortDescription ?? `${row.product.name} — details, ingredients, and Beauty Match score.`,
    openGraph: { title, description: row.product.shortDescription ?? undefined },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getProduct(id);
  if (!row) notFound();

  const product = parseProduct({ ...row.product, brandName: row.brandName, brandSlug: row.brandSlug });

  const liveRows = await db
    .select({ product: products, brandName: brands.name, brandSlug: brands.slug })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.status, "live"));

  const liveProducts = liveRows.map((r) => parseProduct({ ...r.product, brandName: r.brandName, brandSlug: r.brandSlug }));

  const similar = liveProducts
    .filter((p) => p.id !== product.id && p.productType === product.productType)
    .slice(0, 4);

  const alternatives = liveProducts
    .filter((p) => p.id !== product.id && p.productType === product.productType && p.price != null && product.price != null)
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

  const cheaper = alternatives.filter((p) => (p.price ?? 0) < (product.price ?? 0)).slice(-2);
  const premium = alternatives.filter((p) => (p.price ?? 0) > (product.price ?? 0)).slice(0, 2);

  const moreFromBrand = liveProducts
    .filter((p) => p.id !== product.id && p.brandSlug === product.brandSlug)
    .slice(0, 4);

  const resolvedIngredients = product.keyIngredients.map((name) => ({ name, data: findIngredientByName(name) }));
  const price = formatPrice(product.price, product.currency);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <RecentlyViewedTracker productId={product.id} />

      <nav className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-8" aria-label="Breadcrumb">
        <Link href="/discover" className="hover:text-[var(--ink)]">Discover</Link>
        <span className="mx-2">/</span>
        <Link href={`/brands/${product.brandSlug}`} className="hover:text-[var(--gold-deep)]">{product.brandName}</Link>
      </nav>

      <div className="grid md:grid-cols-[340px_1fr] gap-12">
        <div>
          <ProductImage
            src={product.imageUrl}
            alt={`${product.brandName} ${product.name}`}
            className="relative aspect-[3/4] w-full max-w-[260px] mx-auto md:mx-0 rounded-2xl"
            sizes="260px"
          />
          {product.dataSource === "seed" && (
            <p className="sample-data-note mt-4 text-center md:text-left">Sample catalogue data for development</p>
          )}
        </div>

        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--ink)]">{product.name}</h1>
          <p className="text-[var(--muted)] mt-2">
            {productTypeLabel(product.productType) ?? product.subcategory ?? product.category} · {product.brandName}
          </p>

          <div className="flex items-center gap-4 mt-5">
            {price && <span className="font-mono text-2xl text-[var(--gold-deep)]">{price}</span>}
            {product.spf != null && <Badge tone="gold">SPF {product.spf}</Badge>}
          </div>

          <div className="mt-6">
            <ProductMatchScore product={product} brandSegment={row.brandSegment} />
          </div>

          <div className="mt-8">
            <ProductActions productId={product.id} morningUse={product.morningUse} nightUse={product.nightUse} />
          </div>

          {product.shortDescription && (
            <p className="text-lg text-[var(--ink-soft)] mt-8 max-w-xl leading-relaxed">{product.shortDescription}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            {product.skinTypes.map((t) => <SkinTypeBadge key={t} type={t} />)}
            {product.concerns.map((c) => <ConcernBadge key={c} concern={c} />)}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-16">
        <div>
          <Section title="What it does">
            <p className="text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">
              {product.fullDescription || "Full description coming soon."}
            </p>
          </Section>

          {product.howToUse && (
            <Section title="How to use">
              <p className="text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">{product.howToUse}</p>
            </Section>
          )}

          <Section title="When to use">
            <div className="flex gap-3">
              {product.morningUse !== false && (
                <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)]"><Sun size={14} /> Morning</span>
              )}
              {product.nightUse !== false && (
                <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)]"><Moon size={14} /> Night</span>
              )}
              {product.morningUse === false && product.nightUse === false && (
                <span className="text-sm text-[var(--muted)]">Not specified</span>
              )}
            </div>
            {product.usageFrequency && (
              <p className="text-sm text-[var(--muted)] mt-2">Frequency: {product.usageFrequency}</p>
            )}
          </Section>
        </div>

        <div className="space-y-10">
          {resolvedIngredients.length > 0 && (
            <Section title="Key ingredients">
              <div className="flex flex-wrap gap-2">
                {resolvedIngredients.map(({ name, data }) => (
                  <Link
                    key={name}
                    href={data ? `/ingredients/${data.slug}` : "/ingredients"}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--hairline)] text-[var(--gold-deep)] hover:border-[var(--gold)] transition-colors"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {(product.texture || product.finish || product.fragrance) && (
            <Section title="Texture & finish">
              <ul className="text-sm text-[var(--ink-soft)] space-y-1.5">
                {product.texture && <li><span className="text-[var(--muted)]">Texture —</span> {product.texture}</li>}
                {product.finish && <li><span className="text-[var(--muted)]">Finish —</span> {product.finish}</li>}
                {product.fragrance && <li><span className="text-[var(--muted)]">Fragrance —</span> {product.fragrance}</li>}
              </ul>
            </Section>
          )}

          {product.ingredientsRaw && (
            <Section title="Full ingredient list">
              <p className="text-xs text-[var(--muted)] leading-relaxed">{product.ingredientsRaw}</p>
            </Section>
          )}

          {product.cautions && (
            <div className="flex gap-3 rounded-xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] p-4">
              <AlertTriangle size={18} className="text-[var(--warn)] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--warn)] mb-1">Worth knowing</p>
                <p className="text-sm text-[var(--ink-soft)]">{product.cautions}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {(cheaper.length > 0 || premium.length > 0) && (
        <Section title="Alternatives">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cheaper.map((p) => (
              <div key={p.id}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold-deep)] mb-2">Cheaper pick</p>
                <ProductCard product={p} />
              </div>
            ))}
            {premium.map((p) => (
              <div key={p.id}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold-deep)] mb-2">Premium pick</p>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {similar.length > 0 && (
        <Section title="Similar products">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {moreFromBrand.length > 0 && (
        <Section title={`More from ${product.brandName}`}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moreFromBrand.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--gold-deep)] mb-4">{title}</h2>
      {children}
    </div>
  );
}
