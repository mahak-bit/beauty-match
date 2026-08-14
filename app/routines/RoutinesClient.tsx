"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X, Sun, Moon, Plus } from "lucide-react";
import { useDraftRoutine, useRoutines } from "@/lib/client-store";
import { useProductsByIds } from "@/lib/hooks/useProductsByIds";
import { findRoutineConflicts } from "@/lib/data/ingredients";
import { AM_PM_ORDER } from "@/lib/data/categories";
import type { Product } from "@/lib/types";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { formatPrice } from "@/lib/db/parse";

export default function RoutinesClient() {
  const { draft, removeFromSlot, addToSlot, clearDraft } = useDraftRoutine();
  const { routines, save, remove: removeRoutine } = useRoutines();
  const [routineName, setRoutineName] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<"am" | "pm" | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const { products: amProducts } = useProductsByIds(draft.am);
  const { products: pmProducts } = useProductsByIds(draft.pm);

  const sortedAm = useMemo(
    () => [...amProducts].sort((a, b) => (AM_PM_ORDER[a.productType ?? ""] ?? 99) - (AM_PM_ORDER[b.productType ?? ""] ?? 99)),
    [amProducts]
  );
  const sortedPm = useMemo(
    () => [...pmProducts].sort((a, b) => (AM_PM_ORDER[a.productType ?? ""] ?? 99) - (AM_PM_ORDER[b.productType ?? ""] ?? 99)),
    [pmProducts]
  );

  const allIngredients = [...amProducts, ...pmProducts].flatMap((p) => p.keyIngredients);
  const conflicts = findRoutineConflicts(allIngredients);

  useEffect(() => {
    if (!pickerSlot) return;
    const t = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => setResults((d.products ?? []).slice(0, 6)));
    }, 250);
    return () => clearTimeout(t);
  }, [query, pickerSlot]);

  function handleSave() {
    if (!routineName.trim() || (draft.am.length === 0 && draft.pm.length === 0)) return;
    save({ name: routineName.trim(), am: draft.am, pm: draft.pm });
    setRoutineName("");
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Routine builder</span>
      <h1 className="font-display text-4xl sm:text-5xl italic mt-3 mb-4 text-[var(--ink)]">Build your routine</h1>
      <p className="text-[var(--muted)] max-w-xl mb-10 leading-relaxed">
        Add products from any product page, or search below. We&apos;ll order
        each slot in a sensible cleanse → treat → moisturize → protect
        sequence and flag actives that are commonly introduced separately.
      </p>

      {conflicts.length > 0 && (
        <div className="flex gap-3 rounded-xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] p-4 mb-10">
          <AlertTriangle size={18} className="text-[var(--warn)] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--warn)] mb-1">Routine compatibility</p>
            <ul className="text-sm text-[var(--ink-soft)] space-y-1">
              {conflicts.map((c, i) => (
                <li key={i}>
                  {c.a} and {c.b} are commonly introduced on alternating days or times rather than layered together — start slow and watch how skin responds.
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <RoutineSlot
          label="Morning"
          icon={<Sun size={16} />}
          products={sortedAm}
          onRemove={(id) => removeFromSlot(id, "am")}
          onAdd={() => setPickerSlot("am")}
        />
        <RoutineSlot
          label="Night"
          icon={<Moon size={16} />}
          products={sortedPm}
          onRemove={(id) => removeFromSlot(id, "pm")}
          onAdd={() => setPickerSlot("pm")}
        />
      </div>

      {(draft.am.length > 0 || draft.pm.length > 0) && (
        <div className="mt-12 rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Name this routine — e.g. Summer glow"
            className="flex-1 bg-transparent border border-[var(--hairline)] rounded-full px-5 py-3 text-sm outline-none focus:border-[var(--gold)]"
          />
          <button onClick={handleSave} className="px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--bg)] text-sm font-medium whitespace-nowrap">
            {savedMessage ? "Saved ✓" : "Save routine"}
          </button>
          <button onClick={clearDraft} className="px-6 py-3 rounded-full border border-[var(--hairline)] text-sm text-[var(--muted)] whitespace-nowrap">
            Clear
          </button>
        </div>
      )}

      {routines.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl italic text-[var(--ink)] mb-6">Saved routines</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {routines.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[var(--hairline)] p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--ink)]">{r.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{r.am.length} AM · {r.pm.length} PM</p>
                </div>
                <button onClick={() => removeRoutine(r.id)} className="text-xs text-[var(--muted)] hover:text-[var(--warn)]">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pickerSlot && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-[var(--panel)]/50" onClick={() => setPickerSlot(null)} />
          <div role="dialog" aria-modal="true" aria-label={`Add product to ${pickerSlot === "am" ? "morning" : "night"} routine`} className="relative bg-[var(--bg)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display italic text-xl">Add to {pickerSlot === "am" ? "morning" : "night"}</span>
              <button onClick={() => setPickerSlot(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <SearchBar value={query} onChange={setQuery} placeholder="Search products…" />
            <div className="mt-4 space-y-2">
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    addToSlot(p.id, pickerSlot);
                    setPickerSlot(null);
                    setQuery("");
                  }}
                  className="w-full text-left rounded-xl border border-[var(--hairline)] p-3 hover:border-[var(--gold)] transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--ink)]">{p.name}</p>
                    <p className="text-xs text-[var(--muted)]">{p.brandName}</p>
                  </div>
                  <span className="text-xs font-mono text-[var(--gold-deep)]">{formatPrice(p.price, p.currency)}</span>
                </button>
              ))}
              {query && results.length === 0 && <p className="text-sm text-[var(--muted)] py-4">No matches.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoutineSlot({
  label,
  icon,
  products,
  onRemove,
  onAdd,
}: {
  label: string;
  icon: React.ReactNode;
  products: Product[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-medium text-[var(--ink)] mb-4">
        {icon} {label}
      </h2>
      {products.length === 0 ? (
        <EmptyState title="Empty" body="No steps added yet." />
      ) : (
        <ol className="space-y-2">
          {products.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 rounded-xl border border-[var(--hairline)] bg-[var(--surface)] p-3">
              <span className="w-6 h-6 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-xs font-mono text-[var(--muted)] shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${p.id}`} className="text-sm font-medium text-[var(--ink)] hover:text-[var(--gold-deep)] truncate block">
                  {p.name}
                </Link>
                <p className="text-xs text-[var(--muted)] truncate">{p.brandName}</p>
              </div>
              <button onClick={() => onRemove(p.id)} aria-label={`Remove ${p.name}`} className="text-[var(--muted)] hover:text-[var(--warn)] shrink-0">
                <X size={14} />
              </button>
            </li>
          ))}
        </ol>
      )}
      <button
        onClick={onAdd}
        className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[var(--hairline)] text-sm text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--ink)] transition-colors"
      >
        <Plus size={14} /> Add a step
      </button>
    </div>
  );
}
