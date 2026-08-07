# Match — beauty & haircare discovery platform

A multi-brand beauty and haircare discovery site: a conversational AI quiz
that forks for skin / hair / both, a filterable discovery feed, a brand
directory, detailed product pages, and a product-entry form so you can add
brands and products by hand.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Drizzle ORM** + libSQL (SQLite, ships prebuilt binaries — no native compilation needed on any OS, including Windows) locally, swap to Postgres/Supabase or Turso for production — see below
- **Vercel AI SDK** (`ai` + `@ai-sdk/anthropic` + `@ai-sdk/react`) for the agentic quiz
- **Tailwind CSS v4**
- **Clerk** is *not* wired up yet — the admin form is currently open to anyone
  with the URL. Add real auth before this goes live publicly (see below).

## Getting started

```bash
npm install

# create the local SQLite database from the schema
npm run db:push

# optional — adds 5 sample brands and 6 products so the site isn't empty
npm run db:seed

# add your Anthropic key so the quiz agent can respond
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

npm run dev
```

Then open http://localhost:3000.

Note: `next/font/google` needs internet access at build time to fetch
Instrument Serif, Inter, and Space Mono — this works fine on your machine
and on Vercel, it only fails in network-restricted sandboxes.

## How the pieces fit together

- **`lib/db/schema.ts`** — the whole data model: `brands`, `products`,
  `quizSessions`. Every product has structured fields (`skinTypes`,
  `hairTypes`, `concerns`, `keyIngredients`) that both the discovery filters
  and the AI agent query against — this is what makes recommendations
  explainable instead of a black box.
- **`app/admin/add-product`** — the form you'll use to add brands and write
  product data by hand. Ingredients/skin-types/concerns are tag inputs so
  they stay structured (queryable) rather than free text.
- **`app/quiz`** — the conversational agent. It picks skin/hair/both, asks
  adaptive follow-ups, then calls a real tool (`searchProducts` in
  `lib/agent/tools.ts`) against your live product table before ever
  recommending anything — it can't invent products.
- **`app/discover`** — a non-quiz browsing path with manual filters, for
  people who just want to scroll.
- **`app/brands`** and **`app/brands/[slug]`** — the brand directory and
  individual brand pages.
- **`app/products/[id]`** — the detailed product page: full description,
  how-to-use, key ingredients, suitability tags, cautions.

## Adding your first real products

1. Go to `/admin/add-product`
2. Create a brand (or pick an existing one)
3. Fill in the product — the more precisely you tag skin/hair types and
   concerns, the better both the quiz and the discovery filters work
4. Repeat for every product you're featuring

There's no limit on brands — the schema was built so "every brand" is just
more rows, not a redesign.

## Going to production

**Database:** swap `lib/db/index.ts` from `better-sqlite3` to a Postgres
driver (e.g. `@supabase/supabase-js` or `postgres` + `drizzle-orm/postgres-js`),
point `drizzle.config.ts` at your Postgres URL, and run `db:push` again.
Your schema file doesn't need to change.

**Auth for the admin form:** right now anyone with the URL can add
products. Before brands manage their own listings for real, wire up Clerk
(or NextAuth) and gate `/admin/*` behind a logged-in brand or admin account —
the `ownerEmail` field on `brands` is already there for this.

**AI cost/safety:** the agent currently has no rate limiting. Add basic
throttling per session before opening the quiz to real traffic.

## What's intentionally left for you

- Real photography/product images (currently text-only cards)
- Payment/checkout — this is a discovery platform, not a storefront, unless
  you want to extend it that way later
- Brand-side login/dashboard (schema supports it, UI doesn't exist yet)
