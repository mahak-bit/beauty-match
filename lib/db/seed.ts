import { db } from "./index";
import { brands, products } from "./schema";
import { randomUUID } from "crypto";

// ---------------------------------------------------------------------------
// Development seed data.
//
// This is realistic, editorially-written sample data for local development
// and demos — NOT verified real-world product data. Every row is tagged
// `dataSource: "seed"`. Fields that would require verified sourcing
// (ratings, review counts, exact ingredient percentages, live availability)
// are intentionally left unset rather than invented — see lib/types.ts and
// the schema comments in lib/db/schema.ts for how real data should replace
// this later (API / CSV / JSON import, or the admin form).
// ---------------------------------------------------------------------------

type BrandSeed = {
  name: string;
  tagline: string;
  segment: "mass" | "clinical" | "k-beauty" | "indian" | "premium" | "indie";
  originCountry: string;
};

const brandData: BrandSeed[] = [
  { name: "Minimalist", tagline: "Concentration-labelled actives, nothing extra.", segment: "indian", originCountry: "IN" },
  { name: "The Ordinary", tagline: "Clinical formulations, honest pricing.", segment: "premium", originCountry: "CA" },
  { name: "Mamaearth", tagline: "Natural, toxin-free skin and hair care.", segment: "indian", originCountry: "IN" },
  { name: "CeraVe", tagline: "Developed with dermatologists.", segment: "clinical", originCountry: "US" },
  { name: "Plum", tagline: "Cruelty-free, vegan goodness for skin & hair.", segment: "indian", originCountry: "IN" },
  { name: "The Derma Co", tagline: "Dermatologist-backed actives at high concentrations.", segment: "indian", originCountry: "IN" },
  { name: "Dot & Key", tagline: "K-beauty inspired formulas for Indian skin.", segment: "indian", originCountry: "IN" },
  { name: "Deconstruct", tagline: "Single-active, science-first skincare.", segment: "indian", originCountry: "IN" },
  { name: "Foxtale", tagline: "Skin-first formulas, dermatologist reviewed.", segment: "indian", originCountry: "IN" },
  { name: "Dr Sheth's", tagline: "Ayurveda meets dermatology.", segment: "indian", originCountry: "IN" },
  { name: "Re'equil", tagline: "Sun care and derm-led actives.", segment: "indian", originCountry: "IN" },
  { name: "Cetaphil", tagline: "Gentle cleansing, trusted by dermatologists.", segment: "clinical", originCountry: "US" },
  { name: "Neutrogena", tagline: "Dermatologist recommended since 1954.", segment: "mass", originCountry: "US" },
  { name: "Simple", tagline: "Kind to skin, free from harsh chemicals.", segment: "mass", originCountry: "UK" },
  { name: "NIVEA", tagline: "Skincare essentials for the whole family.", segment: "mass", originCountry: "DE" },
  { name: "Dove", tagline: "Real beauty, real care.", segment: "mass", originCountry: "US" },
  { name: "La Roche-Posay", tagline: "Dermatological laboratories, thermal spring water.", segment: "clinical", originCountry: "FR" },
  { name: "Bioderma", tagline: "Biology at the service of dermatology.", segment: "clinical", originCountry: "FR" },
  { name: "Eucerin", tagline: "Dermo-cosmetics backed by skin research.", segment: "clinical", originCountry: "DE" },
  { name: "Avène", tagline: "Soothing care with thermal spring water.", segment: "clinical", originCountry: "FR" },
  { name: "COSRX", tagline: "Minimal, effective, fuss-free Korean skincare.", segment: "k-beauty", originCountry: "KR" },
  { name: "Beauty of Joseon", tagline: "Traditional Korean herbal wisdom, modern formulas.", segment: "k-beauty", originCountry: "KR" },
  { name: "SKIN1004", tagline: "Madagascar Centella, straight from the source.", segment: "k-beauty", originCountry: "KR" },
  { name: "Anua", tagline: "Clean, effective Korean actives.", segment: "k-beauty", originCountry: "KR" },
  { name: "Round Lab", tagline: "Korean skin, Korean land, Korean formulas.", segment: "k-beauty", originCountry: "KR" },
  { name: "Purito", tagline: "Low-irritant, high-performance Korean skincare.", segment: "k-beauty", originCountry: "KR" },
  { name: "Isntree", tagline: "Honest Korean skincare for sensitive skin.", segment: "k-beauty", originCountry: "KR" },
  { name: "Torriden", tagline: "Hydration-first Korean skincare.", segment: "k-beauty", originCountry: "KR" },
];

const MARKET_BY_SEGMENT: Record<BrandSeed["segment"], { currency: string; market: string; country: string[] }> = {
  indian: { currency: "INR", market: "IN", country: ["IN"] },
  mass: { currency: "USD", market: "US", country: ["US", "UK"] },
  clinical: { currency: "EUR", market: "EU", country: ["EU", "UK", "FR"] },
  "k-beauty": { currency: "USD", market: "US", country: ["US", "KR"] },
  premium: { currency: "USD", market: "US", country: ["US", "UK", "CA"] },
  indie: { currency: "USD", market: "US", country: ["US"] },
};

type ProductSeed = {
  brand: string;
  name: string;
  category: "skincare" | "haircare" | "both";
  productType: string;
  price: number;
  shortDescription: string;
  fullDescription: string;
  howToUse: string;
  keyIngredients: string[];
  benefits?: string[];
  skinTypes?: string[];
  hairTypes?: string[];
  concerns: string[];
  texture?: string;
  finish?: string;
  fragranceFree?: boolean;
  alcoholFree?: boolean;
  comedogenicRisk?: "low" | "medium" | "high";
  sensitiveSkinFriendly?: boolean;
  acneFriendly?: boolean;
  barrierFriendly?: boolean;
  usageFrequency?: string;
  morningUse?: boolean;
  nightUse?: boolean;
  spf?: number;
  tags?: string[];
  cautions?: string;
};

const sample: ProductSeed[] = [
  // ---------------- Minimalist ----------------
  {
    brand: "Minimalist", name: "Niacinamide 10% Face Serum", category: "skincare", productType: "serum",
    price: 549, shortDescription: "A lightweight serum that fades dark spots and controls oil without irritation.",
    fullDescription: "Formulated at a clinically-tested 10% concentration, this serum targets pigmentation and excess sebum while strengthening the skin barrier. Fragrance-free and non-comedogenic.",
    howToUse: "Apply 2-3 drops on clean skin at night, before moisturizer. Start 3x/week and build up tolerance.",
    keyIngredients: ["Niacinamide", "Zinc PCA"], skinTypes: ["oily", "combination"],
    concerns: ["acne", "pigmentation", "dullness", "excess-oil"], texture: "lightweight serum", finish: "natural",
    fragranceFree: true, comedogenicRisk: "low", sensitiveSkinFriendly: true, acneFriendly: true,
    nightUse: true, usageFrequency: "3-4x/week to start", tags: ["lightweight", "non-greasy"],
    cautions: "May cause slight flushing when first introduced — this settles with regular use.",
  },
  {
    brand: "Minimalist", name: "Salicylic Acid 2% Solution", category: "skincare", productType: "chemical-exfoliant",
    price: 499, shortDescription: "A targeted BHA solution for clearer, less congested pores.",
    fullDescription: "A 2% salicylic acid solution that exfoliates within the pore lining, reducing the look of blemishes and blackheads with consistent use.",
    howToUse: "Apply a thin layer to affected areas at night, 2-3x/week to start.",
    keyIngredients: ["Salicylic Acid"], skinTypes: ["oily", "combination"], concerns: ["acne", "clogged-pores", "blackheads"],
    texture: "watery gel", fragranceFree: true, alcoholFree: true, comedogenicRisk: "low", acneFriendly: true,
    nightUse: true, usageFrequency: "2-3x/week", tags: ["lightweight"],
    cautions: "Avoid combining with retinol or other exfoliating acids in the same routine. Patch test first.",
  },
  {
    brand: "Minimalist", name: "Hyaluronic Acid 2% + B5 Serum", category: "skincare", productType: "serum",
    price: 499, shortDescription: "A multi-molecular-weight hydrator for plumper, dewier skin.",
    fullDescription: "Combines three molecular weights of hyaluronic acid with panthenol (B5) to hydrate at multiple skin depths and support the barrier.",
    howToUse: "Apply to damp skin morning and night, before moisturizer.",
    keyIngredients: ["Hyaluronic Acid", "Panthenol"], skinTypes: ["dry", "normal", "combination", "sensitive"],
    concerns: ["dehydration", "dullness"], texture: "lightweight gel serum", finish: "dewy", fragranceFree: true,
    comedogenicRisk: "low", sensitiveSkinFriendly: true, morningUse: true, nightUse: true, tags: ["lightweight", "hydrating"],
  },

  // ---------------- The Ordinary ----------------
  {
    brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", category: "skincare", productType: "serum",
    price: 12, shortDescription: "A high-strength vitamin B3 and zinc formula for oil balance and texture.",
    fullDescription: "A concentrated serum that targets the appearance of blemish-prone skin and enlarged pores.",
    howToUse: "Apply a few drops to face morning and evening before heavier creams.",
    keyIngredients: ["Niacinamide", "Zinc PCA"], skinTypes: ["oily", "combination"], concerns: ["excess-oil", "enlarged-pores"],
    texture: "lightweight serum", fragranceFree: true, comedogenicRisk: "low", morningUse: true, nightUse: true,
  },
  {
    brand: "The Ordinary", name: "Hyaluronic Acid 2% + B5", category: "skincare", productType: "serum",
    price: 9, shortDescription: "A foundational multi-depth hydration serum.",
    fullDescription: "Combines several forms of hyaluronic acid with vitamin B5 to attract and retain moisture at the skin's surface.",
    howToUse: "Apply to damp skin morning and night before moisturizer.",
    keyIngredients: ["Hyaluronic Acid", "Panthenol"], skinTypes: ["dry", "normal", "combination", "sensitive", "oily"],
    concerns: ["dehydration"], texture: "watery serum", fragranceFree: true, sensitiveSkinFriendly: true,
    morningUse: true, nightUse: true,
  },
  {
    brand: "The Ordinary", name: "Granactive Retinoid 2% Emulsion", category: "skincare", productType: "serum",
    price: 10, shortDescription: "A next-generation retinoid for smoother-looking texture over time.",
    fullDescription: "A gentler retinoid derivative in a lightweight emulsion, aimed at the visible signs of aging and uneven texture.",
    howToUse: "Apply a small amount at night, 2-3x/week to start.",
    keyIngredients: ["Retinol"], skinTypes: ["normal", "combination", "oily", "dry"], concerns: ["fine-lines", "uneven-tone"],
    texture: "lightweight emulsion", fragranceFree: true, nightUse: true, usageFrequency: "2-3x/week to start",
    cautions: "Can increase sun sensitivity — use SPF during the day. Not recommended during pregnancy; check with a professional.",
  },

  // ---------------- Mamaearth ----------------
  {
    brand: "Mamaearth", name: "Onion Hair Fall Shampoo", category: "haircare", productType: "shampoo",
    price: 349, shortDescription: "A sulfate-free shampoo that reduces hairfall and adds volume.",
    fullDescription: "Formulated with onion extract and plant keratin to strengthen hair from root to tip while gently cleansing the scalp.",
    howToUse: "Massage into wet hair and scalp, lather, rinse thoroughly. Use 2-3x a week.",
    keyIngredients: ["Onion Bulb Extract"], hairTypes: ["straight", "wavy", "curly"], concerns: ["hairfall", "damage"],
    fragranceFree: false, usageFrequency: "2-3x/week",
  },
  {
    brand: "Mamaearth", name: "Vitamin C Face Wash", category: "skincare", productType: "face-wash",
    price: 299, shortDescription: "A brightening daily cleanser with vitamin C and turmeric.",
    fullDescription: "A gentle foaming cleanser that removes daily buildup while supporting a brighter-looking complexion over time.",
    howToUse: "Use morning and night on damp skin.",
    keyIngredients: ["Vitamin C"], skinTypes: ["normal", "combination", "oily"], concerns: ["dullness", "uneven-tone"],
    morningUse: true, nightUse: true,
  },

  // ---------------- CeraVe ----------------
  {
    brand: "CeraVe", name: "Hydrating Facial Cleanser", category: "skincare", productType: "cleanser",
    price: 15.99, shortDescription: "A gentle, non-foaming cleanser that never strips the skin barrier.",
    fullDescription: "Developed with dermatologists, this cleanser uses ceramides and hyaluronic acid to cleanse while maintaining the skin's natural moisture barrier.",
    howToUse: "Massage onto damp skin, rinse with lukewarm water. Use morning and night.",
    keyIngredients: ["Ceramides", "Hyaluronic Acid"], skinTypes: ["dry", "sensitive", "normal"], concerns: ["dryness", "dullness"],
    texture: "creamy lotion", fragranceFree: true, comedogenicRisk: "low", sensitiveSkinFriendly: true, barrierFriendly: true,
    morningUse: true, nightUse: true,
  },
  {
    brand: "CeraVe", name: "PM Facial Moisturizing Lotion", category: "skincare", productType: "moisturizer",
    price: 17.99, shortDescription: "A lightweight night moisturizer with ceramides and niacinamide.",
    fullDescription: "Absorbs quickly and helps restore the protective skin barrier overnight without feeling heavy.",
    howToUse: "Apply to face and neck after cleansing, as the last step of your PM routine.",
    keyIngredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"], skinTypes: ["normal", "combination", "dry"],
    concerns: ["dehydration", "barrier-damage"], texture: "lightweight lotion", finish: "natural", fragranceFree: true,
    barrierFriendly: true, nightUse: true,
  },
  {
    brand: "CeraVe", name: "AM Facial Moisturizing Lotion SPF 30", category: "skincare", productType: "spf-moisturizer",
    price: 18.99, shortDescription: "A daily moisturizer with broad-spectrum SPF 30 and niacinamide.",
    fullDescription: "Combines sun protection with ceramides and hyaluronic acid for a lightweight daily step.",
    howToUse: "Apply generously to face and neck as the last step of your morning routine.",
    keyIngredients: ["Ceramides", "Niacinamide"], skinTypes: ["normal", "combination", "dry", "oily"],
    concerns: ["barrier-damage"], texture: "lightweight lotion", fragranceFree: true, spf: 30, morningUse: true,
  },

  // ---------------- Plum ----------------
  {
    brand: "Plum", name: "Green Tea Clear Face Wash", category: "skincare", productType: "face-wash",
    price: 345, shortDescription: "A foaming cleanser that clears excess oil without over-drying.",
    fullDescription: "Green tea extract and salicylic acid combine to control oil and reduce breakouts, while glycerin keeps skin from feeling stripped.",
    howToUse: "Use morning and night on damp skin, massaging gently before rinsing.",
    keyIngredients: ["Green Tea Extract", "Salicylic Acid"], skinTypes: ["oily", "combination"], concerns: ["acne", "dullness"],
    morningUse: true, nightUse: true, acneFriendly: true,
  },
  {
    brand: "Plum", name: "Bio-Active Frizz Control Serum", category: "haircare", productType: "hair-serum",
    price: 425, shortDescription: "A silicone-based serum that smooths frizz and adds shine instantly.",
    fullDescription: "Seals the hair cuticle to reduce frizz and flyaways, leaving hair glossy without weighing it down.",
    howToUse: "Apply a pea-sized amount to towel-dried or dry hair, focusing on mid-lengths and ends.",
    keyIngredients: ["Dimethicone", "Argan Oil"], hairTypes: ["wavy", "curly", "coily"], concerns: ["frizz", "damage"],
  },
  {
    brand: "Plum", name: "10% Niacinamide Sunscreen SPF 50", category: "skincare", productType: "sunscreen",
    price: 575, shortDescription: "A no-white-cast daily sunscreen with niacinamide.",
    fullDescription: "A lightweight, non-greasy sunscreen designed to sit comfortably under makeup while supporting an even-looking tone.",
    howToUse: "Apply generously as the last step of your morning routine, reapply every 2-3 hours in direct sun.",
    keyIngredients: ["Niacinamide"], skinTypes: ["normal", "combination", "oily", "dry"], concerns: ["excess-oil"],
    texture: "lightweight fluid", finish: "matte", spf: 50, morningUse: true, tags: ["non-greasy"],
  },

  // ---------------- The Derma Co ----------------
  {
    brand: "The Derma Co", name: "1% Hyaluronic Sunscreen Aqua Gel SPF 50", category: "skincare", productType: "sunscreen",
    price: 399, shortDescription: "A gel-textured sunscreen with hyaluronic acid for hydration on the go.",
    fullDescription: "Broad-spectrum protection in a fast-absorbing gel base that layers well under makeup.",
    howToUse: "Apply liberally 15 minutes before sun exposure; reapply every 2-3 hours.",
    keyIngredients: ["Hyaluronic Acid"], skinTypes: ["oily", "combination", "normal"], concerns: ["dehydration"],
    texture: "gel", finish: "natural", spf: 50, morningUse: true,
  },
  {
    brand: "The Derma Co", name: "2% Alpha Arbutin Face Serum", category: "skincare", productType: "serum",
    price: 549, shortDescription: "A brightening serum for uneven tone and dark spots.",
    fullDescription: "Combines alpha arbutin with niacinamide to target the look of dark spots and dullness.",
    howToUse: "Apply at night after cleansing, before moisturizer.",
    keyIngredients: ["Alpha Arbutin", "Niacinamide"], skinTypes: ["normal", "combination", "oily", "dry"],
    concerns: ["dark-spots", "uneven-tone", "pigmentation"], texture: "lightweight serum", nightUse: true,
  },
  {
    brand: "The Derma Co", name: "1% Retinol Night Serum", category: "skincare", productType: "serum",
    price: 649, shortDescription: "An entry-strength retinol serum for smoother-looking texture.",
    fullDescription: "A 1% retinol formula in a barrier-supporting base, meant to be introduced gradually.",
    howToUse: "Apply a pea-sized amount at night, 2x/week to start.",
    keyIngredients: ["Retinol"], skinTypes: ["normal", "combination", "oily"], concerns: ["fine-lines", "uneven-tone"],
    nightUse: true, usageFrequency: "2x/week to start",
    cautions: "Can increase sun sensitivity — pair with daily SPF. Not recommended during pregnancy; check with a professional.",
  },

  // ---------------- Dot & Key ----------------
  {
    brand: "Dot & Key", name: "Vitamin C Serum with Turmeric", category: "skincare", productType: "serum",
    price: 595, shortDescription: "A brightening morning serum for a more even-looking glow.",
    fullDescription: "Combines vitamin C with turmeric extract to help brighten the look of dull, uneven skin.",
    howToUse: "Apply in the morning after cleansing, before SPF.",
    keyIngredients: ["Vitamin C"], skinTypes: ["normal", "combination", "dry"], concerns: ["dullness", "uneven-tone"],
    morningUse: true, texture: "lightweight serum",
  },
  {
    brand: "Dot & Key", name: "Watermelon Hyaluronic Gel Moisturizer", category: "skincare", productType: "gel-moisturizer",
    price: 495, shortDescription: "An oil-free gel moisturizer for a hydrated, dewy finish.",
    fullDescription: "A lightweight gel that hydrates without heaviness, ideal for humid climates and oilier skin.",
    howToUse: "Apply morning and night as the last step before SPF (AM) or overnight.",
    keyIngredients: ["Hyaluronic Acid"], skinTypes: ["oily", "combination", "normal"], concerns: ["dehydration"],
    texture: "gel", finish: "dewy", morningUse: true, nightUse: true, tags: ["lightweight", "non-greasy"],
  },

  // ---------------- Deconstruct ----------------
  {
    brand: "Deconstruct", name: "2% Salicylic Acid Face Serum", category: "skincare", productType: "chemical-exfoliant",
    price: 399, shortDescription: "A single-active BHA serum for congestion-prone skin.",
    fullDescription: "A no-frills 2% salicylic acid formula focused on one job: clearer-looking pores.",
    howToUse: "Apply at night, 2-3x/week to start.",
    keyIngredients: ["Salicylic Acid"], skinTypes: ["oily", "combination"], concerns: ["acne", "clogged-pores"],
    nightUse: true, acneFriendly: true, usageFrequency: "2-3x/week",
  },
  {
    brand: "Deconstruct", name: "Under Eye Cream with Caffeine", category: "skincare", productType: "eye-cream",
    price: 449, shortDescription: "A lightweight eye cream for tired-looking under-eyes.",
    fullDescription: "Caffeine and peptides combine in a light gel-cream texture built for the delicate eye area.",
    howToUse: "Dab a small amount around the orbital bone morning and night.",
    keyIngredients: ["Peptides"], skinTypes: ["normal", "combination", "dry", "sensitive"], concerns: ["fine-lines"],
    texture: "gel-cream", morningUse: true, nightUse: true,
  },

  // ---------------- Foxtale ----------------
  {
    brand: "Foxtale", name: "Dewy Skin Serum with Hyaluronic Acid", category: "skincare", productType: "serum",
    price: 599, shortDescription: "A hydration serum for a plump, dewy look.",
    fullDescription: "Multiple molecular weights of hyaluronic acid layer to hydrate skin at different depths.",
    howToUse: "Apply to damp skin morning and night.",
    keyIngredients: ["Hyaluronic Acid"], skinTypes: ["dry", "normal", "combination"], concerns: ["dehydration", "dullness"],
    finish: "dewy", morningUse: true, nightUse: true,
  },
  {
    brand: "Foxtale", name: "Salicylic + LHA Acne Serum", category: "skincare", productType: "acne-treatment",
    price: 649, shortDescription: "A dual-acid formula for active breakouts and post-acne marks.",
    fullDescription: "Combines salicylic acid with LHA for gentle, ongoing exfoliation aimed at breakout-prone skin.",
    howToUse: "Apply at night to affected areas, 3x/week to start.",
    keyIngredients: ["Salicylic Acid"], skinTypes: ["oily", "combination"], concerns: ["acne", "post-acne-marks"],
    nightUse: true, acneFriendly: true,
  },

  // ---------------- Dr Sheth's ----------------
  {
    brand: "Dr Sheth's", name: "Ceramide & Vitamin C Serum", category: "skincare", productType: "serum",
    price: 699, shortDescription: "A brightening serum that also supports the skin barrier.",
    fullDescription: "Pairs vitamin C with ceramides so brightening doesn't come at the cost of barrier comfort.",
    howToUse: "Apply in the morning before SPF.",
    keyIngredients: ["Vitamin C", "Ceramides"], skinTypes: ["normal", "dry", "combination"], concerns: ["dullness", "barrier-damage"],
    morningUse: true, barrierFriendly: true,
  },
  {
    brand: "Dr Sheth's", name: "Cica & Salicylic Acid Sunscreen SPF 50", category: "skincare", productType: "sunscreen",
    price: 549, shortDescription: "A calming sunscreen for acne-prone, reactive skin.",
    fullDescription: "Combines mineral-leaning sun protection with centella and salicylic acid for breakout-prone skin.",
    howToUse: "Apply as the last step of your morning routine, reapply every 2-3 hours.",
    keyIngredients: ["Centella Asiatica", "Salicylic Acid"], skinTypes: ["oily", "combination", "sensitive"],
    concerns: ["acne", "redness"], spf: 50, morningUse: true, sensitiveSkinFriendly: true,
  },

  // ---------------- Re'equil ----------------
  {
    brand: "Re'equil", name: "Oil Free Matte Sunscreen SPF 50", category: "skincare", productType: "sunscreen",
    price: 425, shortDescription: "A matte-finish daily sunscreen for oily skin.",
    fullDescription: "A lightweight, oil-free formula that sets to a natural matte finish under makeup.",
    howToUse: "Apply generously every morning, reapply every 2-3 hours.",
    keyIngredients: [], skinTypes: ["oily", "combination"], concerns: ["excess-oil"], finish: "matte", spf: 50,
    morningUse: true, tags: ["non-greasy"],
  },
  {
    brand: "Re'equil", name: "10% Niacinamide Serum", category: "skincare", productType: "serum",
    price: 449, shortDescription: "An oil-balancing niacinamide serum.",
    fullDescription: "A straightforward 10% niacinamide formula aimed at excess oil and enlarged pores.",
    howToUse: "Apply at night after cleansing.",
    keyIngredients: ["Niacinamide"], skinTypes: ["oily", "combination"], concerns: ["excess-oil", "enlarged-pores"],
    nightUse: true,
  },

  // ---------------- Cetaphil ----------------
  {
    brand: "Cetaphil", name: "Gentle Skin Cleanser", category: "skincare", productType: "cleanser",
    price: 13.99, shortDescription: "A soap-free cleanser trusted for decades by dermatologists.",
    fullDescription: "A mild, non-foaming formula for normal to dry, sensitive skin that cleanses without disrupting the barrier.",
    howToUse: "Massage onto skin, rinse or wipe off. Use morning and night.",
    keyIngredients: [], skinTypes: ["dry", "sensitive", "normal"], concerns: ["dryness"], fragranceFree: true,
    sensitiveSkinFriendly: true, comedogenicRisk: "low", morningUse: true, nightUse: true,
  },
  {
    brand: "Cetaphil", name: "Moisturizing Cream", category: "skincare", productType: "cream-moisturizer",
    price: 16.99, shortDescription: "A rich, fragrance-free cream for very dry skin.",
    fullDescription: "A dense, occlusive cream formulated to help restore comfort to very dry or compromised skin.",
    howToUse: "Apply liberally to face and body as needed.",
    keyIngredients: [], skinTypes: ["dry", "sensitive"], concerns: ["dryness", "barrier-damage"], fragranceFree: true,
    sensitiveSkinFriendly: true, barrierFriendly: true, texture: "rich cream",
  },

  // ---------------- Neutrogena ----------------
  {
    brand: "Neutrogena", name: "Hydro Boost Water Gel", category: "skincare", productType: "gel-moisturizer",
    price: 19.99, shortDescription: "A hyaluronic-acid gel moisturizer that hydrates without heaviness.",
    fullDescription: "A oil-free gel-cream that absorbs quickly, leaving skin feeling plump rather than greasy.",
    howToUse: "Apply morning and night to cleansed skin.",
    keyIngredients: ["Hyaluronic Acid"], skinTypes: ["oily", "combination", "normal"], concerns: ["dehydration"],
    texture: "gel", finish: "dewy", morningUse: true, nightUse: true, tags: ["non-greasy"],
  },
  {
    brand: "Neutrogena", name: "Ultra Sheer Dry-Touch Sunscreen SPF 55", category: "skincare", productType: "sunscreen",
    price: 12.99, shortDescription: "A lightweight, non-greasy daily sunscreen.",
    fullDescription: "A fast-absorbing, dry-touch sunscreen formula for daily wear under makeup.",
    howToUse: "Apply generously 15 minutes before sun exposure.",
    keyIngredients: [], skinTypes: ["normal", "combination", "oily"], concerns: [], spf: 55, morningUse: true,
  },

  // ---------------- Simple ----------------
  {
    brand: "Simple", name: "Kind To Skin Micellar Water", category: "skincare", productType: "micellar-water",
    price: 9.49, shortDescription: "A no-rinse cleanser and makeup remover for sensitive skin.",
    fullDescription: "Micelles lift away makeup and daily buildup without harsh rubbing, in a fragrance-free base.",
    howToUse: "Sweep across skin with a cotton pad; no rinsing needed.",
    keyIngredients: [], skinTypes: ["sensitive", "normal", "dry"], concerns: ["sensitivity"], fragranceFree: true,
    sensitiveSkinFriendly: true,
  },
  {
    brand: "Simple", name: "Water Boost Hydrating Gel Cream", category: "skincare", productType: "gel-moisturizer",
    price: 11.99, shortDescription: "A lightweight daily moisturizer for sensitive skin.",
    fullDescription: "A gel-cream hybrid formulated to hydrate without common irritants.",
    howToUse: "Apply morning and night after cleansing.",
    keyIngredients: ["Glycerin"], skinTypes: ["sensitive", "normal", "combination"], concerns: ["dehydration"],
    fragranceFree: true, sensitiveSkinFriendly: true, morningUse: true, nightUse: true,
  },

  // ---------------- NIVEA ----------------
  {
    brand: "NIVEA", name: "Soft Light Moisturizer", category: "skincare", productType: "cream-moisturizer",
    price: 6.99, shortDescription: "A classic lightweight cream for face, hands, and body.",
    fullDescription: "A long-standing everyday moisturizer with vitamin E and jojoba oil.",
    howToUse: "Apply as needed to face and body.",
    keyIngredients: ["Vitamin E"], skinTypes: ["normal", "dry", "combination"], concerns: ["dryness"], texture: "light cream",
  },
  {
    brand: "NIVEA", name: "Cocoa Butter Body Lotion", category: "skincare", productType: "body-lotion",
    price: 8.99, shortDescription: "A rich body lotion for dry skin.",
    fullDescription: "Deeply moisturizing formula for elbows, knees, and other dry-prone areas.",
    howToUse: "Massage into skin after bathing.",
    keyIngredients: [], skinTypes: ["dry"], concerns: ["dryness"], texture: "rich lotion",
  },

  // ---------------- Dove ----------------
  {
    brand: "Dove", name: "Deep Moisture Body Wash", category: "skincare", productType: "cleanser",
    price: 7.99, shortDescription: "A moisturizing body wash with 1/4 moisturizing cream.",
    fullDescription: "Cleanses without stripping, leaving skin feeling softer than soap.",
    howToUse: "Lather in the shower, rinse thoroughly.",
    keyIngredients: [], skinTypes: ["dry", "normal"], concerns: ["dryness"],
  },
  {
    brand: "Dove", name: "Nourishing Hand Cream", category: "skincare", productType: "hand-cream",
    price: 4.99, shortDescription: "A fast-absorbing hand cream for everyday dryness.",
    fullDescription: "Lightweight enough for frequent reapplication throughout the day.",
    howToUse: "Apply to hands as needed.",
    keyIngredients: ["Glycerin"], skinTypes: ["dry", "normal"], concerns: ["dryness"], texture: "light cream",
  },

  // ---------------- La Roche-Posay ----------------
  {
    brand: "La Roche-Posay", name: "Toleriane Hydrating Gentle Cleanser", category: "skincare", productType: "cleanser",
    price: 15.99, shortDescription: "A ceramide-rich cleanser for sensitive, compromised skin.",
    fullDescription: "Formulated with prebiotic thermal spring water and ceramides to cleanse while supporting the barrier.",
    howToUse: "Massage onto damp skin, rinse. Use morning and night.",
    keyIngredients: ["Ceramides"], skinTypes: ["sensitive", "dry", "normal"], concerns: ["barrier-damage", "sensitivity"],
    fragranceFree: true, sensitiveSkinFriendly: true, barrierFriendly: true, morningUse: true, nightUse: true,
  },
  {
    brand: "La Roche-Posay", name: "Anthelios Ultra-Light Fluid SPF 50+", category: "skincare", productType: "sunscreen",
    price: 34.99, shortDescription: "A dermatologist-favoured broad-spectrum daily sunscreen.",
    fullDescription: "An ultra-light fluid texture designed for daily wear, even on reactive skin.",
    howToUse: "Apply generously as the last morning step, reapply every 2 hours in direct sun.",
    keyIngredients: [], skinTypes: ["sensitive", "normal", "combination", "oily"], concerns: [], spf: 50,
    morningUse: true, sensitiveSkinFriendly: true,
  },

  // ---------------- Bioderma ----------------
  {
    brand: "Bioderma", name: "Sensibio H2O Micellar Water", category: "skincare", productType: "micellar-water",
    price: 17.99, shortDescription: "The original micellar water for sensitive skin.",
    fullDescription: "A gentle, pH-neutral formula that removes makeup and impurities without rinsing.",
    howToUse: "Sweep across skin with a cotton pad, morning and night.",
    keyIngredients: [], skinTypes: ["sensitive", "normal", "dry", "combination"], concerns: ["sensitivity"],
    fragranceFree: true, sensitiveSkinFriendly: true, alcoholFree: true,
  },

  // ---------------- Eucerin ----------------
  {
    brand: "Eucerin", name: "Hyaluron-Filler Day Cream", category: "skincare", productType: "cream-moisturizer",
    price: 24.99, shortDescription: "An anti-aging day cream with hyaluronic acid.",
    fullDescription: "Aimed at the visible signs of aging, with a texture suited to daily wear under makeup.",
    howToUse: "Apply every morning to cleansed skin.",
    keyIngredients: ["Hyaluronic Acid"], skinTypes: ["normal", "dry", "combination"], concerns: ["fine-lines", "dehydration"],
    morningUse: true, texture: "cream",
  },

  // ---------------- Avène ----------------
  {
    brand: "Avène", name: "Tolerance Control Soothing Skin Recovery Cream", category: "skincare", productType: "barrier-repair",
    price: 29.99, shortDescription: "A minimal-ingredient cream for very reactive, compromised skin.",
    fullDescription: "Formulated with an extremely short ingredient list for skin in active distress or post-procedure recovery.",
    howToUse: "Apply a thin layer as needed to calm and support the skin barrier.",
    keyIngredients: [], skinTypes: ["sensitive"], concerns: ["barrier-damage", "redness", "sensitivity"],
    fragranceFree: true, sensitiveSkinFriendly: true, barrierFriendly: true,
  },

  // ---------------- COSRX ----------------
  {
    brand: "COSRX", name: "Advanced Snail 96 Mucin Power Essence", category: "skincare", productType: "essence",
    price: 19, shortDescription: "A cult-favourite hydrating essence with snail secretion filtrate.",
    fullDescription: "A lightweight, tacky-textured essence that layers well under serums and moisturizer for extra hydration.",
    howToUse: "Pat onto skin after toner, before serum.",
    keyIngredients: ["Snail Secretion Filtrate"], skinTypes: ["normal", "combination", "dry", "oily"],
    concerns: ["dehydration", "post-acne-marks"], texture: "tacky essence", morningUse: true, nightUse: true,
  },
  {
    brand: "COSRX", name: "BHA Blackhead Power Liquid", category: "skincare", productType: "chemical-exfoliant",
    price: 20, shortDescription: "A betaine salicylate exfoliant for blackhead-prone skin.",
    fullDescription: "A gentler BHA derivative aimed at clearing congestion without excess dryness.",
    howToUse: "Apply after toner, at night. Start 2-3x/week.",
    keyIngredients: ["Salicylic Acid"], skinTypes: ["oily", "combination"], concerns: ["blackheads", "clogged-pores"],
    nightUse: true, acneFriendly: true,
  },
  {
    brand: "COSRX", name: "Low pH Good Morning Gel Cleanser", category: "skincare", productType: "cleanser",
    price: 15, shortDescription: "A low-pH gel cleanser that respects the skin barrier.",
    fullDescription: "A tea-tree-infused gel cleanser formulated at a skin-friendly pH for daily use.",
    howToUse: "Use morning and night on damp skin.",
    keyIngredients: [], skinTypes: ["oily", "combination", "normal"], concerns: ["excess-oil"], morningUse: true, nightUse: true,
  },

  // ---------------- Beauty of Joseon ----------------
  {
    brand: "Beauty of Joseon", name: "Glow Deep Serum: Rice + Alpha Arbutin", category: "skincare", productType: "serum",
    price: 17, shortDescription: "A brightening rice serum inspired by traditional Korean skincare.",
    fullDescription: "Combines fermented rice extract with alpha arbutin to target the look of dullness and uneven tone.",
    howToUse: "Apply after toner, morning or night.",
    keyIngredients: ["Alpha Arbutin"], skinTypes: ["normal", "combination", "dry"], concerns: ["dullness", "uneven-tone"],
    morningUse: true, nightUse: true,
  },
  {
    brand: "Beauty of Joseon", name: "Relief Sun: Rice + Probiotics SPF 50+", category: "skincare", productType: "sunscreen",
    price: 18, shortDescription: "A cult-favourite lightweight daily sunscreen.",
    fullDescription: "A no-white-cast, hydrating sunscreen that layers seamlessly under makeup.",
    howToUse: "Apply as the last step of your morning routine.",
    keyIngredients: [], skinTypes: ["normal", "combination", "oily", "dry"], concerns: [], spf: 50, morningUse: true,
    tags: ["non-greasy"],
  },

  // ---------------- SKIN1004 ----------------
  {
    brand: "SKIN1004", name: "Madagascar Centella Ampoule", category: "skincare", productType: "ampoule",
    price: 18, shortDescription: "A soothing centella ampoule for reactive, irritated skin.",
    fullDescription: "A high-percentage centella asiatica extract formula aimed at calming the look of redness and discomfort.",
    howToUse: "Apply after toner, morning and night.",
    keyIngredients: ["Centella Asiatica"], skinTypes: ["sensitive", "normal", "oily", "combination"],
    concerns: ["redness", "sensitivity", "barrier-damage"], fragranceFree: true, sensitiveSkinFriendly: true,
    morningUse: true, nightUse: true,
  },

  // ---------------- Anua ----------------
  {
    brand: "Anua", name: "Heartleaf 77% Soothing Toner", category: "skincare", productType: "toner",
    price: 19, shortDescription: "A calming toner for redness-prone, congested skin.",
    fullDescription: "A high-percentage heartleaf (houttuynia cordata) extract toner used to prep and soothe skin.",
    howToUse: "Pat onto skin after cleansing, before serum.",
    keyIngredients: [], skinTypes: ["sensitive", "oily", "combination"], concerns: ["redness", "sensitivity"],
    fragranceFree: true, alcoholFree: true, sensitiveSkinFriendly: true,
  },
  {
    brand: "Anua", name: "Niacinamide 10% + Zinc 2% Serum", category: "skincare", productType: "serum",
    price: 21, shortDescription: "A high-strength oil-balancing serum.",
    fullDescription: "Pairs niacinamide with zinc for a stronger take on oil control and pore appearance.",
    howToUse: "Apply at night after toner.",
    keyIngredients: ["Niacinamide", "Zinc PCA"], skinTypes: ["oily", "combination"], concerns: ["excess-oil", "enlarged-pores"],
    nightUse: true,
  },

  // ---------------- Round Lab ----------------
  {
    brand: "Round Lab", name: "1025 Dokdo Toner", category: "skincare", productType: "toner",
    price: 19, shortDescription: "A mineral-rich hydrating toner from deep-sea water.",
    fullDescription: "Uses mineral-dense deep-sea water to hydrate and prep skin without common irritants.",
    howToUse: "Pat onto skin after cleansing.",
    keyIngredients: [], skinTypes: ["normal", "dry", "combination", "sensitive"], concerns: ["dehydration"],
    fragranceFree: true, sensitiveSkinFriendly: true,
  },

  // ---------------- Purito ----------------
  {
    brand: "Purito", name: "Centella Green Level Unscented Sun SPF 50+", category: "skincare", productType: "sunscreen",
    price: 17, shortDescription: "A fragrance-free daily sunscreen for sensitive skin.",
    fullDescription: "A widely-used lightweight sunscreen with centella extract for reactive skin types.",
    howToUse: "Apply as the last step of your morning routine.",
    keyIngredients: ["Centella Asiatica"], skinTypes: ["sensitive", "normal", "combination", "oily"], concerns: ["redness"],
    fragranceFree: true, spf: 50, morningUse: true, sensitiveSkinFriendly: true,
  },

  // ---------------- Isntree ----------------
  {
    brand: "Isntree", name: "Hyaluronic Acid Toner Gel", category: "skincare", productType: "toner",
    price: 18, shortDescription: "A gel-toner hybrid for lightweight hydration.",
    fullDescription: "A humectant-rich formula that layers easily under serum for sensitive or dehydrated skin.",
    howToUse: "Pat onto skin after cleansing, morning and night.",
    keyIngredients: ["Hyaluronic Acid"], skinTypes: ["dry", "sensitive", "normal", "combination"], concerns: ["dehydration"],
    fragranceFree: true, sensitiveSkinFriendly: true, morningUse: true, nightUse: true,
  },

  // ---------------- Torriden ----------------
  {
    brand: "Torriden", name: "DIVE-IN Low Molecular Hyaluronic Acid Serum", category: "skincare", productType: "serum",
    price: 16, shortDescription: "A five-type hyaluronic acid serum for deep hydration.",
    fullDescription: "Layers multiple molecular weights of hyaluronic acid for a plumper, dewier look.",
    howToUse: "Apply to damp skin morning and night.",
    keyIngredients: ["Hyaluronic Acid"], skinTypes: ["normal", "dry", "combination", "oily"], concerns: ["dehydration", "dullness"],
    finish: "dewy", morningUse: true, nightUse: true,
  },
];

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
