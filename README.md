# Beauty Match — AI-matched skincare & haircare discovery

A premium beauty-tech discovery platform: a conversational AI quiz and a
quick static quiz that both feed a transparent, explainable matching
engine, a searchable/filterable product catalogue spanning mass, clinical,
K-beauty, and Indian beauty brands, an ingredient explorer, an AM/PM
routine builder with active-ingredient conflict checking, side-by-side
compare, and a localStorage-backed "Beauty Shelf" for saved products and
routines.

## Stack

- **Next.js 16** (App Router, Turbopack) — note the `proxy.ts` file
  convention (renamed from `middleware.ts` in this version)
- **Drizzle ORM** + libSQL (SQLite, ships prebuilt binaries — no native
  compilation needed on any OS, including Windows) locally, swap to
  Postgres/Supabase or Turso for production — see below
- **Vercel AI SDK** (`ai` + `@ai-sdk/anthropic` + `@ai-sdk/react`) for the
  agentic quiz
- **Framer Motion** for the animation system (`lib/motion.ts`) — centralized
  fade/scale/slide/stagger/float variants, no bespoke transitions per file
- **Tailwind CSS v4**
- **Clerk** is *not* wired up yet — the admin form is currently open to anyone
  with the URL. Add real auth before this goes live publicly (see below).

## Getting started

```bash
npm install

# create the local SQLite database from the schema
npm run db:push

# adds 28 brands (mass/clinical/K-beauty/Indian) and 54 products —
# clearly-labeled development seed data (dataSource: "seed"), not real
# verified product listings
npm run db:seed

# add your Anthropic key so the AI-conversational quiz can respond
# (optional — the default quiz is a fast static flow that needs no AI credits)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

npm run dev
```

Then open http://localhost:3000.

Note: `next/font/google` needs internet access at build time to fetch
Instrument Serif, Inter, and Space Mono — this works fine on your machine
and on Vercel, it only fails in network-restricted sandboxes.

## How the pieces fit together

- **`lib/db/schema.ts`** — the data model: `brands` and `products`, with
  structured matching fields (`skinTypes`, `hairTypes`, `concerns`,
  `keyIngredients`, `texture`, `fragranceFree`, `comedogenicRisk`,
  `sensitiveSkinFriendly`, `spf`, `country`/`market`/`currency`, …) so the
  catalogue can scale toward real multi-market data without a schema
  redesign. `lib/types.ts` and `lib/db/parse.ts` turn raw rows into the
  typed `Product`/`Brand` shapes the UI actually uses.
- **`lib/match/engine.ts`** — the Beauty Match scoring model: skin type,
  concern, ingredient, preference, budget, texture, and routine
  compatibility, minus a potential-irritant penalty, with the reasons and
  caveats behind every score exposed (`scoreProduct`/`rankProducts`) —
  never a bare percentage.
- **`lib/data/`** — shared reference data: the concern/skin-type taxonomy,
  the product-category taxonomy (cleanser → sunscreen → body care, ~40
  types), and an educational ingredient reference (`ingredients.ts`) used
  by the match engine, the Ingredient Explorer, and the routine builder's
  conflict checker.
- **`app/quiz`** — `QuizStatic` (default, no AI cost) runs a short
  preference quiz and reveals a cinematic, scored result using the match
  engine; `QuizChat` is the AI-conversational alternative, gated behind
  `NEXT_PUBLIC_USE_AI_QUIZ=true`, and calls a real tool
  (`searchProducts` in `lib/agent/tools.ts`) against the live product
  table — it can't invent products.
- **`app/discover`** — search (name/brand/ingredient/concern-aware),
  filters, and sort over the live catalogue.
- **`app/products/[id]`** — the product detail page: match score (once
  you've taken the quiz), add-to-routine/compare/save, full breakdown,
  similar products, cheaper/premium alternatives.
- **`app/ingredients`** — the Ingredient Explorer.
- **`app/routines`**, **`app/compare`**, **`app/saved`** — the routine
  builder, comparison table, and Beauty Shelf. There's no auth system yet,
  so these persist per-browser via `lib/client-store.ts`
  (`useSyncExternalStore` over `localStorage`) rather than a fake account.
- **`app/brands`** and **`app/brands/[slug]`** — the brand directory and
  individual brand pages.
- **`app/admin/add-product`** — the form for adding brands and writing
  product data by hand. Ingredients/skin-types/concerns are tag inputs so
  they stay structured (queryable) rather than free text.

## Adding your first real products

1. Go to `/admin/add-product`
2. Create a brand (or pick an existing one)
3. Fill in the product — the more precisely you tag skin/hair types,
   concerns, texture, and suitability flags, the better the quiz, filters,
   and match engine all work
4. Repeat for every product you're featuring

There's no limit on brands — the schema was built so "every brand" is just
more rows, not a redesign.

## Going to production

**Database:** point `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` at a real Turso
database, or swap `lib/db/index.ts` to a Postgres driver (e.g.
`@supabase/supabase-js` or `postgres` + `drizzle-orm/postgres-js`) and point
`drizzle.config.ts` at your Postgres URL, then run `db:push` again. Your
schema file doesn't need to change.

**Product data:** the seed catalogue is development sample data
(`dataSource: "seed"`), not verified real-world product listings — prices,
availability, and formulation flags are editorial best-effort, and
ratings/review counts/ingredient percentages are intentionally left unset
rather than invented. Replace it via the admin form, a CSV/JSON import
script against `lib/db/schema.ts`, or a real product feed before launch.

**Auth for the admin form:** right now anyone with the URL can add
products. Before brands manage their own listings for real, wire up Clerk
(or NextAuth) and gate `/admin/*` behind a logged-in brand or admin account —
the `ownerEmail` field on `brands` is already there for this.

**AI cost/safety:** the agent currently has no rate limiting. Add basic
throttling per session before opening the AI quiz to real traffic.

## What's intentionally left for you

- Real photography/product images (product visuals are a CSS-only glass
  "bottle" placeholder rather than fabricated stock photography)
- Payment/checkout — this is a discovery platform, not a storefront, unless
  you want to extend it that way later
- Brand-side login/dashboard (schema supports it, UI doesn't exist yet)
- Real per-market pricing/currency conversion — products carry their own
  `currency`/`market`, but cross-currency filtering (e.g. a single price
  slider across INR and USD listings) is a known simplification
