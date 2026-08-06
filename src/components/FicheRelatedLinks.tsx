import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Fiche } from "@/types";
import { categoryLabels } from "@/data/categories";
import { cn } from "@/lib/utils";

interface FicheRelatedLinksProps {
  currentSlug: string;
  related: Pick<
    Fiche,
    "slug" | "title" | "emoji" | "excerpt" | "category"
  >[];
  className?: string;
}

/** Maillage interne SEO entre fiches (liens contextuels). */
export function FicheRelatedLinks({
  currentSlug,
  related,
  className,
}: FicheRelatedLinksProps) {
  const items = related.filter((f) => f.slug !== currentSlug);
  if (!items.length) return null;

  return (
    <nav
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8",
        className
      )}
      aria-labelledby="related-fiches-heading"
    >
      <h2
        id="related-fiches-heading"
        className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-foreground"
      >
        Pour aller plus loin
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        D’autres guides Beagle complémentaires pour approfondir le sujet.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((f) => {
          const cat = categoryLabels[f.category];
          return (
            <li key={f.slug}>
              <Link
                href={`/fiche/${f.slug}`}
                className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 transition hover:border-primary/35 hover:bg-primary/5 hover:shadow-md"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-2xl shadow-sm ring-1 ring-border"
                  role="img"
                  aria-label={`Icône ${cat.label}`}
                >
                  {f.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-wide text-primary">
                    {cat.label}
                  </span>
                  <span className="mt-0.5 block text-sm font-bold leading-snug text-foreground group-hover:text-primary">
                    {f.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {f.excerpt}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-80 group-hover:opacity-100">
                    Lire la fiche
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
