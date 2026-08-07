import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const skinType = searchParams.get("skinType");
  const hairType = searchParams.get("hairType");
  const concern = searchParams.get("concern");
  const brandSlug = searchParams.get("brand");

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      category: products.category,
      subcategory: products.subcategory,
      price: products.price,
      currency: products.currency,
      imageUrl: products.imageUrl,
      shortDescription: products.shortDescription,
      keyIngredients: products.keyIngredients,
      skinTypes: products.skinTypes,
      hairTypes: products.hairTypes,
      concerns: products.concerns,
      status: products.status,
      brandName: brands.name,
      brandSlug: brands.slug,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.status, "live"));

  const filtered = rows.filter((p) => {
    if (category && category !== "all" && p.category !== category && p.category !== "both") return false;
    if (skinType && !(p.skinTypes ?? "").includes(skinType)) return false;
    if (hairType && !(p.hairTypes ?? "").includes(hairType)) return false;
    if (concern && !(p.concerns ?? "").toLowerCase().includes(concern.toLowerCase())) return false;
    if (brandSlug && p.brandSlug !== brandSlug) return false;
    return true;
  });

  return NextResponse.json({ products: filtered });
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
    status: body.status ?? "live",
  });

  return NextResponse.json({ id }, { status: 201 });
}
