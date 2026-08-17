import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, jsonLdScript, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { formatDateShort, buildWhatsAppUrl } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArticleCard } from "@/components/ArticleCard";
import { Accordion } from "@/components/ui/Accordion";
import { WhatsAppIcon, CheckIcon, CalendarIcon, ClockReadIcon } from "@/components/icons";
import Link from "next/link";

interface AreaPageProps {
  params: Promise<{ slug: string }>;
}

async function getAreaTopics(slug: string): Promise<string[]> {
  const config = await prisma.config.findUnique({ where: { key: `area.${slug}.topics` } });
  if (!config?.value) return [];
  try {
    const parsed = JSON.parse(config.value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = await prisma.category.findUnique({ where: { slug } });
  if (!area) return buildMetadata({});
  return buildMetadata({
    title: area.name,
    description: area.description ?? undefined,
    path: `/areas/${slug}`,
  });
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { slug } = await params;
  const area = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          slug: true,
          title: true,
          subtitle: true,
          summary: true,
          coverImage: true,
          publishedAt: true,
          readingTime: true,
        },
      },
      faqs: {
        where: { active: true },
        orderBy: { order: "asc" },
        take: 8,
        select: { question: true, answer: true },
      },
    },
  });

  if (!area || area.type !== "AREA" || !area.active) notFound();

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const topics = await getAreaTopics(slug);
  const waUrl = settings?.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, area.whatsappMessage ?? settings.whatsappMessage)
    : "#";

  const crumbSchema = breadcrumbSchema([
    { name: "Início", path: "/" },
    { name: "Áreas de Atuação", path: "/areas-de-atuacao" },
    { name: area.name, path: `/areas/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbSchema) }} />
      {area.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(faqSchema(area.faqs.map((f) => ({ question: f.question, answer: f.answer })))),
          }}
        />
      )}

      {/* Hero da área */}
      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { name: "Início", path: "/" },
                { name: "Áreas de Atuação", path: "/areas-de-atuacao" },
                { name: area.name },
              ]}
            />
          </div>
          <div className="max-w-3xl">
            <Badge tone="sand" className="mb-4">
              Área de Atuação
            </Badge>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
              {area.name}
            </h1>
            {area.description && (
              <p className="mt-5 text-lg leading-relaxed text-brand-gray">{area.description}</p>
            )}
            <p className="mt-6 text-sm italic text-brand-gray">
              A atuação em cada situação depende de análise individualizada de fatos e documentos. As
              informações abaixo têm caráter informativo e não garantem direito ou resultado.
            </p>
          </div>
        </div>
      </section>

      {/* Tópicos de atuação */}
      {topics.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-page">
            <h2 className="mb-10 font-serif text-3xl font-semibold text-brand-graphite">
              Temas em que o escritório pode atuar
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <li key={topic} className="flex items-center gap-3 rounded-sm border border-brand-sand bg-brand-off-white p-5">
                  <CheckIcon className="h-5 w-5 shrink-0 text-brand-terracotta" aria-hidden="true" />
                  <span className="font-serif text-lg text-brand-graphite">{topic}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="/contato" variant="primary">
                Falar sobre {area.name}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ da área */}
      {area.faqs.length > 0 && (
        <section className="section-pad bg-brand-off-white">
          <div className="container-page max-w-4xl">
            <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-brand-graphite">
              Dúvidas frequentes
            </h2>
            <Accordion
              items={area.faqs.map((f, index) => ({
                id: `area-faq-${index}`,
                question: f.question,
                answer: <p>{f.answer}</p>,
              }))}
            />
            <div className="mt-10 text-center">
              <Link href="/faq" className="btn-secondary">
                VER TODAS AS PERGUNTAS
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Artigos relacionados */}
      {area.articles.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-page">
            <h2 className="mb-10 font-serif text-3xl font-semibold text-brand-graphite">Artigos relacionados</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {area.articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={{ ...article, category: { name: area.name } }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contato */}
      <section className="bg-brand-deep py-16">
        <div className="container-page flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-white">Entre em contato</h2>
            <p className="mt-3 max-w-xl text-white/80">
              Apresente sua situação ao escritório. A análise individualizada é o primeiro passo para compreender
              as possibilidades jurídicas.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            {settings?.whatsapp && (
              <Button href={waUrl} variant="whatsapp" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                WHATSAPP
              </Button>
            )}
            <Button href="/contato" variant="light">
              ENVIAR MENSAGEM
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
