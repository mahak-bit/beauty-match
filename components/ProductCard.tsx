"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Heart, Scale } from "lucide-react";
import { formatPrice } from "@/lib/db/parse";
import { useSavedProducts, useCompareList } from "@/lib/client-store";
import { concernLabel } from "@/lib/data/concerns";
import MatchScore from "@/components/MatchScore";
import ProductImage from "@/components/ProductImage";

export type ProductCardData = {
  id: string;
  name: string;
  brandName: string;
  category: string;
  subcategory?: string | null;
  productType?: string | null;
  price?: number | null;
  currency?: string | null;
  shortDescription?: string | null;
  concerns?: string | string[] | null;
  imageUrl?: string | null;
};

export default function ProductCard({
  product,
  matchScore,
}: {
  product: ProductCardData;
  matchScore?: number;
}) {
  const concerns: string[] = Array.isArray(product.concerns)
    ? product.concerns
    : product.concerns
      ? JSON.parse(product.concerns)
      : [];

  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { isSaved, toggle } = useSavedProducts();
  const { isInCompare, toggle: toggleCompare } = useCompareList();
  const price = formatPrice(product.price, product.currency);

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="group relative rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] overflow-hidden hover:border-[var(--gold)] hover:shadow-[0_24px_48px_-28px_rgba(34,30,26,0.3)] transition-[border-color,box-shadow]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label={isSaved(product.id) ? "Remove from saved" : "Save product"}
            aria-pressed={isSaved(product.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
              isSaved(product.id) ? "bg-[var(--gold)] text-white" : "bg-[var(--bg)]/80 text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Heart size={14} fill={isSaved(product.id) ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product.id);
            }}
            aria-label={isInCompare(product.id) ? "Remove from compare" : "Add to compare"}
            aria-pressed={isInCompare(product.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
              isInCompare(product.id) ? "bg-[var(--ink)] text-[var(--bg)]" : "bg-[var(--bg)]/80 text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Scale size={14} />
          </button>
        </div>

        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-[4/3] flex items-center justify-center bg-[var(--surface-2)] overflow-hidden" style={{ transform: "translateZ(30px)" }}>
            {product.imageUrl ? (
              <ProductImage
                src={product.imageUrl}
                alt={`${product.brandName} ${product.name}`}
                className="absolute inset-0"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              />
            ) : (
              <motion.div
                className="product-silhouette w-16 h-24"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
            )}
            {matchScore != null && (
              <div className="absolute bottom-2 left-2 bg-[var(--bg)]/90 rounded-full backdrop-blur-sm">
                <MatchScore score={matchScore} size={44} />
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  {product.brandName}
                </span>
                <h3 className="font-medium mt-1 text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors truncate">
                  {product.name}
                </h3>
              </div>
              {price && (
                <span className="font-mono text-sm text-[var(--gold-deep)] whitespace-nowrap shrink-0">{price}</span>
              )}
            </div>
            {product.shortDescription && (
              <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed line-clamp-2">
                {product.shortDescription}
              </p>
            )}
            {concerns.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {concerns.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full border border-[var(--hairline)] text-[var(--ink-soft)] capitalize"
                  >
                    {concernLabel(c)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
