// Fine-grained product-type taxonomy the catalogue is architected to hold —
// `products.productType` stores one of these slugs. Grouped so filter UIs
// and the admin form can render sensible sections instead of one long list.
export const PRODUCT_CATEGORY_GROUPS: Array<{
  group: string;
  types: Array<{ slug: string; label: string }>;
}> = [
  {
    group: "Cleanse",
    types: [
      { slug: "cleanser", label: "Cleanser" },
      { slug: "face-wash", label: "Face wash" },
      { slug: "cleansing-balm", label: "Cleansing balm" },
      { slug: "cleansing-oil", label: "Cleansing oil" },
      { slug: "micellar-water", label: "Micellar water" },
    ],
  },
  {
    group: "Tone & Treat",
    types: [
      { slug: "toner", label: "Toner" },
      { slug: "essence", label: "Essence" },
      { slug: "serum", label: "Serum" },
      { slug: "ampoule", label: "Ampoule" },
      { slug: "spot-treatment", label: "Spot treatment" },
      { slug: "acne-treatment", label: "Acne treatment" },
    ],
  },
  {
    group: "Moisturize",
    types: [
      { slug: "moisturizer", label: "Moisturizer" },
      { slug: "gel-moisturizer", label: "Gel moisturizer" },
      { slug: "cream-moisturizer", label: "Cream moisturizer" },
      { slug: "facial-oil", label: "Facial oil" },
      { slug: "barrier-repair", label: "Barrier repair" },
      { slug: "sleeping-mask", label: "Sleeping mask" },
    ],
  },
  {
    group: "Protect",
    types: [
      { slug: "sunscreen", label: "Sunscreen" },
      { slug: "spf-moisturizer", label: "SPF moisturizer" },
    ],
  },
  {
    group: "Eyes & Lips",
    types: [
      { slug: "eye-cream", label: "Eye cream" },
      { slug: "eye-serum", label: "Eye serum" },
      { slug: "lip-care", label: "Lip care" },
      { slug: "lip-balm", label: "Lip balm" },
    ],
  },
  {
    group: "Masks & Exfoliants",
    types: [
      { slug: "face-mask", label: "Face mask" },
      { slug: "clay-mask", label: "Clay mask" },
      { slug: "sheet-mask", label: "Sheet mask" },
      { slug: "chemical-exfoliant", label: "Chemical exfoliant" },
      { slug: "physical-exfoliant", label: "Physical exfoliant" },
    ],
  },
  {
    group: "Body",
    types: [
      { slug: "body-lotion", label: "Body lotion" },
      { slug: "body-sunscreen", label: "Body sunscreen" },
      { slug: "hand-cream", label: "Hand cream" },
    ],
  },
  {
    group: "Hair",
    types: [
      { slug: "shampoo", label: "Shampoo" },
      { slug: "conditioner", label: "Conditioner" },
      { slug: "hair-serum", label: "Hair serum" },
      { slug: "hair-mask", label: "Hair mask" },
      { slug: "scalp-treatment", label: "Scalp treatment" },
    ],
  },
];

export const ALL_PRODUCT_TYPES = PRODUCT_CATEGORY_GROUPS.flatMap((g) => g.types);

export function productTypeLabel(slug?: string | null): string | null {
  if (!slug) return null;
  return ALL_PRODUCT_TYPES.find((t) => t.slug === slug)?.label ?? slug;
}

export const AM_PM_ORDER: Record<string, number> = {
  cleanser: 1,
  "face-wash": 1,
  "cleansing-balm": 1,
  "cleansing-oil": 1,
  "micellar-water": 1,
  toner: 2,
  essence: 3,
  ampoule: 4,
  serum: 4,
  "spot-treatment": 5,
  "acne-treatment": 5,
  "eye-cream": 6,
  "eye-serum": 6,
  moisturizer: 7,
  "gel-moisturizer": 7,
  "cream-moisturizer": 7,
  "barrier-repair": 7,
  "facial-oil": 8,
  sunscreen: 9,
  "spf-moisturizer": 9,
  "sleeping-mask": 10,
};

export const MARKETS = [
  { code: "IN", label: "India", currency: "INR" },
  { code: "US", label: "United States", currency: "USD" },
  { code: "UK", label: "United Kingdom", currency: "GBP" },
  { code: "EU", label: "Europe", currency: "EUR" },
] as const;
