// ---------------------------------------------------------------------------
// UI-facing product/brand shapes — the DB stores arrays as JSON text columns
// (SQLite has no native array type); everything downstream of `lib/db`
// should work with these parsed, typed shapes instead of raw rows.
// ---------------------------------------------------------------------------

export type SkinType = "oily" | "dry" | "combination" | "sensitive" | "normal";
export type HairType = "straight" | "wavy" | "curly" | "coily";

export type ComedogenicRisk = "low" | "medium" | "high";
export type Availability = "in_stock" | "limited" | "out_of_stock" | "discontinued" | "unknown";
export type BrandSegment = "mass" | "clinical" | "k-beauty" | "indian" | "premium" | "indie";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  website?: string | null;
  segment?: BrandSegment | null;
  originCountry?: string | null;
  crueltyFree?: boolean | null;
  vegan?: boolean | null;
  isVerified?: boolean | null;
  status?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  category: "skincare" | "haircare" | "both";
  subcategory?: string | null;
  productType?: string | null;

  price?: number | null;
  currency?: string | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  productUrl?: string | null;

  shortDescription?: string | null;
  fullDescription?: string | null;
  howToUse?: string | null;
  ingredientsRaw?: string | null;
  keyIngredients: string[];
  ingredientPercentages: Record<string, string>;
  benefits: string[];

  skinTypes: string[];
  hairTypes: string[];
  concerns: string[];
  cautions?: string | null;

  texture?: string | null;
  finish?: string | null;
  fragrance?: string | null;
  fragranceFree?: boolean | null;
  alcoholFree?: boolean | null;
  essentialOilFree?: boolean | null;
  crueltyFree?: boolean | null;
  vegan?: boolean | null;

  comedogenicRisk?: ComedogenicRisk | null;
  sensitiveSkinFriendly?: boolean | null;
  acneFriendly?: boolean | null;
  barrierFriendly?: boolean | null;
  pregnancySafetyNote?: string | null;

  usageFrequency?: string | null;
  morningUse?: boolean | null;
  nightUse?: boolean | null;
  spf?: number | null;

  rating?: number | null;
  reviewCount?: number | null;

  tags: string[];
  country: string[];
  market?: string | null;
  availability?: Availability | null;
  dataSource?: "seed" | "admin" | "import" | null;

  status?: string | null;
}

/** Explains a single match-engine factor for a product — the "why" behind a score. */
export interface MatchReason {
  label: string;
  weight: number; // positive = contributed to the score, negative = penalty
}

export interface MatchResult {
  productId: string;
  score: number; // 0-100
  reasons: string[]; // human-readable positives, most important first
  caveats: string[]; // "why this may not be perfect"
  breakdown: MatchReason[];
}

export interface UserPreferences {
  skinType?: SkinType;
  hairType?: HairType;
  concerns: string[];
  budgetMax?: number;
  fragranceFree?: boolean;
  alcoholFree?: boolean;
  essentialOilFree?: boolean;
  crueltyFree?: boolean;
  vegan?: boolean;
  texturePreference?: string; // "gel" | "cream" | "lightweight" | ...
  preferKBeauty?: boolean;
  preferIndianBrands?: boolean;
  preferDermFocused?: boolean;
  preferPremium?: boolean;
}
