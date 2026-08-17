import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, basePath, query = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(query);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages: number[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== -1) {
      pages.push(-1);
    }
  }

  return (
    <nav aria-label="Paginação" className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="btn-secondary px-4 py-2"
          aria-label="Página anterior"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
      )}
      {pages.map((p, index) =>
        p === -1 ? (
          <span key={`ellipsis-${index}`} aria-hidden="true" className="px-2 text-brand-gray">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-sm text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-brand-terracotta text-white"
                : "bg-white text-brand-graphite hover:bg-brand-sand"
            }`}
          >
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className="btn-secondary px-4 py-2" aria-label="Próxima página">
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
