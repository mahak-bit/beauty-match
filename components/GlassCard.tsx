import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`${dark ? "glass-panel-dark" : "glass-panel"} rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
