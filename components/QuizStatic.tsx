"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import MatchScore from "@/components/MatchScore";
import { SKIN_TYPES, HAIR_TYPES, SKIN_CONCERNS, HAIR_CONCERNS, concernLabel } from "@/lib/data/concerns";
import { rankProducts } from "@/lib/match/engine";
import { useUserProfile } from "@/lib/client-store";
import type { Product, UserPreferences } from "@/lib/types";
import { fadeUp, staggerContainer } from "@/lib/motion";

type Path = "skin" | "hair" | "both";
type Step = "path" | "skinType" | "hairType" | "concerns" | "preferences" | "revealing" | "results";

export default function QuizStatic() {
  const [path, setPath] = useState<Path | null>(null);
  const [step, setStep] = useState<Step>("path");
  const [skinType, setSkinType] = useState<string | null>(null);
  const [hairType, setHairType] = useState<string | null>(null);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [fragranceFree, setFragranceFree] = useState(false);
  const [budgetMax, setBudgetMax] = useState<number | undefined>(undefined);
  const [ranked, setRanked] = useState<Array<Product & { match: ReturnType<typeof rankProducts>[number]["match"] }>>([]);
  const { setProfile } = useUserProfile();

  const concernOptions =
    path === "hair" ? HAIR_CONCERNS : path === "skin" ? SKIN_CONCERNS : [...SKIN_CONCERNS, ...HAIR_CONCERNS];

  function choosePath(p: Path) {
    setPath(p);
    setStep(p === "hair" ? "hairType" : "skinType");
  }

  function toggleConcern(slug: string) {
    setConcerns((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : prev.length < 3 ? [...prev, slug] : prev));
  }

  async function runMatch() {
    setStep("revealing");

    const prefs: UserPreferences = {
      skinType: skinType as UserPreferences["skinType"],
      hairType: hairType as UserPreferences["hairType"],
      concerns,
      fragranceFree: fragranceFree || undefined,
      budgetMax,
    };
    setProfile(prefs);

    const sp = new URLSearchParams();
    if (path && path !== "both") sp.set("category", path === "skin" ? "skincare" : "haircare");
    const res = await fetch(`/api/products?${sp.toString()}`);
    const data = await res.json();
    const scored = rankProducts(data.products ?? [], prefs).slice(0, 6);

    // Cinematic pacing — profile, then concerns, then the score reveal.
    await wait(900);
    setRanked(scored);
    await wait(1400);
    setStep("results");
  }

  return (
    <div className="max-w-xl mx-auto py-12 sm:py-16 min-h-[60vh]">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">
        Quick match — no account needed
      </span>

      <AnimatePresence mode="wait">
        {step === "path" && (
          <Screen key="path">
            <h1 className="font-display text-4xl italic mt-4 mb-10 text-[var(--ink)]">What are you shopping for?</h1>
            <div className="grid gap-4">
              <OptionButton label="Skin" desc="Cleansers, serums, moisturizers, SPF" onClick={() => choosePath("skin")} />
              <OptionButton label="Hair" desc="Shampoo, scalp care, styling, treatments" onClick={() => choosePath("hair")} />
              <OptionButton label="Both" desc="A full routine across skin and hair" onClick={() => choosePath("both")} />
            </div>
          </Screen>
        )}

        {step === "skinType" && (
          <Screen key="skinType">
            <h1 className="font-display text-3xl italic mt-4 mb-8 text-[var(--ink)]">What&apos;s your skin type?</h1>
            <div className="grid grid-cols-2 gap-3">
              {SKIN_TYPES.map((t) => (
                <OptionButton key={t.slug} label={t.label} onClick={() => { setSkinType(t.slug); setStep(path === "both" ? "hairType" : "concerns"); }} />
              ))}
            </div>
          </Screen>
        )}

        {step === "hairType" && (
          <Screen key="hairType">
            <h1 className="font-display text-3xl italic mt-4 mb-8 text-[var(--ink)]">What&apos;s your hair type?</h1>
            <div className="grid grid-cols-2 gap-3">
              {HAIR_TYPES.map((t) => (
                <OptionButton key={t.slug} label={t.label} onClick={() => { setHairType(t.slug); setStep("concerns"); }} />
              ))}
            </div>
          </Screen>
        )}

        {step === "concerns" && (
          <Screen key="concerns">
            <h1 className="font-display text-3xl italic mt-4 mb-2 text-[var(--ink)]">What&apos;s on your mind?</h1>
            <p className="text-sm text-[var(--muted)] mb-8">Pick up to 3 — this drives most of your match score.</p>
            <div className="grid grid-cols-2 gap-3">
              {concernOptions.map((c) => (
                <OptionButton key={c.slug} label={c.label} active={concerns.includes(c.slug)} onClick={() => toggleConcern(c.slug)} />
              ))}
            </div>
            <button
              disabled={concerns.length === 0}
              onClick={() => setStep("preferences")}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--ink)] text-[var(--bg)] disabled:opacity-40 transition-opacity"
            >
              Continue <ArrowRight size={15} />
            </button>
          </Screen>
        )}

        {step === "preferences" && (
          <Screen key="preferences">
            <h1 className="font-display text-3xl italic mt-4 mb-8 text-[var(--ink)]">A couple of preferences</h1>
            <div className="space-y-8">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-3">Budget</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Keep it low", value: 400 },
                    { label: "Mid-range", value: 800 },
                    { label: "No limit", value: undefined },
                  ].map((b) => (
                    <OptionChip key={b.label} active={budgetMax === b.value} onClick={() => setBudgetMax(b.value)}>
                      {b.label}
                    </OptionChip>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-3">Fragrance</span>
                <OptionChip active={fragranceFree} onClick={() => setFragranceFree((v) => !v)}>
                  Fragrance-free only
                </OptionChip>
              </div>
            </div>
            <button
              onClick={runMatch}
              className="mt-10 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--ink)] text-[var(--bg)]"
            >
              Reveal my match <ArrowRight size={15} />
            </button>
          </Screen>
        )}

        {step === "revealing" && (
          <Screen key="revealing">
            <div className="py-16 text-center">
              <motion.div
                initial="hidden"
                animate="show"
                variants={staggerContainer(0.18)}
                className="space-y-3"
              >
                <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                  Reading your profile
                </motion.p>
                <motion.p variants={fadeUp} className="font-display text-2xl italic text-[var(--ink)]">
                  {skinType && <>Skin: {skinType} · </>}
                  {hairType && <>Hair: {hairType} · </>}
                  {concerns.map(concernLabel).join(", ")}
                </motion.p>
                <motion.div variants={fadeUp} className="pt-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    className="w-14 h-14 mx-auto rounded-full border-2 border-[var(--hairline)] border-t-[var(--gold)]"
                  />
                </motion.div>
                <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-widest text-[var(--gold-deep)] pt-2">
                  Calculating your Beauty Match
                </motion.p>
              </motion.div>
            </div>
          </Screen>
        )}

        {step === "results" && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="text-center mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Your Beauty Match</span>
              {ranked[0] && (
                <div className="flex justify-center mt-4">
                  <MatchScore score={ranked[0].match.score} size={110} />
                </div>
              )}
              <h1 className="font-display text-3xl italic mt-4 text-[var(--ink)]">
                {ranked.length > 0 ? "Here's what fits" : "No strong matches yet"}
              </h1>
            </div>

            {ranked.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--hairline)] p-10 text-center">
                <p className="text-[var(--muted)]">
                  The catalogue doesn&apos;t have a confident match for this combination yet. Try loosening your budget or picking fewer concerns.
                </p>
                <Link href="/discover" className="inline-block mt-4 text-[var(--gold-deep)] hover:underline">
                  Browse everything instead →
                </Link>
              </div>
            ) : (
              <motion.div initial="hidden" animate="show" variants={staggerContainer(0.12)} className="space-y-5">
                {ranked.map((p) => (
                  <motion.div key={p.id} variants={fadeUp}>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {p.match.reasons.slice(0, 2).map((r) => (
                        <span key={r} className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--ink-soft)]">
                          {r}
                        </span>
                      ))}
                    </div>
                    <ProductCard product={p} matchScore={p.match.score} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="text-center mt-10">
              <button
                onClick={() => {
                  setStep("path");
                  setPath(null);
                  setSkinType(null);
                  setHairType(null);
                  setConcerns([]);
                  setRanked([]);
                }}
                className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              >
                Start over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function OptionButton({
  label,
  desc,
  active,
  onClick,
}: {
  label: string;
  desc?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-left rounded-xl border px-6 py-4 transition-colors ${
        active ? "border-[var(--gold)] bg-[var(--surface-2)]" : "border-[var(--hairline)] hover:border-[var(--gold)] hover:bg-[var(--surface)]"
      }`}
    >
      <div className="font-display italic text-xl text-[var(--ink)]">{label}</div>
      {desc && <div className="text-sm text-[var(--muted)] mt-1">{desc}</div>}
    </button>
  );
}

function OptionChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-sm px-4 py-2 rounded-full border transition-colors ${
        active ? "bg-[var(--ink)] border-[var(--ink)] text-[var(--bg)]" : "border-[var(--hairline)] text-[var(--ink-soft)] hover:border-[var(--gold)]"
      }`}
    >
      {children}
    </button>
  );
}
