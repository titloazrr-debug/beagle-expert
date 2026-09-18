/**
 * Notifie IndexNow (Bing, Yandex, Brave, …) des URLs du sitemap.
 *
 * Production Vercel : lancé par `postbuild` si VERCEL_ENV=production.
 * Manuel : `npm run indexnow`
 */
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const KEY = "4e677eaeac30ef2db51f6cde697be4c8";
const HOST = "expert-beagle.fr";
const SITE = `https://${HOST}`;
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const STATIC_PATHS = [
  "/",
  "/par-ou-commencer",
  "/fiches",
  "/quizzes",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/a-propos",
  "/methodologie",
];

function collectUrls() {
  const urls = STATIC_PATHS.map((p) => (p === "/" ? SITE : `${SITE}${p}`));

  for (const file of readdirSync(join(root, "content/fiches"))) {
    if (!file.endsWith(".mdx")) continue;
    urls.push(`${SITE}/fiche/${file.replace(/\.mdx$/, "")}`);
  }
  for (const file of readdirSync(join(root, "content/quizzes"))) {
    if (!file.endsWith(".json")) continue;
    urls.push(`${SITE}/quiz/${file.replace(/\.json$/, "")}`);
  }
  return [...new Set(urls)];
}

function shouldRun() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--force") || process.env.INDEXNOW_FORCE === "1") return true;
  if (process.env.INDEXNOW_SKIP === "1") return false;
  if (args.has("--from-build")) {
    return process.env.VERCEL_ENV === "production";
  }
  return true;
}

async function main() {
  if (!shouldRun()) {
    console.log("IndexNow : skip (pas un déploiement production).");
    return;
  }

  const urlList = collectUrls();
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  });

  const text = await res.text().catch(() => "");
  console.log(
    `IndexNow ${res.status} ${res.statusText} — ${urlList.length} URLs → ${ENDPOINT}`
  );
  if (text) console.log(text.slice(0, 400));

  // 200 = reçu et clé OK ; 202 = reçu, validation de clé en cours (1er ping).
  const fromBuild = process.argv.includes("--from-build");
  if (res.status !== 200 && res.status !== 202) {
    if (fromBuild) {
      console.warn("IndexNow : ping non bloquant (le déploiement continue).");
    } else {
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error("IndexNow : échec", err);
  if (process.argv.includes("--from-build")) {
    console.warn("IndexNow : ping non bloquant (le déploiement continue).");
    return;
  }
  process.exitCode = 1;
});
