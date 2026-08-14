export default function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-[var(--hairline)] overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-[var(--surface-2)]" />
          <div className="p-5 space-y-3">
            <div className="h-2 w-16 bg-[var(--surface-2)] rounded-full" />
            <div className="h-4 w-3/4 bg-[var(--surface-2)] rounded-full" />
            <div className="h-3 w-full bg-[var(--surface-2)] rounded-full" />
            <div className="h-3 w-2/3 bg-[var(--surface-2)] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
