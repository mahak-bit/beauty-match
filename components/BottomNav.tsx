"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, Heart, Scale } from "lucide-react";
import { useSavedProducts, useCompareList } from "@/lib/client-store";

const ITEMS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/quiz", label: "Quiz", icon: Sparkles },
  { href: "/compare", label: "Compare", icon: Scale },
  { href: "/saved", label: "Saved", icon: Heart },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { savedIds } = useSavedProducts();
  const { compareIds } = useCompareList();
  const counts: Record<string, number> = { "/saved": savedIds.length, "/compare": compareIds.length };

  return (
    <nav
      aria-label="Primary"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-t border-[var(--hairline)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          const count = counts[href];
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-wide ${
                active ? "text-[var(--ink)]" : "text-[var(--muted)]"
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
              {label}
              {!!count && (
                <span className="absolute top-1 right-[28%] min-w-[14px] h-[14px] px-0.5 rounded-full bg-[var(--gold)] text-[8px] font-bold text-white flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
