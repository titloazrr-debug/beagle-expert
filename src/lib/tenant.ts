import type { TenantConfig } from "@/types";

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
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://beagle-expert.fr",
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
