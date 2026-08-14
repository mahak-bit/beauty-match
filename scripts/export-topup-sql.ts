// ---------------------------------------------------------------------------
// One-off tool: emits a top-up SQL script that resolves each product's
// brand_id via a `(SELECT id FROM brands WHERE name = ...)` subquery instead
// of a hardcoded id — safe to run against a database whose brand ids don't
// match this generator's ids, and safe to re-run (INSERT OR IGNORE).
//
// Usage: npx tsx scripts/export-topup-sql.ts > topup.sql
// ---------------------------------------------------------------------------
import { randomUUID } from "crypto";
import { brandData, MARKET_BY_SEGMENT, sample } from "../lib/db/seed-data";

function sqlString(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return String(value);
  return `'${value.replace(/'/g, "''")}'`;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const lines: string[] = [];
lines.push("-- Beauty Match: top-up script (brand-id resolved by name) — safe to run more than once.");
lines.push("");

for (const p of sample) {
  const brand = brandData.find((b) => b.name === p.brand)!;
  const marketInfo = MARKET_BY_SEGMENT[brand.segment];
  const id = randomUUID();
  const slug = `${slugify(p.name)}-${randomUUID().slice(0, 6)}`;

  const columns = [
    "id", "brand_id", "name", "slug", "category", "subcategory", "product_type",
    "price", "currency", "short_description", "full_description", "how_to_use",
    "key_ingredients", "benefits", "skin_types", "hair_types", "concerns", "cautions",
    "texture", "finish", "fragrance_free", "alcohol_free", "comedogenic_risk",
    "sensitive_skin_friendly", "acne_friendly", "barrier_friendly", "usage_frequency",
    "morning_use", "night_use", "spf", "tags", "country", "market", "availability",
    "data_source", "status",
  ];

  const selectValues = [
    sqlString(id),
    `(SELECT id FROM brands WHERE name = ${sqlString(p.brand)})`,
    sqlString(p.name), sqlString(slug), sqlString(p.category), sqlString(p.productType), sqlString(p.productType),
    sqlString(p.price), sqlString(marketInfo.currency), sqlString(p.shortDescription),
    sqlString(p.fullDescription), sqlString(p.howToUse),
    sqlString(JSON.stringify(p.keyIngredients ?? [])), sqlString(JSON.stringify(p.benefits ?? [])),
    sqlString(JSON.stringify(p.skinTypes ?? [])), sqlString(JSON.stringify(p.hairTypes ?? [])),
    sqlString(JSON.stringify(p.concerns ?? [])), sqlString(p.cautions ?? null),
    sqlString(p.texture ?? null), sqlString(p.finish ?? null),
    sqlString(p.fragranceFree ?? null), sqlString(p.alcoholFree ?? null), sqlString(p.comedogenicRisk ?? null),
    sqlString(p.sensitiveSkinFriendly ?? null), sqlString(p.acneFriendly ?? null), sqlString(p.barrierFriendly ?? null),
    sqlString(p.usageFrequency ?? null), sqlString(p.morningUse ?? null), sqlString(p.nightUse ?? null),
    sqlString(p.spf ?? null), sqlString(JSON.stringify(p.tags ?? [])), sqlString(JSON.stringify(marketInfo.country)),
    sqlString(marketInfo.market), sqlString("unknown"), sqlString("seed"), sqlString("live"),
  ];

  lines.push(
    `INSERT OR IGNORE INTO products (${columns.join(", ")})\n` +
      `SELECT ${selectValues.join(", ")}\n` +
      `WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = ${sqlString(p.name)} AND brand_id = (SELECT id FROM brands WHERE name = ${sqlString(p.brand)}));`
  );
}

console.log(lines.join("\n"));
