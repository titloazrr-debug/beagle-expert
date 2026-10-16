/**
 * Catalogue des images Beagle (public/images/beagle/).
 */

export const BEAGLE_IMAGES_DIR = "/images/beagle";

export type BeagleImageKey =
  | "hero"
  | "sante"
  | "alimentation"
  | "education"
  | "soins"
  | "budget"
  | "histoire"
  | "jouets"
  | "gps"
  | "solitude"
  | "assurance"
  | "esperance"
  | "og-default";

export interface BeagleImageAsset {
  key: BeagleImageKey;
  /** Chemin public pour next/image */
  src: string;
  /** Alt accessible / SEO */
  alt: string;
  width: number;
  height: number;
}

const BASE = BEAGLE_IMAGES_DIR;

/** Dimensions des JPG de couverture (alignées sur les autres cartes) */
const PHOTO_W = 1168;
const PHOTO_H = 784;

/** Assets dans public/images/beagle/ */
export const BEAGLE_IMAGES: Record<BeagleImageKey, BeagleImageAsset> = {
  hero: {
    key: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Beagle regardant la caméra",
    width: PHOTO_W,
    height: PHOTO_H,
  },
  sante: {
    key: "sante",
    src: `${BASE}/sante.jpg`,
    alt: "Beagle en bonne forme — santé, prévention et suivi vétérinaire",
    width: PHOTO_W,
    height: PHOTO_H,
  },
  alimentation: {
    key: "alimentation",
    src: `${BASE}/alimentation.jpg`,
    alt: "Beagle à table — alimentation, rations et croquettes adaptées",
    width: PHOTO_W,
    height: PHOTO_H,
  },
  education: {
    key: "education",
    src: `${BASE}/education.jpg`,
    alt: "Beagle en promenade — éducation, rappel, flair et comportement",
    width: PHOTO_W,
    height: PHOTO_H,
  },
  soins: {
    key: "soins",
    src: `${BASE}/soins.jpg`,
    alt: "Soins du Beagle — entretien du pelage, oreilles et hygiène",
    width: PHOTO_W,
    height: PHOTO_H,
  },
  budget: {
    key: "budget",
    src: `${BASE}/budget.jpg`,
    alt: "Budget Beagle — coûts, équipement et dépenses du quotidien",
    width: PHOTO_W,
    height: PHOTO_H,
  },
  histoire: {
    key: "histoire",
    src: `${BASE}/histoire.jpg`,
    alt: "Histoire et standard du Beagle — origines et caractère de la race",
    width: PHOTO_W,
    height: PHOTO_H,
  },
  jouets: {
    key: "jouets",
    src: `${BASE}/jouets.jpg`,
    alt: "Beagle tricolore avec un jouet en caoutchouc rouge dans la gueule",
    width: 768,
    height: 1152,
  },
  gps: {
    key: "gps",
    src: `${BASE}/gps.jpg`,
    alt: "Beagle tricolore qui renifle un chemin, un petit boîtier GPS sur le collier",
    width: 768,
    height: 1152,
  },
  solitude: {
    key: "solitude",
    src: `${BASE}/solitude.jpg`,
    alt: "Beagle couché sur un tapis devant une porte fermée",
    width: 768,
    height: 1152,
  },
  assurance: {
    key: "assurance",
    src: `${BASE}/assurance.jpg`,
    alt: "Beagle assis dans une salle d'attente, à côté de son maître",
    width: 768,
    height: 1152,
  },
  esperance: {
    key: "esperance",
    src: `${BASE}/esperance.jpg`,
    alt: "Beagle plus âgé allongé dans une tache de soleil",
    width: 768,
    height: 1152,
  },
  "og-default": {
    key: "og-default",
    src: `${BASE}/og-default.jpg`,
    alt: "Beagle Expert — guides et quiz pour les maîtres de Beagle",
    width: PHOTO_W,
    height: PHOTO_H,
  },
};

/** Mapping slug fiche → image thématique */
const FICHE_SLUG_TO_IMAGE: Record<string, BeagleImageKey> = {
  sante: "sante",
  alimentation: "alimentation",
  "education-comportement": "education",
  "collier-gps-beagle": "gps",
  "solitude-aboiements-destruction": "solitude",
  "soins-entretien": "soins",
  "budget-equipement": "budget",
  "assurance-chien-beagle": "assurance",
  "histoire-standard": "histoire",
  "esperance-de-vie": "esperance",
  "jouets-beagle-destructeur": "jouets",
};

const CATEGORY_TO_IMAGE: Record<string, BeagleImageKey> = {
  sante: "sante",
  alimentation: "alimentation",
  education: "education",
  soins: "soins",
  budget: "budget",
  histoire: "histoire",
};

export function getBeagleImage(key: BeagleImageKey): BeagleImageAsset {
  return BEAGLE_IMAGES[key];
}

export function getHeroImage(): BeagleImageAsset {
  return BEAGLE_IMAGES.hero;
}

export function getDefaultOgImage(): BeagleImageAsset {
  return BEAGLE_IMAGES["og-default"];
}

/**
 * Image de couverture pour une fiche (slug ou catégorie).
 * Retourne null si aucune image dédiée n’est prévue.
 */
export function getFicheCoverImage(input: {
  slug: string;
  category?: string;
}): BeagleImageAsset | null {
  const bySlug = FICHE_SLUG_TO_IMAGE[input.slug];
  if (bySlug) return BEAGLE_IMAGES[bySlug];
  if (input.category && CATEGORY_TO_IMAGE[input.category]) {
    return BEAGLE_IMAGES[CATEGORY_TO_IMAGE[input.category]];
  }
  return null;
}

/** Image OG d’une fiche : cover dédiée, ogImage frontmatter, ou défaut site */
export function getFicheOgImageSrc(input: {
  slug: string;
  category?: string;
  ogImage?: string | null;
}): string {
  if (input.ogImage?.trim()) return input.ogImage.trim();
  const cover = getFicheCoverImage(input);
  if (cover) return cover.src;
  return BEAGLE_IMAGES["og-default"].src;
}
