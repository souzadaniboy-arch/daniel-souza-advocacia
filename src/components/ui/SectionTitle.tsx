interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionTitle({ eyebrow, title, subtitle, align = "center", dark = false, className = "" }: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-terracotta">{eyebrow}</p>
      ) : null}
      <h2 className={`text-3xl font-semibold leading-tight sm:text-4xl ${dark ? "text-brand-off-white" : "text-brand-graphite"}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-brand-off-white/70" : "text-brand-gray"}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
