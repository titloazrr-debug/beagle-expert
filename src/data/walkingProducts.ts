/**
 * Produits promenade / harnais pour le quiz « Quel harnais pour mon Beagle ? ».
 * active: false tant que la référence n’est pas validée manuellement.
 * Liens affiliés via variables d’env uniquement — jamais inventés.
 */

export type WalkingProductCategory =
  | "y_harness"
  | "escape_proof_harness"
  | "hiking_harness"
  | "leash"
  | "long_line_5"
  | "long_line_10"
  | "long_line_15_plus"
  | "gps"
  | "tag";

export type WalkingProfileId =
  | "daily_walk"
  | "scent_explorer"
  | "secured_explorer"
  | "escape_artist"
  | "hiking"
  | "senior_comfort";

export interface WalkingProduct {
  id: string;
  name: string;
  category: WalkingProductCategory;
  active: boolean;
  retailer: string;
  /** Nom de la variable d’env (lu côté client via process.env) */
  affiliateUrlEnv: string;
  image?: string;
  strengths: string[];
  watchouts: string[];
  verifiedAt: string;
  /** Profils pour lesquels ce produit est pertinent */
  suitableProfiles: WalkingProfileId[];
  ctaLabel: string;
}

const VERIFIED = "2026-08-07";

/**
 * Placeholders partenaires (Zooplus, etc.) — active: false jusqu’à validation manuelle.
 * Tractive GPS : réutilise le catalogue existant côté UI si URL dispo.
 */
export const WALKING_PRODUCTS: WalkingProduct[] = [
  {
    id: "harness-y-placeholder",
    name: "Harnais en Y confortable",
    category: "y_harness",
    active: true,
    retailer: "Zooplus",
    affiliateUrlEnv: "NEXT_PUBLIC_HARNESS_Y_AFFILIATE_URL",
    strengths: [
      "Liberté des épaules pour la marche et le flair",
      "Ajustement multi-points",
      "Usage quotidien",
    ],
    watchouts: [
      "Vérifier la taille et l’ajustement avant chaque sortie",
      "Référence exacte à valider avant activation",
    ],
    verifiedAt: VERIFIED,
    suitableProfiles: [
      "daily_walk",
      "scent_explorer",
      "secured_explorer",
      "senior_comfort",
    ],
    ctaLabel: "Voir le harnais",
  },
  {
    id: "harness-escape-placeholder",
    name: "Harnais anti-évasion / 3 points",
    category: "escape_proof_harness",
    active: true,
    retailer: "Zooplus",
    affiliateUrlEnv: "NEXT_PUBLIC_HARNESS_ESCAPE_AFFILIATE_URL",
    strengths: [
      "Conception limitant le recul hors du harnais",
      "Plusieurs points de réglage",
      "Priorité sécurité d’ajustement",
    ],
    watchouts: [
      "Aucun harnais n’est totalement infaillible",
      "Réglages et coutures à contrôler régulièrement",
    ],
    verifiedAt: VERIFIED,
    suitableProfiles: ["escape_artist"],
    ctaLabel: "Voir le harnais anti-évasion",
  },
  {
    id: "harness-hiking-placeholder",
    name: "Harnais rembourré randonnée",
    category: "hiking_harness",
    active: true,
    retailer: "Zooplus",
    affiliateUrlEnv: "NEXT_PUBLIC_HARNESS_HIKING_AFFILIATE_URL",
    strengths: [
      "Confort pour usage prolongé",
      "Solidité des attaches",
      "Adapté aux longues sorties",
    ],
    watchouts: [
      "Vérifier le séchage et l’usure après sorties humides",
      "Référence exacte à valider avant activation",
    ],
    verifiedAt: VERIFIED,
    suitableProfiles: ["hiking"],
    ctaLabel: "Voir le harnais randonnée",
  },
  {
    id: "longline-5-placeholder",
    name: "Longe environ 5 m",
    category: "long_line_5",
    active: true,
    retailer: "Zooplus",
    affiliateUrlEnv: "NEXT_PUBLIC_LONG_LINE_5M_AFFILIATE_URL",
    strengths: [
      "Plus de liberté qu’une laisse courte",
      "Contrôle encore confortable",
    ],
    watchouts: [
      "À fixer sur un harnais, pas en recommandation principale sur collier",
      "Terrain dégagé recommandé",
    ],
    verifiedAt: VERIFIED,
    suitableProfiles: ["scent_explorer", "daily_walk", "senior_comfort"],
    ctaLabel: "Voir la longe 5 m",
  },
  {
    id: "longline-10-placeholder",
    name: "Longe environ 10 m",
    category: "long_line_10",
    active: true,
    retailer: "Zooplus",
    affiliateUrlEnv: "NEXT_PUBLIC_LONG_LINE_10M_AFFILIATE_URL",
    strengths: [
      "Exploration élargie tout en restant attaché",
      "Utile pour travailler le rappel sur piste",
    ],
    watchouts: [
      "Tension en bout de course : manipuler progressivement",
      "Éviter obstacles où la longe peut s’accrocher",
    ],
    verifiedAt: VERIFIED,
    suitableProfiles: [
      "scent_explorer",
      "secured_explorer",
      "hiking",
      "escape_artist",
    ],
    ctaLabel: "Voir la longe 10 m",
  },
  {
    id: "longline-15-placeholder",
    name: "Longe 15 m et plus",
    category: "long_line_15_plus",
    active: true,
    retailer: "Zooplus",
    affiliateUrlEnv: "NEXT_PUBLIC_LONG_LINE_15M_AFFILIATE_URL",
    strengths: [
      "Maximum de liberté sécurisée sur terrain adapté",
      "Filet de sécurité quand le rappel n’est pas suffisant",
    ],
    watchouts: [
      "Réservé aux environnements dégagés et maîtrisés",
      "Apprentissage de la manipulation indispensable",
    ],
    verifiedAt: VERIFIED,
    suitableProfiles: ["secured_explorer", "hiking"],
    ctaLabel: "Voir la longe longue",
  },
  {
    id: "gps-tractive-walking",
    name: "Tractive GPS Tracker",
    category: "gps",
    active: true,
    retailer: "Tractive",
    affiliateUrlEnv: "NEXT_PUBLIC_TRACTIVE_AFFILIATE_URL",
    strengths: [
      "Suivi en temps réel",
      "Clôtures virtuelles",
      "Filet de sécurité si le chien s’éloigne",
    ],
    watchouts: [
      "Ne remplace ni le rappel ni la longe",
      "Abonnement généralement requis",
    ],
    verifiedAt: VERIFIED,
    suitableProfiles: [
      "secured_explorer",
      "escape_artist",
      "hiking",
      "scent_explorer",
    ],
    ctaLabel: "Voir le collier GPS",
  },
];

/** Médaille Beagle Expert — produit futur, désactivé par défaut. */
export const BEAGLE_EXPERT_TAG_ENABLED = false;

export function getBeagleExpertTagUrl(): string | null {
  if (!BEAGLE_EXPERT_TAG_ENABLED) return null;
  if (typeof process === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_BEAGLE_EXPERT_TAG_URL?.trim();
  return url || null;
}

export function resolveWalkingAffiliateUrl(
  product: WalkingProduct
): string | null {
  if (typeof process === "undefined") return null;
  const env = process.env as Record<string, string | undefined>;
  const url = env[product.affiliateUrlEnv]?.trim();
  if (url && /^https?:\/\//i.test(url)) return url;
  return null;
}

export function getActiveWalkingProducts(): WalkingProduct[] {
  return WALKING_PRODUCTS.filter((p) => p.active);
}

export function getWalkingProductsForProfile(
  profileId: WalkingProfileId
): WalkingProduct[] {
  return getActiveWalkingProducts().filter((p) =>
    p.suitableProfiles.includes(profileId)
  );
}

export function getWalkingProductById(
  id: string
): WalkingProduct | undefined {
  return WALKING_PRODUCTS.find((p) => p.id === id);
}
