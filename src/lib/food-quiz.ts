/**
 * Logique du quiz croquettes Ultra Premium Direct.
 * Priorité stricte (pas un simple max de points) :
 * medical_review > puppy_sensitive > puppy_standard > senior
 * > adult_weight_control > adult_sensitive > adult_standard
 */

import type { Quiz } from "@/types";
import {
  type FoodProduct,
  type FoodProfileId,
  FOOD_PRODUCTS,
  FORBIDDEN_FOOD_PHRASES,
  getFoodProductById,
  resolveAffiliateUrl,
} from "@/data/foodProducts";

export type FoodAnswers = Record<string, string | string[]>;

export interface FoodProfileResult {
  id: FoodProfileId;
  title: string;
  description: string;
  /** Raisons / critères influencants (max 3 affichés) */
  criteria: string[];
  /** Alerte prudente (maigreur, appétit récent, etc.) */
  alerts: string[];
  /** Checklist pour le véto (profil médical) */
  vetChecklist?: string[];
  /** Conseils contextuels */
  tips: string[];
  /** Encadré spécifique */
  callout?: { title: string; body: string };
  showCommercial: boolean;
  primaryProductId: string | null;
  alternativeProductId: string | null;
}

function single(answers: FoodAnswers, id: string): string | undefined {
  const v = answers[id];
  if (Array.isArray(v)) return v[0];
  return v;
}

export function isPuppy(answers: FoodAnswers): boolean {
  const age = single(answers, "age");
  return age === "age-lt4m" || age === "age-4-11m";
}

export function isSenior(answers: FoodAnswers): boolean {
  const age = single(answers, "age");
  return age === "age-7-9" || age === "age-10p";
}

export function isAdult(answers: FoodAnswers): boolean {
  return !isPuppy(answers) && !isSenior(answers);
}

/**
 * Score digestion via la question fusionnée appétit_digestion :
 * 0 normal / gourmand OK · 1 fragile · 2 sensible régulière
 */
export function digestionLevel(answers: FoodAnswers): number {
  const ad = single(answers, "appetit_digestion");
  if (ad === "ad-fragile") return 1;
  if (ad === "ad-sensitive") return 2;
  return 0;
}

export function silhouetteWeightScore(answers: FoodAnswers): number {
  const s = single(answers, "silhouette");
  if (s === "sil-hard") return 4;
  if (s === "sil-round") return 2;
  return 0;
}

export function isSterilized(answers: FoodAnswers): boolean {
  return single(answers, "sterilisation") === "ster-yes";
}

export function isLowActivity(answers: FoodAnswers): boolean {
  return single(answers, "activite") === "act-low";
}

/** Gourmand mais digestion OK (nouvelle option fusionnée). */
export function hasStrongAppetite(answers: FoodAnswers): boolean {
  return single(answers, "appetit_digestion") === "ad-greedy";
}

export function hasSkinCaution(answers: FoodAnswers): boolean {
  const sante = single(answers, "sante");
  if (sante === "health-itch") return true;
  const ad = single(answers, "appetit_digestion");
  return ad === "ad-sensitive";
}

export function isLean(answers: FoodAnswers): boolean {
  return single(answers, "silhouette") === "sil-lean";
}

/**
 * Avis vétérinaire : pathologie sous suivi (option unique santé).
 * Les démangeaisons seules ne bloquent pas.
 */
export function needsMedicalReview(answers: FoodAnswers): boolean {
  return single(answers, "sante") === "health-medical";
}

/**
 * Profil weight_control (adulte uniquement) :
 * - silhouette arrondie ou côtes dures → oui
 * - stérilisation seule → non
 * - stérilisation + (faible activité | gourmandise | silhouette) → oui
 * - gourmand + faible activité → oui
 */
export function needsWeightControl(answers: FoodAnswers): boolean {
  if (!isAdult(answers)) return false;
  const sil = silhouetteWeightScore(answers);
  if (sil >= 2) return true;

  if (isSterilized(answers)) {
    if (isLowActivity(answers) || hasStrongAppetite(answers) || sil > 0) {
      return true;
    }
  }

  if (hasStrongAppetite(answers) && isLowActivity(answers)) return true;

  return false;
}

/** Digestion fragile / sensible ou peau sans diagnostic. */
export function needsSensitive(answers: FoodAnswers): boolean {
  if (digestionLevel(answers) >= 1) return true;
  return single(answers, "sante") === "health-itch";
}

export function pickFoodProfileId(answers: FoodAnswers): FoodProfileId {
  if (needsMedicalReview(answers)) return "medical_review";

  if (isPuppy(answers)) {
    if (needsSensitive(answers)) return "puppy_sensitive";
    return "puppy_standard";
  }

  if (isSenior(answers)) return "senior";

  if (needsWeightControl(answers)) return "adult_weight_control";
  if (needsSensitive(answers)) return "adult_sensitive";
  return "adult_standard";
}

function buildCriteria(answers: FoodAnswers, profileId: FoodProfileId): string[] {
  const items: string[] = [];
  const age = single(answers, "age");
  const ageLabels: Record<string, string> = {
    "age-lt4m": "Âge : moins de 4 mois (croissance)",
    "age-4-11m": "Âge : 4 à 11 mois (croissance)",
    "age-1-6": "Âge : adulte 1–6 ans",
    "age-7-9": "Âge : 7 à 9 ans (senior)",
    "age-10p": "Âge : 10 ans ou plus (senior)",
  };
  if (age && ageLabels[age]) items.push(ageLabels[age]);

  const sil = single(answers, "silhouette");
  const silLabels: Record<string, string> = {
    "sil-lean": "Silhouette : côtes très visibles",
    "sil-ok": "Silhouette : taille visible, côtes faciles à sentir",
    "sil-round": "Silhouette : taille moins marquée",
    "sil-hard": "Silhouette : côtes difficiles à sentir",
    "sil-nsp": "Silhouette non évaluée",
  };
  if (sil && silLabels[sil] && profileId !== "medical_review") {
    items.push(silLabels[sil]);
  }

  if (isSterilized(answers) && profileId === "adult_weight_control") {
    items.push("Stérilisation + autres indicateurs de poids");
  }

  const dig = digestionLevel(answers);
  if (dig === 1) items.push("Digestion : sensibilité occasionnelle");
  if (dig === 2) items.push("Digestion : sensibilité régulière");
  if (dig >= 3) items.push("Digestion : troubles nécessitant un avis professionnel");

  const act = single(answers, "activite");
  if (act === "act-low" && profileId === "adult_weight_control") {
    items.push("Activité plutôt faible");
  }
  if (act === "act-high" && profileId === "adult_standard") {
    items.push("Activité élevée");
  }

  if (hasStrongAppetite(answers) && profileId === "adult_weight_control") {
    items.push("Appétit marqué (réclame / mange vite)");
  }

  if (single(answers, "sante") === "health-medical") {
    items.push("Pathologie sous suivi vétérinaire");
  } else if (hasSkinCaution(answers) && profileId === "adult_sensitive") {
    items.push("Peau ou digestion à surveiller (sans diagnostic)");
  }

  return items.slice(0, 3);
}

function buildAlerts(answers: FoodAnswers, profileId: FoodProfileId): string[] {
  const alerts: string[] = [];

  if (isLean(answers)) {
    alerts.push(
      "Si la perte de poids est récente ou inexpliquée, parlez-en au vétérinaire avant d’augmenter la ration. Le quiz ne recommande pas automatiquement une ration plus élevée."
    );
  }

  if (single(answers, "silhouette") === "sil-hard") {
    alerts.push(
      "Des côtes difficiles à sentir justifient un contrôle de la silhouette et du poids avec votre vétérinaire."
    );
  }

  if (digestionLevel(answers) >= 1 && profileId !== "medical_review") {
    alerts.push(
      "En cas de sensibilité digestive, commencez toute transition progressivement et interrompez-la si les symptômes s’aggravent."
    );
  }

  if (
    (single(answers, "sante") === "health-itch" ||
      single(answers, "appetit_digestion") === "ad-sensitive") &&
    profileId !== "medical_review"
  ) {
    alerts.push(
      "Démangeaisons ou peaux sensibles sans diagnostic ne signifient pas automatiquement une allergie alimentaire. Un vétérinaire peut aider à en chercher la cause si ça persiste."
    );
  }

  return alerts;
}

const PROFILE_COPY: Record<
  FoodProfileId,
  Omit<
    FoodProfileResult,
    | "id"
    | "criteria"
    | "alerts"
    | "showCommercial"
    | "primaryProductId"
    | "alternativeProductId"
  > & { primary: string | null; alternative: string | null }
> = {
  medical_review: {
    title: "Avis vétérinaire recommandé",
    description:
      "Vous avez indiqué une pathologie suivie par un vétérinaire. Dans ce cas, l’alimentation fait partie du traitement. Ne changez rien sans l’accord de votre vétérinaire — il peut recommander une alimentation thérapeutique spécifique.",
    tips: [
      "Un changement d’alimentation peut interagir avec un traitement en cours",
      "Votre vétérinaire est le mieux placé pour adapter la ration à la pathologie",
    ],
    vetChecklist: [
      "Son poids et sa silhouette sont-ils adaptés ?",
      "Une maladie ou une allergie doit-elle être recherchée ?",
      "Une alimentation thérapeutique est-elle nécessaire ?",
      "Quelle densité énergétique convient à son activité ?",
      "Comment organiser une éventuelle transition ?",
    ],
    callout: {
      title: "Alimentation standard non proposée",
      body: "Conservez l’alimentation prescrite et demandez l’avis de votre vétérinaire avant toute transition.",
    },
    primary: null,
    alternative: null,
  },
  puppy_standard: {
    title: "Chiot Beagle en croissance",
    description:
      "Votre Beagle a besoin d’une recette riche en protéines et nutriments adaptés à sa croissance, avec des portions fractionnées (3 repas/jour jusqu’à 6 mois, puis 2).",
    tips: [
      "Ultra Premium Direct propose une formule chiot adaptée aux races moyennes, avec un bon rapport protéines/calcium pour une croissance régulière",
      "Fractionnez la ration en 3 repas jusqu’à 6 mois pour éviter les gloutonneries et favoriser la digestion",
    ],
    primary: "upd-puppy-chicken-grain-free",
    alternative: null,
  },
  puppy_sensitive: {
    title: "Chiot Beagle à digestion sensible",
    description:
      "Votre chiot a un système digestif délicat. Une formule sans céréales ou à base de riz peut mieux convenir. Transition alimentaire sur 7 à 10 jours.",
    tips: [
      "Ultra Premium Direct propose des recettes sans céréales adaptées aux sensibilités digestives, même pour les jeunes chiens",
      "Une transition progressive (7-10 jours) est essentielle pour ne pas aggraver les fragilités",
      "Si les symptômes persistent malgré le changement, consultez votre vétérinaire",
    ],
    callout: {
      title: "Prudence",
      body: "Une recette « digestion sensible » ne remplace pas un diagnostic ni une alimentation thérapeutique lorsqu’elle est nécessaire.",
    },
    primary: "upd-puppy-sensitive-grain-free",
    alternative: "upd-puppy-chicken-grain-free",
  },
  adult_standard: {
    title: "Beagle adulte au poids stable",
    description:
      "Votre Beagle a un bon équilibre poids/activité. Une croquette adulte classique, avec des portions ajustées à son activité, suffit à le maintenir en forme.",
    tips: [
      "Ultra Premium Direct propose des formules adultes équilibrées, avec un bon taux de protéines animales pour un Beagle actif",
      "Pesez la ration et comptez les friandises dans le total du jour pour prévenir la prise de poids",
    ],
    callout: {
      title: "À confirmer selon sa tolérance",
      body: "Vérifiez la composition complète, les quantités recommandées et la tolérance individuelle de votre chien.",
    },
    primary: "upd-adult-chicken-grain-free",
    alternative: null,
  },
  adult_sensitive: {
    title: "Beagle à digestion sensible ou peau réactive",
    description:
      "Sensibilité digestive ou démangeaisons sans diagnostic : une formule sans céréales ou hypoallergénique peut améliorer le confort. Testez sur 3 à 4 semaines et observez.",
    tips: [
      "Ultra Premium Direct a des recettes sans céréales, adaptées aux sensibilités alimentaires légères à modérées",
      "Un test de 3-4 semaines permet de voir si les symptômes régressent avant d’envisager un régime plus strict",
      "Si les démangeaisons ou selles molles persistent, consultez un vétérinaire pour écarter une allergie",
    ],
    callout: {
      title: "Transition et surveillance",
      body: "Commencez toute transition progressivement et interrompez-la en cas d’aggravation.",
    },
    primary: "upd-adult-sensitive-grain-free",
    alternative: "upd-adult-chicken-grain-free",
  },
  adult_weight_control: {
    title: "Beagle adulte — poids à surveiller",
    description:
      "Plusieurs signaux (appétit marqué, silhouette qui s’arrondit, stérilisation) suggèrent de choisir une recette au contrôle calorique. Le Beagle est gourmand par nature, ce n’est pas un problème de volonté.",
    tips: [
      "Ultra Premium Direct propose des formules light ou à teneur calorique maîtrisée, idéales pour un Beagle stérilisé ou gourmand",
      "Associez croquettes adaptées + occupation mentale (Kong, tapis de fouille) pour détourner l’attention de la gamelle",
    ],
    callout: {
      title: "Avant de réduire sa ration",
      body: "Ne réduisez pas fortement sa nourriture sans vérifier sa silhouette, son poids et les quantités adaptées. Une prise de poids importante, rapide ou associée à d’autres symptômes mérite un avis vétérinaire.",
    },
    primary: "upd-light-grain-free",
    alternative: "upd-adult-chicken-grain-free",
  },
  senior: {
    title: "Beagle senior",
    description:
      "Avec l’âge, les besoins énergétiques baissent et le confort articulaire devient prioritaire. Une recette senior ou light, associée à un poids stable, protège le dos et les articulations.",
    tips: [
      "Ultra Premium Direct propose des formules adaptées aux seniors, avec un apport calorique modéré et des nutriments pour les articulations",
      "Un bilan vétérinaire annuel (ou semestriel après 10 ans) permet d’ajuster la ration et de détecter les signes précoces",
    ],
    callout: {
      title: "Signes d’alerte chez le senior",
      body: "Un chien âgé qui maigrit, boit davantage, perd l’appétit ou change brutalement de comportement doit être examiné avant un changement d’alimentation.",
    },
    primary: "upd-senior-care",
    alternative: null,
  },
};

/**
 * Produit à afficher pour le résultat.
 * - missing : id inconnu
 * - inactive : reco masquée volontairement (active: false)
 * - out_of_stock : reco visible + bandeau indisponible
 * - ok : reco visible (CTA seulement si URL d’affiliation présente)
 */
export function resolveDisplayProduct(
  productId: string | null
): {
  product: FoodProduct | null;
  reason: "ok" | "inactive" | "out_of_stock" | "missing";
} {
  if (!productId) return { product: null, reason: "missing" };
  const product = getFoodProductById(productId);
  if (!product) return { product: null, reason: "missing" };
  if (!product.active) return { product: null, reason: "inactive" };
  if (!product.inStock) return { product, reason: "out_of_stock" };
  return { product, reason: "ok" };
}

export function buildFoodResult(answers: FoodAnswers): FoodProfileResult {
  const id = pickFoodProfileId(answers);
  const copy = PROFILE_COPY[id];
  const showCommercial = id !== "medical_review";

  const primaryProductId = copy.primary;
  const alternativeProductId = copy.alternative;

  // Si primaire inactive, on n’affiche pas d’autre produit pour « écouler le stock »
  // mais on peut proposer une alternative active réellement mappée.
  if (showCommercial && primaryProductId) {
    const primary = resolveDisplayProduct(primaryProductId);
    if (primary.reason === "inactive" || primary.reason === "missing") {
      // garder l’id pour message « non configuré » en dev ; UI masque le CTA
    }
    if (
      primary.reason === "out_of_stock" &&
      alternativeProductId
    ) {
      const alt = resolveDisplayProduct(alternativeProductId);
      if (alt.reason === "ok") {
        // profil inchangé ; UI propose l’alternative active
      }
    }
  }

  // Appétit marqué + medical? déjà géré. Changement d'appétit fort avec dig grave?
  // Si appétit change + medical health flags already medical.

  // reasons du prompt = tips ; critères = facteurs de scoring lisibles
  return {
    id,
    title: copy.title,
    description: copy.description,
    criteria: buildCriteria(answers, id),
    alerts: buildAlerts(answers, id),
    tips: copy.tips,
    vetChecklist: copy.vetChecklist,
    callout: copy.callout,
    showCommercial,
    primaryProductId,
    alternativeProductId,
  };
}

export function buildAnswerRecap(
  quiz: Quiz,
  answers: FoodAnswers
): { question: string; answer: string }[] {
  return quiz.questions
    .map((q) => {
      const raw = answers[q.id];
      if (!raw) return null;
      const ids = Array.isArray(raw) ? raw : [raw];
      const labels = ids
        .map((id) => q.options.find((o) => o.id === id)?.label)
        .filter(Boolean) as string[];
      if (!labels.length) return null;
      return { question: q.question, answer: labels.join(" · ") };
    })
    .filter((x): x is { question: string; answer: string } => Boolean(x));
}

export function isFoodQuizSlug(slug: string): boolean {
  return slug === "alimentation-croquettes";
}

export function collectFoodQuizText(): string {
  const parts: string[] = [];
  for (const p of FOOD_PRODUCTS) {
    parts.push(p.name, ...p.features, ...p.cautions, p.ctaLabel);
  }
  for (const copy of Object.values(PROFILE_COPY)) {
    parts.push(copy.title, copy.description, ...copy.tips);
    if (copy.callout) parts.push(copy.callout.title, copy.callout.body);
  }
  return parts.join("\n").toLowerCase();
}

export function assertNoForbiddenPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN_FOOD_PHRASES.filter((p) => lower.includes(p.toLowerCase()));
}

export function seniorNeverGrainFreeBadge(product: FoodProduct): boolean {
  if (product.id !== "upd-senior-care") return true;
  return product.grainStatus !== "grain_free";
}

export { resolveAffiliateUrl, FOOD_PRODUCTS };
