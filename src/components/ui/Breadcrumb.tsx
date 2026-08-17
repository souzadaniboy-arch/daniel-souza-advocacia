import Link from "next/link";

export interface Crumb {
  name: string;
  path?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-sm text-brand-gray">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden="true" className="text-brand-sand">/</span>}
              {isLast || !item.path ? (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-medium text-brand-graphite" : ""}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-brand-terracotta">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
