/** Constantes partagées par la recherche, la fenêtre et les tests. */

export const SITE_ORIGIN = "https://expert-beagle.fr";

export const INDEX_URL = `${SITE_ORIGIN}/aliments/index.json`;

export const UTM = {
  utm_source: "chrome-extension",
  utm_medium: "extension",
  utm_campaign: "toxique-chien",
};

/** 12 h après une mise à jour réussie, 1 h après un échec. */
export const REFRESH_OK_MS = 12 * 60 * 60 * 1000;
export const REFRESH_FAIL_MS = 60 * 60 * 1000;

export const VERDICT_LABEL = {
  toxique: "Toxique",
  "a-eviter": "À éviter",
  "avec-moderation": "Avec modération",
  "sans-danger": "Sans danger",
};

/** Du plus grave au plus anodin, pour départager un homonyme. */
export const VERDICT_SEVERITY = {
  toxique: 0,
  "a-eviter": 1,
  "avec-moderation": 2,
  "sans-danger": 3,
};

export const VERDICTS = new Set(Object.keys(VERDICT_LABEL));

export const EMERGENCY_MESSAGE =
  "En cas d'ingestion, appelez votre vétérinaire ou un centre antipoison vétérinaire.";

/**
 * Repris de la base du site (src/lib/aliments-shared.ts).
 * Horaires et téléphones relevés le 31 octobre 2026.
 */
export const POISON_CENTERS = [
  {
    id: "cnitv",
    nom: "CNITV",
    detail: "Lyon · VetAgro Sup",
    telephone: "04 78 87 10 40",
    telephoneHref: "tel:+33478871040",
    horaires: "7j/7, de 8 h 30 à minuit",
  },
  {
    id: "capae",
    nom: "CAPAE-Ouest",
    detail: "Nantes · Oniris",
    telephone: "02 40 68 77 40",
    telephoneHref: "tel:+33240687740",
    horaires: "de 8 h 30 à minuit, 365 jours par an",
  },
];

export const POISON_NOTE =
  "Ces numéros ont été relevés sur les sites officiels le 31 octobre 2026. Le CNITV demande le téléphone plutôt que l'e-mail en urgence.";

export const UNKNOWN_TITLE = "Pas encore dans notre base";

export const UNKNOWN_BODY =
  "Cet aliment ne figure pas encore dans notre base. Cela ne veut pas dire que vous pouvez en donner : nous ne nous prononçons pas. Consultez la liste des aliments déjà vérifiés, ou appelez votre vétérinaire.";

export const AMBIGUOUS_INTRO =
  "Plusieurs fiches correspondent. Ouvrez celle qui décrit ce que votre chien a mangé.";

export const FICHE_LINK_LABEL = "Voir la fiche";

export const INDEX_LINK_LABEL = "Voir la base des aliments";

export const ERROR_BODY =
  "La base embarquée n'a pas pu être lue. Nous ne pouvons pas dire si cet aliment est toxique. Appelez votre vétérinaire.";

/**
 * Mots ignorés quand on cherche un aliment par son premier mot.
 * Ils restent dans la phrase : « du raisin » est encore une forme connue.
 */
export const STOPWORDS = new Set([
  "a",
  "ai",
  "as",
  "au",
  "aux",
  "avec",
  "avez",
  "ce",
  "ces",
  "cet",
  "cette",
  "chien",
  "chienne",
  "chiens",
  "chiot",
  "d",
  "dans",
  "de",
  "des",
  "du",
  "elle",
  "en",
  "est",
  "et",
  "ete",
  "eu",
  "il",
  "ils",
  "je",
  "l",
  "la",
  "le",
  "les",
  "ma",
  "mange",
  "mangee",
  "manger",
  "manges",
  "mes",
  "mon",
  "ne",
  "nos",
  "notre",
  "on",
  "ont",
  "ou",
  "par",
  "pas",
  "peut",
  "peuvent",
  "peux",
  "plus",
  "pour",
  "qu",
  "que",
  "qui",
  "sa",
  "sans",
  "se",
  "ses",
  "son",
  "sur",
  "ta",
  "te",
  "tes",
  "ton",
  "tu",
  "un",
  "une",
  "vos",
  "votre",
  "vous",
]);

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function formatVerifiedAt(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!match) return iso || "date inconnue";
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return iso;
  return `${Number(match[3])} ${month} ${match[1]}`;
}
