import type { MatchReason, MatchResult, Product, UserPreferences } from "@/lib/types";
import { findIngredientByName } from "@/lib/data/ingredients";
import { concernLabel } from "@/lib/data/concerns";

/**
 * The Beauty Match scoring model. Every weight below is documented so the
 * score is explainable rather than a black box — `scoreProduct` returns not
 * just a number but the reasons and caveats a product page/quiz result
 * renders directly.
 *
 * Weights sum to 100 before the irritant penalty is subtracted.
 */
const WEIGHTS = {
  skinType: 22,
  concerns: 28,
  ingredients: 15,
  preferences: 10,
  budget: 10,
  texture: 8,
  routine: 7,
  maxPenalty: 15,
};

export function scoreProduct(
  product: Product,
  prefs: UserPreferences,
  brandSegment?: string | null
): MatchResult {
  const breakdown: MatchReason[] = [];
  const reasons: string[] = [];
  const caveats: string[] = [];

  // 1. Skin type compatibility
  let skinTypeScore = 0;
  if (prefs.skinType) {
    if (product.skinTypes.length === 0) {
      caveats.push("This brand hasn't specified which skin types it suits best yet.");
    } else if (product.skinTypes.includes(prefs.skinType)) {
      skinTypeScore = WEIGHTS.skinType;
      reasons.push(`Formulated for ${prefs.skinType} skin`);
    } else {
      caveats.push(`Not specifically formulated for ${prefs.skinType} skin.`);
    }
  } else {
    skinTypeScore = WEIGHTS.skinType * 0.5;
  }
  breakdown.push({ label: "Skin type compatibility", weight: skinTypeScore });

  // 2. Concern compatibility
  let concernScore = 0;
  if (prefs.concerns.length > 0) {
    const matched = prefs.concerns.filter((c) =>
      product.concerns.map((x) => x.toLowerCase()).includes(c.toLowerCase())
    );
    concernScore = (matched.length / prefs.concerns.length) * WEIGHTS.concerns;
    if (matched.length > 0) {
      reasons.push(
        `Targets ${matched.map((c) => concernLabel(c).toLowerCase()).join(" and ")}`
      );
    }
    const unmatched = prefs.concerns.filter((c) => !matched.includes(c));
    if (unmatched.length > 0 && matched.length > 0) {
      caveats.push(
        `Doesn't directly address ${unmatched.map((c) => concernLabel(c).toLowerCase()).join(", ")}.`
      );
    }
  } else {
    concernScore = WEIGHTS.concerns * 0.5;
  }
  breakdown.push({ label: "Concern compatibility", weight: concernScore });

  // 3. Ingredient compatibility — does a key ingredient's known role line up
  // with what the person is trying to address?
  let ingredientScore = 0;
  if (prefs.concerns.length > 0 && product.keyIngredients.length > 0) {
    const resolved = product.keyIngredients
      .map((name) => findIngredientByName(name))
      .filter((i): i is NonNullable<typeof i> => !!i);
    const relevant = resolved.filter((ing) =>
      ing.commonlyUsedFor.some((c) => prefs.concerns.includes(c))
    );
    if (relevant.length > 0) {
      ingredientScore = Math.min(1, relevant.length / 2) * WEIGHTS.ingredients;
      reasons.push(
        `Contains ${relevant.map((i) => i.name).slice(0, 2).join(" and ")}, a compatible active for your concerns`
      );
    }
  } else {
    ingredientScore = WEIGHTS.ingredients * 0.4;
  }
  breakdown.push({ label: "Ingredient compatibility", weight: ingredientScore });

  // 4. Preference compatibility — fragrance/alcohol/EO-free, cruelty-free,
  // vegan, and brand-segment leanings (K-beauty, Indian, dermatologist-led).
  const prefChecks: Array<[boolean | undefined, boolean | null | undefined, string]> = [
    [prefs.fragranceFree, product.fragranceFree, "fragrance-free"],
    [prefs.alcoholFree, product.alcoholFree, "alcohol-free"],
    [prefs.essentialOilFree, product.essentialOilFree, "essential-oil-free"],
    [prefs.crueltyFree, product.crueltyFree, "cruelty-free"],
    [prefs.vegan, product.vegan, "vegan"],
  ];
  const requested = prefChecks.filter(([want]) => want);
  let preferenceScore: number;
  if (requested.length === 0) {
    preferenceScore = WEIGHTS.preferences * 0.7;
  } else {
    const satisfied = requested.filter(([, has]) => has === true);
    const failed = requested.filter(([, has]) => has !== true);
    preferenceScore = (satisfied.length / requested.length) * WEIGHTS.preferences;
    satisfied.forEach(([, , label]) => reasons.push(`Matches your ${label} preference`));
    failed.forEach(([, has, label]) =>
      caveats.push(has === false ? `Not ${label}.` : `${label[0].toUpperCase()}${label.slice(1)} status not specified.`)
    );
  }
  if (brandSegment) {
    if (
      (prefs.preferKBeauty && brandSegment === "k-beauty") ||
      (prefs.preferIndianBrands && brandSegment === "indian") ||
      (prefs.preferDermFocused && brandSegment === "clinical") ||
      (prefs.preferPremium && brandSegment === "premium")
    ) {
      reasons.push("From a brand that matches your style preference");
    }
  }
  breakdown.push({ label: "Preference compatibility", weight: preferenceScore });

  // 5. Budget compatibility
  let budgetScore = WEIGHTS.budget;
  if (prefs.budgetMax != null) {
    if (product.price == null) {
      budgetScore = WEIGHTS.budget * 0.5;
    } else if (product.price <= prefs.budgetMax) {
      budgetScore = WEIGHTS.budget;
      reasons.push("Within your budget");
    } else {
      const over = product.price - prefs.budgetMax;
      budgetScore = Math.max(0, WEIGHTS.budget * (1 - over / prefs.budgetMax));
      caveats.push(`Above your budget by ${Math.round(over)}.`);
    }
  }
  breakdown.push({ label: "Budget compatibility", weight: budgetScore });

  // 6. Texture compatibility
  let textureScore = WEIGHTS.texture;
  if (prefs.texturePreference) {
    if (product.texture) {
      const matches = product.texture.toLowerCase().includes(prefs.texturePreference.toLowerCase());
      textureScore = matches ? WEIGHTS.texture : WEIGHTS.texture * 0.2;
      if (matches) reasons.push(`${product.texture[0].toUpperCase()}${product.texture.slice(1)} texture, as you prefer`);
    } else {
      textureScore = WEIGHTS.texture * 0.5;
    }
  }
  breakdown.push({ label: "Texture compatibility", weight: textureScore });

  // 7. Routine compatibility — is this product clearly slotted into AM/PM?
  const routineScore =
    product.morningUse != null || product.nightUse != null ? WEIGHTS.routine : WEIGHTS.routine * 0.4;
  breakdown.push({ label: "Routine compatibility", weight: routineScore });

  // 8. Potential irritant penalty
  let penalty = 0;
  if (prefs.skinType === "sensitive" && product.sensitiveSkinFriendly === false) {
    penalty += 8;
    caveats.push("Not flagged as sensitive-skin-friendly.");
  }
  if (
    (prefs.concerns.includes("sensitivity") || prefs.concerns.includes("redness")) &&
    product.comedogenicRisk === "high"
  ) {
    penalty += 5;
    caveats.push("Higher comedogenic risk than ideal for reactive skin.");
  }
  if (prefs.concerns.includes("acne") && product.acneFriendly === false) {
    penalty += 6;
    caveats.push("Not flagged as acne-friendly.");
  }
  penalty = Math.min(penalty, WEIGHTS.maxPenalty);
  if (penalty > 0) breakdown.push({ label: "Potential irritant penalty", weight: -penalty });

  const rawTotal =
    skinTypeScore +
    concernScore +
    ingredientScore +
    preferenceScore +
    budgetScore +
    textureScore +
    routineScore -
    penalty;

  const score = Math.max(0, Math.min(100, Math.round(rawTotal)));

  return {
    productId: product.id,
    score,
    reasons: reasons.slice(0, 5),
    caveats: caveats.slice(0, 4),
    breakdown,
  };
}

export function rankProducts(
  products: Array<Product & { brandSegment?: string | null }>,
  prefs: UserPreferences
): Array<Product & { match: MatchResult }> {
  return products
    .map((p) => ({ ...p, match: scoreProduct(p, prefs, p.brandSegment) }))
    .sort((a, b) => b.match.score - a.match.score);
}
