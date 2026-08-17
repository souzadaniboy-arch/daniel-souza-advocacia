import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArticleCard, type ArticleCardData } from "@/components/ArticleCard";

interface RecentArticlesProps {
  articles: ArticleCardData[];
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  if (articles.length === 0) return null;
  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mb-14 flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="Central de Conhecimento Jurídico"
            title="Artigos recentes"
            align="left"
          />
          <Link href="/artigos" className="btn-secondary shrink-0">
            VER TODOS OS ARTIGOS
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
