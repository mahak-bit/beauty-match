"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

type Path = "skin" | "hair" | "both";

const SKIN_TYPES = ["oily", "dry", "combination", "sensitive", "normal"];
const HAIR_TYPES = ["straight", "wavy", "curly", "coily"];
const SKIN_CONCERNS = ["acne", "pigmentation", "dryness", "dullness"];
const HAIR_CONCERNS = ["frizz", "dandruff", "hairfall", "damage"];

type Step = "path" | "skinType" | "hairType" | "concerns" | "results";

export default function QuizStatic() {
  const [path, setPath] = useState<Path | null>(null);
  const [step, setStep] = useState<Step>("path");
  const [skinType, setSkinType] = useState<string | null>(null);
  const [hairType, setHairType] = useState<string | null>(null);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);

  function choosePath(p: Path) {
    setPath(p);
    if (p === "skin") setStep("skinType");
    else if (p === "hair") setStep("hairType");
    else setStep("skinType");
  }

  function afterSkinType() {
    if (path === "both") setStep("hairType");
    else setStep("concerns");
  }

  function afterHairType() {
    setStep("concerns");
  }

  async function getResults() {
    setLoading(true);
    const params = new URLSearchParams();
    if (path && path !== "both") params.set("category", path === "skin" ? "skincare" : "haircare");
    if (skinType) params.set("skinType", skinType);
    if (hairType) params.set("hairType", hairType);
    if (concerns[0]) params.set("concern", concerns[0]);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setResults(data.products ?? []);
    setLoading(false);
    setStep("results");
  }

  const concernOptions =
    path === "hair" ? HAIR_CONCERNS : path === "skin" ? SKIN_CONCERNS : [...SKIN_CONCERNS, ...HAIR_CONCERNS];

  return (
    <div className="max-w-lg mx-auto py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">
        Quick match — no AI needed
      </span>

      <AnimatePresence mode="wait">
        {step === "path" && (
          <motion.div
            key="path"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display text-4xl mt-4 mb-10">What are you shopping for?</h1>
            <div className="grid gap-4">
              <OptionButton label="Skin" onClick={() => choosePath("skin")} />
              <OptionButton label="Hair" onClick={() => choosePath("hair")} />
              <OptionButton label="Both" onClick={() => choosePath("both")} />
            </div>
          </motion.div>
        )}

        {step === "skinType" && (
          <motion.div
            key="skinType"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display text-3xl mt-4 mb-8">What's your skin type?</h1>
            <div className="grid grid-cols-2 gap-3">
              {SKIN_TYPES.map((t) => (
                <OptionButton
                  key={t}
                  label={t}
                  onClick={() => {
                    setSkinType(t);
                    afterSkinType();
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === "hairType" && (
          <motion.div
            key="hairType"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display text-3xl mt-4 mb-8">What's your hair type?</h1>
            <div className="grid grid-cols-2 gap-3">
              {HAIR_TYPES.map((t) => (
                <OptionButton
                  key={t}
                  label={t}
                  onClick={() => {
                    setHairType(t);
                    afterHairType();
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === "concerns" && (
          <motion.div
            key="concerns"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display text-3xl mt-4 mb-8">What's your main concern?</h1>
            <div className="grid grid-cols-2 gap-3">
              {concernOptions.map((c) => (
                <OptionButton
                  key={c}
                  label={c}
                  onClick={() => {
                    setConcerns([c]);
                    getResults();
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display text-3xl mt-4 mb-8">Your matches</h1>
            {loading ? (
              <p className="text-[var(--muted)] font-mono text-sm">Finding matches…</p>
            ) : results.length === 0 ? (
              <p className="text-[var(--muted)]">
                No matches yet for this combination — the catalog grows as more products are added.
              </p>
            ) : (
              <div className="grid gap-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left capitalize rounded-xl border border-[var(--hairline)] px-6 py-4 hover:border-[var(--violet)] hover:bg-[var(--surface)] transition-colors font-display italic text-xl"
    >
      {label}
    </button>
  );
}
