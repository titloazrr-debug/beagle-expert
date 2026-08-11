import type { Product } from "@/types";

/** Extrait un prix approximatif en centimes depuis une fourchette textuelle. */
export function parsePriceToCents(price?: string): number {
  if (!price) return 0;
  const match = price.replace(/\s/g, "").match(/(\d+)(?:[.,](\d+))?/);
  if (!match) return 0;
  const euros = parseInt(match[1], 10);
  return euros * 100;
}

export function emojiForProduct(
  id: string,
  name: string,
  tags: string[] = []
): string {
  const hay = `${id} ${name} ${tags.join(" ")}`.toLowerCase();
  if (hay.includes("gps") || hay.includes("tractive") || hay.includes("weenect"))
    return "📡";
  if (
    hay.includes("assurance") ||
    hay.includes("santevet") ||
    hay.includes("assur")
  )
    return "🛡️";
  if (
    hay.includes("croquette") ||
    hay.includes("ultra") ||
    hay.includes("premium") ||
    hay.includes("royal") ||
    hay.includes("hill")
  )
    return "🥣";
  if (hay.includes("kong")) return "🔴";
  if (hay.includes("fouille") || hay.includes("snuffle")) return "🌿";
  if (hay.includes("balle")) return "🎾";
  if (hay.includes("auriculaire") || hay.includes("oreille")) return "👂";
  return "🛒";
}

function clampRating(value?: number): number | undefined {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined;
  }
  return Math.min(5, Math.max(0, Math.round(value * 10) / 10));
}

export function normalizeContentProduct(raw: {
  id: string;
  name: string;
  price?: string;
  shortDescription?: string;
  recommendation?: string;
  reason?: string;
  category?: string;
  tags?: string[];
  affiliateUrl?: string;
  categories?: string[];
  badge?: string;
  promoCode?: string;
  promoLabel?: string;
  imageEmoji?: string;
  advantages?: string[];
  disadvantages?: string[];
  bestFor?: string;
  rating?: number;
}): Product {
  const tags = raw.tags ?? [];
  const priceLabel = raw.price?.trim() || undefined;
  const recommendation =
    raw.recommendation?.trim() || raw.reason?.trim() || undefined;
  return {
    id: raw.id,
    name: raw.name,
    shortDescription:
      raw.shortDescription?.trim() ||
      recommendation ||
      "Produit recommandé pour les propriétaires de Beagle.",
    recommendation,
    category: raw.category,
    priceCents: parsePriceToCents(priceLabel),
    priceLabel,
    affiliateUrl: raw.affiliateUrl?.trim() || "#",
    imageEmoji: raw.imageEmoji ?? emojiForProduct(raw.id, raw.name, tags),
    badge: raw.badge,
    promoCode: raw.promoCode?.trim() || undefined,
    promoLabel: raw.promoLabel?.trim() || undefined,
    tags,
    categories: raw.categories ?? (raw.category ? [raw.category] : tags),
    advantages: raw.advantages?.map((s) => s.trim()).filter(Boolean),
    disadvantages: raw.disadvantages?.map((s) => s.trim()).filter(Boolean),
    bestFor: raw.bestFor?.trim() || undefined,
    rating: clampRating(raw.rating),
  };
}

export function mergeProducts(list: Product[]): Product[] {
  const map = new Map<string, Product>();
  for (const p of list) {
    const existing = map.get(p.id);
    if (!existing) {
      map.set(p.id, p);
      continue;
    }
    map.set(p.id, {
      ...existing,
      ...p,
      shortDescription:
        (p.recommendation?.length ?? 0) > 0
          ? p.shortDescription
          : p.shortDescription.length > existing.shortDescription.length
            ? p.shortDescription
            : existing.shortDescription,
      recommendation: p.recommendation ?? existing.recommendation,
      tags: Array.from(new Set([...existing.tags, ...p.tags])),
      categories: Array.from(
        new Set([...(existing.categories ?? []), ...(p.categories ?? [])])
      ),
      priceLabel: p.priceLabel ?? existing.priceLabel,
      priceCents: p.priceCents || existing.priceCents,
      affiliateUrl:
        p.affiliateUrl && p.affiliateUrl !== "#"
          ? p.affiliateUrl
          : existing.affiliateUrl,
      advantages:
        (p.advantages?.length ?? 0) > 0 ? p.advantages : existing.advantages,
      disadvantages:
        (p.disadvantages?.length ?? 0) > 0
          ? p.disadvantages
          : existing.disadvantages,
      bestFor: p.bestFor ?? existing.bestFor,
      rating: p.rating ?? existing.rating,
    });
  }
  return Array.from(map.values());
}
