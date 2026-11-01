import type { MetadataRoute } from "next";
import { getAllFiches, getAllFicheSlugs } from "@/data/fiches";
import { getAllQuizSlugs } from "@/data/quizzes";
import { absoluteUrl } from "@/lib/seo";

/** Priorités SEO par thème de fiche (pages piliers). */
const FICHE_PRIORITY: Record<string, number> = {
  sante: 0.9,
  alimentation: 0.9,
  "education-comportement": 0.9,
  "solitude-aboiements-destruction": 0.9,
  "soins-entretien": 0.85,
  "budget-equipement": 0.85,
  "histoire-standard": 0.8,
  "esperance-de-vie": 0.95,
  "assurance-chien-beagle": 0.9,
  "collier-gps-beagle": 0.95,
};

/**
 * Dernière modification réelle du contenu (pas la date de déploiement).
 * À changer seulement quand le texte de la page change.
 * Dates = dernier commit de contenu de chaque page, au format AAAA-MM-JJ.
 */
const STATIC_LASTMOD: Record<string, string> = {
  "/": "2026-10-19",
  "/par-ou-commencer": "2026-10-19",
  "/fiches": "2026-08-06",
  "/quizzes": "2026-10-19",
  "/mentions-legales": "2026-08-07",
  "/politique-de-confidentialite": "2026-08-06",
  "/a-propos": "2026-10-31",
  "/methodologie": "2026-08-10",
};

const QUIZ_LASTMOD: Record<string, string> = {
  "alimentation-croquettes": "2026-08-06",
  "assurance-sante-beagle": "2026-08-06",
  "collier-gps": "2026-10-31",
  "harnais-beagle": "2026-10-31",
  "jouets-occupation": "2026-10-31",
  "pret-a-adopter": "2026-10-31",
  "risque-obesite": "2026-10-19",
};

/** Midi UTC : le jour calendaire reste le même quel que soit le fuseau. */
function contentDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00.000Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const allFiches = getAllFiches();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: contentDate(STATIC_LASTMOD["/"]),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/par-ou-commencer"),
      lastModified: contentDate(STATIC_LASTMOD["/par-ou-commencer"]),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/fiches"),
      lastModified: contentDate(STATIC_LASTMOD["/fiches"]),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/quizzes"),
      lastModified: contentDate(STATIC_LASTMOD["/quizzes"]),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/mentions-legales"),
      lastModified: contentDate(STATIC_LASTMOD["/mentions-legales"]),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/politique-de-confidentialite"),
      lastModified: contentDate(STATIC_LASTMOD["/politique-de-confidentialite"]),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/a-propos"),
      lastModified: contentDate(STATIC_LASTMOD["/a-propos"]),
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: absoluteUrl("/methodologie"),
      lastModified: contentDate(STATIC_LASTMOD["/methodologie"]),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const ficheRoutes: MetadataRoute.Sitemap = allFiches.map((fiche) => {
    const lastMod = fiche.dateModified || fiche.datePublished;
    return {
      url: absoluteUrl(`/fiche/${fiche.slug}`),
      lastModified: lastMod ? new Date(lastMod) : now,
      changeFrequency: "monthly" as const,
      priority: FICHE_PRIORITY[fiche.slug] ?? 0.85,
    };
  });

  // Garantit l’inclusion même si une fiche n’a pas de metadata date
  const known = new Set(allFiches.map((f) => f.slug));
  for (const slug of getAllFicheSlugs()) {
    if (!known.has(slug)) {
      ficheRoutes.push({
        url: absoluteUrl(`/fiche/${slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: FICHE_PRIORITY[slug] ?? 0.85,
      });
    }
  }

  const quizRoutes: MetadataRoute.Sitemap = getAllQuizSlugs().map((slug) => {
    const iso = QUIZ_LASTMOD[slug];
    if (!iso) {
      throw new Error(
        `sitemap: date fixe manquante pour le quiz « ${slug} ». Ajoutez-la dans QUIZ_LASTMOD quand le quiz est créé, et ne la changez que si son contenu change.`
      );
    }
    return {
      url: absoluteUrl(`/quiz/${slug}`),
      lastModified: contentDate(iso),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    };
  });

  return [...staticRoutes, ...ficheRoutes, ...quizRoutes];
}
