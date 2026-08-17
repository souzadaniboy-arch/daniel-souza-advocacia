interface LogoMarkProps {
  className?: string;
}

/**
 * Marca do escritório — monograma "DS" (logo do cartão).
 * Placeholder premium que deve ser substituído pelo logo
 * oficial em Configurações > Logos (/admin/configuracoes).
 */
export function LogoMark({ className = "" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Monograma DS"
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="24"
        fontWeight="600"
        fill="currentColor"
      >
        DS
      </text>
      <line x1="18" y1="50" x2="46" y2="50" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

interface LogoProps {
  name: string;
  shortName?: string;
  logoUrl?: string | null;
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Logotipo completo (marca + nome). Se `logoUrl` estiver configurada,
 * exibe a imagem oficial; caso contrário usa o monograma "DS".
 */
export function Logo({ name, shortName, logoUrl, variant = "dark", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-brand-graphite";
  const subColor = variant === "light" ? "text-brand-sand/80" : "text-brand-gray";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={name} className="h-12 w-auto max-w-40 object-contain" />
      ) : (
        <LogoMark className="h-12 w-12 shrink-0 text-brand-terracotta" />
      )}
      <span className="leading-tight">
        <span className={`block font-serif text-lg font-semibold tracking-wide ${textColor}`}>
          {shortName || name}
        </span>
        <span className={`block text-[11px] uppercase tracking-widest ${subColor}`}>Advocacia &amp; Consultoria</span>
      </span>
    </span>
  );
}
