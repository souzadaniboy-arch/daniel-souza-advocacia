import type { Metadata } from "next";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { buildMetadata, jsonLdScript, breadcrumbSchema } from "@/lib/seo";
import { buildWhatsAppUrl, buildInstagramUrl } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";
import { WhatsAppIcon, InstagramIcon, MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Contato",
    description:
      "Entre em contato com o Daniel de Souza Advocacia e Consultoria Jurídica por WhatsApp, Instagram, e-mail, telefone ou formulário.",
    path: "/contato",
  });
}

export default async function ContatoPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const waUrl = settings?.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, settings.whatsappMessage ?? "")
    : "#";
  const igUrl = buildInstagramUrl(settings?.instagram ?? "");

  const crumbSchema = breadcrumbSchema([
    { name: "Início", path: "/" },
    { name: "Contato", path: "/contato" },
  ]);

  const contactItems = [
    settings?.whatsapp && {
      icon: <WhatsAppIcon className="h-5 w-5" />,
      label: "WhatsApp",
      value: settings.whatsapp,
      href: waUrl,
      external: true,
    },
    settings?.instagram && settings.instagram !== "[INSERIR INSTAGRAM]" && {
      icon: <InstagramIcon className="h-5 w-5" />,
      label: "Instagram",
      value: settings.instagramProfile || settings.instagram,
      href: igUrl,
      external: true,
    },
    settings?.email && {
      icon: <MailIcon className="h-5 w-5" />,
      label: "E-mail",
      value: settings.email,
      href: `mailto:${settings.email}`,
      external: false,
    },
    settings?.phone && {
      icon: <PhoneIcon className="h-5 w-5" />,
      label: "Telefone",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, "")}`,
      external: false,
    },
    settings?.address && {
      icon: <MapPinIcon className="h-5 w-5" />,
      label: "Endereço",
      value: settings.address,
      href: undefined,
      external: false,
    },
    settings?.hours && {
      icon: <ClockIcon className="h-5 w-5" />,
      label: "Horário de atendimento",
      value: settings.hours,
      href: undefined,
      external: false,
    },
  ].filter(Boolean) as {
    icon: ReactNode;
    label: string;
    value: string;
    href?: string;
    external: boolean;
  }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbSchema) }} />
      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-8">
            <Breadcrumb items={[{ name: "Início", path: "/" }, { name: "Contato" }]} />
          </div>
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
              Contato
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
              Entre em contato
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-gray">
              O primeiro passo é compreender a situação. Apresente sua questão e verifique a possibilidade de
              atendimento jurídico.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Canais */}
          <div className="space-y-4 lg:col-span-2">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-sm border border-brand-sand bg-brand-off-white p-5"
              >
                <span className="mt-0.5 text-brand-terracotta" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-gray">
                    {item.label}
                  </h2>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="mt-1 block font-serif text-lg text-brand-graphite hover:text-brand-deep"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-serif text-lg text-brand-graphite">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
            <p className="pt-2 text-sm leading-relaxed text-brand-gray">
              Respeitamos a confidencialidade das informações. Sua mensagem será tratada com sigilo profissional.
            </p>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-3">
            <div className="rounded-sm border border-brand-sand p-6 sm:p-8">
              <h2 className="mb-6 font-serif text-2xl font-semibold text-brand-graphite">Envie uma mensagem</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
