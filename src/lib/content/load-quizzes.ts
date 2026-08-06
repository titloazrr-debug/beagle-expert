import "server-only";

import fs from "fs";
import path from "path";
import type { Product, Quiz, QuizQuestion, QuizResultProfile } from "@/types";
import { QUIZZES_DIR } from "@/lib/content/paths";
import {
  getAllProducts,
  getProductsByIds,
} from "@/lib/content/load-products";

interface RawQuizFile {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  estimatedMinutes: number;
  mode: "profile" | "product-score";
  ctaLabel?: string;
  seo: { title: string; description: string };
  questions: QuizQuestion[];
  results: QuizResultProfile[];
  /** Liste d'IDs du catalogue content/products.json */
  productIds?: string[];
  /** @deprecated legacy map — résolu via catalogue officiel */
  products?: Record<string, { id: string }> | { id: string }[];
  basedOn?: string[];
}

function collectProductIds(raw: RawQuizFile): string[] {
  if (raw.productIds?.length) return raw.productIds;
  if (!raw.products) {
    // Tous les IDs cités dans les résultats
    const fromResults = raw.results.flatMap((r) => r.productIds ?? []);
    return Array.from(new Set(fromResults));
  }
  const list = Array.isArray(raw.products)
    ? raw.products.map((p) => p.id)
    : Object.keys(raw.products);
  return list;
}

function readQuizFile(filePath: string): Quiz {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as RawQuizFile;
  const ids = collectProductIds(raw);
  const products =
    ids.length > 0 ? getProductsByIds(ids) : getAllProducts();

  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    emoji: raw.emoji,
    description: raw.description,
    estimatedMinutes: raw.estimatedMinutes,
    mode: raw.mode,
    ctaLabel: raw.ctaLabel,
    seo: raw.seo,
    questions: raw.questions,
    results: raw.results,
    productCatalog: products,
  };
}

let cache: Quiz[] | null = null;

export function loadAllQuizzes(): { quizzes: Quiz[]; products: Product[] } {
  const quizzes = getAllQuizzes();
  return { quizzes, products: getAllProducts() };
}

export function getAllQuizzes(): Quiz[] {
  if (cache) return cache;

  if (!fs.existsSync(QUIZZES_DIR)) {
    cache = [];
    return cache;
  }

  const files = fs
    .readdirSync(QUIZZES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  cache = files.map((file) => readQuizFile(path.join(QUIZZES_DIR, file)));
  return cache;
}

export function getQuizBySlug(slug: string): Quiz | undefined {
  return getAllQuizzes().find((q) => q.slug === slug);
}

export function getAllQuizSlugs(): string[] {
  return getAllQuizzes().map((q) => q.slug);
}

export function getQuizProducts(): Product[] {
  return getAllProducts();
}
