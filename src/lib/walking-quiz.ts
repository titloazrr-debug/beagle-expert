/**
 * Logique du quiz promenade / harnais Beagle.
 * Priorité des profils :
 * escape_artist >
 * senior_comfort (si contraintes physiques) >
 * hiking >
 * secured_explorer >
 * scent_explorer >
 * daily_walk
 *
 * Le type d’équipement est déterminé avant toute marque.
 */

import type { Quiz } from "@/types";
import {
  type WalkingProduct,
  type WalkingProductCategory,
  type WalkingProfileId,
  getWalkingProductsForProfile,
  resolveWalkingAffiliateUrl,
} from "@/data/walkingProducts";

export type WalkingAnswers = Record<string, string | string[]>;
export type GpsRelevance = "low" | "medium" | "high";
export type IdentificationStatus = "has_tag" | "missing_tag";
export type LeadKind = "leash" | "long_line";

export interface WalkingSetup {
  harnessType: string;
  harnessDetail: string;
  leadKind: LeadKind;
  leadLabel: string;
  leadLengthHint: string;
  identificationLabel: string;
  gpsLabel: string;
}

export interface WalkingInfluencer {
  questionId: string;
  label: string;
}

export interface WalkingResult {
  profileId: WalkingProfileId;
  title: string;
  badge?: string;
  description: string;
  priority: string;
  setup: WalkingSetup;
  influencers: WalkingInfluencer[];
  tips: string[];
  callouts: { title: string; body: string; tone?: "info" | "warn" }[];
  gpsRelevance: GpsRelevance;
  identificationStatus: IdentificationStatus;
  hasGpsAlready: boolean;
  hasTagAlready: boolean;
  longLineRecommended: boolean;
  products: WalkingProduct[];
  showGpsCrosslink: boolean;
  showGpsCommercial: boolean;
  secondaryGpsCta: boolean;
  checklist: string[];
}

function single(answers: WalkingAnswers, id: string): string | undefined {
  const v = answers[id];
  if (Array.isArray(v)) return v[0];
  return v;
}

function multi(answers: WalkingAnswers, id: string): string[] {
  const v = answers[id];
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return [v];
}

export function isWalkingQuizSlug(slug: string): boolean {
  return slug === "harnais-beagle";
}

export function isPuppy(answers: WalkingAnswers): boolean {
  return single(answers, "age") === "age-puppy";
}

export function isSenior(answers: WalkingAnswers): boolean {
  const age = single(answers, "age");
  return age === "age-senior" || age === "age-senior-adv";
}

export function isSeniorAdvanced(answers: WalkingAnswers): boolean {
  return single(answers, "age") === "age-senior-adv";
}

export function isHighEscapeRisk(answers: WalkingAnswers): boolean {
  const e = single(answers, "escape");
  return e === "escape-high" || e === "escape-history";
}

export function isMediumEscapeRisk(answers: WalkingAnswers): boolean {
  return single(answers, "escape") === "escape-medium";
}

export function isLostSignificant(answers: WalkingAnswers): boolean {
  const l = single(answers, "lost");
  return l === "lost-significant" || l === "lost-repeated";
}

export function isLostRepeated(answers: WalkingAnswers): boolean {
  return single(answers, "lost") === "lost-repeated";
}

export function isRecallLow(answers: WalkingAnswers): boolean {
  const r = single(answers, "recall");
  return r === "recall-low" || r === "recall-variable";
}

export function isRecallScentSensitive(answers: WalkingAnswers): boolean {
  return single(answers, "recall") === "recall-scent";
}

export function isScentPuller(answers: WalkingAnswers): boolean {
  const p = single(answers, "pull");
  return p === "pull-scent" || p === "pull-frequent" || p === "pull-strong";
}

export function wantsExtendedFreedom(answers: WalkingAnswers): boolean {
  const f = single(answers, "freedom");
  return (
    f === "free-extended" ||
    f === "free-max" ||
    f === "free-offleash"
  );
}

export function wantsMaxFreedom(answers: WalkingAnswers): boolean {
  return single(answers, "freedom") === "free-max";
}

export function isHikingEnv(answers: WalkingAnswers): boolean {
  return single(answers, "environment") === "env-hiking";
}

export function isOpenEnv(answers: WalkingAnswers): boolean {
  const e = single(answers, "environment");
  return (
    e === "env-country" ||
    e === "env-forest" ||
    e === "env-hiking" ||
    e === "env-mixed"
  );
}

export function isCityEnv(answers: WalkingAnswers): boolean {
  return single(answers, "environment") === "env-city";
}

export function ownedEquipment(answers: WalkingAnswers): Set<string> {
  const ids = multi(answers, "equipment");
  if (ids.includes("eq-none")) return new Set();
  return new Set(ids);
}

export function hasTag(answers: WalkingAnswers): boolean {
  return ownedEquipment(answers).has("eq-tag");
}

export function hasGps(answers: WalkingAnswers): boolean {
  return ownedEquipment(answers).has("eq-gps");
}

export function hasHarness(answers: WalkingAnswers): boolean {
  return ownedEquipment(answers).has("eq-harness");
}

export function hasLongLine(answers: WalkingAnswers): boolean {
  return ownedEquipment(answers).has("eq-longline");
}

/**
 * GPS relevance scoring (transparent, testable).
 * high ≥ 4 points, medium ≥ 2, else low.
 */
export function computeGpsRelevance(answers: WalkingAnswers): GpsRelevance {
  let score = 0;

  const recall = single(answers, "recall");
  if (recall === "recall-low") score += 2;
  else if (recall === "recall-variable") score += 1;
  else if (recall === "recall-scent") score += 1;

  const lost = single(answers, "lost");
  if (lost === "lost-repeated") score += 3;
  else if (lost === "lost-significant") score += 2;
  else if (lost === "lost-short") score += 1;

  if (isHighEscapeRisk(answers)) score += 1;

  const env = single(answers, "environment");
  if (env === "env-hiking" || env === "env-forest") score += 1;
  else if (env === "env-country") score += 1;

  if (wantsMaxFreedom(answers) || single(answers, "freedom") === "free-offleash") {
    score += 1;
  }
  if (isScentPuller(answers) && isOpenEnv(answers)) score += 1;

  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

export function gpsLabel(relevance: GpsRelevance, alreadyHas: boolean): string {
  if (alreadyHas) {
    return "GPS : vous disposez déjà de cette couche de sécurité";
  }
  if (relevance === "high") return "GPS : fortement pertinent";
  if (relevance === "medium") return "GPS : pertinent dans votre situation";
  return "GPS : option de sécurité supplémentaire";
}

/**
 * Longueur indicative de laisse / longe (repères, pas normes absolues).
 */
export function computeLead(
  answers: WalkingAnswers,
  profileId: WalkingProfileId
): {
  kind: LeadKind;
  label: string;
  lengthHint: string;
  longLineRecommended: boolean;
  categoryHint: WalkingProductCategory | null;
} {
  const freedom = single(answers, "freedom");
  const env = single(answers, "environment");
  const city = env === "env-city";

  // Base from freedom preference
  let metersMin = 1.5;
  let metersMax = 3;
  let wantLongLine = false;

  if (freedom === "free-close") {
    metersMin = 1.5;
    metersMax = 3;
    wantLongLine = false;
  } else if (freedom === "free-moderate") {
    metersMin = 3;
    metersMax = 5;
    wantLongLine = !city;
  } else if (freedom === "free-extended") {
    metersMin = 5;
    metersMax = 10;
    wantLongLine = true;
  } else if (freedom === "free-max") {
    metersMin = 10;
    metersMax = 20;
    wantLongLine = true;
  } else if (freedom === "free-offleash") {
    metersMin = 5;
    metersMax = 15;
    wantLongLine = true;
  }

  // Environment adjustments
  if (city) {
    metersMax = Math.min(metersMax, 3);
    metersMin = Math.min(metersMin, 2);
    if (freedom !== "free-max" && freedom !== "free-extended") {
      wantLongLine = false;
    }
  } else if (env === "env-park") {
    if (wantLongLine) {
      metersMin = Math.max(metersMin, 3);
      metersMax = Math.min(Math.max(metersMax, 5), 10);
    }
  } else if (env === "env-country" || env === "env-forest") {
    if (isRecallLow(answers) || wantsExtendedFreedom(answers)) {
      wantLongLine = true;
      metersMin = Math.max(metersMin, 5);
      metersMax = Math.max(metersMax, 10);
    }
  } else if (env === "env-hiking") {
    wantLongLine =
      wantLongLine ||
      isRecallLow(answers) ||
      isRecallScentSensitive(answers) ||
      wantsExtendedFreedom(answers);
    if (wantLongLine) {
      metersMin = Math.max(metersMin, 5);
      metersMax = Math.max(metersMax, 10);
    }
  }

  // Lost history pushes toward long line when freedom isn't "close only"
  if (isLostSignificant(answers) && freedom !== "free-close") {
    wantLongLine = true;
    metersMin = Math.max(metersMin, 5);
    metersMax = Math.max(metersMax, 10);
  }

  // Profile overrides
  if (profileId === "daily_walk" && !wantLongLine) {
    return {
      kind: "leash",
      label: "Laisse classique ou réglable, environ 2 à 3 mètres",
      lengthHint: "environ 2 à 3 m",
      longLineRecommended: false,
      categoryHint: null,
    };
  }

  if (profileId === "senior_comfort" && !wantLongLine) {
    return {
      kind: "leash",
      label: "Longueur permettant de flairer sans imposer de fortes tensions",
      lengthHint: "environ 2 à 3 m (ou longe courte si terrain adapté)",
      longLineRecommended: false,
      categoryHint: null,
    };
  }

  if (profileId === "escape_artist" && !wantLongLine) {
    // Still allow short leash in city, but mention adapted line if freedom wants it
    if (city || freedom === "free-close") {
      return {
        kind: "leash",
        label: "Laisse robuste, bien tenue — longe seulement si terrain adapté",
        lengthHint: "environ 1,5 à 3 m en zone à risque",
        longLineRecommended: false,
        categoryHint: null,
      };
    }
  }

  if (!wantLongLine) {
    return {
      kind: "leash",
      label: `Laisse classique ou réglable, environ ${formatRange(metersMin, metersMax)}`,
      lengthHint: formatRange(metersMin, metersMax),
      longLineRecommended: false,
      categoryHint: null,
    };
  }

  // Long line category
  let categoryHint: WalkingProductCategory = "long_line_10";
  let label: string;
  if (metersMax <= 5) {
    categoryHint = "long_line_5";
    label = "Longe d’environ 5 mètres selon l’environnement";
  } else if (metersMax <= 10 || (metersMin <= 10 && metersMax < 15)) {
    categoryHint = "long_line_10";
    if (profileId === "scent_explorer") {
      label = "Longe d’environ 5 à 10 mètres selon l’environnement";
    } else if (profileId === "secured_explorer") {
      label =
        "Environ 10 à 15 mètres, éventuellement davantage dans un environnement réellement adapté";
      if (metersMax >= 15) categoryHint = "long_line_15_plus";
    } else {
      label = `Longe d’environ ${formatRange(metersMin, Math.min(metersMax, 10))}`;
    }
  } else {
    categoryHint = "long_line_15_plus";
    label =
      "Longe d’environ 10 à 20 m selon l’environnement et votre maîtrise";
  }

  if (profileId === "hiking") {
    label =
      "À adapter au terrain : laisse réglable ou longe lorsque l’espace le permet";
  }
  if (profileId === "escape_artist") {
    label = "Longe adaptée à l’environnement et à votre maîtrise";
  }

  return {
    kind: "long_line",
    label,
    lengthHint: formatRange(metersMin, metersMax),
    longLineRecommended: true,
    categoryHint,
  };
}

function formatRange(min: number, max: number): string {
  if (Math.abs(min - max) < 0.1) return `${min} m`;
  return `${min} à ${max} m`;
}

/**
 * Profil principal — ordre strict de priorité.
 */
export function pickWalkingProfileId(
  answers: WalkingAnswers
): WalkingProfileId {
  // 1. Anti-évasion prioritaire
  if (isHighEscapeRisk(answers)) {
    return "escape_artist";
  }

  // Medium escape + significant loss also leans escape
  if (
    isMediumEscapeRisk(answers) &&
    (isLostSignificant(answers) || isRecallLow(answers))
  ) {
    return "escape_artist";
  }

  // 2. Senior comfort when age is senior and walk is calm / not hiking-focused
  if (isSenior(answers)) {
    const calmPull =
      single(answers, "pull") === "pull-low" ||
      single(answers, "pull") === "pull-variable";
    const quietFreedom =
      single(answers, "freedom") === "free-close" ||
      single(answers, "freedom") === "free-moderate";
    if (
      isSeniorAdvanced(answers) ||
      (calmPull && quietFreedom && !isHikingEnv(answers))
    ) {
      return "senior_comfort";
    }
  }

  // 3. Hiking / grands espaces
  if (isHikingEnv(answers) && !isHighEscapeRisk(answers)) {
    return "hiking";
  }

  // 4. Secured explorer — wants freedom + imperfect recall / open env
  const secured =
    (wantsMaxFreedom(answers) ||
      (wantsExtendedFreedom(answers) && isOpenEnv(answers))) &&
    (isRecallLow(answers) ||
      isRecallScentSensitive(answers) ||
      isLostSignificant(answers) ||
      single(answers, "recall") === "recall-never");

  if (secured) {
    return "secured_explorer";
  }

  // 5. Scent explorer
  if (
    isScentPuller(answers) ||
    isRecallScentSensitive(answers) ||
    (single(answers, "pull") === "pull-scent" &&
      (isOpenEnv(answers) || wantsExtendedFreedom(answers)))
  ) {
    // Quiet city walkers with mild scent pull stay daily if close freedom
    if (
      isCityEnv(answers) &&
      single(answers, "freedom") === "free-close" &&
      single(answers, "pull") === "pull-scent" &&
      !isRecallLow(answers)
    ) {
      // fall through toward daily or scent — mild scent still explorer if not pure city-close
    } else if (
      !(
        isCityEnv(answers) &&
        single(answers, "freedom") === "free-close" &&
        single(answers, "recall") === "recall-good" &&
        single(answers, "pull") === "pull-low"
      )
    ) {
      // Prefer scent_explorer over daily when scent is a factor
      if (
        isScentPuller(answers) ||
        isRecallScentSensitive(answers) ||
        wantsExtendedFreedom(answers)
      ) {
        return "scent_explorer";
      }
    }
  }

  // Explicit scent path for park + scent pull + medium recall
  if (
    (single(answers, "pull") === "pull-scent" ||
      isRecallScentSensitive(answers)) &&
    (single(answers, "environment") === "env-park" ||
      isOpenEnv(answers) ||
      wantsExtendedFreedom(answers))
  ) {
    return "scent_explorer";
  }

  // 6. Default daily walk
  return "daily_walk";
}

const PROFILE_COPY: Record<
  WalkingProfileId,
  {
    title: string;
    badge?: string;
    description: string;
    priority: string;
    harnessType: string;
    harnessDetail: string;
    tips: string[];
    callouts: WalkingResult["callouts"];
  }
> = {
  daily_walk: {
    title: "Son profil : balade quotidienne",
    description:
      "Votre Beagle semble relativement facile à gérer lors des promenades. Un harnais confortable laissant les épaules libres et une laisse suffisamment longue pour lui permettre de flairer peuvent constituer une base simple.",
    priority: "Confort et simplicité pour les balades du quotidien.",
    harnessType: "Harnais en Y confortable et bien ajusté",
    harnessDetail:
      "Un modèle en Y laisse les épaules libres pour marcher et flairer.",
    tips: [
      "Vérifiez l’ajustement : deux doigts sous les sangles, sans frottement aux aisselles.",
      "Laissez-le flairer quelques mètres quand c’est sûr — le flair fait partie de la promenade pour un Beagle.",
      "Un bon rappel se construit aussi en laisse, avec des renforts fréquents.",
    ],
    callouts: [],
  },
  scent_explorer: {
    title: "Son profil : explorateur au flair",
    description:
      "Votre Beagle aime explorer avec son nez. Une longe peut offrir beaucoup plus de liberté qu’une laisse classique tout en conservant un lien physique lorsque son attention est absorbée par une odeur.",
    priority:
      "Lui laisser explorer avec le nez tout en gardant un lien physique.",
    harnessType: "Harnais en Y confortable",
    harnessDetail:
      "Privilégiez le confort et la liberté d’épaules : le flair occupe une grande part de ses sorties.",
    tips: [
      "Une odeur passionnante peut parfois gagner la bataille de l’attention — la longe compense sans punir.",
      "Travaillez le rappel sur longe avant d’envisager plus de liberté.",
      "Fixez la longe sur le harnais, pas comme recommandation principale sur un collier.",
    ],
    callouts: [
      {
        title: "Longe et environnement",
        body: "Une longe permet de travailler le rappel et l’exploration, mais elle doit être utilisée dans un environnement adapté, loin des obstacles ou situations où elle pourrait s’accrocher dangereusement.",
        tone: "info",
      },
    ],
  },
  secured_explorer: {
    title: "Son profil : beaucoup de liberté, avec un filet de sécurité",
    description:
      "Vous souhaitez lui permettre d’explorer largement sans dépendre uniquement de son rappel. Le duo harnais + longe constitue ici la base. Un GPS ajoute une couche de sécurité supplémentaire si le chien parvient malgré tout à s’éloigner.",
    priority:
      "Lui permettre d’explorer sans dépendre uniquement de son rappel.",
    harnessType: "Harnais en Y robuste et confortable",
    harnessDetail:
      "Robustesse des attaches et confort pour les sorties plus longues.",
    tips: [
      "Multipliez les couches : identification, harnais, longe, GPS si pertinent.",
      "Une longe longue peut générer une tension importante en bout de course — apprenez à la manipuler progressivement.",
      "Son rappel semble sensible aux distractions : aucun environnement extérieur n’est sans risque.",
    ],
    callouts: [
      {
        title: "Longe + harnais",
        body: "Une longe longue peut générer une tension importante lorsque le chien arrive brutalement en bout de course. Utilisez-la avec un harnais adapté et apprenez à la manipuler progressivement.",
        tone: "warn",
      },
    ],
  },
  escape_artist: {
    title: "Son profil : sécurité anti-évasion prioritaire",
    badge: "Petit Houdini ?",
    description:
      "Certaines morphologies ou certains comportements permettent au chien de reculer hors d’un harnais classique. Dans votre situation, la priorité est donc moins le style du harnais que sa sécurité d’ajustement.",
    priority: "Sécuriser l’ajustement avant d’augmenter la liberté.",
    harnessType: "Harnais anti-évasion / trois points, correctement ajusté",
    harnessDetail:
      "Plusieurs points de réglage et un maintien qui limite le recul hors du harnais.",
    tips: [
      "Vérifiez régulièrement réglages, attaches, coutures et mousquetons.",
      "Enfilez le harnais calmement et testez le recul dans un endroit sûr avant une vraie sortie.",
      "Un collier peut porter la médaille ; la laisse ou la longe se fixe de préférence au harnais.",
    ],
    callouts: [
      {
        title: "Aucun harnais n’est infaillible",
        body: "Aucun harnais n’est totalement infaillible. Vérifiez régulièrement les réglages, attaches, coutures et mousquetons.",
        tone: "warn",
      },
    ],
  },
  hiking: {
    title: "Son profil : longues sorties et grands espaces",
    description:
      "Pour les longues sorties, le confort, la solidité des attaches et un matériel adapté au terrain passent avant le style.",
    priority: "Confort durable et matériel robuste pour les grands espaces.",
    harnessType: "Harnais rembourré confortable pour usage prolongé",
    harnessDetail:
      "Critères utiles : confort, liberté des épaules, solidité, séchage, visibilité, qualité des attaches.",
    tips: [
      "Contrôlez les points de friction après les premières longues sorties.",
      "Emportez une laisse courte en plus d’une longe pour les zones plus fréquentées.",
      "Un GPS est un filet de sécurité utile dans les grands espaces — il ne remplace pas le lien physique.",
    ],
    callouts: [
      {
        title: "Critères randonnée",
        body: "Confort, liberté des épaules, solidité, séchage, visibilité et qualité des attaches sont souvent plus importants qu’un design « sportif ».",
        tone: "info",
      },
    ],
  },
  senior_comfort: {
    title: "Son profil : confort et contrôle en douceur",
    description:
      "Pour un Beagle senior, le confort, la facilité d’enfilage et l’absence de pression inutile deviennent particulièrement importants.",
    priority: "Confort, enfilage facile et sorties sans tensions inutiles.",
    harnessType: "Harnais confortable, facile à enfiler et bien rembourré",
    harnessDetail:
      "Privilégiez l’enfilage simple et le rembourrage plutôt qu’un modèle ultra-technique.",
    tips: [
      "Une baisse récente de mobilité, une douleur à la manipulation ou une difficulté à marcher mérite un avis vétérinaire.",
      "Des sorties plus courtes mais régulières conviennent souvent mieux qu’une longue sortie fatigante.",
      "Laissez-le flairer : le flair reste un plaisir accessible même quand l’endurance diminue.",
    ],
    callouts: [
      {
        title: "Mobilité",
        body: "Une baisse récente de mobilité, une douleur à la manipulation ou une difficulté à marcher mérite un avis vétérinaire.",
        tone: "info",
      },
    ],
  },
};

function buildInfluencers(answers: WalkingAnswers): WalkingInfluencer[] {
  const items: { weight: number; questionId: string; label: string }[] = [];

  const escape = single(answers, "escape");
  if (escape === "escape-history") {
    items.push({
      weight: 10,
      questionId: "escape",
      label: "Il s’est déjà échappé de son harnais",
    });
  } else if (escape === "escape-high") {
    items.push({
      weight: 9,
      questionId: "escape",
      label: "Il a déjà presque réussi à sortir de son harnais",
    });
  } else if (escape === "escape-medium") {
    items.push({
      weight: 5,
      questionId: "escape",
      label: "Il recule parfois lorsqu’il a peur ou refuse d’avancer",
    });
  }

  const recall = single(answers, "recall");
  if (recall === "recall-low") {
    items.push({
      weight: 8,
      questionId: "recall",
      label: "Une fois sur une piste, il semble ne plus vous entendre",
    });
  } else if (recall === "recall-scent") {
    items.push({
      weight: 7,
      questionId: "recall",
      label: "Son rappel devient aléatoire lorsqu’il suit une odeur",
    });
  } else if (recall === "recall-variable") {
    items.push({
      weight: 6,
      questionId: "recall",
      label: "Le rappel est encore très aléatoire",
    });
  } else if (recall === "recall-good") {
    items.push({
      weight: 3,
      questionId: "recall",
      label:
        "Son rappel semble déjà bien installé d’après vos réponses, mais aucun environnement extérieur n’est sans risque",
    });
  } else if (recall === "recall-never") {
    items.push({
      weight: 6,
      questionId: "recall",
      label: "Vous ne le lâchez jamais, par prudence",
    });
  }

  const lost = single(answers, "lost");
  if (lost === "lost-repeated") {
    items.push({
      weight: 9,
      questionId: "lost",
      label: "Vous l’avez déjà perdu de vue plusieurs fois",
    });
  } else if (lost === "lost-significant") {
    items.push({
      weight: 8,
      questionId: "lost",
      label: "Une disparition vous a réellement inquiété",
    });
  }

  const env = single(answers, "environment");
  const envLabels: Record<string, string> = {
    "env-city": "Vous vous promenez principalement en ville",
    "env-park": "Vous vous promenez surtout en parc ou périurbain",
    "env-country": "Vous vous promenez principalement en campagne",
    "env-forest": "Vous vous promenez principalement en forêt",
    "env-hiking": "Vous pratiquez randonnée et grands espaces",
    "env-mixed": "Vous alternez plusieurs types d’environnements",
  };
  if (env && envLabels[env]) {
    items.push({ weight: 5, questionId: "environment", label: envLabels[env] });
  }

  const freedom = single(answers, "freedom");
  const freeLabels: Record<string, string> = {
    "free-close": "Vous préférez le garder assez près de vous",
    "free-moderate": "Vous souhaitez qu’il puisse flairer autour de vous",
    "free-extended": "Vous souhaitez qu’il explore plusieurs mètres devant vous",
    "free-max": "Vous souhaitez beaucoup de liberté tout en restant attaché",
    "free-offleash":
      "Vous aimeriez pouvoir le détacher davantage à terme",
  };
  if (freedom && freeLabels[freedom]) {
    items.push({
      weight: freedom === "free-max" || freedom === "free-extended" ? 6 : 4,
      questionId: "freedom",
      label: freeLabels[freedom],
    });
  }

  const pull = single(answers, "pull");
  if (pull === "pull-scent") {
    items.push({
      weight: 5,
      questionId: "pull",
      label: "Il tire surtout lorsqu’une odeur l’intéresse",
    });
  } else if (pull === "pull-strong") {
    items.push({
      weight: 5,
      questionId: "pull",
      label: "Il tire très fort en laisse",
    });
  } else if (pull === "pull-frequent") {
    items.push({
      weight: 4,
      questionId: "pull",
      label: "Il tire souvent en laisse",
    });
  }

  const age = single(answers, "age");
  if (age === "age-senior-adv" || age === "age-senior") {
    items.push({
      weight: 4,
      questionId: "age",
      label:
        age === "age-senior-adv"
          ? "C’est un Beagle de 10 ans ou plus"
          : "C’est un Beagle senior (7–9 ans)",
    });
  } else if (age === "age-puppy") {
    items.push({
      weight: 3,
      questionId: "age",
      label: "C’est encore un chiot (moins d’un an)",
    });
  }

  items.sort((a, b) => b.weight - a.weight);
  const seen = new Set<string>();
  const out: WalkingInfluencer[] = [];
  for (const item of items) {
    if (seen.has(item.questionId)) continue;
    seen.add(item.questionId);
    out.push({ questionId: item.questionId, label: item.label });
    if (out.length >= 3) break;
  }
  return out;
}

function filterProducts(
  profileId: WalkingProfileId,
  answers: WalkingAnswers,
  leadCategory: WalkingProductCategory | null,
  gpsRelevance: GpsRelevance
): WalkingProduct[] {
  const owned = ownedEquipment(answers);
  let products = getWalkingProductsForProfile(profileId);

  // Filter by harness category relevance
  products = products.filter((p) => {
    if (p.category === "y_harness") {
      return (
        profileId === "daily_walk" ||
        profileId === "scent_explorer" ||
        profileId === "secured_explorer" ||
        profileId === "senior_comfort"
      );
    }
    if (p.category === "escape_proof_harness") {
      return profileId === "escape_artist";
    }
    if (p.category === "hiking_harness") {
      return profileId === "hiking";
    }
    if (
      p.category === "long_line_5" ||
      p.category === "long_line_10" ||
      p.category === "long_line_15_plus"
    ) {
      if (owned.has("eq-longline")) return false;
      if (!leadCategory) return false;
      return p.category === leadCategory;
    }
    if (p.category === "gps") {
      if (owned.has("eq-gps")) return false;
      return gpsRelevance === "medium" || gpsRelevance === "high";
    }
    if (p.category === "tag") {
      return !owned.has("eq-tag");
    }
    if (p.category === "leash") {
      return !owned.has("eq-leash");
    }
    return true;
  });

  // Only active products with optional URL (UI hides broken buttons)
  return products.filter((p) => p.active);
}

function buildChecklist(
  answers: WalkingAnswers,
  result: Pick<
    WalkingResult,
    | "profileId"
    | "setup"
    | "gpsRelevance"
    | "identificationStatus"
    | "hasGpsAlready"
    | "longLineRecommended"
  >
): string[] {
  const owned = ownedEquipment(answers);
  const items: string[] = [];

  if (!owned.has("eq-harness")) {
    items.push(`Équiper d’un ${result.setup.harnessType.toLowerCase()}`);
  } else if (result.profileId === "escape_artist") {
    items.push(
      "Vérifier que le harnais actuel limite bien le recul (sinon envisager un modèle anti-évasion)"
    );
  } else {
    items.push("Vérifier l’ajustement et l’état du harnais actuel");
  }

  if (result.longLineRecommended && !owned.has("eq-longline")) {
    items.push(`Ajouter : ${result.setup.leadLabel}`);
  } else if (!result.longLineRecommended && !owned.has("eq-leash")) {
    items.push(`Ajouter : ${result.setup.leadLabel}`);
  }

  if (result.identificationStatus === "missing_tag") {
    items.push(
      "Ajouter une médaille avec numéro de téléphone (complément à la puce, pas un remplacement)"
    );
  } else {
    items.push("Vérifier que le numéro sur la médaille est à jour");
  }

  if (result.hasGpsAlready) {
    items.push("GPS déjà en place — vérifier batterie et abonnement");
  } else if (result.gpsRelevance === "high" || result.gpsRelevance === "medium") {
    items.push(result.setup.gpsLabel);
  }

  return items.slice(0, 5);
}

export function buildWalkingResult(answers: WalkingAnswers): WalkingResult {
  const profileId = pickWalkingProfileId(answers);
  const copy = PROFILE_COPY[profileId];
  const gpsRelevance = computeGpsRelevance(answers);
  const hasTagAlready = hasTag(answers);
  const hasGpsAlready = hasGps(answers);
  const identificationStatus: IdentificationStatus = hasTagAlready
    ? "has_tag"
    : "missing_tag";
  const lead = computeLead(answers, profileId);

  const identificationLabel = hasTagAlready
    ? "Médaille déjà en place — gardez le numéro à jour"
    : profileId === "escape_artist" ||
        profileId === "secured_explorer" ||
        isLostSignificant(answers)
      ? "Médaille avec numéro de téléphone fortement recommandée"
      : "Médaille avec numéro de téléphone recommandée";

  const setup: WalkingSetup = {
    harnessType: copy.harnessType,
    harnessDetail: copy.harnessDetail,
    leadKind: lead.kind,
    leadLabel: lead.label,
    leadLengthHint: lead.lengthHint,
    identificationLabel,
    gpsLabel: gpsLabel(gpsRelevance, hasGpsAlready),
  };

  const callouts = [...copy.callouts];
  if (isLostSignificant(answers)) {
    callouts.unshift({
      title: "Sans jugement",
      body: "Un chien peut s’éloigner très vite lorsqu’il suit une piste. L’objectif est ici d’ajouter plusieurs niveaux de sécurité, pas de juger ce qui s’est passé.",
      tone: "info",
    });
  }
  if (lead.longLineRecommended) {
    const hasLongeCallout = callouts.some((c) =>
      c.body.toLowerCase().includes("longe")
    );
    if (!hasLongeCallout) {
      callouts.push({
        title: "Longe + harnais",
        body: "Une longe longue peut générer une tension importante lorsque le chien arrive brutalement en bout de course. Utilisez-la avec un harnais adapté et apprenez à la manipuler progressivement.",
        tone: "warn",
      });
    }
  }

  // Puppy: avoid overly sporty framing in tips
  const tips = [...copy.tips];
  if (isPuppy(answers) && profileId !== "senior_comfort") {
    tips.unshift(
      "Chiot : privilégiez le confort, des sorties adaptées à son âge, et un apprentissage progressif plutôt qu’un matériel « sportif »."
    );
  }

  const products = filterProducts(
    profileId,
    answers,
    lead.categoryHint,
    gpsRelevance
  );

  const showGpsCrosslink =
    !hasGpsAlready && (gpsRelevance === "medium" || gpsRelevance === "high");
  const showGpsCommercial =
    !hasGpsAlready &&
    (gpsRelevance === "medium" || gpsRelevance === "high") &&
    products.some((p) => p.category === "gps" && resolveWalkingAffiliateUrl(p));
  const secondaryGpsCta =
    profileId === "escape_artist" || showGpsCrosslink;

  const partial = {
    profileId,
    setup,
    gpsRelevance,
    identificationStatus,
    hasGpsAlready,
    longLineRecommended: lead.longLineRecommended,
  };

  return {
    profileId,
    title: copy.title,
    badge: copy.badge,
    description: copy.description,
    priority: copy.priority,
    setup,
    influencers: buildInfluencers(answers),
    tips: tips.slice(0, 3),
    callouts,
    gpsRelevance,
    identificationStatus,
    hasGpsAlready,
    hasTagAlready,
    longLineRecommended: lead.longLineRecommended,
    products,
    showGpsCrosslink,
    showGpsCommercial,
    secondaryGpsCta,
    checklist: buildChecklist(answers, partial),
  };
}

export function buildAnswerRecap(
  quiz: Quiz,
  answers: WalkingAnswers
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

export const WALKING_AFFILIATE_DISCLAIMER =
  "Certains liens vers les équipements présentés peuvent être affiliés. Une commission peut nous être versée si vous effectuez un achat, sans surcoût pour vous. Les résultats du quiz sont déterminés par vos réponses, pas par le niveau de commission.";

export const WALKING_EDU = {
  harnessOrCollar: {
    title: "Harnais, collier ou les deux ?",
    body: "Le collier peut rester utile pour porter une médaille d’identification. Pour les promenades, de nombreux propriétaires préfèrent attacher la laisse ou la longe à un harnais afin de répartir les tensions sur le corps plutôt que sur le cou. Le choix dépend toutefois du chien, du matériel et de son utilisation.",
  },
  whyLongLine: {
    title: "Pourquoi une longe peut être intéressante avec un Beagle",
    body: "Une longe crée un compromis entre la laisse courte et la liberté totale. Elle permet au chien de flairer et d’explorer plusieurs mètres autour de son humain tout en conservant un lien physique lorsque le rappel n’est pas encore suffisamment fiable.",
    note: "Elle doit être utilisée avec attention : terrain dégagé, manipulation adaptée et absence de risque d’enroulement autour d’une personne, d’un chien ou d’un obstacle.",
  },
  layeredSafety: {
    title: "La sécurité fonctionne mieux en plusieurs couches",
    layers: [
      "Identification officielle (puce / I-CAD)",
      "Médaille téléphone",
      "Harnais et laisse ou longe adaptés",
      "GPS lorsque pertinent",
    ],
    body: "Aucun dispositif n’est parfait isolément. L’intérêt est de multiplier les moyens de retrouver ou de sécuriser rapidement le chien si un incident survient.",
  },
} as const;

export const WALKING_FAQ = [
  {
    question: "Quel type de harnais convient généralement à un Beagle ?",
    answer:
      "Pour les promenades classiques, un harnais bien ajusté laissant une bonne liberté de mouvement constitue souvent une base intéressante. Un Beagle ayant tendance à reculer hors de son harnais peut nécessiter un modèle anti-évasion à plusieurs points.",
  },
  {
    question: "Un Beagle peut-il porter une longe ?",
    answer:
      "Oui, une longe peut être utile pour lui offrir davantage de liberté dans un environnement adapté tout en conservant un lien physique. La longueur doit rester compatible avec le terrain, le comportement du chien et la capacité du propriétaire à la manipuler correctement.",
  },
  {
    question: "Quelle longueur de longe choisir ?",
    answer:
      "Il n’existe pas une longueur parfaite pour tous les chiens. Une longe de 5 mètres offre davantage de contrôle, tandis que 10 mètres ou davantage permettent une exploration plus large lorsque l’environnement s’y prête.",
  },
  {
    question: "Harnais ou collier pour un Beagle ?",
    answer:
      "Les deux peuvent avoir des rôles différents. Le collier peut notamment porter les coordonnées du propriétaire, tandis qu’un harnais peut être utilisé pour attacher la laisse ou la longe. Le choix doit surtout tenir compte du confort, de l’ajustement et du comportement du chien.",
  },
  {
    question: "Une médaille est-elle utile si mon Beagle est pucé ?",
    answer:
      "Oui, comme complément. La puce constitue l’identification officielle, tandis qu’une médaille avec un numéro de téléphone peut permettre à la personne qui retrouve le chien de contacter immédiatement son propriétaire.",
  },
  {
    question: "Un GPS remplace-t-il la longe ?",
    answer:
      "Non. Un GPS permet de localiser un chien qui s’est éloigné ; il ne l’empêche pas de partir. Harnais, laisse ou longe et GPS répondent donc à des fonctions différentes.",
  },
  {
    question: "Peut-on lâcher un Beagle s’il a un bon rappel ?",
    answer:
      "Aucun quiz ne peut garantir qu’un chien restera toujours sous contrôle. Le rappel dépend du chien, de son apprentissage, de l’environnement et des distractions présentes. Chez un chien très attiré par les odeurs, la prudence reste particulièrement importante.",
  },
] as const;
