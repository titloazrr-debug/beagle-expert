/**
 * Millésime des sélections « meilleur X ».
 * Pour passer à l'année suivante, changer uniquement cette constante.
 */
export const SELECTION_YEAR = 2027;

/** Date éditoriale de cette sélection (reprise en dateModified des fiches). */
export const SELECTION_UPDATED_ON = "2026-10-26";

const MONTHS_FR = [
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
] as const;

/**
 * Titres SEO, H1, og:title et headline.
 * Le title de fiche (cartes, footer, fil d'Ariane) reste sans année.
 */
const ANNUAL_HEADLINES: Record<string, string> = {
  "collier-gps-beagle": `Meilleur collier GPS pour Beagle ${SELECTION_YEAR}`,
  alimentation: `Meilleures croquettes pour Beagle ${SELECTION_YEAR}`,
  "assurance-chien-beagle": `Assurance chien Beagle ${SELECTION_YEAR} : comparatif et tarifs`,
  "jouets-beagle-destructeur": `Meilleurs jouets indestructibles pour Beagle ${SELECTION_YEAR}`,
  "harnais-anti-evasion-beagle": `Meilleur harnais anti-évasion pour Beagle ${SELECTION_YEAR}`,
};

const TARIFF_NOTICE_SLUGS = new Set(["assurance-chien-beagle"]);

export function annualSelectionHeadline(slug: string): string | undefined {
  return ANNUAL_HEADLINES[slug];
}

export function isAnnualSelection(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(ANNUAL_HEADLINES, slug);
}

export function selectionNeedsTariffNotice(slug: string): boolean {
  return TARIFF_NOTICE_SLUGS.has(slug);
}

/** Mention affichée sur chaque fiche de sélection. Le millésime suit SELECTION_YEAR. */
export function selectionFreshnessNotice(): string {
  return `Sélection basée sur les modèles disponibles et vérifiés aujourd'hui. Cette page sera mise à jour dès la sortie des nouveautés ${SELECTION_YEAR}.`;
}

export const INSURANCE_TARIFF_NOTICE =
  "Les tarifs indiqués sont à revérifier auprès des assureurs : ce sont des ordres de grandeur, pas un devis.";

/** Affiche une date ISO (YYYY-MM-DD) en français, sans décalage de fuseau. */
export function formatIsoDateFr(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!match) return undefined;
  const month = MONTHS_FR[Number(match[2]) - 1];
  if (!month) return undefined;
  return `${Number(match[3])} ${month} ${match[1]}`;
}
