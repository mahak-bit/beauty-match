import { ReactNode } from "react";
import { SearchX } from "lucide-react";

export default function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--hairline)] p-12 sm:p-16 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-5 text-[var(--muted)]">
        {icon ?? <SearchX size={20} />}
      </div>
      <h3 className="font-display italic text-2xl text-[var(--ink)] mb-2">{title}</h3>
      <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
