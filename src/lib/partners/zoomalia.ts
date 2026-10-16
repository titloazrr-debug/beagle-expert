/**
 * Zoomalia via Affilae — Beagle Expert.
 * Le paramètre lp reçoit l'URL produit encodée (lien profond).
 * La base vient de NEXT_PUBLIC_ZOOMALIA_TRACKING si elle est définie,
 * sinon du lien de tracking validé sur le programme.
 */

export const ZOOMALIA_TRACKING_DEFAULT =
  "https://lb.affilae.com/r/?p=6556375b1aebef1e00d5caf5&af=614";

const UTM = "utm_source=ae&utm_medium=ae&utm_campaign=beagle-expert";

export function zoomaliaTrackingBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_ZOOMALIA_TRACKING?.trim();
  return fromEnv || ZOOMALIA_TRACKING_DEFAULT;
}

/** Lien affilié vers un chemin Zoomalia ou une URL produit complète. */
export function zoomaliaLink(target: string): string {
  const trimmed = target.trim();
  if (!trimmed || trimmed === "#") return "#";
  if (trimmed.includes("affilae.com/r/")) return trimmed;

  const url = trimmed.startsWith("http")
    ? trimmed
    : `https://www.zoomalia.com${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;

  const withUtm = `${url}${url.includes("?") ? "&" : "?"}${UTM}`;
  const base = zoomaliaTrackingBase();
  if (!base) return withUtm;
  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}lp=${encodeURIComponent(withUtm)}`;
}

export function isZoomaliaDestination(url?: string): boolean {
  if (!url || url === "#") return false;
  if (url.startsWith("/animalerie/")) return true;
  try {
    const host = new URL(url).hostname;
    return host === "zoomalia.com" || host === "www.zoomalia.com";
  } catch {
    return false;
  }
}
