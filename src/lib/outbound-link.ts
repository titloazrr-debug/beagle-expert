import type { Product } from "@/types";

const REFERRAL_SOURCE = "expert-beagle.fr";
const REFERRAL_MEDIUM = "referral";

/** URL absente, « # », ou non navigable : rien ne doit être affiché. */
export function isMissingOutboundUrl(url?: string | null): boolean {
  const value = (url ?? "").trim();
  if (!value || value === "#") return true;
  const lower = value.toLowerCase();
  return lower === "undefined" || lower.startsWith("javascript:");
}

/**
 * Ajoute les UTM de provenance si elles ne sont pas déjà présentes.
 * Sert aux liens officiels non affiliés (pas aux liens de tracking affilié).
 */
export function withReferralUtm(url: string, campaign: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (!parsed.searchParams.has("utm_source")) {
    parsed.searchParams.set("utm_source", REFERRAL_SOURCE);
  }
  if (!parsed.searchParams.has("utm_medium")) {
    parsed.searchParams.set("utm_medium", REFERRAL_MEDIUM);
  }
  const trimmedCampaign = campaign.trim();
  if (trimmedCampaign && !parsed.searchParams.has("utm_campaign")) {
    parsed.searchParams.set("utm_campaign", trimmedCampaign);
  }
  return parsed.toString();
}

export type OutboundLink = {
  url: string;
  kind: "affiliate" | "official";
  label: string;
  rel: string;
};

/**
 * Lien sortant d'une carte produit.
 * Affilié si l'URL affiliée est réelle, sinon site officiel non affilié,
 * sinon null (aucun bouton, aucun libellé d'attente).
 */
export function resolveProductOutbound(
  product: Pick<Product, "name" | "affiliateUrl" | "officialUrl" | "ctaLabel">,
  options?: { utmCampaign?: string }
): OutboundLink | null {
  const label = product.ctaLabel?.trim();
  if (!isMissingOutboundUrl(product.affiliateUrl)) {
    return {
      url: product.affiliateUrl.trim(),
      kind: "affiliate",
      label: label || "Voir le produit",
      rel: "noopener noreferrer sponsored",
    };
  }
  if (!isMissingOutboundUrl(product.officialUrl)) {
    return {
      url: withReferralUtm(
        product.officialUrl!.trim(),
        options?.utmCampaign?.trim() || "site"
      ),
      kind: "official",
      label: label || `Voir sur le site ${product.name}`,
      rel: "noopener noreferrer",
    };
  }
  return null;
}

/** Campagne UTM déduite du chemin de page (`/fiche/alimentation` → `fiche-alimentation`). */
export function referralCampaignFromPath(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return "site";
  const path = pathOrUrl.startsWith("http")
    ? (() => {
        try {
          return new URL(pathOrUrl).pathname;
        } catch {
          return pathOrUrl;
        }
      })()
    : pathOrUrl;
  const fiche = path.match(/\/fiche\/([^/]+)/);
  if (fiche) return `fiche-${fiche[1]}`;
  const quiz = path.match(/\/quiz\/([^/]+)/);
  if (quiz) return `quiz-${quiz[1]}`;
  return "site";
}
