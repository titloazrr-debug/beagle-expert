/** Textes juridiques & disclaimers (FR) */

export const MEDICAL_DISCLAIMER_FULL =
  "Les informations fournies sur ce site sont à titre informatif uniquement et ne remplacent en aucun cas l’avis d’un vétérinaire. En cas de doute sur la santé de votre animal, consultez un professionnel.";

export const MEDICAL_DISCLAIMER_SHORT =
  "Infos à titre informatif uniquement — ne remplacent pas l’avis d’un vétérinaire.";

export const QUIZ_RECO_DISCLAIMER =
  "Les recommandations (y compris produits) sont basées sur des informations générales et un questionnaire automatisé. Elles ne constituent pas un conseil vétérinaire, diététique ou comportemental personnalisé. Adaptez toujours les choix à votre animal avec un professionnel de santé animale si besoin.";

/** Disclaimer affiliation — version complète (mentions légales) */
export const AFFILIATE_DISCLAIMER_TITLE = "Transparence";

export const AFFILIATE_DISCLAIMER_FULL = [
  "Certains liens présents sur ce site sont des liens d’affiliation. Cela signifie que si vous effectuez un achat via ces liens, nous pouvons percevoir une commission, sans aucun surcoût pour vous.",
  "Cette rémunération nous aide à maintenir le site et à continuer de proposer des contenus gratuits et de qualité.",
  "Nos recommandations restent indépendantes et basées sur notre expertise.",
].join(" ");

/** Version courte (footer) */
export const AFFILIATE_DISCLAIMER_SHORT =
  "Certains liens sont affiliés : une commission peut nous être versée, sans surcoût pour vous. Nos recommandations restent indépendantes.";

/** Version encadré produit (fiches / quiz) */
export const AFFILIATE_DISCLAIMER_BOX =
  "Liens d’affiliation : un achat via ces liens peut nous rapporter une commission, sans surcoût pour vous. Cela nous aide à financer le site. Nos conseils restent indépendants et basés sur notre expertise.";

/** Fiches où le disclaimer médical est obligatoire en haut de page */
export const MEDICAL_FICHE_CATEGORIES = ["sante", "alimentation"] as const;

/** Quiz liés à la santé / nutrition */
export const MEDICAL_QUIZ_SLUGS = [
  "risque-obesite",
  "alimentation-croquettes",
  "assurance-sante-beagle",
] as const;

export function isMedicalFicheCategory(category: string): boolean {
  return (MEDICAL_FICHE_CATEGORIES as readonly string[]).includes(category);
}

export function isMedicalQuizSlug(slug: string): boolean {
  return (MEDICAL_QUIZ_SLUGS as readonly string[]).includes(slug);
}

/** Coordonnées éditeur (à personnaliser en prod) */
export const LEGAL_PUBLISHER = {
  siteName: "Beagle Expert",
  companyName: "Thierry Loiseau",
  legalForm: "Particulier (projet éditorial individuel — SASU en cours de création)",
  address: "515 route de Falgueyras, 47300 Villeneuve-sur-Lot, France",
  email: "contact@expert-beagle.fr",
  publicationDirector: "Thierry Loiseau",
  hostName: "Vercel Inc.",
  hostAddress: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  hostWebsite: "https://vercel.com",
};
