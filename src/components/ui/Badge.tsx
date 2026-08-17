import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "terracotta" | "sand" | "graphite";
}

const toneClass: Record<NonNullable<BadgeProps["tone"]>, string> = {
  terracotta: "bg-brand-terracotta/10 text-brand-deep",
  sand: "bg-brand-sand text-brand-graphite",
  graphite: "bg-brand-graphite text-white",
};

export function Badge({ tone = "terracotta", children, className = "", ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${toneClass[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
