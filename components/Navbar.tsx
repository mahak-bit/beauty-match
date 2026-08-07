import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[var(--ink)]/80 border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display italic text-2xl tracking-wide">
          Match
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--muted)]">
          <Link href="/quiz" className="hover:text-[var(--paper)] transition-colors">
            Take the quiz
          </Link>
          <Link href="/discover" className="hover:text-[var(--paper)] transition-colors">
            Discover
          </Link>
          <Link href="/brands" className="hover:text-[var(--paper)] transition-colors">
            Brands
          </Link>
        </nav>
        <Link
          href="/quiz"
          className="text-sm font-mono px-4 py-2 rounded-full border border-[var(--violet)] text-[var(--violet)] hover:bg-[var(--violet)] hover:text-[var(--ink)] transition-colors"
        >
          Find your match
        </Link>
      </div>
    </header>
  );
}
