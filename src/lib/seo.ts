import type { Metadata } from "next";
import type { Fiche, Product } from "@/types";
import {
  getDefaultOgImage,
  getFicheOgImageSrc,
} from "@/lib/beagle-images";
import { getTenant } from "@/lib/tenant";

const tenant = getTenant();

/** Image Open Graph par défaut (1200×630) — public/images/beagle/og-default.jpg */
export const DEFAULT_OG_IMAGE = getDefaultOgImage().src;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Locale Open Graph (underscore) */
function ogLocale(locale: string): string {
  return locale.replace("-", "_");
}

export function absoluteUrl(path = ""): string {
  const base = tenant.siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return path ? `${base}${p}` : base;
}

/**
 * Résout une image OG relative ou absolue.
 * Fallback systématique sur /images/beagle/og-default.jpg.
 */
export function resolveOgImage(image?: string | null): string {
  const raw = (image ?? "").trim();
  if (!raw) return absoluteUrl(DEFAULT_OG_IMAGE);
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return absoluteUrl(raw.startsWith("/") ? raw : `/${raw}`);
}

/** ISO date (YYYY-MM-DD) pour aujourd’hui (fuseau local serveur). */
export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Normalise une date frontmatter ou file mtime en YYYY-MM-DD. */
export function toIsoDate(value?: string | Date | null): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    return value.toISOString().slice(0, 10);
  }
  const s = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const parsed = new Date(s);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

export function brandTitle(title: string): string {
  if (title === tenant.name) return title;
  if (title.includes(tenant.name)) return title;
  return `${title} | ${tenant.name}`;
}

/** Tronque une meta description sans couper un mot (cible SEO ~155). */
export function clampMetaDescription(
  text: string,
  max = 155
): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;
  return `${base.replace(/[.,;:\-–—\s]+$/, "")}…`;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path?: string;
  /** Chemin public (/images/beagle/…) ou URL absolue */
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = brandTitle(title);
  const metaDescription = clampMetaDescription(description);
  const ogImageUrl = resolveOgImage(image);
  const locale = ogLocale(tenant.locale);

  const ogImages = [
    {
      url: ogImageUrl,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: fullTitle,
      type: "image/jpeg" as const,
    },
  ];

  const googleVerification =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
    process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: keywords?.length ? keywords : undefined,
    metadataBase: new URL(tenant.siteUrl),
    alternates: { canonical: url },
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url,
      siteName: tenant.name,
      locale,
      type,
      images: ogImages,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            authors: [tenant.name],
            section: tenant.breed,
            tags: keywords,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      site: tenant.social?.twitter,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Metadata dédiée aux fiches races (Article). */
export function buildFicheMetadata(fiche: Fiche): Metadata {
  const path = `/fiche/${fiche.slug}`;
  const keywords = Array.from(
    new Set([
      ...(fiche.keywords ?? []),
      `${tenant.breed}`,
      `fiche ${fiche.category} ${tenant.breed}`,
      `guide ${tenant.breed}`,
    ])
  );

  const published =
    toIsoDate(fiche.datePublished) ?? todayIsoDate();
  const modified =
    toIsoDate(fiche.dateModified) ?? published;

  return buildMetadata({
    title: fiche.seo.title,
    description: fiche.seo.description,
    path,
    image: getFicheOgImageSrc({
      slug: fiche.slug,
      category: fiche.category,
      ogImage: fiche.ogImage,
    }),
    keywords,
    type: "article",
    publishedTime: published,
    modifiedTime: modified,
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: tenant.name,
    description: tenant.description,
    url: tenant.siteUrl,
    inLanguage: "fr-FR",
    about: {
      "@type": "Thing",
      name: `Chien de race ${tenant.breed}`,
    },
    publisher: {
      "@type": "Organization",
      name: tenant.name,
      url: tenant.siteUrl,
      description: tenant.description,
    },
    hasPart: [
      {
        "@type": "AboutPage",
        name: "Méthodologie et sources",
        url: absoluteUrl("/methodologie"),
      },
      {
        "@type": "AboutPage",
        name: `À propos de ${tenant.name}`,
        url: absoluteUrl("/a-propos"),
      },
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: `${tenant.siteUrl}/fiches?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  keywords,
  image,
}: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
  image?: string;
}) {
  const url = absoluteUrl(path);
  const published = toIsoDate(datePublished) ?? todayIsoDate();
  const modified = toIsoDate(dateModified) ?? published;
  const imageUrl = resolveOgImage(image);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: clampMetaDescription(description, 300),
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: published,
    dateModified: modified,
    inLanguage: "fr-FR",
    keywords: keywords?.join(", "),
    image: [imageUrl],
    author: {
      "@type": "Organization",
      name: tenant.name,
      url: tenant.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: tenant.name,
      url: tenant.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-beagle.svg"),
      },
    },
    about: {
      "@type": "Thing",
      name: `Chien de race ${tenant.breed}`,
    },
    isPartOf: {
      "@type": "WebSite",
      name: tenant.name,
      url: tenant.siteUrl,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-agent-summary]", "h1"],
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function quizJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: title,
    description,
    url: absoluteUrl(path),
    educationalLevel: "beginner",
    inLanguage: "fr-FR",
    about: tenant.breed,
  };
}

/** Schema FAQPage (à combiner avec Article via un 2ᵉ script JSON-LD). */
export function faqPageJsonLd(
  items: { question: string; answer: string }[]
) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function hasUsableProductUrl(url?: string | null): boolean {
  const u = (url ?? "").trim();
  return Boolean(u && u !== "#" && !u.toLowerCase().startsWith("javascript:"));
}

/**
 * Schema Product — pour citabilité agents / rich results.
 * Offre uniquement si une URL d’achat réelle est disponible (pas de "#").
 */
export function productJsonLd(
  product: Product,
  options?: { position?: number; url?: string }
): Record<string, unknown> {
  const description = clampMetaDescription(
    product.recommendation || product.shortDescription || product.name,
    300
  );
  const data: Record<string, unknown> = {
    "@type": "Product",
    "@id": absoluteUrl(`/produits#${product.id}`),
    name: product.name,
    description,
    category: product.category || product.categories?.[0] || "Animalier",
    sku: product.id,
  };

  const extraProps: Record<string, unknown>[] = [];
  if (product.bestFor) {
    extraProps.push({
      "@type": "PropertyValue",
      name: "Public cible",
      value: product.bestFor,
    });
  }
  if (product.advantages?.length) {
    extraProps.push({
      "@type": "PropertyValue",
      name: "Avantages",
      value: product.advantages.join(" · "),
    });
  }
  if (product.disadvantages?.length) {
    extraProps.push({
      "@type": "PropertyValue",
      name: "Points de vigilance",
      value: product.disadvantages.join(" · "),
    });
  }
  if (extraProps.length) {
    data.additionalProperty = extraProps;
  }

  if (hasUsableProductUrl(product.affiliateUrl)) {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      url: product.affiliateUrl,
      priceCurrency: product.currency ?? "EUR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: tenant.name,
      },
    };
    if (product.priceCents > 0) {
      offer.price = (product.priceCents / 100).toFixed(2);
    } else if (product.priceLabel) {
      offer.priceSpecification = {
        "@type": "PriceSpecification",
        priceCurrency: product.currency ?? "EUR",
        description: product.priceLabel,
      };
    }
    data.offers = offer;
  } else if (product.priceLabel) {
    data.offers = {
      "@type": "Offer",
      priceCurrency: product.currency ?? "EUR",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: product.currency ?? "EUR",
        description: product.priceLabel,
      },
      availability: "https://schema.org/PreOrder",
      description: "Lien marchand en cours de finalisation",
    };
  }

  if (options?.url) {
    data.url = options.url;
  }
  if (options?.position != null) {
    data.position = options.position;
  }

  return data;
}

/** ItemList de produits recommandés (fiche, quiz). */
export function productItemListJsonLd({
  name,
  description,
  path,
  products,
}: {
  name: string;
  description?: string;
  path: string;
  products: Product[];
}): Record<string, unknown> | null {
  if (!products.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description:
      description ||
      `Sélection de produits recommandés pour le ${tenant.breed} sur ${tenant.name}.`,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      item: productJsonLd(product, {
        position: index + 1,
        url: absoluteUrl(path),
      }),
    })),
  };
}

/** Page À propos / Méthodologie — autorité éditoriale pour agents. */
export function aboutPageJsonLd({
  path = "/methodologie",
  name,
  description,
}: {
  path?: string;
  name?: string;
  description?: string;
} = {}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: name ?? `Méthodologie et sources — ${tenant.name}`,
    description:
      description ??
      `Comment ${tenant.name} rédige ses fiches et quiz sur le ${tenant.breed} : sources, critères de recommandation, limites et transparence d’affiliation.`,
    url,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      name: tenant.name,
      url: tenant.siteUrl,
    },
    about: {
      "@type": "Thing",
      name: `Chien de race ${tenant.breed}`,
    },
    publisher: {
      "@type": "Organization",
      name: tenant.name,
      url: tenant.siteUrl,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-agent-summary]", "h1", "h2"],
    },
  };
}

/** Enrichit Article avec zones speakable (résumé agent-first). */
export function withSpeakableArticle(
  article: Record<string, unknown>
): Record<string, unknown> {
  return {
    ...article,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-agent-summary]", "h1"],
    },
  };
}
