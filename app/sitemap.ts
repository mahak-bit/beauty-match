import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { INGREDIENTS } from "@/lib/data/ingredients";

const BASE = "https://beautymatch.app";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: "weekly", priority: 1 },
  { url: `${BASE}/discover`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/quiz`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/brands`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/ingredients`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/routines`, changeFrequency: "monthly", priority: 0.5 },
  ...INGREDIENTS.map((i) => ({ url: `${BASE}/ingredients/${i.slug}`, changeFrequency: "monthly" as const, priority: 0.4 })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Falls back to the static routes if the database isn't reachable at
  // build time (e.g. a fresh environment before `db:push`/`db:seed`) —
  // a missing product catalogue shouldn't fail the whole production build.
  try {
    const [productRows, brandRows] = await Promise.all([
      db.select({ id: products.id }).from(products).where(eq(products.status, "live")),
      db.select({ slug: brands.slug }).from(brands).where(eq(brands.status, "live")),
    ]);

    return [
      ...STATIC_ROUTES,
      ...productRows.map((p) => ({ url: `${BASE}/products/${p.id}`, changeFrequency: "weekly" as const, priority: 0.6 })),
      ...brandRows.map((b) => ({ url: `${BASE}/brands/${b.slug}`, changeFrequency: "weekly" as const, priority: 0.5 })),
    ];
  } catch {
    return STATIC_ROUTES;
  }
}
