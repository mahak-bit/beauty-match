"use client";

import { useEffect, useState } from "react";
import TagInput from "@/components/TagInput";
import { slugify } from "@/lib/slug";
import { Check, Plus } from "lucide-react";

type Brand = { id: string; name: string; slug: string };

const SKIN_SUGGESTIONS = ["oily", "dry", "combination", "sensitive", "normal"];
const HAIR_SUGGESTIONS = ["straight", "wavy", "curly", "coily"];
const CONCERN_SUGGESTIONS = [
  "acne",
  "pigmentation",
  "anti-aging",
  "dryness",
  "dullness",
  "frizz",
  "dandruff",
  "hairfall",
  "damage",
];

export default function AddProductPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState("");
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<"skincare" | "haircare" | "both">("skincare");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [ingredientsRaw, setIngredientsRaw] = useState("");
  const [cautions, setCautions] = useState("");
  const [keyIngredients, setKeyIngredients] = useState<string[]>([]);
  const [skinTypes, setSkinTypes] = useState<string[]>([]);
  const [hairTypes, setHairTypes] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBrands() {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data.brands ?? []);
  }

  useEffect(() => {
    // Fetch-on-mount: the setState happens asynchronously after the fetch
    // resolves, not synchronously within this effect's execution.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBrands();
  }, []);

  async function handleCreateBrand() {
    if (!newBrandName.trim()) return;
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newBrandName,
        slug: slugify(newBrandName),
        status: "live",
      }),
    });
    const data = await res.json();
    if (res.ok) {
      await loadBrands();
      setBrandId(data.id);
      setCreatingBrand(false);
      setNewBrandName("");
    }
  }

  function resetForm() {
    setName("");
    setSubcategory("");
    setPrice("");
    setShortDescription("");
    setFullDescription("");
    setHowToUse("");
    setIngredientsRaw("");
    setCautions("");
    setKeyIngredients([]);
    setSkinTypes([]);
    setHairTypes([]);
    setConcerns([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!brandId) {
      setError("Choose or create a brand first.");
      return;
    }
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId,
        name,
        slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 7),
        category,
        subcategory: subcategory || null,
        price: price ? parseFloat(price) : null,
        shortDescription,
        fullDescription,
        howToUse,
        ingredientsRaw,
        cautions,
        keyIngredients,
        skinTypes,
        hairTypes,
        concerns,
        status: "live",
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setSuccess(true);
    resetForm();
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">
        For brands & internal entry
      </span>
      <h1 className="font-display text-4xl mt-4 mb-2">List a product</h1>
      <p className="text-[var(--muted)] mb-10 max-w-xl">
        The more precisely a product is tagged here, the better the quiz and
        the AI agent can match it to the right person — this is the data
        everything else runs on.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-2">
            Brand
          </label>
          {!creatingBrand ? (
            <div className="flex gap-3">
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="flex-1 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              >
                <option value="">Select a brand…</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCreatingBrand(true)}
                className="flex items-center gap-1 px-4 py-3 rounded-lg border border-[var(--hairline)] text-sm text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors whitespace-nowrap"
              >
                <Plus size={14} /> New brand
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Brand name"
                className="flex-1 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              />
              <button
                type="button"
                onClick={handleCreateBrand}
                className="px-4 py-3 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setCreatingBrand(false)}
                className="px-4 py-3 rounded-lg border border-[var(--hairline)] text-sm text-[var(--muted)]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <Field label="Product name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="e.g. Niacinamide 10% Serum"
          />
        </Field>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "skincare" | "haircare" | "both")}
              className="input"
            >
              <option value="skincare">Skincare</option>
              <option value="haircare">Haircare</option>
              <option value="both">Both</option>
            </select>
          </Field>
          <Field label="Subcategory">
            <input
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="input"
              placeholder="e.g. serum, shampoo"
            />
          </Field>
        </div>

        <Field label="Price (INR)">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            className="input"
            placeholder="599"
          />
        </Field>

        <Field label="Short description" hint="Shown on cards — one sentence">
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="input"
            placeholder="A lightweight serum that fades dark spots without irritation."
          />
        </Field>

        <Field label="Full description">
          <textarea
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            className="input min-h-[120px]"
            placeholder="Write the full product story — what it does, who it's for, why it works."
          />
        </Field>

        <Field label="How to use">
          <textarea
            value={howToUse}
            onChange={(e) => setHowToUse(e.target.value)}
            className="input min-h-[80px]"
            placeholder="Apply 2-3 drops at night after cleansing, before moisturizer."
          />
        </Field>

        <TagInput
          label="Key ingredients"
          hint="e.g. Niacinamide — press Enter"
          value={keyIngredients}
          onChange={setKeyIngredients}
        />

        {category !== "haircare" && (
          <TagInput
            label="Suitable skin types"
            value={skinTypes}
            onChange={setSkinTypes}
            suggestions={SKIN_SUGGESTIONS}
          />
        )}

        {category !== "skincare" && (
          <TagInput
            label="Suitable hair types"
            value={hairTypes}
            onChange={setHairTypes}
            suggestions={HAIR_SUGGESTIONS}
          />
        )}

        <TagInput
          label="Addresses concerns"
          value={concerns}
          onChange={setConcerns}
          suggestions={CONCERN_SUGGESTIONS}
        />

        <Field label="Full ingredient list" hint="Optional — paste the label copy">
          <textarea
            value={ingredientsRaw}
            onChange={(e) => setIngredientsRaw(e.target.value)}
            className="input min-h-[80px] font-mono text-xs"
          />
        </Field>

        <Field label="Cautions" hint="Optional — shown as a warning on the product page">
          <input
            value={cautions}
            onChange={(e) => setCautions(e.target.value)}
            className="input"
            placeholder="Avoid combining with retinol. Patch test first."
          />
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--bg)] font-medium hover:bg-[var(--gold-deep)] transition-colors disabled:opacity-50"
        >
          {success ? (
            <>
              <Check size={16} /> Added — list another
            </>
          ) : submitting ? (
            "Saving…"
          ) : (
            "Add product"
          )}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--hairline);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--gold);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-2">
        {label}
        {hint && <span className="normal-case font-sans text-[var(--muted)]/70"> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}