import Link from "next/link";
import { Badge } from "./ui/Badge";
import { CalendarIcon, ClockReadIcon } from "./icons";
import { formatDateShort } from "@/lib/utils";

export interface ArticleCardData {
  slug: string;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  coverImage?: string | null;
  category?: { name: string } | null;
  publishedAt?: Date | string | null;
  readingTime?: number;
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm transition-shadow hover:shadow-md">
      {article.coverImage ? (
        <Link href={`/artigos/${article.slug}`} className="block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      ) : (
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-sand to-brand-off-white" aria-hidden="true" />
      )}
      <div className="flex flex-1 flex-col p-6">
        {article.category && (
          <div className="mb-3">
            <Badge>{article.category.name}</Badge>
          </div>
        )}
        <h3 className="font-serif text-xl leading-snug text-brand-graphite">
          <Link href={`/artigos/${article.slug}`} className="transition-colors hover:text-brand-deep">
            {article.title}
          </Link>
        </h3>
        {article.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-gray">{article.summary}</p>
        ) : article.subtitle ? (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-gray">{article.subtitle}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-brand-gray">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDateShort(article.publishedAt)}
          </span>
          {article.readingTime ? (
            <span className="inline-flex items-center gap-1.5">
              <ClockReadIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {article.readingTime} min
            </span>
          ) : null}
        </div>
        <Link
          href={`/artigos/${article.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-terracotta transition-colors hover:text-brand-deep"
        >
          Ler artigo
        </Link>
      </div>
    </article>
  );
}
