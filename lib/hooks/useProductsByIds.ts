"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

/**
 * Fetches full product records for a list of ids (from localStorage —
 * saved products, compare list, recently viewed, routine drafts) and
 * returns them in the same order as `ids`.
 */
export function useProductsByIds(ids: string[]) {
  const [fetched, setFetched] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) return; // caller derives the empty case from `ids` itself
    // eslint-disable-next-line react-hooks/set-state-in-effect -- marks the fetch-start, resolved asynchronously below
    setLoading(true);
    fetch(`/api/products/by-ids?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        const order = new Map(ids.map((id, i) => [id, i]));
        const sorted = [...(data.products ?? [])].sort(
          (a: Product, b: Product) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
        );
        setFetched(sorted);
      })
      .finally(() => setLoading(false));
    // ids.join(",") is the real dependency — a fresh array each render would re-fetch every time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return {
    products: ids.length === 0 ? [] : fetched,
    loading: ids.length === 0 ? false : loading,
  };
}
