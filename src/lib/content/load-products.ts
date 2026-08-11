import "server-only";

import fs from "fs";
import type { Product } from "@/types";
import { PRODUCTS_FILE } from "@/lib/content/paths";
import {
  mergeProducts,
  normalizeContentProduct,
} from "@/lib/content/product-utils";

let cache: Product[] | null = null;

interface RawCatalogProduct {
  id: string;
  name: string;
  category?: string;
  price?: string;
  shortDescription?: string;
  recommendation?: string;
  affiliateUrl?: string;
  imageEmoji?: string;
  badge?: string;
  promoCode?: string;
  promoLabel?: string;
  tags?: string[];
  categories?: string[];
  advantages?: string[];
  disadvantages?: string[];
  bestFor?: string;
  rating?: number;
}

/** Catalogue officiel d’affiliation (content/products.json). */
export function loadProductCatalog(): Product[] {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  const raw = JSON.parse(
    fs.readFileSync(PRODUCTS_FILE, "utf8")
  ) as RawCatalogProduct[];
  return raw.map((p) =>
    normalizeContentProduct({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      shortDescription: p.shortDescription,
      recommendation: p.recommendation,
      affiliateUrl: p.affiliateUrl,
      imageEmoji: p.imageEmoji,
      badge: p.badge,
      promoCode: p.promoCode,
      promoLabel: p.promoLabel,
      tags: p.tags,
      categories: p.categories,
      advantages: p.advantages,
      disadvantages: p.disadvantages,
      bestFor: p.bestFor,
      rating: p.rating,
    })
  );
}

export function getAllProducts(): Product[] {
  if (cache) return cache;
  // Source de vérité : catalogue central (les fiches/quiz référencent ces IDs)
  cache = mergeProducts(loadProductCatalog());
  return cache;
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductsByIds(ids: string[]): Product[] {
  const all = getAllProducts();
  return ids
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

/** Résout un catalogue quiz (ids) vers les produits officiels. */
export function resolveProductCatalog(
  idsOrMap?: string[] | Record<string, unknown>
): Product[] {
  const all = getAllProducts();
  if (!idsOrMap) return all;
  const ids = Array.isArray(idsOrMap)
    ? idsOrMap
    : Object.keys(idsOrMap);
  const resolved = ids
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  return resolved.length ? resolved : all;
}
