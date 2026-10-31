import type { ComparisonTableSpec } from "@/types";

/**
 * Tableaux interactifs (critères × produits).
 * Le tableau Tractive vs Weenect n'est plus monté : pas de bouton ni
 * d'accordéon pour ce concurrent. La comparaison factuelle reste dans
 * le texte des fiches.
 */
export const COMPARISON_TABLES: ComparisonTableSpec[] = [];

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
