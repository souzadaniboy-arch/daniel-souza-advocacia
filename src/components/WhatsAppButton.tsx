"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "./icons";
import { buildWhatsAppUrl } from "@/lib/utils";

export interface AreaMessage {
  path: string;
  message: string;
}

interface WhatsAppButtonProps {
  whatsapp?: string | null;
  defaultMessage: string;
  areaMessages?: AreaMessage[];
}

/**
 * Botão flutuante do WhatsApp com mensagem contextual.
 * As mensagens por área são editáveis no painel administrativo
 * (Áreas de Atuação → mensagem de WhatsApp de cada área).
 */
export function WhatsAppButton({ whatsapp, defaultMessage, areaMessages = [] }: WhatsAppButtonProps) {
  const pathname = usePathname();
  if (!whatsapp) return null;

  const matched = areaMessages.find(({ path }) => pathname.startsWith(path));
  const message = matched?.message ?? defaultMessage ?? "Olá, gostaria de obter informações sobre o atendimento do escritório.";

  const url = buildWhatsAppUrl(whatsapp, message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o escritório pelo WhatsApp"
      className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
