import "server-only";

import fs from "fs";
import path from "path";
import type {
  FaqItem,
  Fiche,
  FicheCategory,
  FicheSection,
  Product,
} from "@/types";
import { FICHES_DIR } from "@/lib/content/paths";
import { getProductById, getProductsByIds } from "@/lib/content/load-products";
import { resolveFicheFaq } from "@/lib/content/load-faqs";
import { normalizeContentProduct } from "@/lib/content/product-utils";
import { parseFrontmatter } from "@/lib/content/parse-frontmatter";
import { toIsoDate, todayIsoDate } from "@/lib/seo";

interface FicheFrontmatter {
  slug: string;
  title: string;
  excerpt: string;
  intro?: string;
  /** Bloc « En résumé » (2–4 phrases), agent-first / GEO */
  summary?: string;
  category: FicheCategory;
  emoji: string;
  readingTime: number;
  keywords?: string[];
  datePublished?: string;
  dateModified?: string;
  /** Image OG spécifique (chemin public, ex. /og/sante.jpg) */
  ogImage?: string;
  seo: { title: string; description: string };
  relatedProducts?: Array<{
    id: string;
    name?: string;
    price?: string;
    reason?: string;
  }>;
  relatedQuizzes?: string[];
  relatedFiches?: string[];
  /** FAQ optionnelle en frontmatter (prioritaire sur content/faqs/) */
  faq?: FaqItem[];
  sources?: string[];
}

/** Maillage interne par défaut (si non défini dans le frontmatter). */
const DEFAULT_RELATED_FICHES: Record<string, string[]> = {
  sante: ["alimentation", "soins-entretien", "education-comportement"],
  alimentation: ["sante", "budget-equipement", "education-comportement"],
  "education-comportement": [
    "sante",
    "alimentation",
    "histoire-standard",
  ],
  "soins-entretien": ["sante", "budget-equipement", "alimentation"],
  "budget-equipement": [
    "sante",
    "alimentation",
    "education-comportement",
  ],
  "histoire-standard": [
    "education-comportement",
    "budget-equipement",
    "sante",
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}

/** Parse le corps MDX en sections structurées (titre, puces, attention, CTA). */
export function parseFicheBody(
  body: string,
  relatedProducts: Product[] = []
): FicheSection[] {
  const cleaned = body.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const parts = cleaned.split(/\n(?=## )/);
  const sections: FicheSection[] = [];

  for (const part of parts) {
    const lines = part.split("\n");
    const titleLine = lines[0]?.replace(/^##\s+/, "").trim();
    if (!titleLine) continue;

    const bullets: string[] = [];
    let attention: FicheSection["attention"];
    const ctaLines: string[] = [];
    let inAttention = false;
    let attentionTitle = "Attention";
    let attentionBuf: string[] = [];
    let inCta = false;
    let inTable = false;

    const flushAttention = () => {
      if (attentionBuf.length) {
        attention = {
          title: attentionTitle,
          text: decodeEntities(attentionBuf.join(" ").replace(/\s+/g, " ").trim()),
        };
        attentionBuf = [];
      }
      inAttention = false;
    };

    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trim();

      if (!line || line === "---") {
        if (inAttention) flushAttention();
        continue;
      }

      // Sous-titre CTA
      if (/^###\s*CTA\s*produit/i.test(line)) {
        if (inAttention) flushAttention();
        inCta = true;
        inTable = false;
        continue;
      }

      if (/^###\s+/.test(line)) {
        if (inAttention) flushAttention();
        inCta = false;
        // Ignore autres ### (ex. Checklist) → puces si listes suivent
        continue;
      }

      // Blockquote attention
      if (line.startsWith(">")) {
        inCta = false;
        const content = line.replace(/^>\s?/, "").trim();
        const titleMatch = content.match(
          /^\*\*(Attention|Bon à savoir|Point clé|Point cle)\*\*\s*(.*)$/i
        );
        if (titleMatch) {
          if (inAttention) flushAttention();
          inAttention = true;
          attentionTitle = titleMatch[1];
          if (titleMatch[2]) attentionBuf.push(titleMatch[2]);
          continue;
        }
        if (inAttention) {
          attentionBuf.push(content.replace(/^\*\*.*?\*\*\s*/, ""));
        }
        continue;
      } else if (inAttention) {
        flushAttention();
      }

      // Tableau markdown → puces "Col1 : val"
      if (line.startsWith("|")) {
        inCta = false;
        if (/^\|?\s*:?-{3,}/.test(line.replace(/\|/g, "").trim()) || line.includes("---")) {
          inTable = true;
          continue;
        }
        const cells = line
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (!cells.length) continue;
        // Skip header-looking first table row if all short labels — still useful as context
        if (!inTable) {
          inTable = true;
          // header row: store for pairing? keep as skip of pure headers
          const isHeader =
            cells.every((c) => c.length < 40) &&
            cells.some((c) => /critère|produit|taille|aspect/i.test(c));
          if (isHeader) continue;
        }
        if (cells.length >= 2) {
          const label = cells[0].replace(/\*\*/g, "");
          const value = cells.slice(1).join(" — ").replace(/\*\*/g, "");
          bullets.push(decodeEntities(`${label} : ${value}`));
        }
        continue;
      } else {
        inTable = false;
      }

      // List bullets
      if (/^[-*]\s+/.test(line)) {
        const bullet = decodeEntities(line.replace(/^[-*]\s+/, "").trim());
        if (inCta) ctaLines.push(bullet);
        else bullets.push(bullet);
        continue;
      }

      // CTA product lines: **Name** (price) — reason
      if (inCta || /^\*\*.+\*\*/.test(line)) {
        if (/^\*\*.+\*\*/.test(line)) {
          ctaLines.push(decodeEntities(line.replace(/\*\*/g, "")));
          inCta = true;
          continue;
        }
      }

      // Plain paragraph → bullet if short enough and meaningful
      if (!inCta && line.length > 20 && !line.startsWith("#")) {
        bullets.push(decodeEntities(line));
      }
    }

    if (inAttention) flushAttention();

    // Match CTA product names → productIds
    const productIds: string[] = [];
    for (const cta of ctaLines) {
      const namePart = cta.split(/[—(]/)[0]?.trim() ?? "";
      const match = relatedProducts.find(
        (p) =>
          namePart.toLowerCase().includes(p.name.toLowerCase().slice(0, 12)) ||
          p.name.toLowerCase().includes(namePart.toLowerCase().slice(0, 12))
      );
      if (match && !productIds.includes(match.id)) productIds.push(match.id);
    }

    // Limit bullets for scannability (keep tables full-ish)
    const finalBullets = bullets.filter(Boolean).slice(0, 12);
    if (!finalBullets.length && !attention && !productIds.length) continue;

    sections.push({
      id: slugify(titleLine) || `section-${sections.length + 1}`,
      title: titleLine,
      bullets: finalBullets.length
        ? finalBullets
        : attention
          ? [attention.text]
          : ["Voir le détail ci-dessous."],
      attention,
      productIds: productIds.length ? productIds : undefined,
      ctaLines: ctaLines.length ? ctaLines : undefined,
    });
  }

  return sections;
}

function readFicheFile(filePath: string): {
  fiche: Fiche;
  products: Product[];
} {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter<FicheFrontmatter>(raw);
  const fm = data;

  if (!fm.slug || !fm.title || !fm.category) {
    throw new Error(`Frontmatter incomplet: ${filePath}`);
  }

  // Résolution prioritaire via content/products.json
  const relatedIds = (fm.relatedProducts ?? []).map((p) => p.id);
  let products = getProductsByIds(relatedIds);

  // Fallback si IDs absents du catalogue
  if (products.length === 0 && relatedIds.length > 0) {
    products = (fm.relatedProducts ?? []).map((p) =>
      normalizeContentProduct({
        id: p.id,
        name: p.name ?? p.id,
        price: p.price,
        reason: p.reason,
        shortDescription: p.reason,
        tags: [fm.category],
        categories: [fm.category],
      })
    );
  }

  // Enrichit le matching section CTA avec tout le catalogue connu
  const catalogForMatch = [
    ...products,
    ...relatedIds
      .map((id) => getProductById(id))
      .filter((p): p is Product => Boolean(p)),
  ];

  const sections = parseFicheBody(content, catalogForMatch);

  const relatedFicheSlugs =
    fm.relatedFiches?.length
      ? fm.relatedFiches
      : DEFAULT_RELATED_FICHES[fm.slug] ?? [];

  const faq = resolveFicheFaq(fm.slug, fm.faq);

  // Dates réelles : frontmatter → mtime fichier → aujourd’hui
  const stats = fs.statSync(filePath);
  const fileIso = toIsoDate(stats.mtime);
  const datePublished =
    toIsoDate(fm.datePublished) ?? fileIso ?? todayIsoDate();
  const dateModified =
    toIsoDate(fm.dateModified) ?? fileIso ?? datePublished;

  const ogImage = fm.ogImage?.trim() || undefined;

  const fiche: Fiche = {
    slug: fm.slug,
    title: fm.title,
    excerpt: fm.excerpt ?? "",
    intro: fm.intro?.trim() || undefined,
    summary: fm.summary?.trim() || undefined,
    category: fm.category,
    emoji: fm.emoji ?? "🐶",
    readingTime: fm.readingTime ?? 4,
    keywords: fm.keywords ?? [],
    datePublished,
    dateModified,
    ogImage,
    seo: {
      title: fm.seo?.title ?? fm.title,
      description: fm.seo?.description ?? fm.excerpt ?? "",
    },
    sections,
    relatedProductIds: products.map((p) => p.id),
    relatedQuizSlugs: fm.relatedQuizzes ?? [],
    relatedFicheSlugs,
    faq: faq.length ? faq : undefined,
    sources: fm.sources,
  };

  return { fiche, products };
}

let cache: { fiches: Fiche[]; products: Product[] } | null = null;

export function loadAllFiches(): { fiches: Fiche[]; products: Product[] } {
  if (cache) return cache;

  if (!fs.existsSync(FICHES_DIR)) {
    cache = { fiches: [], products: [] };
    return cache;
  }

  const files = fs
    .readdirSync(FICHES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .sort();

  const fiches: Fiche[] = [];
  const products: Product[] = [];

  for (const file of files) {
    const { fiche, products: fp } = readFicheFile(path.join(FICHES_DIR, file));
    fiches.push(fiche);
    products.push(...fp);
  }

  cache = { fiches, products };
  return cache;
}

export function getAllFiches(): Fiche[] {
  return loadAllFiches().fiches;
}

export function getFicheBySlug(slug: string): Fiche | undefined {
  return getAllFiches().find((f) => f.slug === slug);
}

export function getAllFicheSlugs(): string[] {
  return getAllFiches().map((f) => f.slug);
}

export function getFicheProducts(): Product[] {
  return loadAllFiches().products;
}
