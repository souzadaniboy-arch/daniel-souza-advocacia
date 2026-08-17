import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, jsonLdScript, breadcrumbSchema } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import { SearchIcon } from "@/components/icons";
import Link from "next/link";

const PER_PAGE = 9;

interface ArtigosPageProps {
  searchParams: Promise<{ q?: string; categoria?: string; page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Artigos",
    description:
      "Artigos e conteúdos jurídicos informativos sobre Direito Previdenciário, Trabalhista, Tributário, Bancário e Direitos das Pessoas Autistas.",
    path: "/artigos",
  });
}

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  const { q = "", categoria = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const categories = await prisma.category.findMany({
    where: { active: true },
    select: { slug: true, name: true, type: true },
    orderBy: { order: "asc" },
  });

  const where = {
    status: "PUBLISHED" as const,
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { subtitle: { contains: q } },
            { summary: { contains: q } },
            { content: { contains: q } },
            { keywords: { contains: q } },
          ],
        }
      : {}),
    ...(categoria ? { category: { slug: categoria } } : {}),
  };

  const [total, articles, featured] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      select: {
        slug: true,
        title: true,
        subtitle: true,
        summary: true,
        coverImage: true,
        publishedAt: true,
        readingTime: true,
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    !q && !categoria
      ? prisma.article.findMany({
          where: { status: "PUBLISHED", featured: true },
          select: {
            slug: true,
            title: true,
            subtitle: true,
            summary: true,
            coverImage: true,
            publishedAt: true,
            readingTime: true,
            category: { select: { name: true } },
          },
          orderBy: { publishedAt: "desc" },
          take: 3,
        })
      : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const crumbSchema = breadcrumbSchema([
    { name: "Início", path: "/" },
    { name: "Artigos", path: "/artigos" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbSchema) }} />
      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-8">
            <Breadcrumb items={[{ name: "Início", path: "/" }, { name: "Artigos" }]} />
          </div>
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
              Central de Conhecimento Jurídico
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
              Artigos
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-gray">
              Conteúdos jurídicos informativos para ajudar você a compreender direitos, deveres, riscos e
              possibilidades.
            </p>
          </div>

          {/* Busca */}
          <form method="get" action="/artigos" role="search" className="mt-10 max-w-2xl">
            <label htmlFor="q" className="sr-only">
              Pesquisar artigos
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" aria-hidden="true" />
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder='Pesquisar, por exemplo: "aposentadoria", "horas extras", "empréstimo", "autismo"'
                  className="input pl-12"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0 px-5">
                Buscar
              </button>
            </div>
          </form>

          {/* Categorias */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/artigos"
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                !categoria ? "bg-brand-terracotta text-white" : "bg-white text-brand-gray hover:text-brand-deep"
              }`}
            >
              Todas
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/artigos?categoria=${cat.slug}`}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  categoria === cat.slug ? "bg-brand-terracotta text-white" : "bg-white text-brand-gray hover:text-brand-deep"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artigos em destaque */}
      {featured.length > 0 && (
        <section className="bg-white pb-4 pt-12">
          <div className="container-page">
            <h2 className="mb-8 font-serif text-2xl font-semibold text-brand-graphite">Artigos em destaque</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featured.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-12">
        <div className="container-page">
          {q && (
            <p className="mb-8 text-sm text-brand-gray">
              {total} resultado{total !== 1 ? "s" : ""} para &ldquo;
              <span className="font-medium text-brand-graphite">{q}</span>&rdquo;
            </p>
          )}
          {articles.length === 0 ? (
            <div className="rounded-sm border border-brand-sand bg-brand-off-white p-12 text-center">
              <h2 className="font-serif text-2xl text-brand-graphite">Nenhum artigo encontrado</h2>
              <p className="mt-3 text-sm text-brand-gray">
                Tente outros termos de busca ou navegue pelas áreas de atuação.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/artigos"
            query={{ q, categoria }}
          />
        </div>
      </section>
    </>
  );
}
