// ---------------------------------------------------------------------------
// Maps a product's productType to a representative product-photography
// image — free-license stock photos (not the literal named product's real
// packaging), grouped by category so the catalogue doesn't need a unique
// licensed photo per SKU. Swap any entry for a real, licensed product photo
// via the admin form (or by editing `imageUrl` directly) as they become
// available — this is just the "looks like a real photo" baseline.
// ---------------------------------------------------------------------------

export type ImageBucket =
  | "serum"
  | "cleanser"
  | "toner"
  | "moisturizer"
  | "sunscreen"
  | "mask"
  | "body"
  | "hair";

export const CATEGORY_IMAGES: Record<ImageBucket, string> = {
  serum: "",
  cleanser: "",
  toner: "",
  moisturizer: "",
  sunscreen: "",
  mask: "",
  body: "",
  hair: "",
};

const PRODUCT_TYPE_TO_BUCKET: Record<string, ImageBucket> = {
  serum: "serum",
  ampoule: "serum",
  essence: "serum",
  "facial-oil": "serum",

  cleanser: "cleanser",
  "face-wash": "cleanser",
  "cleansing-balm": "cleanser",
  "cleansing-oil": "cleanser",
  "micellar-water": "cleanser",

  toner: "toner",

  moisturizer: "moisturizer",
  "gel-moisturizer": "moisturizer",
  "cream-moisturizer": "moisturizer",
  "barrier-repair": "moisturizer",
  "eye-cream": "moisturizer",
  "eye-serum": "moisturizer",
  "chemical-exfoliant": "moisturizer",
  "physical-exfoliant": "moisturizer",
  "acne-treatment": "moisturizer",
  "spot-treatment": "moisturizer",
  "lip-care": "moisturizer",
  "lip-balm": "moisturizer",

  sunscreen: "sunscreen",
  "spf-moisturizer": "sunscreen",

  "face-mask": "mask",
  "clay-mask": "mask",
  "sheet-mask": "mask",
  "sleeping-mask": "mask",

  "body-lotion": "body",
  "hand-cream": "body",
  "body-sunscreen": "body",

  shampoo: "hair",
  conditioner: "hair",
  "hair-serum": "hair",
  "hair-mask": "hair",
  "scalp-treatment": "hair",
};

export function getProductImageUrl(productType?: string | null): string | null {
  if (!productType) return null;
  const bucket = PRODUCT_TYPE_TO_BUCKET[productType];
  if (!bucket) return null;
  return CATEGORY_IMAGES[bucket] || null;
}
