import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Fiche } from "@/types";
import { categoryLabels } from "@/data/categories";
import { getFicheCoverImage } from "@/lib/beagle-images";
import { BeagleImage } from "@/components/BeagleImage";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FicheCardProps {
  fiche: Fiche;
  className?: string;
  featured?: boolean;
}

export function FicheCard({
  fiche,
  className,
  featured = false,
}: FicheCardProps) {
  const cat = categoryLabels[fiche.category];
  const cover = getFicheCoverImage({
    slug: fiche.slug,
    category: fiche.category,
  });

  return (
    <Link href={`/fiche/${fiche.slug}`} className="group block h-full">
      <article
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-[var(--shadow-card)]",
          "transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]",
          featured && "border-primary/30",
          className
        )}
      >
        {cover ? (
          <div className="relative aspect-[16/10] w-full bg-muted">
            <BeagleImage
              asset={cover}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              wrapperClassName="absolute inset-0"
            />
          </div>
        ) : null}

        <div className="relative flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
                cat.color
              )}
            >
              <span aria-hidden>{cat.emoji}</span>
              {cat.label}
            </span>
            <Badge variant="muted" className="gap-1 font-semibold">
              <Clock className="size-3" aria-hidden />
              {fiche.readingTime} min
            </Badge>
          </div>

          <div className="mt-4 flex items-start gap-3">
            {!cover && (
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-2xl shadow-inner"
                aria-hidden
              >
                {fiche.emoji}
              </span>
            )}
            <h3 className="text-lg font-extrabold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
              {fiche.title}
            </h3>
          </div>

          <p className="mt-3 flex-1 text-[0.95rem] leading-[1.65] text-muted-foreground">
            {fiche.excerpt}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-primary">
            Lire la fiche
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </span>
        </div>
      </article>
    </Link>
  );
}
