import type { FaqItem, Product, ProductComparison } from "@/types";

/** Vitesse retenue pour l’affichage (lecture adulte courante, en français). */
export const READING_WORDS_PER_MINUTE = 230;

/**
 * Compte les mots d’un texte (lettres et chiffres).
 * Les liens markdown ne comptent que leur libellé, pas l’adresse.
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const normalized = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ");
  return normalized.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
}

/** Minutes affichées : 230 mots/min, arrondi à la minute supérieure, minimum 1. */
export function readingMinutesFromWords(words: number): number {
  if (words <= 0) return 1;
  return Math.ceil(words / READING_WORDS_PER_MINUTE);
}

/**
 * Temps de lecture d’une fiche, seule source utilisée à l’écran.
 * Mots comptés : introduction, chapeau, résumé, corps markdown, FAQ,
 * textes des cartes produits et des comparatifs de la page.
 * Ni le menu, ni le pied de page, ni les prix.
 */
export function readingMinutesForFiche(input: {
  intro?: string;
  excerpt?: string;
  summary?: string;
  body: string;
  faq?: FaqItem[];
  products?: Product[];
  comparisons?: ProductComparison[];
}): number {
  const parts: string[] = [];
  const intro = input.intro?.trim() ?? "";
  const excerpt = input.excerpt?.trim() ?? "";
  if (intro) parts.push(intro);
  if (excerpt && excerpt !== intro) parts.push(excerpt);
  if (input.summary?.trim()) parts.push(input.summary);
  parts.push(input.body);

  for (const item of input.faq ?? []) {
    parts.push(item.question, item.answer);
  }

  for (const product of input.products ?? []) {
    parts.push(
      product.name,
      product.recommendation || product.shortDescription || "",
      product.bestFor ?? "",
      ...(product.advantages ?? []),
      ...(product.disadvantages ?? [])
    );
  }

  for (const comparison of input.comparisons ?? []) {
    parts.push(
      comparison.title,
      comparison.intro,
      comparison.verdict,
      comparison.disclaimer ?? "",
      comparison.left.name,
      comparison.left.tagline ?? "",
      ...comparison.left.points,
      comparison.right.name,
      comparison.right.tagline ?? "",
      ...comparison.right.points
    );
  }

  return readingMinutesFromWords(countWords(parts.join("\n")));
}
