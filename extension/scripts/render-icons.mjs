/**
 * Régénère les PNG à partir de icons/icon.svg.
 * Nécessite le paquet sharp, qui n'est pas une dépendance du build :
 *   npm install --no-save sharp && node scripts/render-icons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = await readFile(path.join(root, "icons", "icon.svg"));

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("sharp est absent. npm install --no-save sharp");
  process.exit(1);
}

for (const size of [16, 32, 48, 128]) {
  const sized = svg
    .toString("utf8")
    .replace("<svg ", `<svg width="${size}" height="${size}" `);
  const png = await sharp(Buffer.from(sized)).png().toBuffer();
  const file = path.join(root, "icons", `icon${size}.png`);
  await writeFile(file, png);
  console.log(`${file} (${png.length} octets)`);
}
