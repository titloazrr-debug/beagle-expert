import "server-only";

import fs from "fs";
import path from "path";
import type { FaqItem } from "@/types";
import { FAQS_DIR } from "@/lib/content/paths";

function normalizeFaqItems(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const q = (item as { question?: unknown }).question;
      const a = (item as { answer?: unknown }).answer;
      if (typeof q !== "string" || typeof a !== "string") return null;
      const question = q.trim();
      const answer = a.trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((x): x is FaqItem => Boolean(x));
}

/** Charge la FAQ d’une fiche depuis content/faqs/{slug}.json */
export function loadFaqForSlug(slug: string): FaqItem[] {
  const filePath = path.join(FAQS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return normalizeFaqItems(raw);
  } catch {
    return [];
  }
}

/**
 * Fusionne FAQ frontmatter (prioritaire) et fichier dédié.
 * Si le frontmatter fournit des items, ils remplacent le fichier.
 */
export function resolveFicheFaq(
  slug: string,
  fromFrontmatter?: FaqItem[]
): FaqItem[] {
  const fm = normalizeFaqItems(fromFrontmatter ?? []);
  if (fm.length > 0) return fm;
  return loadFaqForSlug(slug);
}
