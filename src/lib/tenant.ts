import type { TenantConfig } from "@/types";

/** Domaine public canonique (sitemap, robots, canonical, JSON-LD). */
export const CANONICAL_SITE_URL = "https://expert-beagle.fr";

/**
 * URL publique du site.
 * - Priorité à NEXT_PUBLIC_SITE_URL si c’est un vrai domaine custom
 * - Ignore les URLs *.vercel.app (preview / ancien domaine) pour ne pas
 *   polluer sitemap & SEO avec beagle-expert.vercel.app
 */
export function resolveSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "");
  if (!raw) return CANONICAL_SITE_URL;

  try {
    const host = new URL(raw).hostname.toLowerCase();
    if (host.endsWith(".vercel.app") || host === "localhost" || host === "127.0.0.1") {
      return CANONICAL_SITE_URL;
    }
    return raw.startsWith("http") ? raw : `https://${raw}`;
  } catch {
    return CANONICAL_SITE_URL;
  }
}

/**
 * Config multi-tenant.
 * Pour cloner une autre race : dupliquer ce fichier / charger selon NEXT_PUBLIC_TENANT.
 */
export const tenant: TenantConfig = {
  id: "beagle",
  name: "Beagle Expert",
  breed: "Beagle",
  breedPlural: "Beagles",
  tagline:
    "Flair, fugue, santé, budget : quiz et fiches pour sécuriser le quotidien d’un Beagle de piste.",
  description:
    "Guide Beagle centré sur la fugue, le rappel et les bons équipements (GPS, harnais), plus santé, alimentation et budget — quiz personnalisés et fiches claires.",
  siteUrl: resolveSiteUrl(),
  locale: "fr-FR",
  chatbot: {
    enabled: true,
    provider: "aminos",
    // Remplacer par l'URL de script Aminos.ai une fois le compte créé
    scriptUrl: process.env.NEXT_PUBLIC_AMINOS_SCRIPT_URL,
  },
  social: {
    twitter: "@BeagleExpert",
  },
};

export function getTenant(): TenantConfig {
  return tenant;
}
