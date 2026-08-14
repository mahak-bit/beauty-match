"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Scale, Menu, X } from "lucide-react";
import { useSavedProducts, useCompareList } from "@/lib/client-store";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/quiz", label: "Skin Quiz" },
  { href: "/brands", label: "Brands" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/routines", label: "Routines" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { savedIds } = useSavedProducts();
  const { compareIds } = useCompareList();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg)]/85 border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display italic text-2xl tracking-wide text-[var(--ink)] shrink-0">
          Beauty Match
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-[var(--muted)]">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-1 transition-colors hover:text-[var(--ink)] ${
                  active ? "text-[var(--ink)]" : ""
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[var(--gold)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/discover"
            aria-label="Search products"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Search size={17} />
          </Link>
          <Link
            href="/compare"
            aria-label={`Compare list, ${compareIds.length} products`}
            className="relative hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Scale size={17} />
            {compareIds.length > 0 && <CountDot count={compareIds.length} />}
          </Link>
          <Link
            href="/saved"
            aria-label={`Beauty shelf, ${savedIds.length} saved products`}
            className="relative flex w-9 h-9 rounded-full items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Heart size={17} />
            {savedIds.length > 0 && <CountDot count={savedIds.length} />}
          </Link>

          <Link
            href="/quiz"
            className="hidden sm:inline-flex text-sm font-medium px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--gold-deep)] transition-colors"
          >
            Find my match
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="lg:hidden w-9 h-9 flex items-center justify-center text-[var(--ink)]"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[var(--panel)]/40 z-[60] lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-[var(--bg)] z-[70] lg:hidden flex flex-col p-6 border-l border-[var(--hairline)]"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display italic text-xl">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-9 h-9 flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {[...LINKS, { href: "/compare", label: "Compare" }, { href: "/saved", label: "Saved — My Beauty Shelf" }].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-3.5 border-b border-[var(--hairline)] font-display italic text-2xl text-[var(--ink)]"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/quiz"
                onClick={() => setOpen(false)}
                className="mt-auto text-center text-sm font-medium px-6 py-4 rounded-full bg-[var(--ink)] text-[var(--bg)]"
              >
                Find my match
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function CountDot({ count }: { count: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[var(--gold)] text-[9px] font-mono font-bold text-white flex items-center justify-center">
      {count}
    </span>
  );
}
