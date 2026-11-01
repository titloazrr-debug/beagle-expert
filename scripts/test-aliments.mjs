/**
 * Contrats de la base aliments : forme, absence de dose rassurante,
 * liens internes, et URLs de sources en HTTP 200.
 *
 * ALIMENTS_SKIP_URL_CHECK=1 pour sauter le réseau.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  readFileSync(join(root, "content/aliments.json"), "utf8")
);

const VERDICTS = new Set([
  "toxique",
  "a-eviter",
  "avec-moderation",
  "sans-danger",
]);

const EXTRA_URLS = [
  "https://www.vetagro-sup.fr/recherche-expertise/centre-national-dinformations-toxicologiques-veterinaires-cnitv/",
  "https://www.centre-antipoison-animal.com/",
  "https://chuv.oniris-nantes.fr/accueil/centre-anti-poison",
];

const DOSE_PATTERNS = [
  /\d+\s*(g|mg|oz)\s*\/\s*kg/i,
  /en dessous de/i,
  /dose toxique/i,
  /sans risque en dessous/i,
  /pas de risque/i,
];

let failed = 0;
function fail(message) {
  failed += 1;
  console.error(`✗ ${message}`);
}

const aliments = catalog.aliments;
if (!Array.isArray(aliments) || aliments.length < 20 || aliments.length > 25) {
  fail(`nombre de fiches : ${aliments?.length}`);
}
if (catalog.verifiedAt !== "2026-10-31") {
  fail(`verifiedAt inattendu : ${catalog.verifiedAt}`);
}

const slugs = new Set();
const blob = JSON.stringify(catalog);
for (const pattern of DOSE_PATTERNS) {
  if (pattern.test(blob)) fail(`formulation de dose interdite : ${pattern}`);
}

const text = blob.toLowerCase();
for (const banned of ["zoomalia", "weenect", "tractive", "affiliation", "affilié"]) {
  if (text.includes(banned)) fail(`mention interdite : ${banned}`);
}

for (const aliment of aliments) {
  if (!aliment.slug || slugs.has(aliment.slug)) fail(`slug : ${aliment.slug}`);
  slugs.add(aliment.slug);
  if (!VERDICTS.has(aliment.verdict)) fail(`verdict ${aliment.slug}`);
  if (!aliment.nom || !aliment.resume || !aliment.reponse || !aliment.pourquoi) {
    fail(`champs manquants ${aliment.slug}`);
  }
  if (!aliment.signes || !aliment.apresIngestion || !aliment.question) {
    fail(`signes ou conduite ${aliment.slug}`);
  }
  if (aliment.resume.length > 220) fail(`résumé trop long ${aliment.slug}`);
  if (aliment.seo.title.length > 60) fail(`title SEO > 60 ${aliment.slug}`);
  if (aliment.seo.description.length > 160) {
    fail(`description SEO longue ${aliment.slug} (${aliment.seo.description.length})`);
  }
  if (!aliment.synonymes?.length || !aliment.formes?.length) {
    fail(`synonymes ou formes ${aliment.slug}`);
  }
  const shareable =
    aliment.verdict === "avec-moderation" || aliment.verdict === "sans-danger";
  if (shareable && !aliment.preparation) fail(`préparation ${aliment.slug}`);
  if (!shareable && aliment.preparation) fail(`préparation toxique ${aliment.slug}`);
  if (!aliment.sources?.length) fail(`sources ${aliment.slug}`);
  for (const lien of aliment.liens) {
    if (lien.href.startsWith("/fiche/")) {
      if (!["/fiche/alimentation", "/fiche/sante"].includes(lien.href)) {
        fail(`lien fiche non prévu ${aliment.slug} ${lien.href}`);
      }
    } else if (lien.href.startsWith("/aliments/")) {
      const target = lien.href.slice("/aliments/".length);
      if (!catalog.aliments.some((item) => item.slug === target)) {
        fail(`lien aliment cassé ${aliment.slug} -> ${lien.href}`);
      }
    } else {
      fail(`lien inattendu ${aliment.slug} ${lien.href}`);
    }
  }
}

const required = [
  "chocolat-noir",
  "chocolat-au-lait",
  "chocolat-blanc",
  "raisin",
  "oignon",
  "xylitol",
  "avocat",
  "noyaux",
  "os-cuits",
  "alcool",
  "cafe-et-the",
  "noix-de-macadamia",
  "melon",
  "banane",
  "pasteque",
  "tomate",
  "pomme-de-terre",
  "concombre",
  "fraise",
  "mangue",
  "figue",
  "abricot",
  "pomme",
  "carotte",
];
for (const slug of required) {
  if (!slugs.has(slug)) fail(`fiche attendue absente : ${slug}`);
}

const raisin = aliments.find((item) => item.slug === "raisin");
if (raisin?.verdict !== "toxique") fail("raisin doit être toxique");
if (!/aucune quantité/i.test(`${raisin?.resume} ${raisin?.reponse}`)) {
  fail("le raisin doit dire qu'aucune quantité n'est sûre");
}
const haystack = `${raisin?.resume} ${raisin?.reponse} ${raisin?.formes?.join(" ")}`;
if (!/raisins secs/i.test(haystack)) fail("raisins secs absents de la fiche raisin");

if (process.env.ALIMENTS_SKIP_URL_CHECK === "1") {
  console.log("URLs : skip");
} else {
  const urls = new Set(EXTRA_URLS);
  for (const aliment of aliments) {
    for (const source of aliment.sources) urls.add(source.url);
  }
  const results = await Promise.all(
    [...urls].map(async (url) => {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "BeagleExpertLinkCheck/1.0 (+https://expert-beagle.fr)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      return { url, status: response.status };
    })
  );
  for (const result of results) {
    if (result.status !== 200) {
      fail(`${result.status} ${result.url}`);
    }
  }
  console.log(`URLs vérifiées : ${results.length}`);
}

if (failed) {
  console.error(`${failed} échec(s)`);
  process.exit(1);
}
console.log(`OK — ${aliments.length} fiches aliments`);
