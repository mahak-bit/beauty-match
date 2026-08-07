import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row justify-between gap-6 text-sm text-[var(--muted)]">
        <div>
          <div className="font-display italic text-xl text-[var(--paper)] mb-2">Match</div>
          <p className="max-w-sm">
            Every skin and every head of hair reads the world differently.
            Match reads yours first, then tells you what's actually worth buying.
          </p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
              Explore
            </span>
            <Link href="/quiz" className="hover:text-[var(--paper)]">Take the quiz</Link>
            <Link href="/discover" className="hover:text-[var(--paper)]">Discover</Link>
            <Link href="/brands" className="hover:text-[var(--paper)]">All brands</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
              For brands
            </span>
            <Link href="/admin/add-product" className="hover:text-[var(--paper)]">
              List a product
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
