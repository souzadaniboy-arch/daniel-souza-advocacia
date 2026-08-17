import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, jsonLdScript, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/seo";
import { renderMarkdown } from "@/lib/markdown";
import { formatDateBR } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { ArticleCard } from "@/components/ArticleCard";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { CalendarIcon, ClockReadIcon, UserIcon } from "@/components/icons";
import Link from "next/link";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!article || article.status !== "PUBLISHED") return buildMetadata({});
  return buildMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.summary || article.subtitle || undefined,
    path: `/artigos/${article.slug}`,
    ogImage: article.ogImage ?? article.coverImage,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      faqs: { include: { faq: true }, orderBy: { faq: { order: "asc" } } },
      relatedFrom: { include: { articleB: true } },
      relatedTo: { include: { articleA: true } },
    },
  });

  if (!article || article.status !== "PUBLISHED") notFound();

  // Registro de visualização (assíncrono, sem bloquear render)
  prisma.article
    .update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const relatedArticles = [
    ...article.relatedFrom.map((r) => r.articleB),
    ...article.relatedTo.map((r) => r.articleA),
  ].filter((a) => a.status === "PUBLISHED" && a.id !== article.id);

  const sameCategory = relatedArticles.length < 3
    ? await prisma.article.findMany({
        where: { status: "PUBLISHED", categoryId: article.categoryId, id: { not: article.id } },
        select: { slug: true, title: true, subtitle: true, summary: true, coverImage: true, publishedAt: true, readingTime: true },
        orderBy: { publishedAt: "desc" },
        take: 3 - relatedArticles.length,
      })
    : [];

  const displayRelated = [
    ...relatedArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      summary: a.summary,
      coverImage: a.coverImage,
      publishedAt: a.publishedAt,
      readingTime: a.readingTime,
    })),
    ...sameCategory,
  ];

  const faqs = article.faqs.map((f) => f.faq);
  const html = renderMarkdown(article.content);

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const breadcrumbs = jsonLdScript(
    breadcrumbSchema([
      { name: "Início", path: "/" },
      { name: "Artigos", path: "/artigos" },
      { name: article.category.name, path: `/artigos?categoria=${article.category.slug}` },
      { name: article.title, path: `/artigos/${article.slug}` },
    ])
  );

  const articleLd = jsonLdScript(
    articleSchema({
      title: article.title,
      description: article.metaDescription || article.summary || article.subtitle,
      slug: article.slug,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      author: article.author ? { name: article.author.name } : null,
      category: { name: article.category.name },
      image: article.ogImage ?? article.coverImage,
    })
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleLd }} />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))) }}
        />
      )}

      {/* Cabeçalho do artigo */}
      <article>
        <header className="bg-brand-off-white">
          <div className="container-page max-w-4xl py-14 sm:py-20">
            <div className="mb-8">
              <Breadcrumb
                items={[
                  { name: "Início", path: "/" },
                  { name: "Artigos", path: "/artigos" },
                  { name: article.title },
                ]}
              />
            </div>
            <div className="mb-4">
              <Link href={`/artigos?categoria=${article.category.slug}`}>
                <Badge>{article.category.name}</Badge>
              </Link>
            </div>
            <h1 className="font-serif text-3xl font-semibold leading-tight text-brand-graphite sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="mt-5 text-lg leading-relaxed text-brand-gray sm:text-xl">{article.subtitle}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brand-gray">
              {article.publishedAt && (
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-brand-terracotta" aria-hidden="true" />
                  <time dateTime={article.publishedAt.toISOString()}>{formatDateBR(article.publishedAt)}</time>
                </span>
              )}
              {article.readingTime && (
                <span className="inline-flex items-center gap-2">
                  <ClockReadIcon className="h-4 w-4 text-brand-terracotta" aria-hidden="true" />
                  {article.readingTime} min de leitura
                </span>
              )}
              {article.author && (
                <span className="inline-flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-brand-terracotta" aria-hidden="true" />
                  {article.author.name}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Capa */}
        {article.coverImage && (
          <div className="container-page max-w-5xl py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="aspect-[16/9] w-full rounded-sm object-cover"
            />
          </div>
        )}

        {/* Conteúdo */}
        <div className="container-page max-w-4xl pb-16 pt-4 sm:pb-20">
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />

          {/* Aviso informativo */}
          <div className="mt-12 rounded-sm border border-brand-sand bg-brand-off-white p-6">
            <h2 className="font-serif text-lg font-semibold text-brand-graphite">Aviso informativo</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-gray">
              Este conteúdo possui caráter exclusivamente informativo e não substitui a análise jurídica
              individualizada de situações concretas. A orientação sobre casos específicos deve ser realizada por
              profissional habilitado.
            </p>
          </div>

          {/* CTA contato */}
          <div className="mt-8 flex flex-col items-center gap-4 rounded-sm bg-brand-deep p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Tem uma dúvida sobre este tema?</h2>
              <p className="mt-2 text-sm text-white/80">
                Apresente sua situação ao escritório para uma análise individualizada.
              </p>
            </div>
            <Button href="/contato" variant="light" className="shrink-0">
              FALAR COM O ESCRITÓRIO
            </Button>
          </div>
        </div>
      </article>

      {/* FAQ relacionada */}
      {faqs.length > 0 && (
        <section className="section-pad bg-brand-off-white">
          <div className="container-page max-w-4xl">
            <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-brand-graphite">
              Dúvidas frequentes sobre este tema
            </h2>
            <Accordion
              items={faqs.map((f, index) => ({
                id: `article-faq-${index}`,
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
      {displayRelated.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-page">
            <h2 className="mb-10 font-serif text-3xl font-semibold text-brand-graphite">Artigos relacionados</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {displayRelated.map((related) => (
                <ArticleCard
                  key={related.slug}
                  article={{ ...related, category: { name: article.category.name } }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
