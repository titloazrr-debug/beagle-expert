import { VERDICTS } from "./constants.js";
import { isFicheUrl } from "./links.js";

function stringList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim());
}

export function adaptAliment(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("aliment illisible");
  }
  if (typeof raw.slug !== "string" || !raw.slug.trim()) {
    throw new Error("slug manquant");
  }
  if (typeof raw.nom !== "string" || !raw.nom.trim()) {
    throw new Error(`nom manquant : ${raw.slug}`);
  }
  if (!VERDICTS.has(raw.verdict)) {
    throw new Error(`verdict invalide : ${raw.slug}`);
  }
  if (typeof raw.resume !== "string" || !raw.resume.trim()) {
    throw new Error(`résumé manquant : ${raw.slug}`);
  }
  return {
    slug: raw.slug.trim(),
    nom: raw.nom.trim(),
    synonymes: stringList(raw.synonymes),
    formes: stringList(raw.formes),
    verdict: raw.verdict,
    resume: raw.resume.trim(),
    emoji: typeof raw.emoji === "string" ? raw.emoji : "",
    url: typeof raw.url === "string" ? raw.url : "",
  };
}

export function adaptCatalog(raw) {
  if (!raw || !Array.isArray(raw.aliments) || raw.aliments.length === 0) {
    throw new Error("catalogue aliments illisible");
  }
  return {
    verifiedAt: typeof raw.verifiedAt === "string" ? raw.verifiedAt : "",
    aliments: raw.aliments.map(adaptAliment),
  };
}

/**
 * N'accepte la liste publique que si chaque fiche pointe vers
 * expert-beagle.fr et que le verdict fait partie de l'échelle connue.
 * Retourne une copie réduite, ou null.
 */
export function validateRemote(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.verifiedAt || "")) return null;
  if (!Array.isArray(raw.aliments)) return null;
  if (raw.aliments.length < 10 || raw.aliments.length > 80) return null;

  const aliments = [];
  const slugs = new Set();
  for (const item of raw.aliments) {
    let adapted;
    try {
      adapted = adaptAliment(item);
    } catch {
      return null;
    }
    if (!/^[a-z0-9-]{1,80}$/.test(adapted.slug)) return null;
    if (slugs.has(adapted.slug)) return null;
    slugs.add(adapted.slug);
    if (adapted.nom.length > 80 || adapted.resume.length > 300) return null;
    if (/https?:/i.test(adapted.nom) || /https?:/i.test(adapted.resume)) {
      return null;
    }
    if (!isFicheUrl(item.url, adapted.slug)) return null;
    adapted.url = `https://expert-beagle.fr/aliments/${adapted.slug}`;
    aliments.push(adapted);
  }
  return { verifiedAt: raw.verifiedAt, aliments };
}

/**
 * La copie embarquée gagne si le fichier distant est absent, invalide,
 * ou plus ancien. À date égale, la liste du site est retenue.
 */
export function chooseCatalog(embeddedRaw, remoteRaw) {
  const embedded = adaptCatalog(embeddedRaw);
  const remote = remoteRaw ? validateRemote(remoteRaw) : null;
  if (!remote || remote.verifiedAt < embedded.verifiedAt) {
    return {
      source: "embedded",
      verifiedAt: embedded.verifiedAt,
      aliments: embedded.aliments,
    };
  }
  return {
    source: "remote",
    verifiedAt: remote.verifiedAt,
    aliments: remote.aliments,
  };
}
