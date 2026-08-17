import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, jsonLdScript, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Accordion } from "@/components/ui/Accordion";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Dúvidas Frequentes",
    description:
      "Perguntas e respostas frequentes sobre Direito Previdenciário, Trabalhista, Tributário, Bancário e Direitos das Pessoas Autistas.",
    path: "/faq",
  });
}

export default async function FaqPage() {
  const categories = await prisma.category.findMany({
    where: { type: "AREA", active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      order: true,
      faqs: { where: { active: true }, orderBy: { order: "asc" }, select: { question: true, answer: true } },
    },
    orderBy: { order: "asc" },
  });

  const allFaqs = categories.flatMap((c) => c.faqs);

  const crumbSchema = breadcrumbSchema([
    { name: "Início", path: "/" },
    { name: "Dúvidas Frequentes", path: "/faq" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbSchema) }} />
      {allFaqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(faqSchema(allFaqs.map((f) => ({ question: f.question, answer: f.answer })))),
          }}
        />
      )}

      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-8">
            <Breadcrumb items={[{ name: "Início", path: "/" }, { name: "Dúvidas Frequentes" }]} />
          </div>
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
              Central de Conhecimento Jurídico
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
              Dúvidas frequentes
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-gray">
              Perguntas comuns sobre as áreas de atuação, com respostas informativas e juridicamente
              responsáveis. A análise de casos concretos exige avaliação individualizada.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page max-w-4xl space-y-14">
          {categories.map((category) => {
            if (category.faqs.length === 0) return null;
            return (
              <div key={category.id}>
                <h2 className="mb-6 font-serif text-2xl font-semibold text-brand-graphite">{category.name}</h2>
                <Accordion
                  items={category.faqs.map((f, index) => ({
                    id: `${category.slug}-${index}`,
                    question: f.question,
                    answer: <p>{f.answer}</p>,
                  }))}
                />
              </div>
            );
          })}
          {allFaqs.length === 0 && (
            <p className="text-center text-brand-gray">As perguntas frequentes estão em preparação.</p>
          )}
        </div>
      </section>
    </>
  );
}
