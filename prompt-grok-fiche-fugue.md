# Brief Grok Build — fiche « Beagle qui fugue : que faire »

**Mode : edit.** Dépôt `~/beagle-expert` (Next.js 15, App Router). Une seule livraison :
créer la fiche `/fiche/beagle-qui-fugue`, sa FAQ, la relier au reste du site.

**Requête cible :** « beagle qui fugue que faire » (+ variantes « mon beagle fugue »,
« beagle fugueur », « retrouver un beagle perdu »).

**Pourquoi cette page :** c'est la douleur n°1 de la race et le point d'entrée du
tunnel Weenect. La fiche éducation traite la fugue en section ; Google ne fait pas
remonter une section pour une requête d'urgence. Il faut une page dédiée.

---

## 1. Fichier `content/fiches/beagle-qui-fugue.mdx`

Frontmatter à respecter exactement (mêmes clés que `solitude-aboiements-destruction.mdx`) :

```yaml
---
slug: beagle-qui-fugue
title: "Beagle qui fugue : que faire, et comment l'empêcher"
excerpt: "Un Beagle qui suit une piste n'entend plus son nom. Les bons réflexes dans les premières minutes, puis le plan pour que ça ne se reproduise pas."
intro: "Un Beagle fugueur ne désobéit pas : il obéit à son nez. Comprendre ce qui déclenche la poursuite, savoir quoi faire dans les dix premières minutes, puis construire un filet de sécurité réaliste."
summary: "Un Beagle qui fugue suit une odeur, pas un caprice. Dans l'immédiat : rester sur place, appeler calmement, prévenir la mairie et publier une annonce localisée. Ensuite : rappel travaillé en longe, dépense olfactive quotidienne, harnais anti-évasion et traceur GPS. Le rappel seul ne suffit pas pour un chien de piste."
category: education
emoji: "🐾"
readingTime: 6
datePublished: "2026-11-02"
dateModified: "2026-11-02"
keywords:
  - beagle qui fugue
  - beagle fugueur que faire
  - mon beagle s'est enfui
  - retrouver un beagle perdu
  - empecher un beagle de fuguer
  - beagle rappel
seo:
  title: "Beagle qui fugue : que faire tout de suite"
  description: "Votre Beagle a filé en suivant une piste ? Les réflexes des dix premières minutes, puis le plan anti-fugue réaliste : longe, harnais et GPS."
relatedProducts:
  - id: weenect-gps
relatedQuizzes:
  - collier-gps
  - harnais-beagle
relatedFiches:
  - education-comportement
  - collier-gps-beagle
  - budget-equipement
sources:
  - "https://www.fci.be/fr/nomenclature/beagle-161.html"
---
```

Contraintes SEO : `seo.title` ≤ 60 caractères, `seo.description` entre 140 et 160
caractères. Vérifie le compte avant de finir.

## 2. Corps de la fiche — structure imposée

Le rendu passe par `parseFicheBody` (`src/lib/content/load-fiches.ts`) : lis-le avant
d'écrire. Rappels : les paragraphes deviennent des puces, une section est plafonnée à
12 puces, les tableaux s'aplatissent en `libellé : valeur`, et seuls les libellés
`**Attention**`, `**Bon à savoir**`, `**Point clé**`, `**Pour aller plus loin**`
déclenchent les encadrés. Aucun autre gras.

1. **Réponse immédiate** — later une section `## Que faire tout de suite` avec la
   conduite à tenir en 4 puces courtes, dans l'ordre chronologique (rester sur zone,
   appeler sans crier, mairie + vétérinaires + groupes locaux, annonce avec photo et
   heure de disparition). Le lecteur stressé doit avoir l'essentiel avant de scroller.
2. `## Pourquoi un Beagle fugue` — le nez, la meute, la poursuite qui coupe l'écoute.
   Une donnée factuelle : le Beagle est un chien de chasse sélectionné pour poursuivre
   une piste la voix haute, ce qui explique qu'il « n'entend plus ».
3. `## Les dix premières minutes` — détaillé, concret, sans culpabilisation.
4. `## Le plan anti-fugue sur la durée` — rappel en longe (progressivité), dépense
   olfactive quotidienne, clôture et portes, harnais anti-évasion, identification
   (médaille + puce), traceur GPS.
5. `## Ce qui ne marche pas` — laisser courir sans longe en pensant que le rappel est
   acquis, la punition au retour, le collier étrangleur, l'attente devant la porte.
6. `## Le filet de sécurité réaliste` — encadré `**Point clé**` : même bien dressé, un
   chien de piste peut repartir ; le GPS ne remplace ni la laisse ni le rappel, il
   raccourcit la recherche.

Longueur cible : 900 à 1 200 mots rendus. Ton : français naturel, phrases directes,
aucun anglicisme, aucune formule d'IA (« plongeons dans », « il est important de
noter »), pas de pathos sur la perte du chien.

## 3. FAQ — `content/faqs/beagle-qui-fugue.json`

Quatre entrées, réponses de 2 à 3 phrases, format identique aux fichiers existants du
dossier (`question` / `answer`). Questions :

- Un Beagle fugueur finit-il par se calmer avec l'âge ?
- Combien de temps un Beagle peut-il survivre dehors ?
- Faut-il un collier GPS ou une puce électronique ?
- Mon Beagle fugue toujours au même endroit, pourquoi ?

Pas de doublon avec les FAQ de `education-comportement.json` ni `collier-gps-beagle.json`
— relis-les avant.

## 4. Maillage

- Ajouter un lien interne depuis `content/fiches/education-comportement.mdx` vers la
  nouvelle fiche, dans la section fugue (une phrase, pas un encadré).
- `relatedFiches` ci-dessus assure le retour.
- Ne pas toucher aux titres existants : la fiche `education-comportement` porte des
  impressions réelles, son `<title>` ne doit pas bouger.

## 5. Produits et liens — règles bloquantes

- Un seul produit mis en avant : `weenect-gps` (URL trackée, code BEAGLEEXPERT -40 %).
- **Ne pas afficher de harnais ni de longe dans cette fiche.** Les URL Zooplus du
  quiz marche (`NEXT_PUBLIC_HARNESS_*`, `NEXT_PUBLIC_LONG_LINE_*`) pointent vers des
  pages de catégorie sans tracking d'affiliation : on ne les remet pas en avant tant
  qu'elles ne sont pas remplacées.
- Aucun prix inventé. Si un prix est affiché, il doit venir de la page marchand du jour.
- Aucune note d'étoiles, aucune mention de test produit, aucune marque absente du
  catalogue.

## 6. Vérification avant de rendre

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Puis, serveur lancé :

```bash
curl -s localhost:3000/fiche/beagle-qui-fugue | grep -c "FAQPage"
curl -s localhost:3000/fiche/beagle-qui-fugue | grep -c "weenect"
```

Attendu : page rendue, JSON-LD `FAQPage` présent, lien Weenect tracké présent, aucune
étoile `**` visible dans le texte (hors libellés d'encadrés), aucune puce au-delà de
12 par section. Signaler dans la réponse le nombre de mots et les deux comptes obtenus.
