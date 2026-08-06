/**
 * Recettes Ultra Premium Direct pour le quiz croquettes.
 * active: true = afficher la reco (type + fiche).
 * Liens d’achat : variables NEXT_PUBLIC_UPD_* uniquement (jamais inventés).
 * Sans URL → la carte s’affiche, le bouton d’affiliation reste masqué.
 */

export type GrainStatus = "grain_free" | "low_grain" | "contains_grain";
export type LifeStage = "puppy" | "adult" | "senior";

export type FoodProfileId =
  | "puppy_standard"
  | "puppy_sensitive"
  | "adult_standard"
  | "adult_sensitive"
  | "adult_weight_control"
  | "senior"
  | "medical_review";

export interface FoodProduct {
  id: string;
  name: string;
  active: boolean;
  inStock: boolean;
  lifeStage: LifeStage;
  tags: string[];
  grainStatus: GrainStatus;
  proteinSource: string;
  packageSizes: string[];
  suitableProfiles: FoodProfileId[];
  features: string[];
  cautions: string[];
  ctaLabel: string;
  verifiedAt: string;
  /** Nom de la variable d’env (sans process.env ici pour le client) */
  affiliateUrlEnv: string;
  officialUrlEnv?: string;
}

const VERIFIED = "2026-08-06";

export const FOOD_PRODUCTS: FoodProduct[] = [
  {
    id: "upd-puppy-chicken-grain-free",
    name: "Croquettes Sans Céréales au Poulet frais pour Chiot toutes tailles",
    active: true,
    inStock: true,
    lifeStage: "puppy",
    grainStatus: "grain_free",
    proteinSource: "poulet frais",
    packageSizes: ["à vérifier sur le catalogue"],
    suitableProfiles: ["puppy_standard"],
    tags: ["puppy", "growth", "chicken", "grain_free"],
    features: [
      "Aliment complet pour chiot",
      "Fabriqué en France (selon fabricant)",
      "Recette sans céréales",
      "Poulet frais mis en avant",
    ],
    cautions: [],
    ctaLabel: "Découvrir la recette chiot",
    verifiedAt: VERIFIED,
    affiliateUrlEnv: "NEXT_PUBLIC_UPD_PUPPY_AFFILIATE_URL",
  },
  {
    id: "upd-puppy-sensitive-grain-free",
    name: "Croquettes Sans Céréales Chiot Digestion Sensible",
    active: true,
    inStock: true,
    lifeStage: "puppy",
    grainStatus: "grain_free",
    proteinSource: "selon catalogue fabricant",
    packageSizes: ["à vérifier sur le catalogue"],
    suitableProfiles: ["puppy_sensitive"],
    tags: ["puppy", "growth", "sensitive_digestion", "grain_free"],
    features: [
      "Formulée pour chiot",
      "Recette sans céréales",
      "Destinée aux chiots à digestion sensible (positionnement fabricant)",
    ],
    cautions: [
      "Ne remplace pas un diagnostic en cas de troubles réguliers ou de mauvaise croissance.",
    ],
    ctaLabel: "Découvrir la recette chiot sensible",
    verifiedAt: VERIFIED,
    affiliateUrlEnv: "NEXT_PUBLIC_UPD_PUPPY_SENSITIVE_AFFILIATE_URL",
  },
  {
    id: "upd-adult-chicken-grain-free",
    name: "Croquettes Sans Céréales au Poulet frais pour Chien adulte toutes tailles",
    active: true,
    inStock: true,
    lifeStage: "adult",
    grainStatus: "grain_free",
    proteinSource: "poulet frais",
    packageSizes: ["à vérifier sur le catalogue"],
    suitableProfiles: ["adult_standard"],
    tags: ["adult", "normal_weight", "chicken", "grain_free"],
    features: [
      "Aliment complet pour chien adulte",
      "Recette sans céréales",
      "Poulet frais mis en avant",
    ],
    cautions: [],
    ctaLabel: "Découvrir la recette adulte",
    verifiedAt: VERIFIED,
    affiliateUrlEnv: "NEXT_PUBLIC_UPD_ADULT_AFFILIATE_URL",
  },
  {
    id: "upd-adult-sensitive-grain-free",
    name: "Croquettes Sans Céréales Chien Digestion Sensible Toutes Tailles",
    active: true,
    inStock: true,
    lifeStage: "adult",
    grainStatus: "grain_free",
    proteinSource: "agneau",
    packageSizes: ["à vérifier sur le catalogue"],
    suitableProfiles: ["adult_sensitive"],
    tags: ["adult", "sensitive_digestion", "lamb", "grain_free"],
    features: [
      "Recette sans céréales",
      "Source principale mise en avant : agneau",
      "Présence de prébiotiques annoncée par le fabricant",
      "Destinée aux chiens présentant une sensibilité digestive",
    ],
    cautions: [
      "Ne guérit pas diarrhées, allergies, intolérances ni maladies digestives.",
    ],
    ctaLabel: "Découvrir la recette digestion sensible",
    verifiedAt: VERIFIED,
    affiliateUrlEnv: "NEXT_PUBLIC_UPD_SENSITIVE_AFFILIATE_URL",
  },
  {
    id: "upd-light-grain-free",
    name: "Croquettes Light Sans Céréales pour Chien Stérilisé ou en Surpoids",
    active: true,
    inStock: true,
    lifeStage: "adult",
    grainStatus: "grain_free",
    proteinSource: "selon catalogue fabricant",
    packageSizes: ["à vérifier sur le catalogue"],
    suitableProfiles: ["adult_weight_control"],
    tags: ["adult", "sterilized", "weight_control", "grain_free"],
    features: [
      "Recette sans céréales",
      "Teneur en matières grasses réduite vs recettes adultes classiques (données fabricant)",
      "Fibres destinées à contribuer à la satiété (positionnement fabricant)",
      "Pour chien adulte stérilisé ou sujet à l’embonpoint",
    ],
    cautions: [
      "Une recette moins énergétique ne suffit pas sans ajuster la ration et les friandises.",
    ],
    ctaLabel: "Découvrir la recette light",
    verifiedAt: VERIFIED,
    affiliateUrlEnv: "NEXT_PUBLIC_UPD_LIGHT_AFFILIATE_URL",
  },
  {
    id: "upd-senior-care",
    name: "Croquettes Care Senior 7+ pour Chien de toutes tailles",
    active: true,
    inStock: true,
    lifeStage: "senior",
    grainStatus: "contains_grain",
    proteinSource: "poulet",
    packageSizes: ["à vérifier sur le catalogue"],
    suitableProfiles: ["senior"],
    tags: ["senior", "joint_support", "moderate_energy"],
    features: [
      "Recette destinée aux chiens de 7 ans et plus",
      "Poulet",
      "Matières grasses modérées (selon fabricant)",
      "Fibres",
      "Collagène marin, glucosamine et chondroïtine (selon fabricant)",
    ],
    cautions: [
      "Cette recette contient notamment du riz et du maïs",
      "Ne pas afficher de badge sans céréales",
    ],
    ctaLabel: "Découvrir la recette Senior 7+",
    verifiedAt: VERIFIED,
    affiliateUrlEnv: "NEXT_PUBLIC_UPD_SENIOR_AFFILIATE_URL",
  },
];

/** Lien calculateur de ration UDP (officiel ou affilié). */
export const FOOD_RATION_CALCULATOR_ENV = "NEXT_PUBLIC_UPD_RATION_CALCULATOR_URL";
export const FOOD_RATION_CALCULATOR_FALLBACK_ENV =
  "NEXT_PUBLIC_UPD_OFFICIAL_HOME_URL";

export function getFoodProductById(id: string): FoodProduct | undefined {
  return FOOD_PRODUCTS.find((p) => p.id === id);
}

export function getFoodProductsForProfile(
  profileId: FoodProfileId
): FoodProduct[] {
  return FOOD_PRODUCTS.filter((p) => p.suitableProfiles.includes(profileId));
}

/**
 * Résout une URL d’env publique.
 * Retourne null si absente, vide ou placeholder « # ».
 */
export function resolvePublicUrl(envKey: string | undefined): string | null {
  if (!envKey) return null;
  const raw =
    typeof process !== "undefined" ? process.env[envKey]?.trim() : undefined;
  if (!raw || raw === "#" || raw === "undefined") return null;
  return raw;
}

export function resolveAffiliateUrl(product: FoodProduct): string | null {
  return resolvePublicUrl(product.affiliateUrlEnv);
}

/**
 * URL cliquable pour le CTA produit.
 * 1) lien affilié si configuré
 * 2) sinon URL officielle produit / home UDP
 * 3) sinon site public UDP (évite un résultat sans bouton)
 */
export function resolveProductCtaUrl(product: FoodProduct): {
  url: string;
  isAffiliate: boolean;
} {
  const affiliate = resolveAffiliateUrl(product);
  if (affiliate) return { url: affiliate, isAffiliate: true };

  const official =
    resolvePublicUrl(product.officialUrlEnv) ??
    resolvePublicUrl(FOOD_RATION_CALCULATOR_FALLBACK_ENV) ??
    resolvePublicUrl("NEXT_PUBLIC_UPD_OFFICIAL_HOME_URL");
  if (official) return { url: official, isAffiliate: false };

  return {
    url: "https://www.ultrapremiumdirect.com/",
    isAffiliate: false,
  };
}

export function resolveRationCalculatorUrl(): string | null {
  return (
    resolvePublicUrl(FOOD_RATION_CALCULATOR_ENV) ??
    resolvePublicUrl(FOOD_RATION_CALCULATOR_FALLBACK_ENV)
  );
}

export function grainStatusLabel(status: GrainStatus): string {
  switch (status) {
    case "grain_free":
      return "Sans céréales";
    case "low_grain":
      return "Faible teneur en céréales";
    case "contains_grain":
      return "Contient des céréales";
  }
}

/** Expressions interdites (tests conformité). */
export const FORBIDDEN_FOOD_PHRASES = [
  "nous avons comparé toutes les croquettes",
  "meilleure croquette du marché",
  "meilleure marque",
  "recommandation vétérinaire",
  "recette parfaite pour votre chien",
  "garantit une bonne digestion",
  "empêche le surpoids",
  "évite les allergies",
  "alimentation idéale pour tous les Beagles",
  "votre chien est obèse",
] as const;

export const FOOD_QUIZ_SLUG = "alimentation-croquettes";

/** Présentation marque — affichée seulement avant les recettes (résultat). */
export const FOOD_BRAND_INTRO =
  "Pour ce profil, nous mettons en avant Ultra Premium Direct : une marque française en vente directe, avec un bon rapport qualité-prix, des formules riches en protéines animales et une gamme large (chiot, adulte, digestion sensible, light, senior), dont plusieurs recettes sans céréales. Voici le type de croquettes qui correspond le mieux aux priorités que vous avez indiquées.";

export const FOOD_AFFILIATE_DISCLAIMER =
  "Les liens vers Ultra Premium Direct sont affiliés : une commission peut nous être versée si vous commandez par notre intermédiaire, sans surcoût pour vous. Cela n’influence pas les réponses du quiz ni le type de croquettes retenu pour votre profil.";

export const FOOD_RESULT_DISCLAIMER =
  "Cette orientation repose uniquement sur les informations générales que vous avez indiquées. Elle ne remplace pas l’avis d’un vétérinaire, notamment en présence d’une maladie, d’une allergie suspectée, de troubles persistants ou d’un régime thérapeutique.";

/** Libellés de type de recette (priorité visuelle > marque). */
export const FOOD_RECIPE_TYPE_LABELS: Record<string, string> = {
  "upd-puppy-chicken-grain-free": "Croquettes chiot · croissance",
  "upd-puppy-sensitive-grain-free": "Croquettes chiot · digestion sensible",
  "upd-adult-chicken-grain-free": "Croquettes adulte · maintien",
  "upd-adult-sensitive-grain-free": "Croquettes adulte · digestion sensible",
  "upd-light-grain-free": "Croquettes light · poids à surveiller",
  "upd-senior-care": "Croquettes senior · 7 ans et plus",
};
