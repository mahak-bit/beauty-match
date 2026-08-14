import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brands",
  description: "Every brand on Beauty Match, from mass-market staples to clinical, K-beauty, and Indian formulations.",
};

const SEGMENT_LABELS: Record<string, string> = {
  mass: "Mass market",
  clinical: "Dermatology & clinical",
  "k-beauty": "K-beauty",
  indian: "Indian beauty",
  premium: "Premium",
  indie: "Indie",
};

export default async function BrandsPage() {
  const rows = await db.select().from(brands).where(eq(brands.status, "live"));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">
        {rows.length} brands and counting
      </span>
      <h1 className="font-display text-4xl sm:text-5xl italic mt-3 mb-10 text-[var(--ink)]">Every brand, one shelf</h1>

      {rows.length === 0 ? (
        <EmptyState
          title="No brands listed yet"
          body="Brands appear here as soon as they're added."
          action={<Link href="/admin/add-product" className="px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-sm">List the first one</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((b) => (
            <Link
              key={b.id}
              href={`/brands/${b.slug}`}
              className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-6 hover:border-[var(--gold)] transition-colors"
            >
              <h3 className="font-display italic text-2xl text-[var(--ink)]">{b.name}</h3>
              {b.tagline && <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{b.tagline}</p>}
              {b.segment && (
                <div className="mt-4">
                  <Badge tone="gold">{SEGMENT_LABELS[b.segment] ?? b.segment}</Badge>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
