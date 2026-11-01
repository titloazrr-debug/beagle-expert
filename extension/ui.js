import {
  AMBIGUOUS_INTRO,
  EMERGENCY_MESSAGE,
  ERROR_BODY,
  FICHE_LINK_LABEL,
  INDEX_LINK_LABEL,
  POISON_CENTERS,
  POISON_NOTE,
  UNKNOWN_BODY,
  UNKNOWN_TITLE,
  VERDICT_LABEL,
  formatVerifiedAt,
} from "./src/constants.js";
import { alimentsIndexUrl, ficheUrl } from "./src/links.js";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function ficheLink(aliment) {
  const link = element("a", "fiche", FICHE_LINK_LABEL);
  link.href = ficheUrl(aliment);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function foodCard(aliment) {
  const card = element("article", `card verdict-${aliment.verdict}`);
  const badge = element(
    "p",
    "badge",
    VERDICT_LABEL[aliment.verdict] || aliment.verdict
  );
  const title = element("h2");
  if (aliment.emoji) {
    const emoji = element("span", "emoji", aliment.emoji);
    emoji.setAttribute("aria-hidden", "true");
    title.append(emoji, document.createTextNode(` ${aliment.nom}`));
  } else {
    title.textContent = aliment.nom;
  }
  card.append(badge, title, element("p", "resume", aliment.resume), ficheLink(aliment));
  return card;
}

export function renderEmergency(root) {
  root.replaceChildren();
  root.append(element("p", "emergency-title", EMERGENCY_MESSAGE));
  const list = element("ul", "phones");
  for (const center of POISON_CENTERS) {
    const item = element("li");
    const name = element("span", "phone-name", center.nom);
    const detail = element("span", "phone-detail", center.detail);
    const link = element("a", "phone", center.telephone);
    link.href = center.telephoneHref;
    const hours = element("span", "hours", center.horaires);
    item.append(name, detail, link, hours);
    list.append(item);
  }
  root.append(list, element("p", "poison-note", POISON_NOTE));
}

export function renderCatalogMeta(root, catalog, refresh) {
  root.replaceChildren();
  const date = formatVerifiedAt(catalog.verifiedAt);
  const source =
    catalog.source === "remote"
      ? `Base du ${date}, téléchargée depuis expert-beagle.fr.`
      : `Base du ${date}, embarquée dans l'extension.`;
  root.append(document.createTextNode(source));
  if (refresh?.ok === false && refresh.reason === "fetch") {
    root.append(
      element(
        "span",
        "meta-note",
        " La mise à jour n'a pas abouti. La base déjà présente reste utilisée."
      )
    );
  }
  if (refresh?.reason === "permission") {
    root.append(
      element(
        "span",
        "meta-note",
        " Mise à jour non autorisée : la base embarquée reste utilisée."
      )
    );
  }
}

export function renderResult(root, result) {
  root.replaceChildren();
  if (!result || result.status === "empty") return;

  if (result.status === "error") {
    root.append(element("p", "unknown-title", "Base indisponible"), element("p", "unknown-body", ERROR_BODY));
    return;
  }

  if (result.status === "unknown") {
    const link = element("a", "fiche", INDEX_LINK_LABEL);
    link.href = alimentsIndexUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    root.append(
      element("p", "unknown-title", UNKNOWN_TITLE),
      element("p", "unknown-body", UNKNOWN_BODY),
      link
    );
    return;
  }

  if (result.status === "ambiguous") {
    root.append(element("p", "ambiguous", AMBIGUOUS_INTRO));
  }
  for (const aliment of result.matches) root.append(foodCard(aliment));
}
