import type { MetadataRoute } from "next";
import { getAllFiches, getAllFicheSlugs } from "@/data/fiches";
import { getAllQuizSlugs } from "@/data/quizzes";
import { absoluteUrl } from "@/lib/seo";

/** Priorités SEO par thème de fiche (pages piliers). */
const FICHE_PRIORITY: Record<string, number> = {
  sante: 0.9,
  alimentation: 0.9,
  "education-comportement": 0.9,
  "soins-entretien": 0.85,
  "budget-equipement": 0.85,
  "histoire-standard": 0.8,
  "esperance-de-vie": 0.95,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const allFiches = getAllFiches();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/par-ou-commencer"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/fiches"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/quizzes"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/mentions-legales"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/politique-de-confidentialite"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/a-propos"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: absoluteUrl("/methodologie"),
      lastModified: now,
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

  const quizRoutes: MetadataRoute.Sitemap = getAllQuizSlugs().map((slug) => ({
    url: absoluteUrl(`/quiz/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...ficheRoutes, ...quizRoutes];
}
