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
    "Des quiz rapides et des fiches pratiques pour mieux comprendre le Beagle et prendre soin de lui au quotidien.",
  description:
    "Mieux comprendre votre Beagle et faire les bons choix : quiz personnalisés et fiches pratiques sur la santé, l’alimentation, l’éducation et le budget.",
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
