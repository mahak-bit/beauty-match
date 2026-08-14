// Canonical skin-concern taxonomy — shared by filters, the quiz, the admin
// form's tag suggestions, and the match engine's concern-compatibility score.
export const SKIN_CONCERNS = [
  { slug: "acne", label: "Acne" },
  { slug: "clogged-pores", label: "Clogged pores" },
  { slug: "blackheads", label: "Blackheads" },
  { slug: "whiteheads", label: "Whiteheads" },
  { slug: "redness", label: "Redness" },
  { slug: "pigmentation", label: "Pigmentation" },
  { slug: "dark-spots", label: "Dark spots" },
  { slug: "post-acne-marks", label: "Post-acne marks" },
  { slug: "uneven-tone", label: "Uneven tone" },
  { slug: "dullness", label: "Dullness" },
  { slug: "dehydration", label: "Dehydration" },
  { slug: "fine-lines", label: "Fine lines" },
  { slug: "wrinkles", label: "Wrinkles" },
  { slug: "enlarged-pores", label: "Enlarged pores" },
  { slug: "barrier-damage", label: "Barrier damage" },
  { slug: "excess-oil", label: "Excess oil" },
  { slug: "dryness", label: "Dryness" },
  { slug: "sensitivity", label: "Sensitivity" },
] as const;

export const HAIR_CONCERNS = [
  { slug: "frizz", label: "Frizz" },
  { slug: "dandruff", label: "Dandruff" },
  { slug: "hairfall", label: "Hairfall" },
  { slug: "damage", label: "Damage" },
  { slug: "oily-scalp", label: "Oily scalp" },
  { slug: "dry-scalp", label: "Dry scalp" },
] as const;

export const ALL_CONCERNS = [...SKIN_CONCERNS, ...HAIR_CONCERNS];

export function concernLabel(slug: string): string {
  return ALL_CONCERNS.find((c) => c.slug === slug)?.label ?? slug;
}

export const SKIN_TYPES = [
  { slug: "oily", label: "Oily" },
  { slug: "dry", label: "Dry" },
  { slug: "combination", label: "Combination" },
  { slug: "sensitive", label: "Sensitive" },
  { slug: "normal", label: "Normal" },
] as const;

export const HAIR_TYPES = [
  { slug: "straight", label: "Straight" },
  { slug: "wavy", label: "Wavy" },
  { slug: "curly", label: "Curly" },
  { slug: "coily", label: "Coily" },
] as const;
