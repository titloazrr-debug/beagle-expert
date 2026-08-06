/**
 * Mode conformité assurance / affiliation.
 * true = formulations neutres, pas de « gagnant », pas de conseil personnalisé.
 */
export const COMPLIANCE_MODE = true;

export const INSURANCE_QUIZ_SLUG = "assurance-sante-beagle";

export const INSURANCE_AFFILIATE_DISCLAIMER =
  "Certains liens présents sur cette page sont affiliés. Une commission peut nous être versée, sans surcoût pour vous. Elle n’influence ni les critères présentés ni l’ordre des offres.";

export const INSURANCE_RESULT_DISCLAIMER =
  "Ce résultat est un outil d’information général. Il ne constitue ni un conseil en assurance ni une garantie de prise en charge. Les tarifs, plafonds, exclusions et conditions d’admission peuvent évoluer. Consultez toujours le devis et les documents contractuels de l’assureur.";

/** Expressions interdites en mode conformité (tests + garde-fous). */
export const FORBIDDEN_INSURANCE_PHRASES = [
  "meilleure assurance pour vous",
  "nous vous recommandons de choisir",
  "cette assurance est faite pour vous",
  "offre la moins chère",
  "meilleur rapport qualité-prix",
  "idéal pour votre chien",
  "garantie complète",
  "remboursement assuré",
] as const;

export function isInsuranceQuizSlug(slug: string): boolean {
  return slug === INSURANCE_QUIZ_SLUG;
}
