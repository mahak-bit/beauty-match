"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Try “niacinamide oily skin” or a brand name…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  // Resets the local draft when the parent's value changes externally (e.g.
  // "clear filters") — adjusted during render rather than in an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (value !== syncedValue) {
    setSyncedValue(value);
    setLocal(value);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <div className="relative">
      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products, brands, ingredients, or concerns"
        className="w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-full pl-11 pr-11 py-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--gold)] transition-colors"
      />
      {local && (
        <button
          onClick={() => setLocal("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
