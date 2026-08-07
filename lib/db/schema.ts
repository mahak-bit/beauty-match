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
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  status: text("status", { enum: ["draft", "pending", "live"] }).default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Products — every field a beauty product page actually needs.
// ---------------------------------------------------------------------------
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  brandId: text("brand_id").notNull().references(() => brands.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category", {
    enum: ["skincare", "haircare", "both"],
  }).notNull(),
  subcategory: text("subcategory"), // e.g. "cleanser", "shampoo", "serum"
  price: real("price"),
  currency: text("currency").default("INR"),
  imageUrl: text("image_url"),

  // Written content — she writes this by hand, per product.
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  howToUse: text("how_to_use"),
  ingredientsRaw: text("ingredients_raw"), // full label copy, for reference
  keyIngredients: text("key_ingredients"), // JSON array of strings, e.g. ["Niacinamide","Salicylic Acid"]

  // Structured matching fields — this is what the quiz + AI agent query against.
  skinTypes: text("skin_types"), // JSON array: ["oily","dry","combination","sensitive","normal"]
  hairTypes: text("hair_types"), // JSON array: ["straight","wavy","curly","coily"]
  concerns: text("concerns"), // JSON array: ["acne","pigmentation","frizz","dandruff",...]
  cautions: text("cautions"), // e.g. "Avoid combining with retinol"

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
