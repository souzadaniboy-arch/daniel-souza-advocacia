import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "white" | "sand" | "off-white";
  children: ReactNode;
}

const toneClass: Record<NonNullable<CardProps["tone"]>, string> = {
  white: "bg-white shadow-sm",
  sand: "bg-brand-sand/40",
  "off-white": "bg-brand-off-white",
};

export function Card({ tone = "white", children, className = "", ...rest }: CardProps) {
  return (
    <div className={`rounded-sm ${toneClass[tone]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
