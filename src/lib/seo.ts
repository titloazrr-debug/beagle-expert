import type { Metadata } from "next";
import type { Fiche } from "@/types";
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

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: keywords?.length ? keywords : undefined,
    metadataBase: new URL(tenant.siteUrl),
    alternates: { canonical: url },
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
