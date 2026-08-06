/**
 * Partenaires assurance santé (ordre neutre et stable).
 * Ne jamais réordonner selon les commissions.
 *
 * Liens affiliés via variables d’environnement :
 * - NEXT_PUBLIC_SANTEVET_AFFILIATE_URL
 * - NEXT_PUBLIC_PATOLO_AFFILIATE_URL
 * - NEXT_PUBLIC_KOZOO_AFFILIATE_URL
 *
 * Passer active: true uniquement après validation du programme d’affiliation.
 */

export type InsuranceProvider = {
  id: string;
  name: string;
  active: boolean;
  affiliateNetwork: string;
  /** Env key (sans le préfixe NEXT_PUBLIC_ pour la doc) ou URL résolue */
  envAffiliateKey: string;
  affiliateDisclosure: string;
  verifiedAt: string;
  eligibility: {
    minimumAgeMonths?: number;
    maximumEntryAgeYears?: number;
    maximumAgeRequiresQuote?: boolean;
    notes?: string;
  };
  reimbursementRates: string;
  annualLimits: string;
  deductible: string;
  waitingPeriods: string[];
  prevention: string;
  specialServices: string[];
  strengths: string[];
  watchouts: string[];
  sourceDocumentLabel: string;
  sourceDocumentUrl: string;
  /** Critères pour surlignage neutre (priorités quiz) */
  highlightKeys: string[];
};

function resolveAffiliateUrl(envKey: string): string | null {
  if (typeof process === "undefined") return null;
  const raw = process.env[envKey]?.trim();
  if (!raw || raw === "#" || raw.toLowerCase() === "undefined") return null;
  return raw;
}

/** Ordre d’affichage fixe — ne pas trier par commission. */
export const INSURANCE_PROVIDERS: InsuranceProvider[] = [
  {
    id: "santevet",
    name: "SantéVet",
    active: false,
    affiliateNetwork: "Affilae",
    envAffiliateKey: "NEXT_PUBLIC_SANTEVET_AFFILIATE_URL",
    affiliateDisclosure:
      "Lien affilié SantéVet (Affilae) — commission possible sans surcoût pour vous.",
    verifiedAt: "2026-08-05",
    eligibility: {
      maximumAgeRequiresQuote: true,
      notes:
        "Âge limite de souscription variable selon la race et la formule — vérifier le devis.",
    },
    reimbursementRates: "De 60 à 100 % selon la formule",
    annualLimits: "De 1 500 à 4 000 € par an selon la formule",
    deductible: "De 0 à 75 € de franchise annuelle selon la formule",
    waitingPeriods: [
      "48 heures pour les accidents",
      "45 jours pour les maladies",
      "6 mois pour les chirurgies consécutives à une maladie et les ligaments croisés",
    ],
    prevention: "Budget prévention inclus, de 30 à 150 € par an selon la formule",
    specialServices: [
      "Payvet : service d’avance des frais vétérinaires, sous conditions",
      "Assistance vétérinaire 24 h/24 et 7 j/7",
    ],
    strengths: [
      "Cinq niveaux de couverture",
      "Plafond pouvant atteindre 4 000 € par an",
      "Budget prévention inclus",
      "Service d’avance des frais",
    ],
    watchouts: [
      "Âge limite de souscription variable selon la race et la formule",
      "Certaines formules supérieures sont réservées aux animaux plus jeunes",
      "Délai de six mois pour certaines chirurgies",
      "Maladies et malformations héréditaires ou congénitales souvent exclues",
    ],
    sourceDocumentLabel: "Documents contractuels SantéVet",
    sourceDocumentUrl: "https://www.santevet.fr/",
    highlightKeys: ["plafond", "prevention", "avance", "franchise", "carence"],
  },
  {
    id: "patolo",
    name: "Patolo",
    active: false,
    affiliateNetwork: "Awin",
    envAffiliateKey: "NEXT_PUBLIC_PATOLO_AFFILIATE_URL",
    affiliateDisclosure:
      "Lien affilié Patolo (Awin) — commission possible sans surcoût pour vous.",
    verifiedAt: "2026-08-05",
    eligibility: {
      maximumEntryAgeYears: 8,
      notes: "Admission avant le huitième anniversaire (à confirmer sur devis).",
    },
    reimbursementRates: "60 %, 80 % ou 100 % selon la formule",
    annualLimits:
      "Plafonds progressifs pendant les deux premières années ; plafond de 2 000 € pour Confort et absence de plafond annuel à partir de la troisième année pour Premium et Premium Plus (mécanisme cumulatif des plafonds initiaux — vérifier le contrat)",
    deductible: "Vérifier la fiche contractuelle actualisée avant publication",
    waitingPeriods: [
      "Pas de délai de carence annoncé",
      "Les maladies, blessures ou symptômes antérieurs restent exclus",
    ],
    prevention: "Budget Bien-Être de 80 à 120 € par an selon la formule",
    specialServices: [
      "Téléconseil vétérinaire",
      "Budget Coups Durs",
      "Certaines pathologies génétiques ou développementales prises en charge jusqu’à 1 500 € par pathologie, sous conditions",
    ],
    strengths: [
      "Protection annoncée dès le premier jour",
      "Taux pouvant atteindre 100 %",
      "Plafond annuel illimité à partir de la 3ᵉ année sur formules supérieures",
    ],
    watchouts: [
      "Admission avant le huitième anniversaire",
      "Plafonds relativement bas pendant les deux premières années",
      "Le plafond des deux premières années fonctionne de manière cumulative",
      "Changement de formule parfois impossible sans perdre l’ancienneté",
    ],
    sourceDocumentLabel: "Documents contractuels Patolo",
    sourceDocumentUrl: "https://www.patolo.fr/",
    highlightKeys: ["carence", "plafond", "prevention", "tele", "age-admission"],
  },
  {
    id: "kozoo",
    name: "Kozoo",
    active: false,
    affiliateNetwork: "Programme partenaire direct",
    envAffiliateKey: "NEXT_PUBLIC_KOZOO_AFFILIATE_URL",
    affiliateDisclosure:
      "Lien partenaire Kozoo — commission possible sans surcoût pour vous.",
    verifiedAt: "2026-08-05",
    eligibility: {
      maximumEntryAgeYears: 12,
      notes:
        "Souscription possible jusqu’à 12 ans révolus, sous réserve des conditions et d’absence de symptômes.",
    },
    reimbursementRates: "De 50 à 100 % selon la formule",
    annualLimits: "De 1 000 à 3 000 € par an",
    deductible:
      "Aucune franchise par défaut ; options de 30 ou 50 € par motif de visite possibles",
    waitingPeriods: [
      "14 jours pour les accidents et blessures",
      "45 jours pour les maladies",
      "90 jours pour certaines pathologies orthopédiques, ruptures ligamentaires et hernies",
    ],
    prevention: "Option prévention de 100 ou 150 € par an",
    specialServices: [
      "Remboursement annoncé sous 48 heures",
      "Téléconseil vétérinaire illimité",
    ],
    strengths: [
      "Âge maximal de souscription élevé",
      "Formules très modulables",
      "Absence de franchise par défaut",
      "Taux de remboursement jusqu’à 100 %",
    ],
    watchouts: [
      "Plafond maximal de 3 000 €",
      "Prévention proposée en option payante",
      "Carence de 14 jours même pour les accidents",
      "L’animal ne doit présenter aucun symptôme avant la souscription",
      "Partenariat pro soumis à acceptation (SIRET)",
    ],
    sourceDocumentLabel: "Documents contractuels Kozoo",
    sourceDocumentUrl: "https://www.kozoo.eu/",
    highlightKeys: ["age-admission", "franchise", "tele", "plafond", "carence"],
  },
];

export function getInsuranceProviders(): InsuranceProvider[] {
  return INSURANCE_PROVIDERS;
}

export function getActiveInsuranceProviders(): InsuranceProvider[] {
  return INSURANCE_PROVIDERS.filter((p) => p.active);
}

export function getProviderAffiliateUrl(
  provider: InsuranceProvider
): string | null {
  if (!provider.active) return null;
  return resolveAffiliateUrl(provider.envAffiliateKey);
}

export function canShowAffiliateButton(
  provider: InsuranceProvider
): boolean {
  return provider.active && Boolean(getProviderAffiliateUrl(provider));
}
