# Fiche Chrome Web Store — Toxique pour mon chien ?

Document pour la publication manuelle. Rien n'est envoyé au Store par le dépôt.

## Nom

Toxique pour mon chien ?

## Description courte

Mon chien a mangé du chocolat ou du raisin ? Voyez si cet aliment est toxique pour le chien.

92 caractères, maximum 132.

## Description longue

Toxique pour mon chien ? répond à une seule question : cet aliment est-il toxique pour le chien ?

Sélectionnez un mot sur une page, par exemple « raisin », « chocolat » ou « carotte », puis choisissez « Toxique pour mon chien ? » dans le menu du clic droit. Vous pouvez aussi ouvrir l'icône de la barre d'outils et taper le nom. L'extension cherche dans la base Expert Beagle : le nom, les synonymes et les formes (« raisins secs », « du chocolat au lait », « carottes »), sans tenir compte des accents ni des majuscules.

La base couvre les questions que l'on se pose vraiment :

- aliment toxique chien : raisin, chocolat, oignon, xylitol, macadamia, café…
- mon chien a mangé du chocolat : le noir, le lait et le blanc n'ont pas le même verdict, les trois fiches s'affichent si vous ne précisez pas
- raisin chien : frais ou sec, la fiche rappelle le risque pour les reins
- peut-il manger une carotte, une pomme, une banane : la fiche dit ce qui est possible, et à quelle condition

Chaque réponse affiche le verdict, la phrase de résumé de la fiche, et un bouton « Voir la fiche » vers expert-beagle.fr. Le lien sert à lire la fiche, il n'est pas affilié. En bas de la fenêtre, toujours le même rappel : en cas d'ingestion, appelez votre vétérinaire ou un centre antipoison vétérinaire (CNITV 04 78 87 10 40, CAPAE-Ouest 02 40 68 77 40).

Si l'aliment n'est pas encore dans la base, l'extension le dit : « Pas encore dans notre base ». Elle ne le présente pas comme sans danger. Elle renvoie vers la liste des aliments et vers le vétérinaire.

La liste est embarquée dans l'extension et fonctionne hors ligne. Un bouton « Mettre à jour la base » peut, si vous l'autorisez, télécharger la liste publique https://expert-beagle.fr/aliments/index.json. Votre recherche n'est pas envoyée.

Ce n'est pas un avis vétérinaire. L'extension ne vend rien, n'affiche pas de publicité, ne modifie ni la recherche Google ni la page de nouvel onglet, et ne lit pas les pages que vous visitez : seul le texte que vous sélectionnez est comparé, sur votre appareil, à la liste.

Politique de confidentialité : https://expert-beagle.fr/extension/confidentialite

## Usage unique

Indiquer si un aliment est toxique pour le chien, d'après la base publique Expert Beagle.

## Catégorie

Productivité.

Ne pas choisir « Outils de recherche » : l'extension ne modifie pas la recherche et ne s'installe pas à la place du nouvel onglet.

## Langue

Français.

## Autorisations

À l'installation, seulement :

- `contextMenus` — afficher « Toxique pour mon chien ? » au clic droit sur le texte sélectionné ;
- `storage` — retenir la fenêtre de résultat et, si vous mettez la base à jour, en garder une copie sur l'appareil.

Hôte facultatif, demandé seulement au clic sur « Mettre à jour la base » :

- `https://expert-beagle.fr/*` — un seul GET vers `https://expert-beagle.fr/aliments/index.json`. Aucune autre origine. Pas de `<all_urls>`, pas de lecture des pages, pas de `tabs`, pas de `scripting`, pas de notification.

Texte à coller dans le formulaire du Store : « L'extension compare localement un aliment à la base Expert Beagle. contextMenus sert au menu du clic droit. storage sert à garder la fenêtre de résultat et la copie locale de la liste publique. L'accès à expert-beagle.fr, facultatif, ne sert qu'à télécharger /aliments/index.json. Aucune recherche n'est transmise. »

## Données collectées

Aucune. Dans l'onglet confidentialité du Store, certifier qu'aucune donnée utilisateur n'est collectée ni transmise.

Le texte sélectionné reste sur l'appareil. Il n'est pas historisé et il n'est pas ajouté à l'adresse de la requête vers expert-beagle.fr.

## Politique de confidentialité

URL à coller dans la fiche du Chrome Web Store :

https://expert-beagle.fr/extension/confidentialite

Le manifeste Chrome n'a pas de champ pour cette URL : elle se saisit dans le tableau de bord, pas dans `manifest.json`. Le même texte est dans `extension/POLITIQUE-DE-CONFIDENTIALITE.md` et sur la page du site.

## Étapes de publication manuelle

1. Créer ou ouvrir le compte développeur Chrome Web Store : https://chrome.google.com/webstore/devconsole . L'inscription coûte 5 USD, une seule fois.
2. Depuis une copie du dépôt qui contient `content/aliments.json` : `cd extension && npm run build`. Node 20 ou plus récent suffit, il n'y a pas de dépendance à installer.
3. Le zip à téléverser est `extension/toxique-pour-mon-chien.zip`. Le fichier `manifest.json` est à la racine du zip. Ne pas zipper le dossier `extension` lui-même, et ne pas envoyer le dossier `dist` non compressé.
4. Dans le tableau de bord : Nouvel élément, puis importer le zip.
5. Copier le nom, la description courte et la description longue de ce fichier. Ne pas ajouter de lien affilié, de code promo ni de phrase publicitaire.
6. Catégorie : Productivité. Langue : français.
7. Icône : déjà dans le zip, 128 pixels (`extension/icons/icon128.png`, un beagle stylisé).
8. Captures d'écran : le Store demande au moins une image en 1280×800 ou 640×400. Prévoir deux captures de la fenêtre de résultat, une pour « raisin » (verdict toxique) et une pour « carotte » (verdict sans danger). Chaque capture doit montrer le résumé, le bouton « Voir la fiche » et les deux numéros.
9. URL de politique de confidentialité : https://expert-beagle.fr/extension/confidentialite
10. Onglet Vie privée : aucune donnée collectée. Coller la justification des autorisations ci-dessus. Usage unique : la phrase de la section « Usage unique ».
11. Enregistrer l'élément. Le laisser en brouillon, ou non publié, le temps d'une relecture. Ne pas cliquer sur Publier tant que la fiche, les captures et l'URL de confidentialité n'ont pas été relues.
12. Pour une version suivante : augmenter `version` dans `extension/manifest.json`, relancer `npm run build`, téléverser le nouveau zip. Les numéros du CNITV et du CAPAE-Ouest sont dans le code de l'extension, pas dans `index.json` : un changement de numéro demande une nouvelle version.

## Vérifier avant l'envoi

- `cd extension && npm test`
- `cd extension && npm run build`
- Dans Chromium : `chrome://extensions`, mode développeur, « Chargez l'extension non empaquetée », dossier `extension/dist`.
- Menu du clic droit sur un mot sélectionné : « Toxique pour mon chien ? ».
- Popup de la barre d'outils : le même résultat pour « raisin » et « carotte ».
- Le build du site (`npm run build` à la racine) ne doit pas compiler ce dossier.
