import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Brands — one row per beauty brand featured on the platform.
// Designed so a brand can eventually log in and manage its own products
// (see `ownerEmail` — wire up real auth against this field later).
// ---------------------------------------------------------------------------
export const brands = sqliteTable("brands", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  website: text("website"),
  ownerEmail: text("owner_email"), // future: brand-portal login

  // Positioning — lets the catalogue represent "thousands of brands" across
  // segments without the UI hardcoding any single one of them.
  segment: text("segment", {
    enum: ["mass", "clinical", "k-beauty", "indian", "premium", "indie"],
  }),
  originCountry: text("origin_country"), // e.g. "US", "KR", "IN", "FR"
  crueltyFree: integer("cruelty_free", { mode: "boolean" }),
  vegan: integer("vegan", { mode: "boolean" }),

  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  status: text("status", { enum: ["draft", "pending", "live"] }).default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Products — every field a beauty product page actually needs.
//
// `category` / `subcategory` are the original coarse fields (kept for
// backward compatibility with the quiz agent, filters, and existing rows).
// `productType` is the finer-grained catalogue category (cleanser, serum,
// sunscreen, sheet mask, ...) used by the expanded discovery/filter UI.
// ---------------------------------------------------------------------------
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  brandId: text("brand_id").notNull().references(() => brands.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category", {
    enum: ["skincare", "haircare", "both"],
  }).notNull(),
  subcategory: text("subcategory"), // e.g. "cleanser", "shampoo", "serum" (legacy, free text)
  productType: text("product_type"), // finer catalogue type, e.g. "cleansing-balm", "vitamin-c-serum"

  price: real("price"),
  currency: text("currency").default("INR"),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  productUrl: text("product_url"), // link to retailer/brand page, if known

  // Written content — she writes this by hand, per product.
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  howToUse: text("how_to_use"),
  ingredientsRaw: text("ingredients_raw"), // full label copy, for reference
  keyIngredients: text("key_ingredients"), // JSON array of strings, e.g. ["Niacinamide","Zinc PCA"]
  ingredientPercentages: text("ingredient_percentages"), // JSON object, only set when verified — otherwise omit the key entirely
  benefits: text("benefits"), // JSON array of short benefit phrases

  // Structured matching fields — this is what the quiz + AI agent + match
  // engine query against.
  skinTypes: text("skin_types"), // JSON array: ["oily","dry","combination","sensitive","normal"]
  hairTypes: text("hair_types"), // JSON array: ["straight","wavy","curly","coily"]
  concerns: text("concerns"), // JSON array: ["acne","pigmentation","frizz","dandruff",...]
  cautions: text("cautions"), // e.g. "Avoid combining with retinol"

  // Texture / formulation profile
  texture: text("texture"), // e.g. "gel", "cream", "lightweight lotion", "oil"
  finish: text("finish"), // e.g. "matte", "dewy", "natural"
  fragrance: text("fragrance"), // free text, e.g. "fragrance-free", "light citrus"
  fragranceFree: integer("fragrance_free", { mode: "boolean" }),
  alcoholFree: integer("alcohol_free", { mode: "boolean" }),
  essentialOilFree: integer("essential_oil_free", { mode: "boolean" }),
  crueltyFree: integer("cruelty_free", { mode: "boolean" }),
  vegan: integer("vegan", { mode: "boolean" }),

  // Suitability signals — used by the match engine's compatibility + penalty
  // scoring. "unknown" (null) is a legitimate value; never defaulted to a
  // reassuring answer.
  comedogenicRisk: text("comedogenic_risk", { enum: ["low", "medium", "high"] }),
  sensitiveSkinFriendly: integer("sensitive_skin_friendly", { mode: "boolean" }),
  acneFriendly: integer("acne_friendly", { mode: "boolean" }),
  barrierFriendly: integer("barrier_friendly", { mode: "boolean" }),
  pregnancySafetyNote: text("pregnancy_safety_note"), // educational note only, never a medical claim

  usageFrequency: text("usage_frequency"), // e.g. "daily", "2-3x/week", "as needed"
  morningUse: integer("morning_use", { mode: "boolean" }),
  nightUse: integer("night_use", { mode: "boolean" }),
  spf: integer("spf"),

  rating: real("rating"), // null unless sourced from real verified reviews
  reviewCount: integer("review_count"), // null unless sourced from real verified reviews

  tags: text("tags"), // JSON array of free-form discovery tags, e.g. ["lightweight","non-greasy","dermatologist-focused"]

  // Market / availability — the catalogue is architected for multiple
  // markets from day one rather than a single hardcoded currency.
  country: text("country"), // JSON array of ISO country codes where sold, e.g. ["IN","US"]
  market: text("market"), // primary market, e.g. "IN"
  availability: text("availability", {
    enum: ["in_stock", "limited", "out_of_stock", "discontinued", "unknown"],
  }).default("unknown"),

  // Provenance — every row is labelled so real, verified product data can
  // later replace development seed data without ambiguity.
  dataSource: text("data_source", { enum: ["seed", "admin", "import"] }).default("admin"),

  status: text("status", { enum: ["draft", "pending", "live"] }).default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
}));

// ---------------------------------------------------------------------------
// Quiz sessions — stores each completed quiz + the agent's reasoning,
// so recommendations can be revisited and so the agent has memory of
// what it already asked within a session.
// ---------------------------------------------------------------------------
export const quizSessions = sqliteTable("quiz_sessions", {
  id: text("id").primaryKey(),
  path: text("path", { enum: ["skin", "hair", "both"] }).notNull(),
  answers: text("answers"), // JSON blob of the structured answers collected
  transcript: text("transcript"), // JSON array of the conversational turns
  recommendedProductIds: text("recommended_product_ids"), // JSON array
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
