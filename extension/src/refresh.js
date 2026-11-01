import { validateRemote } from "./catalog.js";
import { INDEX_URL, REFRESH_FAIL_MS, REFRESH_OK_MS } from "./constants.js";

const ORIGIN = "https://expert-beagle.fr/*";

async function hasHostPermission() {
  return chrome.permissions.contains({ origins: [ORIGIN] });
}

/**
 * Télécharge /aliments/index.json si l'utilisateur a autorisé l'hôte.
 * N'envoie aucune recherche. En cas d'échec, la copie déjà stockée reste.
 */
export async function refreshIndex({ force = false } = {}) {
  if (!(await hasHostPermission())) {
    return { ok: false, reason: "permission" };
  }

  const stored = await chrome.storage.local.get(["remoteFetchedAt", "remoteOk"]);
  const elapsed = Date.now() - (stored.remoteFetchedAt || 0);
  const wait = stored.remoteOk ? REFRESH_OK_MS : REFRESH_FAIL_MS;
  if (!force && stored.remoteFetchedAt && elapsed < wait) {
    return { ok: Boolean(stored.remoteOk), reason: "fresh" };
  }

  try {
    const response = await fetch(INDEX_URL, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    const sanitized = validateRemote(json);
    if (!sanitized) throw new Error("index invalide");
    await chrome.storage.local.set({
      remoteIndex: sanitized,
      remoteFetchedAt: Date.now(),
      remoteOk: true,
    });
    return { ok: true, reason: "updated" };
  } catch {
    await chrome.storage.local.set({
      remoteFetchedAt: Date.now(),
      remoteOk: false,
    });
    return { ok: false, reason: "fetch" };
  }
}
