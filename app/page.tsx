"use client";
import RevealText from "@/components/RevealText";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScanIcon, Sparkles, Layers, FlaskConical, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { fadeUp, revealOnScroll, floatY } from "@/lib/motion";
import { PRODUCT_CATEGORY_GROUPS } from "@/lib/data/categories";

export default function Home() {
  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-[var(--hairline)] min-h-[92dvh] flex items-center">
        <div className="grain" />
        <div className="glow-orb" style={{ top: "-160px", right: "-120px" }} />
        <div className="glow-orb" style={{ bottom: "-220px", left: "-160px", opacity: 0.1 }} />

        <div className="mx-auto max-w-7xl px-6 py-20 relative grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center w-full">
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
            <motion.span
              variants={fadeUp}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)] block"
            >
              A skin &amp; hair diagnostic — not another quiz
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] mt-6 text-[var(--ink)]"
            >
              <RevealText text="Your skin." />
              <br />
              <RevealText text="Matched differently." className="italic text-[var(--gold-deep)]" />
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-8 text-base sm:text-lg text-[var(--muted)] max-w-lg leading-relaxed">
              Beauty Match reads your type, your concerns, and your preferences —
              then points you to real products from real brands, with the exact
              reasoning behind every recommendation.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <MagneticButton
                onClick={() => (window.location.href = "/quiz")}
                className="px-7 py-3.5 rounded-full bg-[var(--ink)] text-[var(--bg)] font-medium hover:bg-[var(--gold-deep)] transition-colors"
              >
                Find my match
              </MagneticButton>
              <Link
                href="/discover"
                className="group px-7 py-3.5 rounded-full border border-[var(--hairline)] text-[var(--ink)] hover:border-[var(--gold)] transition-colors inline-flex items-center gap-2"
              >
                Explore products
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-8 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
              28 brands · 6 markets-ready · explainable matching
            </motion.p>
          </motion.div>

          {/* Signature visual: floating glass "bottle" + diagnostic readout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <motion.div variants={floatY} animate="float" className="relative mx-auto w-40 sm:w-48 aspect-[2/3]">
              <div className="product-silhouette w-full h-full" />
            </motion.div>

            <div className="glass-panel rounded-2xl mt-8 p-6 font-mono text-xs text-[var(--ink-soft)] relative overflow-hidden">
              <div className="scan-line top-1/2" />
              <div className="flex justify-between">
                <span className="uppercase tracking-widest text-[var(--muted)]">Diagnostic</span>
                <span className="text-[var(--gold-deep)]">Scanning</span>
              </div>
              <div className="space-y-2 mt-4">
                <Row label="skin_type" value="combination" />
                <Row label="concern" value="pigmentation" />
                <Row label="match_confidence" value="94%" highlight />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">How it works</span>
        <h2 className="font-display text-3xl sm:text-4xl italic text-[var(--ink)] mt-3 mb-14 max-w-xl">
          Three steps between &ldquo;I don&apos;t know what my skin needs&rdquo; and a routine that works.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<ScanIcon size={20} />}
            title="Tell it your skin"
            body="A conversational quiz that adapts its next question to your last answer — skin type, concerns, and preferences, not a fixed script."
            delay={0}
          />
          <Feature
            icon={<Sparkles size={20} />}
            title="Get an explained match"
            body="Every score breaks down into the actual reasons — skin fit, concern coverage, ingredient compatibility, budget — plus honest caveats."
            delay={0.1}
          />
          <Feature
            icon={<Layers size={20} />}
            title="Build a real routine"
            body="Slot matches into AM/PM steps and the routine builder flags actives that are commonly introduced separately, before you buy."
            delay={0.2}
          />
        </div>
      </section>

      {/* ---------------- Browse by category ---------------- */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">Catalogue</span>
            <h2 className="font-display text-3xl italic text-[var(--ink)] mt-3">Browse by category</h2>
          </div>
          <Link href="/discover" className="hidden sm:inline text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
            See all products →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory sm:grid sm:grid-cols-4 sm:overflow-visible sm:mx-0 sm:px-0">
          {PRODUCT_CATEGORY_GROUPS.map((g, i) => (
            <motion.div key={g.group} {...revealOnScroll} transition={{ duration: 0.5, delay: i * 0.05 }}>
              <Link
                href={`/discover?group=${encodeURIComponent(g.group)}`}
                className="group shrink-0 w-64 sm:w-auto snap-start block rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-6 h-full hover:border-[var(--gold)] hover:shadow-[0_18px_40px_-24px_rgba(34,30,26,0.25)] transition-all"
              >
                <h3 className="font-display italic text-xl text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors">
                  {g.group}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                  {g.types.slice(0, 3).map((t) => t.label).join(", ")}
                  {g.types.length > 3 ? "…" : ""}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- For brands strip ---------------- */}
      <section className="bg-[var(--panel)] text-[var(--on-panel)]">
        <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-start gap-5">
            <FlaskConical size={26} className="text-[var(--gold-soft)] mt-1 shrink-0" />
            <div>
              <h3 className="font-display text-3xl italic">Are you a brand?</h3>
              <p className="text-[var(--on-panel-muted)] mt-2 max-w-md leading-relaxed">
                List your products where people are already looking for exactly
                what you make — structured, explainable, and searchable by
                ingredient and concern.
              </p>
            </div>
          </div>
          <Link
            href="/admin/add-product"
            className="px-7 py-3.5 rounded-full border border-[var(--gold-soft)] text-[var(--gold-soft)] hover:bg-[var(--gold-soft)] hover:text-[var(--panel)] transition-colors whitespace-nowrap"
          >
            List a product
          </Link>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between border-t border-[var(--hairline)] pt-2">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={highlight ? "text-[var(--gold-deep)] font-bold" : "text-[var(--ink)]"}>{value}</span>
    </div>
  );
}

function Feature({ icon, title, body, delay }: { icon: React.ReactNode; title: string; body: string; delay: number }) {
  return (
    <motion.div
      {...revealOnScroll}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, borderColor: "var(--gold)" }}
      className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-7 cursor-default transition-colors"
    >
      <div className="w-11 h-11 rounded-full border border-[var(--hairline)] flex items-center justify-center text-[var(--gold-deep)] mb-5">
        {icon}
      </div>
      <h3 className="font-medium text-lg mb-2 text-[var(--ink)]">{title}</h3>
      <p className="text-[var(--muted)] text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}
