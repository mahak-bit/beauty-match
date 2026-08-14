import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { parseProduct } from "@/lib/db/parse";

/**
 * Fetches full, parsed product records for a set of ids — used by the
 * client-side-only pages (Saved, Compare, Routines) that only know which
 * products to show via localStorage ids, not via a server-rendered query.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");
  if (!idsParam) return NextResponse.json({ products: [] });

  const ids = idsParam.split(",").filter(Boolean).slice(0, 50);
  if (ids.length === 0) return NextResponse.json({ products: [] });

  const rows = await db
    .select({ product: products, brandName: brands.name, brandSlug: brands.slug, brandSegment: brands.segment })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(inArray(products.id, ids));

  const list = rows.map((r) =>
    Object.assign(parseProduct({ ...r.product, brandName: r.brandName, brandSlug: r.brandSlug }), {
      brandSegment: r.brandSegment,
    })
  );

  return NextResponse.json({ products: list });
}
