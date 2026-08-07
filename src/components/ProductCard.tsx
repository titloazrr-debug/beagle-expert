"use client";

import type { Product } from "@/types";
import { ExternalLink, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  /** Callback avant redirection marchande (ex: capture email) */
  onBeforeNavigate?: (url: string, productName: string) => void;
}

export function ProductCard({
  product,
  reason,
  rank,
  className,
  compact = false,
  showProsCons,
  onBeforeNavigate,
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
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-card shadow-[var(--shadow-card)]",
        rank === 1
          ? "border-accent shadow-accent/15"
          : "border-accent/30",
        "transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_28px_-8px_rgb(107_63_26_/_0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isPlaceholder && "cursor-default",
        className
      )}
      aria-disabled={isPlaceholder || undefined}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-accent via-accent-soft to-primary",
          rank === 1 && "h-2.5 from-accent via-[#8b5a2b] to-accent"
        )}
      />
      {rank === 1 && (
        <div className="bg-accent px-4 py-1.5 text-center text-[11px] font-extrabold uppercase tracking-wider text-accent-foreground">
          ⭐ Votre résultat — produit recommandé
        </div>
      )}

      <div className={cn("flex flex-1 flex-col p-5", compact && "p-4", rank === 1 && "bg-gradient-to-b from-[#fff8f0] to-card")}>
        <div className="flex items-start gap-3.5">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 border-accent/25 bg-accent/10 text-3xl shadow-inner transition-transform group-hover:scale-105"
            aria-hidden
          >
            {product.imageEmoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {rank !== undefined && (
                <Badge
                  variant={rank === 1 ? "accent" : "default"}
                  className="tabular-nums"
                >
                  #{rank}
                </Badge>
              )}
              {rank === 1 && (
                <Badge variant="accent" className="gap-1">
                  <span aria-hidden>⭐</span> Recommandé
                </Badge>
              )}
              {product.badge && (
                <Badge variant="accent">{product.badge}</Badge>
              )}
            </div>
            <h3 className="mt-1.5 text-base font-extrabold leading-snug text-foreground group-hover:text-accent transition-colors sm:text-[1.05rem]">
              {product.name}
            </h3>
            <p className="mt-1 text-sm font-extrabold text-accent">{price}</p>
          </div>
        </div>

        {why && (
          <div className="mt-3.5 rounded-xl border-2 border-accent/30 bg-accent/8 px-3.5 py-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-accent">
              Pourquoi pour vous
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

        <div className="mt-auto pt-4">
          {isPlaceholder ? (
            <span className="block rounded-xl border border-dashed border-border bg-muted/40 px-3 py-3 text-center text-[11px] italic text-muted-foreground">
              Lien affilié à venir
            </span>
          ) : (
            <span
              onClick={(e) => {
                e.preventDefault();
                onBeforeNavigate?.(href, product.name);
              }}
              className={cn(
                "flex w-full min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 text-sm font-extrabold text-accent-foreground shadow-md shadow-accent/25 transition group-hover:brightness-110",
                rank === 1 && "min-h-14 text-base shadow-lg shadow-accent/30"
              )}
            >
              Voir le produit
              <ExternalLink className="size-4 opacity-95" aria-hidden />
            </span>
          )}
          {!isPlaceholder && (
            <p className="mt-2 text-center text-[10px] font-medium text-muted-foreground">
              Lien affilié · sans surcoût pour vous
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
