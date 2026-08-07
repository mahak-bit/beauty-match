"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export type ProductCardData = {
  id: string;
  name: string;
  brandName: string;
  category: string;
  subcategory?: string | null;
  price?: number | null;
  currency?: string | null;
  shortDescription?: string | null;
  concerns?: string | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const concerns: string[] = product.concerns ? JSON.parse(product.concerns) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/products/${product.id}`}
        className="group block rounded-xl border border-[var(--hairline)] bg-[var(--surface)] p-5 hover:border-[var(--violet)] transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
              {product.brandName}
            </span>
            <h3 className="font-medium mt-1 group-hover:text-[var(--violet)] transition-colors">
              {product.name}
            </h3>
          </div>
          {product.price != null && (
            <span className="font-mono text-sm text-[var(--cyan)] whitespace-nowrap">
              {product.currency === "INR" ? "₹" : "$"}
              {product.price}
            </span>
          )}
        </div>
        {product.shortDescription && (
          <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        {concerns.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {concerns.slice(0, 3).map((c) => (
              <span
                key={c}
                className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full border border-[var(--hairline)] text-[var(--rose)]"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
