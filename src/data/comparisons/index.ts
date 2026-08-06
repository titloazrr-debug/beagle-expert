import type { ComparisonTableSpec } from "@/types";
import { COLLIER_GPS_COMPARISON } from "@/data/comparisons/colliers-gps";

/** Tous les tableaux interactifs (critères × produits). */
export const COMPARISON_TABLES: ComparisonTableSpec[] = [
  COLLIER_GPS_COMPARISON,
];

/** Mapping slug fiche → tableaux à afficher. */
export function getComparisonTablesForFiche(
  slug: string
): ComparisonTableSpec[] {
  return COMPARISON_TABLES.filter((t) => t.ficheSlugs.includes(slug));
}

export function getComparisonTableById(
  id: string
): ComparisonTableSpec | undefined {
  return COMPARISON_TABLES.find((t) => t.id === id);
}
