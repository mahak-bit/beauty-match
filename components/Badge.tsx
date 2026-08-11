import { ReactNode } from "react";

type Tone = "neutral" | "gold" | "blush" | "warn";

const TONES: Record<Tone, string> = {
  neutral: "border-[var(--hairline)] text-[var(--muted)] bg-[var(--surface)]",
  gold: "border-[var(--gold-soft)]/50 text-[var(--gold-deep)] bg-[var(--gold-soft)]/10",
  blush: "border-[var(--blush)]/50 text-[var(--ink-soft)] bg-[var(--blush)]/10",
  warn: "border-[var(--warn)]/40 text-[var(--warn)] bg-[var(--warn-bg)]",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-full border capitalize ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SkinTypeBadge({ type }: { type: string }) {
  return <Badge tone="gold">{type}</Badge>;
}

export function ConcernBadge({ concern }: { concern: string }) {
  return <Badge tone="blush">{concern.replace(/-/g, " ")}</Badge>;
}

export function IngredientBadge({ name, href }: { name: string; href?: string }) {
  const content = <Badge tone="neutral">{name}</Badge>;
  if (!href) return content;
  return (
    <a href={href} className="hover:opacity-80 transition-opacity">
      {content}
    </a>
  );
}
