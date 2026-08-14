"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

export default function TagInput({
  label,
  hint,
  value,
  onChange,
  suggestions,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-2">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 focus-within:border-[var(--gold)]">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs bg-[var(--surface-2)] border border-[var(--hairline)] px-2 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft && addTag(draft)}
          placeholder={value.length === 0 ? hint ?? "Type and press Enter" : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions
            .filter((s) => !value.includes(s))
            .map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => addTag(s)}
                className="text-[10px] px-2 py-1 rounded-full border border-[var(--hairline)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
