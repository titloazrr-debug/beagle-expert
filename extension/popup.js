import { loadCatalog } from "./src/load-catalog.js";
import { lookupFood } from "./src/match.js";
import { renderCatalogMeta, renderEmergency, renderResult } from "./ui.js";

const form = document.querySelector("#search");
const input = document.querySelector("#q");
const out = document.querySelector("#out");
const meta = document.querySelector("#meta");
const updateButton = document.querySelector("#update");

renderEmergency(document.querySelector("#emergency"));

let catalog = null;

async function ensureCatalog() {
  catalog = await loadCatalog();
  renderCatalogMeta(meta, catalog);
  chrome.runtime.sendMessage({ type: "refresh-index" }).catch(() => {});
  return catalog;
}

async function run(query) {
  try {
    const current = catalog ?? (await ensureCatalog());
    renderResult(out, lookupFood(query, current.aliments));
  } catch {
    renderResult(out, { status: "error" });
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  run(input.value);
});

updateButton.addEventListener("click", async () => {
  updateButton.disabled = true;
  try {
    const granted = await chrome.permissions.request({
      origins: ["https://expert-beagle.fr/*"],
    });
    if (!granted) {
      if (catalog) renderCatalogMeta(meta, catalog, { reason: "permission" });
      return;
    }
    const response = await chrome.runtime.sendMessage({
      type: "refresh-index",
      force: true,
    });
    catalog = await loadCatalog();
    renderCatalogMeta(meta, catalog, response);
    if (input.value.trim()) await run(input.value);
  } catch {
    if (catalog) renderCatalogMeta(meta, catalog, { ok: false, reason: "fetch" });
  } finally {
    updateButton.disabled = false;
  }
});

const initial = new URLSearchParams(location.search).get("q");
ensureCatalog()
  .then(() => {
    if (!initial) return;
    input.value = initial;
    history.replaceState({}, "", "popup.html");
    return run(initial);
  })
  .catch(() => {
    renderResult(out, { status: "error" });
  });
