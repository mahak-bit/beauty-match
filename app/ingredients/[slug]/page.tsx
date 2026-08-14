import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { INGREDIENT_BY_SLUG, findIngredientByName } from "@/lib/data/ingredients";
import { concernLabel } from "@/lib/data/concerns";
import { parseProduct } from "@/lib/db/parse";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/Badge";
import EmptyState from "@/components/EmptyState";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = INGREDIENT_BY_SLUG.get(slug);
  if (!ingredient) return { title: "Ingredient not found" };
  return { title: ingredient.name, description: ingredient.summary };
}

export default async function IngredientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ingredient = INGREDIENT_BY_SLUG.get(slug);
  if (!ingredient) notFound();

  const rows = await db
    .select({ product: products, brandName: brands.name, brandSlug: brands.slug })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.status, "live"));

  const containing = rows
    .map((r) => parseProduct({ ...r.product, brandName: r.brandName, brandSlug: r.brandSlug }))
    .filter((p) => p.keyIngredients.some((name) => findIngredientByName(name)?.slug === ingredient.slug));

  const related = (ingredient.relatedIngredients ?? [])
    .map((s) => INGREDIENT_BY_SLUG.get(s))
    .filter((i): i is NonNullable<typeof i> => !!i);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <Link href="/ingredients" className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--ink)]">
        ← Ingredient explorer
      </Link>
      <h1 className="font-display text-4xl sm:text-5xl italic mt-4 text-[var(--ink)]">{ingredient.name}</h1>
      {ingredient.aliases && (
        <p className="text-sm text-[var(--muted)] mt-2">Also known as {ingredient.aliases.join(", ")}</p>
      )}
      <p className="text-lg text-[var(--ink-soft)] mt-6 max-w-2xl leading-relaxed">{ingredient.summary}</p>

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--gold-deep)] mb-4">Commonly used for</h2>
          <div className="flex flex-wrap gap-2">
            {ingredient.commonlyUsedFor.map((c) => <Badge key={c} tone="blush">{concernLabel(c)}</Badge>)}
          </div>

          {ingredient.suitableSkinTypes.length > 0 && (
            <>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--gold-deep)] mb-4 mt-8">Suitable skin types</h2>
              <div className="flex flex-wrap gap-2">
                {ingredient.suitableSkinTypes.map((t) => <Badge key={t} tone="gold">{t}</Badge>)}
              </div>
            </>
          )}

          {ingredient.cautionNote && (
            <div className="mt-8 rounded-xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--warn)] mb-1">Worth knowing</p>
              <p className="text-sm text-[var(--ink-soft)]">{ingredient.cautionNote}</p>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--gold-deep)] mb-4">Related ingredients</h2>
            <div className="flex flex-col gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/ingredients/${r.slug}`}
                  className="rounded-xl border border-[var(--hairline)] px-4 py-3 hover:border-[var(--gold)] transition-colors"
                >
                  <span className="font-medium text-[var(--ink)]">{r.name}</span>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1">{r.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <h2 className="font-display text-2xl italic mt-16 mb-6 text-[var(--ink)]">
        Products containing {ingredient.name}
      </h2>
      {containing.length === 0 ? (
        <EmptyState
          title="None in the catalogue yet"
          body="This ingredient isn't tagged on any live product right now — check back as the catalogue grows."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {containing.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
