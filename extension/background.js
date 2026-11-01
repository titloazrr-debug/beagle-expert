import { refreshIndex } from "./src/refresh.js";

const MENU_ID = "toxique-chien";
const MENU_TITLE = "Toxique pour mon chien ?";

function ensureMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create(
      {
        id: MENU_ID,
        title: MENU_TITLE,
        contexts: ["selection"],
      },
      () => {
        const error = chrome.runtime.lastError;
        if (error) console.error(error.message);
      }
    );
  });
}

async function openResult(query) {
  const url = `${chrome.runtime.getURL("popup.html")}?q=${encodeURIComponent(query)}`;
  const stored = await chrome.storage.session.get("resultWindowId");
  const existingId = stored.resultWindowId;
  if (typeof existingId === "number") {
    try {
      const existing = await chrome.windows.get(existingId, { populate: true });
      const tab = existing.tabs?.find((item) => item.id != null);
      if (tab?.id != null) {
        await chrome.tabs.update(tab.id, { url });
        await chrome.windows.update(existingId, { focused: true });
        return;
      }
    } catch {
      // La fenêtre a été fermée.
    }
  }
  const created = await chrome.windows.create({
    url,
    type: "popup",
    width: 420,
    height: 840,
    focused: true,
  });
  if (created.id != null) {
    await chrome.storage.session.set({ resultWindowId: created.id });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  ensureMenu();
  refreshIndex().catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  ensureMenu();
  refreshIndex().catch(() => {});
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID) return;
  const query = (info.selectionText || "").replace(/\s+/g, " ").trim().slice(0, 300);
  if (!query) return;
  openResult(query).catch((error) => {
    console.error(error);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "refresh-index") return undefined;
  refreshIndex({ force: Boolean(message.force) }).then(
    (result) => sendResponse(result),
    () => sendResponse({ ok: false, reason: "fetch" })
  );
  return true;
});
