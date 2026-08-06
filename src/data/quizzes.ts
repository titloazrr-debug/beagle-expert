import "server-only";

import {
  getAllQuizzes,
  getAllQuizSlugs,
  getQuizBySlug,
} from "@/lib/content/load-quizzes";

/** Quiz chargés depuis content/quizzes/*.json */
export const quizzes = getAllQuizzes();

export { getAllQuizzes, getAllQuizSlugs, getQuizBySlug };

// Logique pure (client-safe) — réexport pour imports serveur unifiés
export {
  aggregateScores,
  pickResultProfile,
  rankProductsForScores,
  getQuizProductsByIds,
} from "@/lib/content/quiz-logic";
