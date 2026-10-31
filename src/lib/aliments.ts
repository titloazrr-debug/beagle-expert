import "server-only";

import fs from "fs";
import path from "path";
import { CONTENT_ROOT } from "@/lib/content/paths";
import { absoluteUrl } from "@/lib/seo";
import {
  isAlimentVerdict,
  VERDICT_LABEL,
  type Aliment,
  type AlimentVerdict,
  type AlimentsCatalog,
} from "@/lib/aliments-shared";

const FILE = path.join(CONTENT_ROOT, "aliments.json");

let cache: AlimentsCatalog | null = null;

function assertCatalog(data: AlimentsCatalog): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.verifiedAt)) {
    throw new Error("content/aliments.json : verifiedAt invalide");
  }
  if (!Array.isArray(data.aliments) || data.aliments.length < 20 || data.aliments.length > 25) {
    throw new Error(
      `content/aliments.json : ${data.aliments?.length ?? 0} fiches (attendu 20 à 25)`
    );
  }

  const slugs = new Set<string>();
  for (const aliment of data.aliments) {
    if (!aliment.slug || slugs.has(aliment.slug)) {
      throw new Error(`slug aliments en double ou vide : ${aliment.slug}`);
    }
    slugs.add(aliment.slug);
    if (!isAlimentVerdict(aliment.verdict)) {
      throw new Error(`verdict invalide : ${aliment.slug}`);
    }
    if (!aliment.resume || aliment.resume.length > 240) {
      throw new Error(`résumé manquant ou trop long : ${aliment.slug}`);
    }
    if (!aliment.sources?.length) {
      throw new Error(`sources manquantes : ${aliment.slug}`);
    }
    const shareable =
      aliment.verdict === "avec-moderation" || aliment.verdict === "sans-danger";
    if (shareable && !aliment.preparation) {
      throw new Error(`préparation manquante : ${aliment.slug}`);
    }
    if (!shareable && aliment.preparation) {
      throw new Error(`préparation interdite pour ${aliment.verdict} : ${aliment.slug}`);
    }
    for (const source of aliment.sources) {
      if (!source.url.startsWith("https://")) {
        throw new Error(`source non https : ${aliment.slug}`);
      }
    }
  }
}

export function getAlimentsCatalog(): AlimentsCatalog {
  if (cache) return cache;
  const parsed = JSON.parse(fs.readFileSync(FILE, "utf8")) as AlimentsCatalog;
  assertCatalog(parsed);
  cache = parsed;
  return parsed;
}

export function getAllAliments(): Aliment[] {
  return getAlimentsCatalog().aliments;
}

export function getAlimentBySlug(slug: string): Aliment | undefined {
  return getAllAliments().find((aliment) => aliment.slug === slug);
}

export function getAllAlimentSlugs(): string[] {
  return getAllAliments().map((aliment) => aliment.slug);
}

export function getAlimentsVerifiedAt(): string {
  return getAlimentsCatalog().verifiedAt;
}

export interface AlimentIndexEntry {
  slug: string;
  nom: string;
  synonymes: string[];
  formes: string[];
  verdict: AlimentVerdict;
  verdictLabel: string;
  resume: string;
  url: string;
}

/** Même source que les pages, format consommé par l'extension. */
export function getAlimentsIndex(): {
  verifiedAt: string;
  aliments: AlimentIndexEntry[];
} {
  const catalog = getAlimentsCatalog();
  return {
    verifiedAt: catalog.verifiedAt,
    aliments: catalog.aliments.map((aliment) => ({
      slug: aliment.slug,
      nom: aliment.nom,
      synonymes: aliment.synonymes,
      formes: aliment.formes,
      verdict: aliment.verdict,
      verdictLabel: VERDICT_LABEL[aliment.verdict],
      resume: aliment.resume,
      url: absoluteUrl(`/aliments/${aliment.slug}`),
    })),
  };
}
