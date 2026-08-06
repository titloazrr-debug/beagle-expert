import type { ProductComparison, ComparisonSide, Product } from "@/types";
import { getProductById } from "@/data/products";
import { Scale, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonBlockProps {
  comparison: ProductComparison;
  className?: string;
}

function SideCard({
  side,
  product,
  accent,
}: {
  side: ComparisonSide;
  product?: Product;
  accent: "left" | "right";
}) {
  const emoji = side.imageEmoji || product?.imageEmoji || "🛒";

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border-2 bg-card p-4 sm:p-5",
        accent === "left"
          ? "border-primary/30 shadow-[var(--shadow-card)]"
          : "border-border shadow-[var(--shadow-card)]"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-2xl"
          aria-hidden
        >
          {emoji}
        </span>
        <div className="min-w-0">
          <h4 className="text-base font-extrabold leading-snug text-foreground">
            {side.name}
          </h4>
          {side.tagline && (
            <p className="mt-0.5 text-sm font-medium text-accent">
              {side.tagline}
            </p>
          )}
        </div>
      </div>

      <ul className="mt-4 flex-1 space-y-2">
        {side.points.map((point) => (
          <li
            key={point}
            className="flex gap-2 text-sm leading-snug text-foreground"
          >
            <span
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                accent === "left" ? "bg-primary" : "bg-accent"
              )}
              aria-hidden
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparisonBlock({
  comparison,
  className,
}: ComparisonBlockProps) {
  const leftProduct = comparison.left.productId
    ? getProductById(comparison.left.productId)
    : undefined;
  const rightProduct = comparison.right.productId
    ? getProductById(comparison.right.productId)
    : undefined;

  return (
    <article
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-xl"
          aria-hidden
        >
          {comparison.emoji}
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-primary">
            <Scale className="size-3.5" aria-hidden />
            Comparatif
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            {comparison.title}
          </h3>
        </div>
      </div>

      <p className="measure-wide mt-3 text-[0.95rem] leading-[1.7] text-foreground/90">
        {comparison.intro}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <SideCard side={comparison.left} product={leftProduct} accent="left" />
        <SideCard
          side={comparison.right}
          product={rightProduct}
          accent="right"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-primary/20 bg-key-bg/80 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-primary">
          <Sparkles className="size-3.5" aria-hidden />
          Notre lecture
        </p>
        <p className="mt-2 text-[0.95rem] leading-[1.7] text-foreground">
          {comparison.verdict}
        </p>
        {comparison.disclaimer && (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {comparison.disclaimer}
          </p>
        )}
      </div>
    </article>
  );
}
