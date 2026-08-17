import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WhatsAppIcon, InstagramIcon, MailIcon } from "@/components/icons";
import { buildInstagramUrl } from "@/lib/utils";

interface ContactSectionProps {
  whatsapp?: string | null;
  whatsappMessage: string;
  instagram?: string | null;
}

export function ContactSection({ whatsapp, whatsappMessage, instagram }: ContactSectionProps) {
  const igUrl = buildInstagramUrl(instagram ?? "");
  const waUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}` : "#";

  return (
    <section className="section-pad bg-white">
      <div className="container-page text-center">
        <SectionTitle
          eyebrow="Contato"
          title="Vamos conversar?"
          subtitle="O primeiro passo é compreender a situação. Entre em contato com o escritório para apresentar sua questão e verificar a possibilidade de atendimento jurídico."
          className="mb-12"
        />
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {whatsapp && (
            <Button href={waUrl} variant="whatsapp" size="lg" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5" />
              WHATSAPP
            </Button>
          )}
          {instagram && instagram !== "[INSERIR INSTAGRAM]" && (
            <Button href={igUrl} variant="secondary" size="lg" target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="h-5 w-5" />
              INSTAGRAM
            </Button>
          )}
          <Button href="/contato" variant="dark" size="lg">
            <MailIcon className="h-5 w-5" />
            ENVIAR MENSAGEM
          </Button>
        </div>
      </div>
    </section>
  );
}
