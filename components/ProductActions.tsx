"use client";

import { useState } from "react";
import { Heart, Scale, Check, Sun, Moon } from "lucide-react";
import { useSavedProducts, useCompareList, useDraftRoutine } from "@/lib/client-store";
import { MagneticButton } from "@/components/MagneticButton";

export default function ProductActions({
  productId,
  morningUse,
  nightUse,
}: {
  productId: string;
  morningUse?: boolean | null;
  nightUse?: boolean | null;
}) {
  const { isSaved, toggle } = useSavedProducts();
  const { isInCompare, toggle: toggleCompare } = useCompareList();
  const { draft, addToSlot, removeFromSlot } = useDraftRoutine();
  const [justAdded, setJustAdded] = useState<"am" | "pm" | null>(null);

  const inAm = draft.am.includes(productId);
  const inPm = draft.pm.includes(productId);

  function handleAdd(slot: "am" | "pm") {
    if (slot === "am" ? inAm : inPm) {
      removeFromSlot(productId, slot);
      return;
    }
    addToSlot(productId, slot);
    setJustAdded(slot);
    setTimeout(() => setJustAdded(null), 1800);
  }

  const suggestAm = morningUse !== false;
  const suggestPm = nightUse !== false;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {suggestAm && (
          <MagneticButton
            onClick={() => handleAdd("am")}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-colors ${
              inAm ? "bg-[var(--gold)] text-white" : "bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--gold-deep)]"
            }`}
          >
            {inAm ? <Check size={15} /> : <Sun size={15} />}
            {inAm ? "In AM routine" : "Add to AM routine"}
          </MagneticButton>
        )}
        {suggestPm && (
          <MagneticButton
            onClick={() => handleAdd("pm")}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border transition-colors ${
              inPm ? "bg-[var(--gold)] text-white border-[var(--gold)]" : "border-[var(--hairline)] text-[var(--ink)] hover:border-[var(--gold)]"
            }`}
          >
            {inPm ? <Check size={15} /> : <Moon size={15} />}
            {inPm ? "In PM routine" : "Add to PM routine"}
          </MagneticButton>
        )}

        <button
          onClick={() => toggle(productId)}
          aria-pressed={isSaved(productId)}
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
            isSaved(productId) ? "bg-[var(--gold)] border-[var(--gold)] text-white" : "border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
          aria-label={isSaved(productId) ? "Remove from saved" : "Save product"}
        >
          <Heart size={16} fill={isSaved(productId) ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => toggleCompare(productId)}
          aria-pressed={isInCompare(productId)}
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
            isInCompare(productId) ? "bg-[var(--ink)] border-[var(--ink)] text-[var(--bg)]" : "border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
          aria-label={isInCompare(productId) ? "Remove from compare" : "Add to compare"}
        >
          <Scale size={16} />
        </button>
      </div>
      {justAdded && (
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--gold-deep)] mt-3">
          Added to your {justAdded.toUpperCase()} routine — continue building in Routines →
        </p>
      )}
    </div>
  );
}
