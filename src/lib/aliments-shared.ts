/** Verdicts de la base « Mon chien peut-il manger… ? ». */

export const VERDICTS = [
  "toxique",
  "a-eviter",
  "avec-moderation",
  "sans-danger",
] as const;

export type AlimentVerdict = (typeof VERDICTS)[number];

export const VERDICT_LABEL: Record<AlimentVerdict, string> = {
  toxique: "Toxique",
  "a-eviter": "À éviter",
  "avec-moderation": "Avec modération",
  "sans-danger": "Sans danger",
};

/** Ordre d'affichage de l'index, des urgences vers les partages. */
export const VERDICT_ORDER: AlimentVerdict[] = [
  "toxique",
  "a-eviter",
  "avec-moderation",
  "sans-danger",
];

export const VERDICT_HINT: Record<AlimentVerdict, string> = {
  toxique:
    "Ne pas donner. En cas d'ingestion, appeler un vétérinaire ou un centre antipoison.",
  "a-eviter":
    "Ne pas donner. Ce n'est pas une friandise, même en petite quantité.",
  "avec-moderation":
    "Un petit morceau préparé peut se partager. Ce n'est pas le repas.",
  "sans-danger":
    "Pas toxique pour le chien, à condition de le préparer et d'en donner peu.",
};

export function isAlimentVerdict(value: string): value is AlimentVerdict {
  return (VERDICTS as readonly string[]).includes(value);
}

export interface AlimentSource {
  titre: string;
  url: string;
  editeur: string;
}

export interface AlimentLien {
  href: string;
  label: string;
}

export interface Aliment {
  slug: string;
  nom: string;
  emoji: string;
  question: string;
  /** Autres noms, espèces, produits proches. */
  synonymes: string[];
  /** Pluriels et tournures tapées dans Google (« raisins secs », « chocolat noir »). */
  formes: string[];
  verdict: AlimentVerdict;
  /** Une phrase, reprise telle quelle dans /aliments/index.json. */
  resume: string;
  /** Réponse visible, une ou deux phrases. */
  reponse: string;
  pourquoi: string;
  signes: string;
  /** Consigne spécifique après ingestion, en plus du bloc centres. */
  apresIngestion: string;
  /** Préparation, uniquement si l'aliment peut être partagé. */
  preparation: string | null;
  liens: AlimentLien[];
  sources: AlimentSource[];
  seo: { title: string; description: string };
  keywords: string[];
}

export interface AlimentsCatalog {
  verifiedAt: string;
  aliments: Aliment[];
}

/**
 * Centres antipoison vétérinaires.
 * Horaires et téléphones relevés le 31 octobre 2026 sur les pages officielles :
 * CNITV (VetAgro Sup) et CAPAE-Ouest (site du centre + page Oniris).
 */
export const POISON_CENTERS = [
  {
    id: "cnitv",
    nom: "CNITV de Lyon",
    organisme: "VetAgro Sup",
    telephone: "04 78 87 10 40",
    telephoneHref: "tel:+33478871040",
    horaires: "7j/7, de 8 h 30 à minuit",
    url: "https://www.vetagro-sup.fr/recherche-expertise/centre-national-dinformations-toxicologiques-veterinaires-cnitv/",
  },
  {
    id: "capae",
    nom: "CAPAE-Ouest de Nantes",
    organisme: "Oniris",
    telephone: "02 40 68 77 40",
    telephoneHref: "tel:+33240687740",
    horaires: "de 8 h 30 à minuit, 365 jours par an",
    url: "https://www.centre-antipoison-animal.com/",
    horairesUrl: "https://chuv.oniris-nantes.fr/accueil/centre-anti-poison",
  },
] as const;

export const ALIMENTS_VERIFIED_LABEL = "31 octobre 2026";
