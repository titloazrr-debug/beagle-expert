import { SITE_ORIGIN, UTM } from "./constants.js";

/** URL de fiche du site, sans redirection ni paramètre. */
export function isFicheUrl(url, slug) {
  if (typeof url !== "string" || !url || typeof slug !== "string" || !slug) {
    return false;
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  return (
    parsed.protocol === "https:" &&
    parsed.hostname === "expert-beagle.fr" &&
    parsed.username === "" &&
    parsed.password === "" &&
    parsed.pathname === `/aliments/${slug}` &&
    parsed.search === "" &&
    parsed.hash === ""
  );
}

export function withCampaign(url) {
  const parsed = new URL(url, SITE_ORIGIN);
  for (const key of Object.keys(UTM)) parsed.searchParams.delete(key);
  for (const [key, value] of Object.entries(UTM)) {
    parsed.searchParams.set(key, value);
  }
  return parsed.toString();
}

export function ficheUrl(aliment) {
  const fallback = `${SITE_ORIGIN}/aliments/${aliment.slug}`;
  const base = isFicheUrl(aliment.url, aliment.slug) ? aliment.url : fallback;
  return withCampaign(base);
}

export function alimentsIndexUrl() {
  return withCampaign(`${SITE_ORIGIN}/aliments`);
}
