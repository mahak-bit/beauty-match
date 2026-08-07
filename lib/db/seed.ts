import { db } from "./index";
import { brands, products } from "./schema";
import { randomUUID } from "crypto";

async function seed() {
  const brandData = [
    { name: "Minimalist", tagline: "Concentration-labelled actives, nothing extra." },
    { name: "The Ordinary", tagline: "Clinical formulations, honest pricing." },
    { name: "Mamaearth", tagline: "Natural, toxin-free skin and hair care." },
    { name: "CeraVe", tagline: "Developed with dermatologists." },
    { name: "Plum", tagline: "Cruelty-free, vegan goodness for skin & hair." },
  ];

  const brandIds: Record<string, string> = {};

  for (const b of brandData) {
    const id = randomUUID();
    brandIds[b.name] = id;
    await db.insert(brands).values({
      id,
      slug: b.name.toLowerCase().replace(/\s+/g, "-"),
      name: b.name,
      tagline: b.tagline,
      status: "live",
    });
  }

  const sample = [
    {
      brand: "Minimalist",
      name: "Niacinamide 10% Face Serum",
      category: "skincare" as const,
      subcategory: "serum",
      price: 549,
      shortDescription: "A lightweight serum that fades dark spots and controls oil without irritation.",
      fullDescription:
        "Formulated at a clinically-tested 10% concentration, this serum targets pigmentation and excess sebum while strengthening the skin barrier. Fragrance-free and non-comedogenic.",
      howToUse: "Apply 2-3 drops on clean skin at night, before moisturizer. Start 3x/week and build up tolerance.",
      keyIngredients: ["Niacinamide", "Zinc PCA"],
      skinTypes: ["oily", "combination"],
      concerns: ["acne", "pigmentation", "dullness"],
      cautions: "May cause slight flushing when first introduced — this settles with regular use.",
    },
    {
      brand: "CeraVe",
      name: "Hydrating Facial Cleanser",
      category: "skincare" as const,
      subcategory: "cleanser",
      price: 649,
      shortDescription: "A gentle, non-foaming cleanser that never strips the skin barrier.",
      fullDescription:
        "Developed with dermatologists, this cleanser uses ceramides and hyaluronic acid to cleanse while maintaining the skin's natural moisture barrier — suitable for daily AM/PM use.",
      howToUse: "Massage onto damp skin, rinse with lukewarm water. Use morning and night.",
      keyIngredients: ["Ceramides", "Hyaluronic Acid"],
      skinTypes: ["dry", "sensitive", "normal"],
      concerns: ["dryness", "dullness"],
    },
    {
      brand: "The Ordinary",
      name: "Salicylic Acid 2% Solution",
      category: "skincare" as const,
      subcategory: "exfoliant",
      price: 720,
      shortDescription: "A targeted BHA solution for clearer, less congested pores.",
      fullDescription:
        "A 2% salicylic acid solution in a silky base that exfoliates within the pore lining, reducing blemishes and blackheads over consistent use.",
      howToUse: "Apply a thin layer to affected areas at night. Do not combine with other exfoliating acids.",
      keyIngredients: ["Salicylic Acid"],
      skinTypes: ["oily", "combination"],
      concerns: ["acne"],
      cautions: "Avoid combining with retinol or other exfoliating acids in the same routine. Patch test first.",
    },
    {
      brand: "Mamaearth",
      name: "Onion Hair Fall Shampoo",
      category: "haircare" as const,
      subcategory: "shampoo",
      price: 349,
      shortDescription: "A sulfate-free shampoo that reduces hairfall and adds volume.",
      fullDescription:
        "Formulated with onion oil and plant keratin, this shampoo strengthens hair from root to tip while gently cleansing the scalp — free from sulfates, parabens, and mineral oil.",
      howToUse: "Massage into wet hair and scalp, lather, rinse thoroughly. Use 2-3x a week.",
      keyIngredients: ["Onion Oil", "Plant Keratin"],
      hairTypes: ["straight", "wavy", "curly"],
      concerns: ["hairfall", "damage"],
    },
    {
      brand: "Plum",
      name: "Green Tea Clear Face Wash",
      category: "skincare" as const,
      subcategory: "cleanser",
      price: 345,
      shortDescription: "A foaming cleanser that clears excess oil without over-drying.",
      fullDescription:
        "Green tea extract and salicylic acid combine to control oil and reduce breakouts, while glycerin keeps the skin from feeling stripped after each wash.",
      howToUse: "Use morning and night on damp skin, massaging gently before rinsing.",
      keyIngredients: ["Green Tea Extract", "Salicylic Acid"],
      skinTypes: ["oily", "combination"],
      concerns: ["acne", "dullness"],
    },
    {
      brand: "Plum",
      name: "Bio-Active Frizz Control Serum",
      category: "haircare" as const,
      subcategory: "hair serum",
      price: 425,
      shortDescription: "A silicone-based serum that smooths frizz and adds shine instantly.",
      fullDescription:
        "A lightweight hair serum that seals the cuticle to reduce frizz and flyaways, leaving hair glossy without weighing it down.",
      howToUse: "Apply a pea-sized amount to towel-dried or dry hair, focusing on mid-lengths and ends.",
      keyIngredients: ["Dimethicone", "Argan Oil"],
      hairTypes: ["wavy", "curly", "coily"],
      concerns: ["frizz", "damage"],
    },
  ];

  for (const p of sample) {
    await db.insert(products).values({
      id: randomUUID(),
      brandId: brandIds[p.brand],
      name: p.name,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      howToUse: p.howToUse,
      keyIngredients: JSON.stringify(p.keyIngredients ?? []),
      skinTypes: JSON.stringify((p as any).skinTypes ?? []),
      hairTypes: JSON.stringify((p as any).hairTypes ?? []),
      concerns: JSON.stringify(p.concerns ?? []),
      cautions: (p as any).cautions ?? null,
      status: "live",
    });
  }

  console.log(`Seeded ${brandData.length} brands and ${sample.length} products.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
