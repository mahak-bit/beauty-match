"use client";

import { SKIN_TYPES, HAIR_TYPES, SKIN_CONCERNS, HAIR_CONCERNS } from "@/lib/data/concerns";

export type DiscoverFilters = {
  category: "all" | "skincare" | "haircare";
  skinType: string | null;
  hairType: string | null;
  concern: string | null;
  priceMax: number | null;
  fragranceFree: boolean;
  sensitiveSkinFriendly: boolean;
  spfOnly: boolean;
};

export const DEFAULT_FILTERS: DiscoverFilters = {
  category: "all",
  skinType: null,
  hairType: null,
  concern: null,
  priceMax: null,
  fragranceFree: false,
  sensitiveSkinFriendly: false,
  spfOnly: false,
};

export function activeFilterCount(f: DiscoverFilters): number {
  let n = 0;
  if (f.category !== "all") n++;
  if (f.skinType) n++;
  if (f.hairType) n++;
  if (f.concern) n++;
  if (f.priceMax) n++;
  if (f.fragranceFree) n++;
  if (f.sensitiveSkinFriendly) n++;
  if (f.spfOnly) n++;
  return n;
}

export default function FilterPanel({
  filters,
  onChange,
  maxPrice = 2000,
}: {
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
  maxPrice?: number;
}) {
  const set = <K extends keyof DiscoverFilters>(key: K, value: DiscoverFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const concernOptions =
    filters.category === "haircare" ? HAIR_CONCERNS : filters.category === "skincare" ? SKIN_CONCERNS : [...SKIN_CONCERNS, ...HAIR_CONCERNS];

  return (
    <div className="space-y-8">
      <FilterGroup label="Category">
        {(["all", "skincare", "haircare"] as const).map((c) => (
          <Chip key={c} active={filters.category === c} onClick={() => set("category", c)}>
            {c}
          </Chip>
        ))}
      </FilterGroup>

      {filters.category !== "haircare" && (
        <FilterGroup label="Skin type">
          {SKIN_TYPES.map((t) => (
            <Chip key={t.slug} active={filters.skinType === t.slug} onClick={() => set("skinType", filters.skinType === t.slug ? null : t.slug)}>
              {t.label}
            </Chip>
          ))}
        </FilterGroup>
      )}

      {filters.category !== "skincare" && (
        <FilterGroup label="Hair type">
          {HAIR_TYPES.map((t) => (
            <Chip key={t.slug} active={filters.hairType === t.slug} onClick={() => set("hairType", filters.hairType === t.slug ? null : t.slug)}>
              {t.label}
            </Chip>
          ))}
        </FilterGroup>
      )}

      <FilterGroup label="Concern">
        {concernOptions.map((c) => (
          <Chip key={c.slug} active={filters.concern === c.slug} onClick={() => set("concern", filters.concern === c.slug ? null : c.slug)}>
            {c.label}
          </Chip>
        ))}
      </FilterGroup>

      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-3">
          Max price {filters.priceMax ? `— ${filters.priceMax}` : ""}
        </span>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={10}
          value={filters.priceMax ?? maxPrice}
          onChange={(e) => set("priceMax", Number(e.target.value) === maxPrice ? null : Number(e.target.value))}
          className="w-full accent-[var(--gold)]"
          aria-label="Maximum price"
        />
      </div>

      <div className="space-y-3">
        <Toggle label="Fragrance-free only" checked={filters.fragranceFree} onChange={(v) => set("fragranceFree", v)} />
        <Toggle label="Sensitive-skin-friendly only" checked={filters.sensitiveSkinFriendly} onChange={(v) => set("sensitiveSkinFriendly", v)} />
        <Toggle label="Has SPF" checked={filters.spfOnly} onChange={(v) => set("spfOnly", v)} />
      </div>

      {activeFilterCount(filters) > 0 && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-xs font-mono uppercase tracking-widest text-[var(--gold-deep)] hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-2.5">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
        active
          ? "bg-[var(--ink)] border-[var(--ink)] text-[var(--bg)]"
          : "border-[var(--hairline)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm text-[var(--ink-soft)] cursor-pointer select-none">
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onChange(!checked))}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-[var(--gold)]" : "bg-[var(--hairline)]"}`}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />
      </span>
      {label}
    </label>
  );
}
