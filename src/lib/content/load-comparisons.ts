import "server-only";

import fs from "fs";
import type { ProductComparison } from "@/types";
import { COMPARISONS_FILE } from "@/lib/content/paths";

let cache: ProductComparison[] | null = null;

export function loadComparisons(): ProductComparison[] {
  if (cache) return cache;
  if (!fs.existsSync(COMPARISONS_FILE)) {
    cache = [];
    return cache;
  }
  const raw = JSON.parse(
    fs.readFileSync(COMPARISONS_FILE, "utf8")
  ) as ProductComparison[];
  cache = raw.map((c) => ({
    ...c,
    left: {
      ...c.left,
      points: c.left.points?.filter(Boolean) ?? [],
    },
    right: {
      ...c.right,
      points: c.right.points?.filter(Boolean) ?? [],
    },
    ficheSlugs: c.ficheSlugs ?? [],
  }));
  return cache;
}

export function getComparisonsForFiche(
  slug: string
): ProductComparison[] {
  return loadComparisons().filter((c) => c.ficheSlugs.includes(slug));
}

export function getComparisonById(
  id: string
): ProductComparison | undefined {
  return loadComparisons().find((c) => c.id === id);
}
