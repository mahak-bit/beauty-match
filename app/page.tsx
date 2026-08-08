"use client";
import RevealText from "@/components/RevealText";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScanIcon, Sparkles, Users, FlaskConical } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";



const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div>
      {/* ---------------- Hero: the signature scan moment ---------------- */}
      <section className="relative overflow-hidden border-b border-[var(--hairline)] min-h-[100dvh]">
        <div className="hero-image-bg">
  <div className="hero-image-overlay" />
</div>
        <div className="grain" />
        <div className="glow-orb" style={{ top: "-100px", right: "-100px" }} />
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-32 relative">
          <motion.div
            className="relative max-w-2xl"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12 }}
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan)] block"
            >
              Skin &amp; hair diagnostic — not another quiz
            </motion.span>
            <motion.h1
  variants={fadeUp}
  transition={{ duration: 0.6 }}
  className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.1] mt-6"
>
  <RevealText text="Stop guessing what your skin and hair actually need" />
</motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mt-8 text-base sm:text-lg text-[var(--muted)] max-w-lg"
            >
              Match reads your type, your concerns and your routine, then
              points you to real products from real brands — with the exact
              reasoning behind every recommendation.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <MagneticButton
  onClick={() => (window.location.href = "/quiz")}
  className="px-6 py-3 rounded-full bg-[var(--violet)] text-[var(--ink)] font-medium hover:bg-[var(--cyan)] transition-colors"
>
  Find your match
</MagneticButton>
              <Link
                href="/discover"
                className="px-6 py-3 rounded-full border border-[var(--hairline)] text-[var(--paper)] hover:border-[var(--muted)] transition-colors"
              >
                Browse without a quiz
              </Link>
            </motion.div>
          </motion.div>

          {/* Diagnostic scan panel — the one signature visual moment */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative mt-20 max-w-xl mx-auto md:mx-0 md:absolute md:right-6 md:top-16 md:mt-0"
          >
            <div className="relative w-full aspect-[4/5] max-w-xs mx-auto rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] overflow-hidden">
              <div className="scan-line top-1/3" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between font-mono text-xs text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>DIAGNOSTIC</span>
                  <span className="text-[var(--cyan)]">SCANNING</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between border-t border-[var(--hairline)] pt-2">
                    <span>skin_type</span>
                    <span className="text-[var(--paper)]">combination</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--hairline)] pt-2">
                    <span>concern</span>
                    <span className="text-[var(--paper)]">pigmentation</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--hairline)] pt-2">
                    <span>match_confidence</span>
                    <span className="text-[var(--cyan)]">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl italic text-[var(--muted)] mb-12">How Match works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <Feature
            icon={<ScanIcon size={20} />}
            title="Tell it your type"
            body="A conversational quiz that forks for skin, hair, or both — and adapts its next question to your last answer, instead of a fixed list."
            delay={0}
          />
          <Feature
            icon={<Sparkles size={20} />}
            title="Get reasoned matches"
            body="Every recommendation comes with the actual why — the ingredient, the concern it addresses, and any caution worth knowing."
            delay={0.1}
          />
          <Feature
            icon={<Users size={20} />}
            title="Compare across brands"
            body="No single brand owns the shelf here. Drugstore and premium sit side by side, ranked by fit — not by who's paying for placement."
            delay={0.2}
          />
        </div>
      </section>

      {/* ---------------- For brands strip ---------------- */}
      <section className="border-t border-[var(--hairline)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <FlaskConical size={24} className="text-[var(--violet)]" />
            <div>
              <h3 className="font-display text-2xl italic">Are you a brand?</h3>
              <p className="text-[var(--muted)] mt-1 max-w-md">
                List your products where people are already looking for exactly what you make.
              </p>
            </div>
          </div>
          <Link
            href="/admin/add-product"
            className="px-6 py-3 rounded-full border border-[var(--violet)] text-[var(--violet)] hover:bg-[var(--violet)] hover:text-[var(--ink)] transition-colors whitespace-nowrap"
          >
            List a product
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body, delay }: { icon: React.ReactNode; title: string; body: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, borderColor: "var(--violet)" }}
      className="rounded-xl border border-[var(--hairline)] p-6 cursor-default transition-colors"
    >
      <div className="w-10 h-10 rounded-full border border-[var(--hairline)] flex items-center justify-center text-[var(--violet)] mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-[var(--muted)] text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}