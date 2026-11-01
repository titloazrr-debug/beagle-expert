import { STOPWORDS, VERDICT_SEVERITY } from "./constants.js";

/**
 * Minuscules, sans accents, apostrophes et ponctuation écartées.
 * « café », « Cafe » et « CAFE » deviennent « cafe ».
 */
export function normalize(value) {
  return String(value ?? "")
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/['’ʼ`]/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function phraseMap(aliments) {
  const map = new Map();
  for (const aliment of aliments) {
    const phrases = [
      aliment.nom,
      ...(Array.isArray(aliment.synonymes) ? aliment.synonymes : []),
      ...(Array.isArray(aliment.formes) ? aliment.formes : []),
    ];
    for (const phrase of phrases) {
      if (typeof phrase !== "string") continue;
      const key = normalize(phrase);
      if (key.length < 2) continue;
      const list = map.get(key) ?? [];
      if (!list.some((item) => item.slug === aliment.slug)) list.push(aliment);
      map.set(key, list);
    }
  }
  return map;
}

function sortMatches(matches) {
  return matches.sort((a, b) => {
    const severity =
      (VERDICT_SEVERITY[a.verdict] ?? 9) - (VERDICT_SEVERITY[b.verdict] ?? 9);
    if (severity !== 0) return severity;
    return a.nom.localeCompare(b.nom, "fr");
  });
}

/**
 * Cherche un aliment par son nom, ses synonymes et ses formes fléchies.
 * Une phrase plus longue gagne sur un mot qu'elle contient (« pomme de terre »
 * plutôt que « pomme »). Si rien n'est stocké tel quel, le premier mot du nom
 * sert de repli (« chocolat » ouvre les trois chocolats).
 *
 * @returns {{ status: "empty" | "unknown" | "found" | "ambiguous", normalized: string, matches: object[] }}
 */
export function lookupFood(query, aliments) {
  const normalized = normalize(query);
  const list = Array.isArray(aliments) ? aliments : [];
  if (!normalized || list.length === 0) {
    return { status: "empty", normalized, matches: [] };
  }

  const words = normalized.split(" ");
  const phrases = phraseMap(list);
  const candidates = [];
  for (let start = 0; start < words.length; start += 1) {
    for (let end = start + 1; end <= words.length; end += 1) {
      const foods = phrases.get(words.slice(start, end).join(" "));
      if (!foods) continue;
      candidates.push({ start, end, len: end - start, foods });
    }
  }
  candidates.sort((a, b) => b.len - a.len || a.start - b.start);

  const covered = new Array(words.length).fill(false);
  const chosen = [];
  for (const candidate of candidates) {
    if (covered.slice(candidate.start, candidate.end).some(Boolean)) continue;
    for (let index = candidate.start; index < candidate.end; index += 1) {
      covered[index] = true;
    }
    chosen.push(candidate);
  }

  for (let index = 0; index < words.length; index += 1) {
    if (covered[index]) continue;
    const token = words[index];
    if (token.length < 2 || STOPWORDS.has(token)) continue;
    const foods = list.filter(
      (aliment) => normalize(aliment.nom).split(" ")[0] === token
    );
    if (foods.length === 0) continue;
    covered[index] = true;
    chosen.push({ foods });
  }

  const bySlug = new Map();
  for (const candidate of chosen) {
    for (const food of candidate.foods) bySlug.set(food.slug, food);
  }
  const matches = sortMatches([...bySlug.values()]);

  let status = "unknown";
  if (matches.length === 1) status = "found";
  else if (matches.length > 1) status = "ambiguous";
  return { status, normalized, matches };
}
