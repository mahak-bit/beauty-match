import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { PRODUCT_CATEGORY_GROUPS } from "@/lib/data/categories";
import { parseProduct } from "@/lib/db/parse";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const category = searchParams.get("category");
  const group = searchParams.get("group");
  const productType = searchParams.get("productType");
  const skinType = searchParams.get("skinType");
  const hairType = searchParams.get("hairType");
  const concern = searchParams.get("concern");
  const brandSlug = searchParams.get("brand");
  const priceMax = searchParams.get("priceMax");
  const fragranceFree = searchParams.get("fragranceFree");
  const spfOnly = searchParams.get("spfOnly");
  const sensitiveSkinFriendly = searchParams.get("sensitiveSkinFriendly");
  const sort = searchParams.get("sort") ?? "relevance";

  const rows = await db
    .select({ product: products, brandName: brands.name, brandSlug: brands.slug, brandSegment: brands.segment })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.status, "live"));

  const groupTypes = group ? PRODUCT_CATEGORY_GROUPS.find((g) => g.group === group)?.types.map((t) => t.slug) : null;

  const parsed = rows.map((r) =>
    Object.assign(parseProduct({ ...r.product, brandName: r.brandName, brandSlug: r.brandSlug }), {
      brandSegment: r.brandSegment,
    })
  );

  const filtered = parsed.filter((p) => {
    if (category && category !== "all" && p.category !== category && p.category !== "both") return false;
    if (productType && p.productType !== productType) return false;
    if (groupTypes && !groupTypes.includes(p.productType ?? "")) return false;
    if (skinType && !p.skinTypes.includes(skinType)) return false;
    if (hairType && !p.hairTypes.includes(hairType)) return false;
    if (concern && !p.concerns.map((c) => c.toLowerCase()).includes(concern.toLowerCase())) return false;
    if (brandSlug && p.brandSlug !== brandSlug) return false;
    if (priceMax && p.price != null && p.price > Number(priceMax)) return false;
    if (fragranceFree === "true" && p.fragranceFree !== true) return false;
    if (sensitiveSkinFriendly === "true" && p.sensitiveSkinFriendly !== true) return false;
    if (spfOnly === "true" && !p.spf) return false;

    if (q) {
      const haystack = [
        p.name,
        p.brandName,
        p.category,
        p.productType,
        p.subcategory,
        p.shortDescription,
        p.keyIngredients.join(" "),
        p.concerns.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      // Every whitespace-separated token in the query must appear somewhere
      // in the product's searchable text — this is what lets a query like
      // "niacinamide oily skin" match a niacinamide serum tagged for oily skin.
      const tokens = q.split(/\s+/).filter(Boolean);
      if (!tokens.every((t) => haystack.includes(t))) return false;
    }

    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "price-asc") return (a.price ?? Infinity) - (b.price ?? Infinity);
    if (sort === "price-desc") return (b.price ?? -Infinity) - (a.price ?? -Infinity);
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return NextResponse.json({ products: filtered, count: filtered.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const required = ["brandId", "name", "slug", "category"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const id = randomUUID();

  await db.insert(products).values({
    id,
    brandId: body.brandId,
    name: body.name,
    slug: body.slug,
    category: body.category,
    subcategory: body.subcategory ?? null,
    productType: body.productType ?? body.subcategory ?? null,
    price: body.price ?? null,
    currency: body.currency ?? "INR",
    imageUrl: body.imageUrl ?? null,
    shortDescription: body.shortDescription ?? null,
    fullDescription: body.fullDescription ?? null,
    howToUse: body.howToUse ?? null,
    ingredientsRaw: body.ingredientsRaw ?? null,
    keyIngredients: JSON.stringify(body.keyIngredients ?? []),
    skinTypes: JSON.stringify(body.skinTypes ?? []),
    hairTypes: JSON.stringify(body.hairTypes ?? []),
    concerns: JSON.stringify(body.concerns ?? []),
    cautions: body.cautions ?? null,
    texture: body.texture ?? null,
    fragranceFree: body.fragranceFree ?? null,
    sensitiveSkinFriendly: body.sensitiveSkinFriendly ?? null,
    spf: body.spf ?? null,
    dataSource: "admin",
    status: body.status ?? "live",
  });

  return NextResponse.json({ id }, { status: 201 });
}
