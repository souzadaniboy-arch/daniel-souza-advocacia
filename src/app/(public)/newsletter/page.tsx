import type { Metadata } from "next";
import { buildMetadata, jsonLdScript, breadcrumbSchema } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsletterForm } from "@/components/NewsletterForm";
import { CheckIcon } from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Newsletter Jurídica",
    description:
      "Newsletter Jurídica — conteúdo jurídico produzido para ajudar você a compreender melhor seus direitos e acompanhar temas relevantes.",
    path: "/newsletter",
  });
}

const BENEFITS = [
  "Artigos e conteúdos jurídicos informativos",
  "Temas atuais das áreas de atuação do escritório",
  "Linguagem clara e acessível",
  "Sem spam — descadastro a qualquer momento",
];

export default async function NewsletterPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Início", path: "/" },
    { name: "Newsletter", path: "/newsletter" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbSchema) }} />
      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-8">
            <Breadcrumb items={[{ name: "Início", path: "/" }, { name: "Newsletter" }]} />
          </div>
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
              Central de Conhecimento Jurídico
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
              Newsletter Jurídica
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-gray">
              Conteúdo jurídico produzido para ajudar você a compreender melhor seus direitos e acompanhar temas
              relevantes.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-brand-graphite">O que você vai receber</h2>
            <ul className="mt-6 space-y-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-brand-gray">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand-terracotta" aria-hidden="true" />
                  <span className="text-base">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-sm border border-brand-sand bg-brand-off-white p-6">
              <h3 className="font-serif text-lg font-semibold text-brand-graphite">Sua privacidade</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                Seus dados serão utilizados exclusivamente para o envio da newsletter e de conteúdos informativos,
                com base no seu consentimento, em conformidade com a LGPD (Lei nº 13.709/2018). Você poderá se
                descadastrar a qualquer momento pelos links presentes em cada e-mail.
              </p>
            </div>
          </div>
          <div>
            <div className="rounded-sm border border-brand-sand bg-brand-off-white p-6 sm:p-8">
              <h2 className="mb-6 font-serif text-2xl font-semibold text-brand-graphite">
                Inscreva-se gratuitamente
              </h2>
              <NewsletterForm source="newsletter" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
