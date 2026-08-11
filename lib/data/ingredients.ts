// ---------------------------------------------------------------------------
// Educational ingredient reference data.
//
// This is general skincare-education content (the kind published by
// ingredient-decoder sites and brand education pages), not a medical
// resource and not a claim about any specific product's efficacy. Every
// entry uses "commonly used for" / "often included to help with the
// appearance of" language rather than diagnostic or medical claims.
//
// Shared by: the Ingredient Explorer (/ingredients), the match engine's
// ingredient-compatibility scoring, product detail pages, and the routine
// builder's conflict checker.
// ---------------------------------------------------------------------------

export type IngredientRole =
  | "hydrator"
  | "exfoliant"
  | "brightening"
  | "barrier-support"
  | "soothing"
  | "oil-control"
  | "anti-aging"
  | "sun-protection";

export interface Ingredient {
  slug: string;
  name: string;
  aliases?: string[];
  role: IngredientRole[];
  summary: string;
  commonlyUsedFor: string[]; // concern slugs, see lib/data/concerns.ts
  suitableSkinTypes: string[];
  cautionNote?: string;
  /** Ingredients that are commonly flagged as a stronger combination to introduce gradually. */
  conflictsWith?: string[];
  relatedIngredients?: string[];
}

export const INGREDIENTS: Ingredient[] = [
  {
    slug: "niacinamide",
    name: "Niacinamide",
    aliases: ["Vitamin B3"],
    role: ["oil-control", "brightening", "barrier-support"],
    summary:
      "A form of vitamin B3 commonly used to help balance visible oiliness, support the skin barrier, and even out the look of skin tone.",
    commonlyUsedFor: ["excess-oil", "enlarged-pores", "uneven-tone", "dullness"],
    suitableSkinTypes: ["oily", "combination", "dry", "normal", "sensitive"],
    relatedIngredients: ["zinc-pca", "salicylic-acid"],
  },
  {
    slug: "zinc-pca",
    name: "Zinc PCA",
    role: ["oil-control"],
    summary: "A zinc salt often paired with niacinamide to help regulate excess surface oil.",
    commonlyUsedFor: ["excess-oil", "clogged-pores"],
    suitableSkinTypes: ["oily", "combination"],
    relatedIngredients: ["niacinamide"],
  },
  {
    slug: "salicylic-acid",
    name: "Salicylic Acid",
    aliases: ["BHA"],
    role: ["exfoliant", "oil-control"],
    summary:
      "An oil-soluble beta hydroxy acid that exfoliates inside the pore lining — commonly used for congestion, blackheads, and breakout-prone skin.",
    commonlyUsedFor: ["acne", "clogged-pores", "blackheads", "enlarged-pores"],
    suitableSkinTypes: ["oily", "combination"],
    cautionNote:
      "Can increase sun sensitivity and dryness — commonly introduced gradually and paired with daily SPF.",
    conflictsWith: ["retinol", "glycolic-acid", "lactic-acid"],
    relatedIngredients: ["niacinamide", "zinc-pca"],
  },
  {
    slug: "glycolic-acid",
    name: "Glycolic Acid",
    aliases: ["AHA"],
    role: ["exfoliant", "brightening"],
    summary:
      "A small-molecule alpha hydroxy acid derived from sugar cane, commonly used to resurface the skin's top layer and soften the look of uneven tone.",
    commonlyUsedFor: ["dullness", "uneven-tone", "fine-lines"],
    suitableSkinTypes: ["normal", "combination", "oily"],
    cautionNote: "Can increase sun sensitivity — pair with daily SPF and introduce gradually.",
    conflictsWith: ["retinol", "salicylic-acid", "vitamin-c", "lactic-acid"],
    relatedIngredients: ["lactic-acid"],
  },
  {
    slug: "lactic-acid",
    name: "Lactic Acid",
    aliases: ["AHA"],
    role: ["exfoliant", "hydrator"],
    summary:
      "A gentler, larger-molecule AHA than glycolic acid, often chosen by drier or more sensitive skin for surface exfoliation.",
    commonlyUsedFor: ["dullness", "uneven-tone", "dehydration"],
    suitableSkinTypes: ["dry", "sensitive", "normal", "combination"],
    conflictsWith: ["retinol", "salicylic-acid", "glycolic-acid"],
    relatedIngredients: ["glycolic-acid"],
  },
  {
    slug: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    role: ["hydrator"],
    summary:
      "A humectant that attracts and holds water in the skin — a common base ingredient across nearly every skin type for surface hydration.",
    commonlyUsedFor: ["dehydration", "dullness", "fine-lines"],
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive", "normal"],
    relatedIngredients: ["glycerin", "panthenol"],
  },
  {
    slug: "retinol",
    name: "Retinol",
    role: ["anti-aging", "exfoliant"],
    summary:
      "A vitamin A derivative commonly used at night to support skin renewal — one of the most studied ingredients for the visible signs of aging and post-acne marks.",
    commonlyUsedFor: ["fine-lines", "wrinkles", "post-acne-marks", "uneven-tone"],
    suitableSkinTypes: ["normal", "combination", "oily", "dry"],
    cautionNote:
      "Commonly introduced 1-2x/week and built up gradually; can increase sun sensitivity and isn't typically recommended during pregnancy — check with a professional.",
    conflictsWith: ["glycolic-acid", "lactic-acid", "salicylic-acid", "vitamin-c", "benzoyl-peroxide"],
    relatedIngredients: ["bakuchiol", "peptides"],
  },
  {
    slug: "bakuchiol",
    name: "Bakuchiol",
    role: ["anti-aging"],
    summary:
      "A plant-derived retinol alternative often chosen by people who find retinoids irritating, including during pregnancy — always confirm with a professional.",
    commonlyUsedFor: ["fine-lines", "wrinkles", "uneven-tone"],
    suitableSkinTypes: ["sensitive", "normal", "dry", "combination", "oily"],
    relatedIngredients: ["retinol"],
  },
  {
    slug: "vitamin-c",
    name: "Vitamin C",
    aliases: ["Ascorbic Acid", "L-Ascorbic Acid"],
    role: ["brightening", "anti-aging"],
    summary:
      "An antioxidant commonly used in the morning to help brighten the look of dullness and support the skin against everyday environmental exposure.",
    commonlyUsedFor: ["dullness", "uneven-tone", "dark-spots", "fine-lines"],
    suitableSkinTypes: ["normal", "combination", "oily", "dry"],
    cautionNote: "Some forms can be unstable in light/air and may irritate reactive skin — patch testing is common.",
    conflictsWith: ["retinol", "glycolic-acid", "niacinamide-high-strength"],
    relatedIngredients: ["ferulic-acid", "vitamin-e"],
  },
  {
    slug: "azelaic-acid",
    name: "Azelaic Acid",
    role: ["brightening", "soothing", "oil-control"],
    summary:
      "A gentle multi-tasking acid commonly used for redness-prone and breakout-prone skin, and for evening out the look of post-acne marks.",
    commonlyUsedFor: ["redness", "post-acne-marks", "acne", "uneven-tone"],
    suitableSkinTypes: ["sensitive", "oily", "combination", "normal"],
    relatedIngredients: ["niacinamide"],
  },
  {
    slug: "kojic-acid",
    name: "Kojic Acid",
    role: ["brightening"],
    summary: "A brightening ingredient derived from fungi, commonly used to help even the look of dark spots.",
    commonlyUsedFor: ["dark-spots", "uneven-tone", "pigmentation"],
    suitableSkinTypes: ["normal", "combination", "oily", "dry"],
    cautionNote: "Can be sensitising for some people — patch testing is common.",
    relatedIngredients: ["vitamin-c", "arbutin"],
  },
  {
    slug: "arbutin",
    name: "Alpha Arbutin",
    role: ["brightening"],
    summary: "A gentler brightening ingredient derived from bearberry, often layered with niacinamide or vitamin C.",
    commonlyUsedFor: ["dark-spots", "uneven-tone", "pigmentation"],
    suitableSkinTypes: ["sensitive", "normal", "combination", "oily", "dry"],
    relatedIngredients: ["kojic-acid", "niacinamide"],
  },
  {
    slug: "tranexamic-acid",
    name: "Tranexamic Acid",
    role: ["brightening"],
    summary: "A brightening ingredient often used alongside niacinamide for stubborn, uneven pigmentation.",
    commonlyUsedFor: ["dark-spots", "uneven-tone", "pigmentation"],
    suitableSkinTypes: ["normal", "combination", "oily", "dry", "sensitive"],
    relatedIngredients: ["niacinamide", "arbutin"],
  },
  {
    slug: "ceramides",
    name: "Ceramides",
    role: ["barrier-support", "hydrator"],
    summary:
      "Lipids naturally found in the skin's outer layer — commonly used in moisturizers to support the skin barrier and reduce moisture loss.",
    commonlyUsedFor: ["dehydration", "barrier-damage", "dryness"],
    suitableSkinTypes: ["dry", "sensitive", "normal", "combination", "oily"],
    relatedIngredients: ["cholesterol", "fatty-acids", "panthenol"],
  },
  {
    slug: "centella-asiatica",
    name: "Centella Asiatica",
    aliases: ["Cica", "Tiger Grass"],
    role: ["soothing", "barrier-support"],
    summary:
      "A plant extract widely used in soothing formulas for reactive or barrier-compromised skin, popularised by K-beauty \"cica\" products.",
    commonlyUsedFor: ["redness", "barrier-damage", "sensitivity"],
    suitableSkinTypes: ["sensitive", "normal", "dry", "combination", "oily"],
    relatedIngredients: ["panthenol", "allantoin"],
  },
  {
    slug: "snail-mucin",
    name: "Snail Secretion Filtrate",
    aliases: ["Snail Mucin"],
    role: ["hydrator", "barrier-support"],
    summary:
      "A K-beauty staple used for its hydrating, film-forming texture — commonly used to support a smoother, more hydrated look over time.",
    commonlyUsedFor: ["dehydration", "post-acne-marks", "dullness"],
    suitableSkinTypes: ["normal", "combination", "dry", "oily"],
    relatedIngredients: ["hyaluronic-acid", "panthenol"],
  },
  {
    slug: "peptides",
    name: "Peptides",
    role: ["anti-aging", "barrier-support"],
    summary:
      "Short chains of amino acids used as signalling ingredients in moisturizers and serums aimed at firmer-looking, more resilient skin over time.",
    commonlyUsedFor: ["fine-lines", "wrinkles", "barrier-damage"],
    suitableSkinTypes: ["normal", "dry", "combination", "sensitive", "oily"],
    relatedIngredients: ["retinol", "ceramides"],
  },
  {
    slug: "panthenol",
    name: "Panthenol",
    aliases: ["Pro-Vitamin B5"],
    role: ["hydrator", "soothing"],
    summary: "A humectant and soothing agent commonly used to support hydration and calm the look of irritation.",
    commonlyUsedFor: ["dehydration", "redness", "sensitivity"],
    suitableSkinTypes: ["sensitive", "dry", "normal", "combination", "oily"],
    relatedIngredients: ["hyaluronic-acid", "allantoin"],
  },
  {
    slug: "allantoin",
    name: "Allantoin",
    role: ["soothing", "barrier-support"],
    summary: "A gentle soothing agent frequently included in sensitive-skin formulas to support comfort.",
    commonlyUsedFor: ["sensitivity", "redness"],
    suitableSkinTypes: ["sensitive", "dry", "normal", "combination", "oily"],
    relatedIngredients: ["centella-asiatica", "panthenol"],
  },
  {
    slug: "squalane",
    name: "Squalane",
    role: ["hydrator", "barrier-support"],
    summary:
      "A lightweight, non-greasy emollient that mimics the skin's own oils — commonly used across skin types to soften and support the barrier.",
    commonlyUsedFor: ["dehydration", "barrier-damage", "dryness"],
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive", "normal"],
    relatedIngredients: ["ceramides"],
  },
  {
    slug: "glycerin",
    name: "Glycerin",
    role: ["hydrator"],
    summary: "One of the most well-studied humectants in skincare, used broadly to draw and hold moisture in skin.",
    commonlyUsedFor: ["dehydration", "dryness"],
    suitableSkinTypes: ["oily", "dry", "combination", "sensitive", "normal"],
    relatedIngredients: ["hyaluronic-acid"],
  },
  {
    slug: "vitamin-e",
    name: "Vitamin E",
    aliases: ["Tocopherol"],
    role: ["barrier-support", "anti-aging"],
    summary: "An antioxidant often paired with vitamin C to help stabilise the formula and support the skin barrier.",
    commonlyUsedFor: ["dryness", "barrier-damage"],
    suitableSkinTypes: ["dry", "normal", "combination", "sensitive"],
    relatedIngredients: ["vitamin-c", "ferulic-acid"],
  },
  {
    slug: "ferulic-acid",
    name: "Ferulic Acid",
    role: ["anti-aging", "brightening"],
    summary: "An antioxidant commonly combined with vitamin C and vitamin E to help stabilise the formula.",
    commonlyUsedFor: ["dullness", "fine-lines"],
    suitableSkinTypes: ["normal", "combination", "oily", "dry"],
    relatedIngredients: ["vitamin-c", "vitamin-e"],
  },
  {
    slug: "dimethicone",
    name: "Dimethicone",
    role: ["barrier-support"],
    summary:
      "A silicone commonly used to smooth texture and lock in hydration — widely used in moisturizers, primers, and hair serums for a smoother finish.",
    commonlyUsedFor: ["dehydration", "frizz"],
    suitableSkinTypes: ["normal", "dry", "combination", "oily"],
    relatedIngredients: ["squalane"],
  },
  {
    slug: "argan-oil",
    name: "Argan Oil",
    role: ["hydrator", "barrier-support"],
    summary: "A fatty-acid-rich plant oil commonly used to add shine and softness to hair, and hydration to dry skin.",
    commonlyUsedFor: ["dryness", "frizz", "damage"],
    suitableSkinTypes: ["dry", "normal", "combination"],
    relatedIngredients: ["squalane"],
  },
  {
    slug: "green-tea-extract",
    name: "Green Tea Extract",
    aliases: ["Camellia Sinensis Leaf Extract"],
    role: ["soothing", "oil-control"],
    summary: "An antioxidant-rich plant extract often included in oil-control formulas for its calming profile.",
    commonlyUsedFor: ["excess-oil", "redness"],
    suitableSkinTypes: ["oily", "combination", "sensitive"],
    relatedIngredients: ["niacinamide"],
  },
  {
    slug: "benzoyl-peroxide",
    name: "Benzoyl Peroxide",
    role: ["oil-control"],
    summary: "A common spot-treatment ingredient used for active breakouts.",
    commonlyUsedFor: ["acne"],
    suitableSkinTypes: ["oily", "combination"],
    cautionNote: "Can be drying and may bleach fabric/towels — often used as a targeted spot treatment rather than all-over.",
    conflictsWith: ["retinol"],
  },
  {
    slug: "onion-extract",
    name: "Onion Bulb Extract",
    aliases: ["Onion Oil"],
    role: ["barrier-support"],
    summary: "A scalp-care ingredient commonly marketed for supporting hair strength alongside plant keratin.",
    commonlyUsedFor: ["hairfall", "damage"],
    suitableSkinTypes: [],
  },
];

export const INGREDIENT_BY_SLUG = new Map(INGREDIENTS.map((i) => [i.slug, i]));

export function findIngredientByName(name: string): Ingredient | undefined {
  const lower = name.trim().toLowerCase();
  return INGREDIENTS.find(
    (i) =>
      i.name.toLowerCase() === lower ||
      i.slug === lower.replace(/\s+/g, "-") ||
      i.aliases?.some((a) => a.toLowerCase() === lower)
  );
}

/** Flags ingredient pairs that are commonly introduced gradually rather than combined at full strength. */
export function findRoutineConflicts(allIngredientNames: string[]): Array<{ a: string; b: string }> {
  const resolved = allIngredientNames
    .map((n) => findIngredientByName(n))
    .filter((i): i is Ingredient => !!i);

  const conflicts: Array<{ a: string; b: string }> = [];
  for (let i = 0; i < resolved.length; i++) {
    for (let j = i + 1; j < resolved.length; j++) {
      const a = resolved[i];
      const b = resolved[j];
      if (a.conflictsWith?.includes(b.slug) || b.conflictsWith?.includes(a.slug)) {
        conflicts.push({ a: a.name, b: b.name });
      }
    }
  }
  return conflicts;
}
