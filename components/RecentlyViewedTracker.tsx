"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/client-store";

/** Records a product view into localStorage — invisible, no UI of its own. */
export default function RecentlyViewedTracker({ productId }: { productId: string }) {
  const { record } = useRecentlyViewed();

  useEffect(() => {
    record(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return null;
}
