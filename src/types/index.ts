/** Types multi-tenant ready — clone pour une autre race en changeant le tenant. */

export type TenantId = "beagle" | string;

export interface TenantConfig {
  id: TenantId;
  name: string;
  breed: string;
  breedPlural: string;
  tagline: string;
  description: string;
  siteUrl: string;
  locale: string;
  theme?: {
    primary?: string;
    accent?: string;
  };
  chatbot?: {
    enabled: boolean;
    scriptUrl?: string;
    provider?: "aminos" | "custom";
  };
  social?: {
    twitter?: string;
  };
}

export type FicheCategory =
  | "sante"
  | "alimentation"
  | "education"
  | "soins"
  | "budget"
  | "histoire";

export interface FicheSection {
  id: string;
  title: string;
  bullets: string[];
  attention?: {
    title?: string;
    text: string;
  };
  productIds?: string[];
  /** Lignes CTA produit brutes (si non résolues en productIds) */
  ctaLines?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Fiche {
  slug: string;
  title: string;
  excerpt: string;
  /** Intro SEO / accroche sous le H1 (optionnelle) */
  intro?: string;
  /**
   * Bloc « En résumé » agent-first (2–4 phrases factuelles).
   * Affiché juste sous le H1 pour extraction GEO / agents IA.
   */
  summary?: string;
  category: FicheCategory;
  emoji: string;
  readingTime: number;
  keywords?: string[];
  datePublished?: string;
  dateModified?: string;
  /** Image Open Graph spécifique (ex. /og/sante.jpg), sinon défaut site */
  ogImage?: string;
  seo: {
    title: string;
    description: string;
  };
  sections: FicheSection[];
  relatedProductIds?: string[];
  relatedQuizSlugs?: string[];
  /** Liens internes vers d’autres fiches */
  relatedFicheSlugs?: string[];
  /** FAQ (content/faqs/{slug}.json ou frontmatter) */
  faq?: FaqItem[];
  sources?: string[];
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  /** Texte expert de recommandation (affiliation) */
  recommendation?: string;
  /** Catégorie métier (croquettes, gps, assurance…) */
  category?: string;
  /** Prix en centimes (approx. si fourchette) */
  priceCents: number;
  /** Affichage libre (ex. "40-50€ + abo 5-10€/mois") */
  priceLabel?: string;
  currency?: string;
  affiliateUrl: string;
  imageEmoji: string;
  badge?: string;
  /** Code promo partenaire (ex. BEAGLEEXPERT) */
  promoCode?: string;
  /** Libellé promo court (ex. −40 % sur le boîtier) */
  promoLabel?: string;
  tags: string[];
  categories: string[];
  /** Points forts (3–5) pour aide à la décision */
  advantages?: string[];
  /** Limites / points de vigilance (2–4) */
  disadvantages?: string[];
  /** Pour qui ce produit est le plus adapté */
  bestFor?: string;
  /** Note globale sur 5 (subjective, cohérente) */
  rating?: number;
}

export interface ComparisonSide {
  /** ID catalogue si le produit est affilié / référencé */
  productId?: string;
  name: string;
  tagline?: string;
  imageEmoji?: string;
  points: string[];
}

export interface ProductComparison {
  id: string;
  title: string;
  category: string;
  emoji: string;
  intro: string;
  /** Fiches où afficher ce comparatif */
  ficheSlugs: string[];
  left: ComparisonSide;
  right: ComparisonSide;
  verdict: string;
  disclaimer?: string;
}

/** ——— Tableau comparatif interactif (critères × produits) ——— */

export interface ComparisonTableProduct {
  id: string;
  name: string;
  emoji: string;
  badge?: string;
  /** Recommandation globale Beagle Expert */
  recommended?: boolean;
  affiliateUrl: string;
  priceLabel: string;
  /** Valeurs affichées par clé de critère */
  criteria: Record<string, string | number | boolean>;
}

export interface ComparisonCriterionMeta {
  key: string;
  label: string;
  /** Id produit gagnant pour ce critère (absent = égalité) */
  winnerId?: string;
  /** Détail optionnel (ligne extensible) */
  detail?: string;
}

export interface ComparisonCategory {
  id: string;
  label: string;
  criteria: ComparisonCriterionMeta[];
}

export interface ComparisonTableSpec {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  products: ComparisonTableProduct[];
  categories: ComparisonCategory[];
  verdict?: string;
  disclaimer?: string;
  /** Fiches où afficher ce tableau */
  ficheSlugs: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  scores: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  helper?: string;
  /** single (défaut) ou multi-sélection */
  type?: "single" | "multi";
  options: QuizOption[];
}

export interface QuizResultProfile {
  id: string;
  title: string;
  description: string;
  tags: string[];
  minScore?: number;
  productIds: string[];
  reasons: string[];
}

export interface Quiz {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  estimatedMinutes: number;
  seo: {
    title: string;
    description: string;
  };
  questions: QuizQuestion[];
  results: QuizResultProfile[];
  mode: "profile" | "product-score";
  ctaLabel?: string;
  /** Produits embarqués depuis le JSON content/quizzes */
  productCatalog?: Product[];
}

/** Race alternative (placeholder multi-tenant / multi-races) */
export interface AlternativeBreed {
  id: string;
  name: string;
  emoji: string;
  justification: string;
  href: string;
}
