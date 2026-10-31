/**
 * Copie la base aliments dans l'extension et produit le zip du Chrome Web Store.
 * À lancer depuis le dépôt : `cd extension && npm run build`
 */
import { execFile } from "node:child_process";
import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const extensionRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.join(extensionRoot, "..");
const dist = path.join(extensionRoot, "dist");
const zipPath = path.join(extensionRoot, "toxique-pour-mon-chien.zip");

const ROOT_FILES = [
  "manifest.json",
  "background.js",
  "popup.html",
  "popup.js",
  "ui.css",
  "ui.js",
  "privacy.html",
];

const SRC_FILES = [
  "constants.js",
  "links.js",
  "match.js",
  "catalog.js",
  "refresh.js",
  "load-catalog.js",
];

const ICON_SIZES = [16, 32, 48, 128];

await rm(dist, { recursive: true, force: true });
await rm(zipPath, { force: true });
await mkdir(path.join(dist, "src"), { recursive: true });
await mkdir(path.join(dist, "icons"), { recursive: true });
await mkdir(path.join(dist, "data"), { recursive: true });

for (const file of ROOT_FILES) {
  await cp(path.join(extensionRoot, file), path.join(dist, file));
}
for (const file of SRC_FILES) {
  await cp(path.join(extensionRoot, "src", file), path.join(dist, "src", file));
}
for (const size of ICON_SIZES) {
  await cp(
    path.join(extensionRoot, "icons", `icon${size}.png`),
    path.join(dist, "icons", `icon${size}.png`)
  );
}

await cp(
  path.join(repoRoot, "content", "aliments.json"),
  path.join(dist, "data", "aliments.json")
);

await exec("zip", ["-r", "-X", "-q", zipPath, "."], { cwd: dist });

const listing = (await exec("unzip", ["-Z1", zipPath])).stdout.split("\n").filter(Boolean);
if (!listing.includes("manifest.json")) {
  throw new Error("manifest.json doit être à la racine du zip");
}
if (!listing.includes("data/aliments.json")) {
  throw new Error("data/aliments.json absent du zip");
}
for (const size of ICON_SIZES) {
  if (!listing.includes(`icons/icon${size}.png`)) {
    throw new Error(`icône ${size} absente du zip`);
  }
}
const leaked = listing.filter(
  (name) => name.includes("STORE.md") || name.endsWith(".test.js") || name.endsWith(".svg")
);
if (leaked.length > 0) {
  throw new Error(`fichiers de travail dans le zip : ${leaked.join(", ")}`);
}

const info = await stat(zipPath);
console.log(`${zipPath} (${info.size} octets, ${listing.length} fichiers)`);
