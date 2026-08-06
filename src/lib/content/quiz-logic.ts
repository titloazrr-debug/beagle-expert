import type { Product, Quiz, QuizResultProfile } from "@/types";

/** Quiz de compatibilité mode de vie (redirection multi-races possible). */
const LIFESTYLE_COMPATIBILITY_SLUGS = new Set(["pret-a-adopter"]);

/**
 * Niveau d’alignement Beagle pour un profil résultat.
 * high = bon match ; medium / low = afficher des races alternatives.
 */
export function getLifestyleFitLevel(
  profile: QuizResultProfile
): "high" | "medium" | "low" {
  const id = profile.id.toLowerCase();
  if (
    id === "pret" ||
    id.includes("compatible") ||
    id.includes("excellent") ||
    id.includes("eleve")
  ) {
    return "high";
  }
  if (
    id === "paspret" ||
    id.includes("pas-pret") ||
    id.includes("incompat") ||
    id.includes("faible")
  ) {
    return "low";
  }
  // vigilance, moyen, etc.
  return "medium";
}

/** Afficher les placeholders multi-races (score moyen ou faible). */
export function shouldShowAlternativeBreeds(
  quiz: Quiz,
  profile: QuizResultProfile
): boolean {
  if (!LIFESTYLE_COMPATIBILITY_SLUGS.has(quiz.slug)) return false;
  return getLifestyleFitLevel(profile) !== "high";
}

/** Agrège les scores des réponses sélectionnées */
export function aggregateScores(
  quiz: Quiz,
  answers: Record<string, string>
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const question of quiz.questions) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [tag, value] of Object.entries(option.scores)) {
      totals[tag] = (totals[tag] ?? 0) + value;
    }
  }
  return totals;
}

/** Sélectionne le profil résultat dominant */
export function pickResultProfile(
  quiz: Quiz,
  scores: Record<string, number>
) {
  let best = quiz.results[quiz.results.length - 1];
  let bestScore = -Infinity;

  for (const result of quiz.results) {
    const tagScore = result.tags.reduce(
      (sum, tag) => sum + (scores[tag] ?? 0),
      0
    );
    if (tagScore > bestScore) {
      bestScore = tagScore;
      best = result;
    }
  }

  if (best.minScore !== undefined && bestScore < best.minScore) {
    const fallback = [...quiz.results].reverse().find((r) => {
      const s = r.tags.reduce((sum, tag) => sum + (scores[tag] ?? 0), 0);
      return r.minScore === undefined || s >= r.minScore;
    });
    if (fallback) best = fallback;
  }

  return { profile: best, matchScore: bestScore };
}

function catalogOf(quiz: Quiz): Product[] {
  return quiz.productCatalog ?? [];
}

export function getQuizProductsByIds(quiz: Quiz, ids: string[]): Product[] {
  const catalog = catalogOf(quiz);
  return ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

/** Top produits par score de tags, dans le catalogue du quiz */
export function rankProductsForScores(
  quiz: Quiz,
  scores: Record<string, number>,
  limit = 4,
  poolIds?: string[]
) {
  const catalog = catalogOf(quiz);
  const pool = poolIds?.length
    ? poolIds
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
    : catalog.filter((p) => p.tags.some((t) => Object.keys(scores).includes(t)));

  const ranked = pool
    .map((product) => {
      const score = product.tags.reduce(
        (sum, tag) => sum + (scores[tag] ?? 0),
        0
      );
      return { product, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit);
}
