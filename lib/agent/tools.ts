import { tool } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * The core tool the agent calls to turn a conversation into real results.
 * It queries the live product table — this is what makes the quiz
 * "agentic" rather than a static filter form: the model decides what to
 * search for based on how the conversation actually went, then explains
 * its reasoning using the fields returned here.
 */
export const searchProducts = tool({
  description:
    "Search the live product catalog for items matching a person's skin/hair profile and concerns. Always call this before recommending anything — never invent products.",
  inputSchema: z.object({
    category: z.enum(["skincare", "haircare", "both"]),
    skinType: z
      .enum(["oily", "dry", "combination", "sensitive", "normal"])
      .optional(),
    hairType: z.enum(["straight", "wavy", "curly", "coily"]).optional(),
    concerns: z
      .array(z.string())
      .describe(
        "e.g. ['acne','pigmentation'] for skin, ['frizz','dandruff'] for hair"
      ),
  }),
  execute: async ({ category, skinType, hairType, concerns }) => {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        brandName: brands.name,
        category: products.category,
        subcategory: products.subcategory,
        price: products.price,
        shortDescription: products.shortDescription,
        keyIngredients: products.keyIngredients,
        skinTypes: products.skinTypes,
        hairTypes: products.hairTypes,
        concerns: products.concerns,
        cautions: products.cautions,
      })
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.status, "live"));

    // Score in application code rather than SQL — the catalog is small
    // enough for this, and it keeps the matching logic easy to tune.
    const scored = rows
      .filter((p) => p.category === category || p.category === "both")
      .map((p) => {
        let score = 0;
        const pSkin: string[] = p.skinTypes ? JSON.parse(p.skinTypes) : [];
        const pHair: string[] = p.hairTypes ? JSON.parse(p.hairTypes) : [];
        const pConcerns: string[] = p.concerns ? JSON.parse(p.concerns) : [];

        if (skinType && pSkin.includes(skinType)) score += 2;
        if (hairType && pHair.includes(hairType)) score += 2;
        concerns.forEach((c) => {
          if (pConcerns.map((x) => x.toLowerCase()).includes(c.toLowerCase())) {
            score += 1;
          }
        });
        return { ...p, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return { results: scored, count: scored.length };
  },
});

export const agentTools = { searchProducts };
