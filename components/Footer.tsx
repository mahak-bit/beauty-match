import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--panel)] text-[var(--on-panel)] mt-24 pb-16 sm:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col md:flex-row justify-between gap-10 text-sm text-[var(--on-panel-muted)]">
        <div className="max-w-sm">
          <div className="font-display italic text-2xl text-[var(--on-panel)] mb-3">Beauty Match</div>
          <p className="leading-relaxed">
            Skincare matched to your skin, your concerns, and your
            preferences — with the reasoning shown, not hidden behind a
            black box.
          </p>
        </div>
        <div className="flex flex-wrap gap-12">
          <FooterGroup title="Explore">
            <Link href="/quiz">Skin quiz</Link>
            <Link href="/discover">Discover</Link>
            <Link href="/brands">Brands</Link>
            <Link href="/ingredients">Ingredients</Link>
            <Link href="/routines">Routines</Link>
          </FooterGroup>
          <FooterGroup title="You">
            <Link href="/compare">Compare</Link>
            <Link href="/saved">My beauty shelf</Link>
          </FooterGroup>
          <FooterGroup title="For brands">
            <Link href="/admin/add-product">List a product</Link>
          </FooterGroup>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-8 text-xs text-[var(--on-panel-muted)]/70 font-mono">
        Development catalogue — pricing and availability shown are illustrative sample data, not live retailer feeds.
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 [&_a]:hover:text-[var(--on-panel)] [&_a]:transition-colors">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--on-panel-muted)] mb-1">
        {title}
      </span>
      {children}
    </div>
  );
}
