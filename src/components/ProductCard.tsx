"use client";

import type { Product } from "@/types";
import { ExternalLink, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductRating } from "@/components/ProductRating";
import { ProductProsCons } from "@/components/ProductProsCons";
import { formatPrice, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  reason?: string;
  rank?: number;
  className?: string;
  compact?: boolean;
  /** Affiche avantages / inconvénients (défaut: true hors compact) */
  showProsCons?: boolean;
}

export function ProductCard({
  product,
  reason,
  rank,
  className,
  compact = false,
  showProsCons,
}: ProductCardProps) {
  const price =
    product.priceLabel ||
    (product.priceCents > 0
      ? formatPrice(product.priceCents, product.currency ?? "EUR")
      : "Prix selon offre");

  const why =
    reason || product.recommendation || product.shortDescription;

  const href =
    !product.affiliateUrl || product.affiliateUrl === "#"
      ? "#"
      : product.affiliateUrl;

  const isPlaceholder = href === "#";
  const displayProsCons =
    showProsCons ??
    (!compact &&
      Boolean(
        product.advantages?.length || product.disadvantages?.length
      ));

  return (
    <a
      href={href}
      target={isPlaceholder ? undefined : "_blank"}
      rel={isPlaceholder ? undefined : "noopener noreferrer sponsored"}
      data-affiliate="true"
      onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-200 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[var(--shadow-soft)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isPlaceholder && "cursor-default",
        className
      )}
      aria-disabled={isPlaceholder || undefined}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent-soft to-accent",
          rank === 1 && "from-accent via-primary to-primary"
        )}
      />

      <div className={cn("flex flex-1 flex-col p-5", compact && "p-4")}>
        <div className="flex items-start gap-3.5">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-3xl shadow-inner transition-transform group-hover:scale-105"
            aria-hidden
          >
            {product.imageEmoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {rank !== undefined && (
                <Badge variant="default" className="tabular-nums">
                  #{rank}
                </Badge>
              )}
              {product.badge && (
                <Badge variant="accent">{product.badge}</Badge>
              )}
            </div>
            <h3 className="mt-1.5 text-base font-extrabold leading-snug text-foreground group-hover:text-primary transition-colors sm:text-[1.05rem]">
              {product.name}
            </h3>
            <p className="mt-1 text-sm font-bold text-accent">{price}</p>
            {product.rating !== undefined && (
              <ProductRating rating={product.rating} className="mt-1.5" />
            )}
          </div>
        </div>

        {why && (
          <div className="mt-3.5 rounded-xl border border-primary/25 bg-key-bg/80 px-3.5 py-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-primary">
              Notre recommandation
            </p>
            <p
              className={cn(
                "mt-1.5 text-[0.95rem] leading-[1.65] text-foreground",
                compact && "line-clamp-4"
              )}
            >
              {why}
            </p>
          </div>
        )}

        {product.bestFor && !compact && (
          <div className="mt-3 flex gap-2 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5">
            <UserCheck
              className="mt-0.5 size-4 shrink-0 text-accent"
              aria-hidden
            />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
                Pour qui
              </p>
              <p className="mt-0.5 text-sm leading-snug text-foreground">
                {product.bestFor}
              </p>
            </div>
          </div>
        )}

        {displayProsCons && (
          <ProductProsCons
            className="mt-3.5"
            advantages={product.advantages}
            disadvantages={product.disadvantages}
            compact={compact}
          />
        )}

        {compact && product.bestFor && (
          <p className="mt-3 line-clamp-2 text-xs leading-snug text-muted-foreground">
            <span className="font-semibold text-foreground">Pour qui : </span>
            {product.bestFor}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="text-[11px] font-medium text-muted-foreground">
            {isPlaceholder ? "Lien bientôt disponible" : "Lien affilié"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition group-hover:brightness-110">
            Voir le produit
            {!isPlaceholder && (
              <ExternalLink className="size-3.5 opacity-90" aria-hidden />
            )}
          </span>
        </div>
      </div>
    </a>
  );
}
