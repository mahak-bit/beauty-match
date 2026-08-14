import type { Product } from "@/lib/types";
import type { products } from "@/lib/db/schema";

type ProductRow = typeof products.$inferSelect & { brandName?: string; brandSlug?: string };

function parseArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseObject(value: string | null | undefined): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Converts a full products row (as returned by
 * `select().from(products).innerJoin(brands, ...)`) plus the joined brand's
 * name/slug into the UI-facing, array-parsed `Product` shape.
 */
export function parseProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandId: row.brandId,
    brandName: row.brandName ?? "",
    brandSlug: row.brandSlug ?? "",
    category: row.category,
    subcategory: row.subcategory,
    productType: row.productType,

    price: row.price,
    currency: row.currency,
    imageUrl: row.imageUrl,
    thumbnailUrl: row.thumbnailUrl,
    productUrl: row.productUrl,

    shortDescription: row.shortDescription,
    fullDescription: row.fullDescription,
    howToUse: row.howToUse,
    ingredientsRaw: row.ingredientsRaw,
    keyIngredients: parseArray(row.keyIngredients),
    ingredientPercentages: parseObject(row.ingredientPercentages),
    benefits: parseArray(row.benefits),

    skinTypes: parseArray(row.skinTypes),
    hairTypes: parseArray(row.hairTypes),
    concerns: parseArray(row.concerns),
    cautions: row.cautions,

    texture: row.texture,
    finish: row.finish,
    fragrance: row.fragrance,
    fragranceFree: row.fragranceFree,
    alcoholFree: row.alcoholFree,
    essentialOilFree: row.essentialOilFree,
    crueltyFree: row.crueltyFree,
    vegan: row.vegan,

    comedogenicRisk: row.comedogenicRisk,
    sensitiveSkinFriendly: row.sensitiveSkinFriendly,
    acneFriendly: row.acneFriendly,
    barrierFriendly: row.barrierFriendly,
    pregnancySafetyNote: row.pregnancySafetyNote,

    usageFrequency: row.usageFrequency,
    morningUse: row.morningUse,
    nightUse: row.nightUse,
    spf: row.spf,

    rating: row.rating,
    reviewCount: row.reviewCount,

    tags: parseArray(row.tags),
    country: parseArray(row.country),
    market: row.market,
    availability: row.availability,
    dataSource: row.dataSource,

    status: row.status,
  };
}

export function formatPrice(price?: number | null, currency?: string | null): string | null {
  if (price == null) return null;
  const symbols: Record<string, string> = { INR: "₹", USD: "$", GBP: "£", EUR: "€" };
  const symbol = symbols[currency ?? "INR"] ?? (currency ? `${currency} ` : "₹");
  return `${symbol}${price % 1 === 0 ? price : price.toFixed(2)}`;
}
