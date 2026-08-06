"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Scale,
  Sparkles,
} from "lucide-react";
import type {
  ComparisonCategory,
  ComparisonCriterionMeta,
  ComparisonTableProduct,
  ComparisonTableSpec,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  table: ComparisonTableSpec;
  className?: string;
}

function formatValue(value: string | number | boolean | undefined): string {
  if (value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return String(value);
}

function isPlaceholderUrl(url: string): boolean {
  return !url || url === "#";
}

function ProductHeader({
  product,
  selected,
  onSelect,
}: {
  product: ComparisonTableProduct;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/30",
        product.recommended && "ring-2 ring-emerald-400/40"
      )}
    >
      {product.recommended && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
          <Sparkles className="size-3" aria-hidden />
          Recommandé Beagle Expert
        </span>
      )}
      <span className="text-3xl" aria-hidden>
        {product.emoji}
      </span>
      <span className="text-sm font-extrabold leading-snug text-foreground">
        {product.name}
      </span>
      {product.badge && (
        <Badge variant="secondary" className="text-[10px]">
          {product.badge}
        </Badge>
      )}
      <span className="text-xs font-bold text-accent">{product.priceLabel}</span>
    </button>
  );
}

function ProductCta({ product }: { product: ComparisonTableProduct }) {
  const placeholder = isPlaceholderUrl(product.affiliateUrl);
  if (placeholder) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground">
        Lien affilié à configurer
      </p>
    );
  }
  return (
    <Button asChild variant="affiliate" className="min-h-11 w-full shadow-md">
      <a
        href={product.affiliateUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-affiliate="true"
      >
        Voir le produit
        <ExternalLink className="size-3.5" aria-hidden />
      </a>
    </Button>
  );
}

function CriterionRow({
  criterion,
  products,
}: {
  criterion: ComparisonCriterionMeta;
  products: ComparisonTableProduct[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-t border-border/70">
        <th
          scope="row"
          className="sticky left-0 z-10 bg-card px-3 py-2.5 text-left text-xs font-extrabold text-foreground sm:text-sm"
        >
          <button
            type="button"
            className={cn(
              "inline-flex max-w-full items-start gap-1 text-left",
              criterion.detail && "hover:text-primary"
            )}
            onClick={() => criterion.detail && setOpen((v) => !v)}
            aria-expanded={criterion.detail ? open : undefined}
            disabled={!criterion.detail}
          >
            <span>{criterion.label}</span>
            {criterion.detail && (
              <ChevronDown
                className={cn(
                  "mt-0.5 size-3.5 shrink-0 transition",
                  open && "rotate-180"
                )}
                aria-hidden
              />
            )}
          </button>
        </th>
        {products.map((p) => {
          const val = p.criteria[criterion.key];
          const isWinner = criterion.winnerId === p.id;
          return (
            <td
              key={p.id}
              className={cn(
                "min-w-[9.5rem] px-3 py-2.5 text-center text-xs sm:min-w-[11rem] sm:text-sm",
                isWinner
                  ? "bg-emerald-50 font-semibold text-emerald-950"
                  : "text-foreground/90"
              )}
            >
              <span className="inline-flex flex-col items-center gap-1">
                {isWinner && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                    <Check className="size-3" aria-hidden />
                    Meilleur
                  </span>
                )}
                <span>{formatValue(val)}</span>
              </span>
            </td>
          );
        })}
      </tr>
      {open && criterion.detail && (
        <tr className="bg-muted/30">
          <td
            colSpan={products.length + 1}
            className="px-3 py-2 text-xs leading-relaxed text-muted-foreground"
          >
            {criterion.detail}
          </td>
        </tr>
      )}
    </>
  );
}

function CategoryBlock({
  category,
  products,
}: {
  category: ComparisonCategory;
  products: ComparisonTableProduct[];
}) {
  return (
    <tbody>
      <tr>
        <th
          colSpan={products.length + 1}
          className="bg-muted/50 px-3 py-2 text-left text-[11px] font-extrabold uppercase tracking-wide text-primary"
        >
          {category.label}
        </th>
      </tr>
      {category.criteria.map((c) => (
        <CriterionRow key={c.key} criterion={c} products={products} />
      ))}
    </tbody>
  );
}

/** Mobile : une carte repliable par produit */
function MobileProductCards({
  products,
  categories,
}: {
  products: ComparisonTableProduct[];
  categories: ComparisonCategory[];
}) {
  const [openId, setOpenId] = useState(products[0]?.id ?? "");

  return (
    <div className="space-y-3 md:hidden">
      {products.map((p) => {
        const open = openId === p.id;
        return (
          <div
            key={p.id}
            className={cn(
              "overflow-hidden rounded-2xl border-2 bg-card shadow-sm",
              p.recommended ? "border-emerald-400/60" : "border-border"
            )}
          >
            <button
              type="button"
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => setOpenId(open ? "" : p.id)}
              aria-expanded={open}
            >
              <span className="text-2xl" aria-hidden>
                {p.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold">{p.name}</span>
                <span className="text-xs font-bold text-accent">
                  {p.priceLabel}
                </span>
                {p.recommended && (
                  <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                    ⭐ Recommandé Beagle Expert
                  </span>
                )}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition",
                  open && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            {open && (
              <div className="space-y-4 border-t border-border px-4 pb-4 pt-3">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-primary">
                      {cat.label}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {cat.criteria.map((c) => {
                        const isWinner = c.winnerId === p.id;
                        return (
                          <li
                            key={c.key}
                            className={cn(
                              "flex items-start justify-between gap-3 rounded-xl px-2.5 py-2 text-sm",
                              isWinner ? "bg-emerald-50" : "bg-muted/40"
                            )}
                          >
                            <span className="font-semibold text-foreground">
                              {c.label}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 text-right text-xs",
                                isWinner
                                  ? "font-bold text-emerald-900"
                                  : "text-foreground/90"
                              )}
                            >
                              {isWinner && "✓ "}
                              {formatValue(p.criteria[c.key])}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                <ProductCta product={p} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ComparisonTable({ table, className }: ComparisonTableProps) {
  const { products, categories } = table;
  const [selectedId, setSelectedId] = useState(
    products.find((p) => p.recommended)?.id ?? products[0]?.id ?? ""
  );
  const selected = products.find((p) => p.id === selectedId) ?? products[0];

  return (
    <article
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7",
        className
      )}
      aria-labelledby={`cmp-table-${table.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-xl"
          aria-hidden
        >
          {table.emoji}
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-primary">
            <Scale className="size-3.5" aria-hidden />
            Tableau comparatif
          </p>
          <h3
            id={`cmp-table-${table.id}`}
            className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-foreground sm:text-xl"
          >
            {table.title}
          </h3>
        </div>
      </div>

      <p className="measure-wide mt-3 text-[0.95rem] leading-[1.7] text-foreground/90">
        {table.intro}
      </p>

      {/* Mobile */}
      <div className="mt-5">
        <MobileProductCards products={products} categories={categories} />
      </div>

      {/* Desktop / tablette : tableau scroll horizontal si besoin */}
      <div className="mt-5 hidden md:block">
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {products.map((p) => (
            <ProductHeader
              key={p.id}
              product={p}
              selected={selectedId === p.id}
              onSelect={() => setSelectedId(p.id)}
            />
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="bg-muted/40">
                <th className="sticky left-0 z-10 bg-muted/40 px-3 py-3 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  Critère
                </th>
                {products.map((p) => (
                  <th
                    key={p.id}
                    className="px-3 py-3 text-center text-xs font-extrabold text-foreground"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            {categories.map((cat) => (
              <CategoryBlock
                key={cat.id}
                category={cat}
                products={products}
              />
            ))}
            <tfoot>
              <tr className="border-t border-border bg-card">
                <th className="sticky left-0 z-10 bg-card px-3 py-3 text-xs font-extrabold text-muted-foreground">
                  Lien
                </th>
                {products.map((p) => (
                  <td key={p.id} className="px-3 py-3">
                    <ProductCta product={p} />
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {selected && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Sélection :{" "}
            <strong className="text-foreground">{selected.name}</strong>
            {" — "}
            cliquez sur « Voir le produit » pour l’offre.
          </p>
        )}
      </div>

      {table.verdict && (
        <div className="mt-5 rounded-2xl border border-primary/20 bg-key-bg/80 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Notre lecture
          </p>
          <p className="mt-2 text-[0.95rem] leading-[1.7] text-foreground">
            {table.verdict}
          </p>
          {table.disclaimer && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {table.disclaimer}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
