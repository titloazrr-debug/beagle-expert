import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { chooseCatalog, validateRemote } from "./catalog.js";
import {
  EMERGENCY_MESSAGE,
  POISON_CENTERS,
  UNKNOWN_BODY,
  UNKNOWN_TITLE,
  formatVerifiedAt,
} from "./constants.js";
import { alimentsIndexUrl, ficheUrl } from "./links.js";
import { lookupFood, normalize } from "./match.js";

const extensionRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(extensionRoot, "..");
const catalog = JSON.parse(
  readFileSync(join(repoRoot, "content/aliments.json"), "utf8")
);
const aliments = catalog.aliments;

function slugs(query) {
  return lookupFood(query, aliments).matches.map((item) => item.slug);
}

describe("normalize", () => {
  it("ignore la casse et les accents", () => {
    assert.equal(normalize("  CAFÉ  "), "cafe");
    assert.equal(normalize("L'oignon"), "l oignon");
    assert.equal(normalize("chocolat à 70 %"), "chocolat a 70");
  });
});

describe("lookupFood", () => {
  it("reconnaît le raisin, ses formes et une phrase", () => {
    assert.deepEqual(slugs("raisin"), ["raisin"]);
    assert.deepEqual(slugs("RAISINS"), ["raisin"]);
    assert.deepEqual(slugs("raisins secs"), ["raisin"]);
    assert.deepEqual(slugs("mon chien a mangé du raisin"), ["raisin"]);
  });

  it("reconnaît la carotte", () => {
    const result = lookupFood("carotte", aliments);
    assert.equal(result.status, "found");
    assert.equal(result.matches[0].verdict, "sans-danger");
    assert.deepEqual(slugs("Carottes"), ["carotte"]);
    assert.deepEqual(slugs("de la carotte"), ["carotte"]);
  });

  it("distingue la pomme de la pomme de terre", () => {
    assert.deepEqual(slugs("pomme"), ["pomme"]);
    assert.deepEqual(slugs("une pomme"), ["pomme"]);
    assert.deepEqual(slugs("pomme de terre"), ["pomme-de-terre"]);
    assert.deepEqual(slugs("pommes de terre"), ["pomme-de-terre"]);
    assert.deepEqual(slugs("patate"), ["pomme-de-terre"]);
  });

  it("ouvre les trois chocolats si le mot est seul", () => {
    const result = lookupFood("chocolat", aliments);
    assert.equal(result.status, "ambiguous");
    assert.deepEqual(slugs("chocolat"), [
      "chocolat-au-lait",
      "chocolat-noir",
      "chocolat-blanc",
    ]);
    assert.ok(result.matches.some((item) => item.verdict === "toxique"));
    assert.deepEqual(slugs("chocolat noir"), ["chocolat-noir"]);
    assert.deepEqual(slugs("du chocolat au lait"), ["chocolat-au-lait"]);
    assert.deepEqual(slugs("chocolat à 70 %"), ["chocolat-noir"]);
    assert.deepEqual(slugs("white chocolate"), ["chocolat-blanc"]);
  });

  it("ignore les accents sur le café et le thé", () => {
    assert.deepEqual(slugs("café"), ["cafe-et-the"]);
    assert.deepEqual(slugs("cafe"), ["cafe-et-the"]);
    assert.deepEqual(slugs("thé"), ["cafe-et-the"]);
  });

  it("retrouve l'ail dans la fiche oignon et le xylitol", () => {
    assert.deepEqual(slugs("ail"), ["oignon"]);
    assert.deepEqual(slugs("poireaux"), ["oignon"]);
    assert.deepEqual(slugs("xylitol"), ["xylitol"]);
    assert.deepEqual(slugs("macadamia"), ["noix-de-macadamia"]);
  });

  it("signale une forme partagée par deux fiches", () => {
    const result = lookupFood("noyau d'abricot", aliments);
    assert.equal(result.status, "ambiguous");
    assert.deepEqual(slugs("noyau d'abricot"), ["noyaux", "abricot"]);
  });

  it("ne devine pas un aliment absent, et ne le classe pas", () => {
    for (const query of ["fromage", "pain", "poulet", "sucre", "eau", "terre"]) {
      const result = lookupFood(query, aliments);
      assert.equal(result.status, "unknown", query);
      assert.deepEqual(result.matches, []);
    }
    assert.equal(lookupFood("mon chien a mangé", aliments).status, "unknown");
    assert.equal(lookupFood("   ", aliments).status, "empty");
    assert.equal(lookupFood("", aliments).status, "empty");
  });

  it("retrouve chaque nom, synonyme et forme de la base", () => {
    for (const aliment of aliments) {
      for (const phrase of [aliment.nom, ...aliment.synonymes, ...aliment.formes]) {
        const hit = lookupFood(phrase, aliments);
        assert.ok(
          hit.matches.some((item) => item.slug === aliment.slug),
          `${aliment.slug} ← ${phrase}`
        );
      }
    }
  });
});

describe("liens et catalogue", () => {
  it("ajoute le suivi de campagne sur la fiche et l'index", () => {
    const url = ficheUrl({ slug: "raisin", url: "" });
    assert.equal(
      url,
      "https://expert-beagle.fr/aliments/raisin?utm_source=chrome-extension&utm_medium=extension&utm_campaign=toxique-chien"
    );
    assert.match(alimentsIndexUrl(), /\/aliments\?utm_source=chrome-extension/);
  });

  it("refuse une URL qui ne pointe pas vers la fiche", () => {
    const url = ficheUrl({
      slug: "raisin",
      url: "https://exemple.test/aliments/raisin",
    });
    assert.equal(
      url,
      "https://expert-beagle.fr/aliments/raisin?utm_source=chrome-extension&utm_medium=extension&utm_campaign=toxique-chien"
    );
  });

  it("garde la base embarquée si le fichier distant est invalide ou plus ancien", () => {
    const chosen = chooseCatalog(catalog, null);
    assert.equal(chosen.source, "embedded");
    assert.equal(chosen.aliments.length, aliments.length);

    const remote = indexFrom(catalog, "2026-11-01");
    assert.equal(chooseCatalog(catalog, remote).source, "remote");

    const older = indexFrom(catalog, "2026-10-01");
    assert.equal(chooseCatalog(catalog, older).source, "embedded");

    const evil = indexFrom(catalog, "2026-12-01");
    evil.aliments[0].url = "https://exemple.test/aliments/raisin";
    assert.equal(validateRemote(evil), null);
    assert.equal(chooseCatalog(catalog, evil).source, "embedded");
  });

  it("affiche la date et les numéros repris du site", () => {
    assert.equal(formatVerifiedAt("2026-10-31"), "31 octobre 2026");
    assert.match(
      EMERGENCY_MESSAGE,
      /En cas d'ingestion, appelez votre vétérinaire ou un centre antipoison vétérinaire/
    );
    assert.equal(POISON_CENTERS[0].telephone, "04 78 87 10 40");
    assert.equal(POISON_CENTERS[1].telephone, "02 40 68 77 40");
    assert.equal(UNKNOWN_TITLE, "Pas encore dans notre base");
    assert.doesNotMatch(`${UNKNOWN_TITLE} ${UNKNOWN_BODY}`, /sans danger/i);
  });
});

describe("limites du Store", () => {
  it("ne demande que les permissions minimales", () => {
    const manifest = JSON.parse(readFileSync(join(extensionRoot, "manifest.json"), "utf8"));
    assert.deepEqual([...manifest.permissions].sort(), ["contextMenus", "storage"]);
    assert.equal(manifest.host_permissions, undefined);
    assert.deepEqual(manifest.optional_host_permissions, ["https://expert-beagle.fr/*"]);
    assert.equal(manifest.content_scripts, undefined);
    assert.equal(manifest.chrome_url_overrides, undefined);
    const blob = JSON.stringify(manifest);
    assert.doesNotMatch(blob, /all_urls|<all_urls>|notifications|webRequest/);
    assert.ok(manifest.description.length <= 132);
  });

  it("borne la description courte du Store à 132 caractères", () => {
    const store = readFileSync(join(extensionRoot, "STORE.md"), "utf8");
    const match = store.match(/## Description courte\n+([^\n]+)/);
    assert.ok(match, "description courte introuvable");
    const text = match[1].trim();
    assert.ok(text.length > 0);
    assert.ok(text.length <= 132, `${text.length} caractères`);
    assert.match(
      store,
      /https:\/\/expert-beagle\.fr\/extension\/confidentialite/
    );
  });
});

function indexFrom(source, verifiedAt) {
  return {
    verifiedAt,
    aliments: source.aliments.map((aliment) => ({
      slug: aliment.slug,
      nom: aliment.nom,
      synonymes: aliment.synonymes,
      formes: aliment.formes,
      verdict: aliment.verdict,
      resume: aliment.resume,
      url: `https://expert-beagle.fr/aliments/${aliment.slug}`,
    })),
  };
}
