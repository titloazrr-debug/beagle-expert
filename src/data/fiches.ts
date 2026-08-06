import "server-only";

import type { FicheCategory } from "@/types";
import {
  getAllFiches,
  getAllFicheSlugs,
  getFicheBySlug,
} from "@/lib/content/load-fiches";

export { categoryLabels } from "@/data/categories";

/** Fiches chargées depuis content/fiches/*.mdx */
export const fiches = getAllFiches();

export { getAllFiches, getAllFicheSlugs, getFicheBySlug };

export function getFichesByCategory(category: FicheCategory) {
  return getAllFiches().filter((f) => f.category === category);
}
