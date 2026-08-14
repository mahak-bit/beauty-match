// ---------------------------------------------------------------------------
// One-off tool: emits UPDATE statements that set image_url on every product,
// matched by (name, brand) via a subquery — for pasting into a database
// console to backfill photos on a database that predates this feature.
//
// Usage: npx tsx scripts/export-image-update-sql.ts > image-update.sql
// ---------------------------------------------------------------------------
import { sample } from "../lib/db/seed-data";
import { getProductImageUrl } from "../lib/data/category-images";

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

const lines: string[] = [];
lines.push("-- Beauty Match: backfills image_url on existing products, matched by name + brand.");
lines.push("");

let skipped = 0;
for (const p of sample) {
  const url = getProductImageUrl(p.productType);
  if (!url) {
    skipped++;
    continue;
  }
  lines.push(
    `UPDATE products SET image_url = ${sqlString(url)} ` +
      `WHERE name = ${sqlString(p.name)} ` +
      `AND brand_id = (SELECT id FROM brands WHERE name = ${sqlString(p.brand)});`
  );
}

if (skipped > 0) {
  lines.push("");
  lines.push(`-- Note: ${skipped} product(s) had no image mapped for their productType and were skipped.`);
}

console.log(lines.join("\n"));
