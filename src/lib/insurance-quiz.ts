import type { Quiz, QuizResultProfile } from "@/types";
import { COMPLIANCE_MODE } from "@/lib/compliance";
import { aggregateScores, pickResultProfile } from "@/lib/content/quiz-logic";

/** Critères prioritaires affichés selon le profil (neutre). */
const PROFILE_CRITERIA: Record<string, string[]> = {
  antecedents: [
    "Exclusions liées aux antécédents et symptômes antérieurs",
    "Confirmation écrite de ce qui n’est pas couvert",
    "Délais de carence pour les futurs événements sans lien",
  ],
  "age-admission": [
    "Âge maximal de souscription selon la formule",
    "Maintien des garanties au fil des années",
    "Exclusions et carences pour profil senior",
  ],
  renforcee: [
    "Taux de remboursement de la formule",
    "Plafond annuel",
    "Franchise et délais de carence",
  ],
  essentielle: [
    "Plafond annuel pour les grosses dépenses",
    "Franchise et reste à charge",
    "Périmètre accidents / maladies",
  ],
  equilibre: [
    "Équilibre cotisation / taux de remboursement",
    "Plafond annuel",
    "Prévention et services optionnels",
  ],
};

/** Mapping priorité réponse → clé de surlignage tableau */
export function priorityHighlightKey(
  answers: Record<string, string>
): string | null {
  const p = answers.priorite;
  const map: Record<string, string> = {
    "prio-franchise": "franchise",
    "prio-carence": "carence",
    "prio-age": "age-admission",
    "prio-plafond": "plafond",
    "prio-avance": "avance",
    "prio-tele": "tele",
    "prio-prev": "prevention",
  };
  return p ? map[p] ?? null : null;
}

export function hasPreExistingFlag(answers: Record<string, string>): boolean {
  const s = answers.sante;
  return s === "sante-diag" || s === "sante-sympt" || s === "sante-nsp";
}

export function isSeniorAge(answers: Record<string, string>): boolean {
  const a = answers.age;
  return a === "age-8-12" || a === "age-12p" || a === "age-7";
}

export function getProfileCriteria(profileId: string): string[] {
  return (
    PROFILE_CRITERIA[profileId] ?? PROFILE_CRITERIA.equilibre
  );
}

export function buildAnswerRecap(
  quiz: Quiz,
  answers: Record<string, string>
): { question: string; answer: string }[] {
  return quiz.questions
    .map((q) => {
      const optId = answers[q.id];
      const opt = q.options.find((o) => o.id === optId);
      if (!opt) return null;
      return { question: q.question, answer: opt.label };
    })
    .filter((x): x is { question: string; answer: string } => Boolean(x));
}

export function complianceLabel(): string {
  return COMPLIANCE_MODE
    ? "Ce critère correspond à l’une des priorités que vous avez indiquées."
    : "Critère mis en avant selon vos réponses.";
}

/**
 * Sélection de profil assurance :
 * 1) antécédents / symptômes prioritaires
 * 2) âge d’admission (8 ans et +)
 * 3) sinon scoring tags classique (hors profils spéciaux)
 */
export function pickInsuranceResultProfile(
  quiz: Quiz,
  answers: Record<string, string>
): { profile: QuizResultProfile; matchScore: number } {
  if (hasPreExistingFlag(answers)) {
    const profile =
      quiz.results.find((r) => r.id === "antecedents") ?? quiz.results[0];
    return { profile, matchScore: 99 };
  }
  if (answers.age === "age-8-12" || answers.age === "age-12p") {
    const profile =
      quiz.results.find((r) => r.id === "age-admission") ?? quiz.results[0];
    return { profile, matchScore: 98 };
  }

  const scores = aggregateScores(quiz, answers);
  const filtered: Quiz = {
    ...quiz,
    results: quiz.results.filter(
      (r) => r.id !== "antecedents" && r.id !== "age-admission"
    ),
  };
  if (!filtered.results.length) {
    return pickResultProfile(quiz, scores);
  }
  return pickResultProfile(filtered, scores);
}

export const INSURANCE_PITFALLS = [
  {
    title: "Confondre taux et plafond",
    text: "Un remboursement à 100 % reste limité lorsque le plafond annuel est faible.",
  },
  {
    title: "Attendre l’apparition des symptômes",
    text: "Un problème apparu avant la souscription est généralement exclu, même si le diagnostic arrive plus tard.",
  },
  {
    title: "Oublier la franchise",
    text: "Vérifiez si elle s’applique par acte, par visite, par sinistre ou par année.",
  },
  {
    title: "Regarder uniquement le prix mensuel",
    text: "Deux cotisations proches peuvent cacher des plafonds, exclusions et délais très différents.",
  },
  {
    title: "Ne pas relire les conditions",
    text: "Les pages commerciales résument les contrats mais ne remplacent pas les documents contractuels.",
  },
] as const;

export const INSURANCE_FAQ = [
  {
    question: "Une assurance santé est-elle obligatoire pour un Beagle ?",
    answer:
      "Non. Elle reste un choix personnel selon votre budget, votre capacité à absorber une facture imprévue et le niveau de sérénité recherché. Le quiz aide à clarifier vos priorités, pas à imposer une souscription.",
  },
  {
    question: "Une maladie déjà connue peut-elle être remboursée ?",
    answer:
      "En règle générale, non : les maladies, blessures ou symptômes antérieurs à la souscription sont exclus. Une assurance peut toutefois couvrir de futurs problèmes sans rapport, sous réserve d’acceptation et des conditions du contrat.",
  },
  {
    question: "À quel âge faut-il assurer un Beagle ?",
    answer:
      "Plus la souscription est précoce, plus le choix d’offres est large. Au-delà d’un certain âge, le nombre de formules accessibles diminue. Vérifiez l’âge maximal de souscription et le maintien des garanties dans le temps.",
  },
  {
    question: "Quels critères comparer avant de demander un devis ?",
    answer:
      "Plafond annuel, taux de remboursement, franchise, délais de carence, prévention, exclusions (dont antécédents) et services comme l’avance des frais ou le téléconseil. Relisez toujours les documents contractuels.",
  },
  {
    question: "Pourquoi les tarifs ne sont-ils pas affichés dans le comparatif ?",
    answer:
      "Le tarif dépend notamment de l’âge, de la formule, parfois du lieu de résidence et des informations demandées par l’assureur. Seuls plusieurs devis actualisés permettent d’approcher le coût réel — ce site ne prétend pas connaître le tarif final.",
  },
] as const;
