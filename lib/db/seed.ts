import { db } from "./index";
import { brands, products } from "./schema";
import { randomUUID } from "crypto";
import { brandData, MARKET_BY_SEGMENT, sample } from "./seed-data";
import { getProductImageUrl } from "@/lib/data/category-images";

// ---------------------------------------------------------------------------
// Runs the development seed data (lib/db/seed-data.ts) against the
// database configured in .env.local. See that file for what this data is
// and isn't (realistic sample data, not verified real-world listings).
// ---------------------------------------------------------------------------

async function seed() {
  const brandIds: Record<string, string> = {};

  for (const b of brandData) {
    const id = randomUUID();
    brandIds[b.name] = id;
    await db.insert(brands).values({
      id,
      slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      name: b.name,
      tagline: b.tagline,
      segment: b.segment,
      originCountry: b.originCountry,
      status: "live",
    });
  }

  for (const p of sample) {
    const marketInfo = MARKET_BY_SEGMENT[brandData.find((b) => b.name === p.brand)!.segment];
    await db.insert(products).values({
      id: randomUUID(),
      brandId: brandIds[p.brand],
      name: p.name,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + randomUUID().slice(0, 6),
      category: p.category,
      subcategory: p.productType,
      productType: p.productType,
      price: p.price,
      currency: marketInfo.currency,
      imageUrl: getProductImageUrl(p.productType),
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      howToUse: p.howToUse,
      keyIngredients: JSON.stringify(p.keyIngredients ?? []),
      benefits: JSON.stringify(p.benefits ?? []),
      skinTypes: JSON.stringify(p.skinTypes ?? []),
      hairTypes: JSON.stringify(p.hairTypes ?? []),
      concerns: JSON.stringify(p.concerns ?? []),
      cautions: p.cautions ?? null,
      texture: p.texture ?? null,
      finish: p.finish ?? null,
      fragranceFree: p.fragranceFree ?? null,
      alcoholFree: p.alcoholFree ?? null,
      comedogenicRisk: p.comedogenicRisk ?? null,
      sensitiveSkinFriendly: p.sensitiveSkinFriendly ?? null,
      acneFriendly: p.acneFriendly ?? null,
      barrierFriendly: p.barrierFriendly ?? null,
      usageFrequency: p.usageFrequency ?? null,
      morningUse: p.morningUse ?? null,
      nightUse: p.nightUse ?? null,
      spf: p.spf ?? null,
      tags: JSON.stringify(p.tags ?? []),
      country: JSON.stringify(marketInfo.country),
      market: marketInfo.market,
      availability: "unknown",
      dataSource: "seed",
      status: "live",
    });
  }

  console.log(`Seeded ${brandData.length} brands and ${sample.length} products.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
