import Link from "next/link";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const rows = await db.select().from(brands).where(eq(brands.status, "live"));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">
        {rows.length} brands and counting
      </span>
      <h1 className="font-display text-4xl mt-4 mb-10">Every brand, one shelf</h1>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[var(--hairline)] p-12 text-center text-[var(--muted)]">
          <p>No brands listed yet.</p>
          <Link href="/admin/add-product" className="text-[var(--violet)] mt-2 inline-block">
            List the first one →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((b) => (
            <Link
              key={b.id}
              href={`/brands/${b.slug}`}
              className="rounded-xl border border-[var(--hairline)] bg-[var(--surface)] p-6 hover:border-[var(--violet)] transition-colors"
            >
              <h3 className="font-display italic text-2xl">{b.name}</h3>
              {b.tagline && (
                <p className="text-sm text-[var(--muted)] mt-2">{b.tagline}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
