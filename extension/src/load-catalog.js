import { chooseCatalog } from "./catalog.js";

/** Base embarquée, remplacée par la copie locale du site si elle est plus récente. */
export async function loadCatalog() {
  const response = await fetch(chrome.runtime.getURL("data/aliments.json"));
  if (!response.ok) throw new Error("base embarquée illisible");
  const embedded = await response.json();
  const stored = await chrome.storage.local.get("remoteIndex");
  return chooseCatalog(embedded, stored.remoteIndex ?? null);
}
