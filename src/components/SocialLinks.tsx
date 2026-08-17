import { InstagramIcon, WhatsAppIcon } from "./icons";
import { buildInstagramUrl, buildWhatsAppUrl } from "@/lib/utils";

interface SocialLinksProps {
  instagram?: string | null;
  whatsapp?: string | null;
  whatsappMessage: string;
  tone?: "dark" | "light";
  className?: string;
}

export function SocialLinks({ instagram, whatsapp, whatsappMessage, tone = "dark", className = "" }: SocialLinksProps) {
  const base = tone === "dark" ? "text-brand-graphite hover:text-brand-terracotta" : "text-white hover:text-brand-sand";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {instagram && instagram !== "[INSERIR INSTAGRAM]" && (
        <a
          href={buildInstagramUrl(instagram)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram do escritório"
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-current transition-colors ${base}`}
        >
          <InstagramIcon className="h-5 w-5" />
        </a>
      )}
      {whatsapp && (
        <a
          href={buildWhatsAppUrl(whatsapp, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp do escritório"
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-current transition-colors ${base}`}
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
