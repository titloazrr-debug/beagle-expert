# Triage des deux audits reçus — 2 novembre 2026

Deux textes d'IA (clusters de requêtes + « analyse du site ») ont été passés au crible
contre l'état réel du dépôt. Verdict : environ 60 % est déjà en place, 25 % est prématuré,
15 % est juste et actionnable. Et les deux audits sont passés à côté du seul problème
qui coûte de l'argent aujourd'hui.

## 1. Déjà fait — ne pas refaire

| Conseil des audits | État réel |
|---|---|
| Quiz interactifs avant les liens produit | 7 quiz en ligne, tunnel fiche → quiz → produit déjà en place |
| Calculateur de budget | `BudgetCalculator.tsx`, branché sur la fiche budget |
| Triptyque harnais + longe + GPS, code BEAGLEEXPERT | Section anti-fugue sur l'accueil + fiche éducation + quiz GPS |
| FAQPage en Schema.org | Présent sur les fiches (`faqPageJsonLd`) et les quiz, alimenté par `content/faqs/*.json` |
| Transparence affiliation + disclaimer médical | En place |
| Maillage article → outil | `FicheRelatedLinks` + CTA quiz dans chaque fiche |
| Titres explicites plutôt que « Tout savoir sur… » | Déjà la ligne éditoriale (« Pourquoi un Beagle a besoin d'un traceur », etc.) |
| Blocs extractibles par les IA (GEO) | `SummaryBox` + `QuizCitableConclusion` + `/methodologie` |

Conclusion : la partie « structure de page de conversion » des deux textes est un
descriptif de ce qui existe. Aucun chantier à ouvrir là.

## 2. Prématuré ou faux

- **« CPL assurance 15–20 € », « 30–60 € par lead »** : aucun programme assurance validé
  à ce jour (SantéVet, Assur O'Poil, Elmut en attente). Pousser l'assurance maintenant
  produit du clic à zéro euro. Le levier n'est pas la page, c'est la candidature.
- **« Un quiz convertit 10 fois mieux »** : chiffre inventé, et surtout les quiz ne se
  positionnent pas (positions 45–77 sur les requêtes commerciales relevées en Search
  Console). Les quiz convertissent le trafic des fiches ; ils n'en apportent pas.
  Créer de nouveaux quiz n'augmente pas le trafic.
- **Chatbot IA, coach WhatsApp, VIP à 4,90 €/mois** : trois projets dans le projet.
  Le widget existe déjà mais reste inerte (pas de `scriptUrl`). Sans trafic ni base
  e-mail, un agent n'a personne à qui parler. À rouvrir quand il y aura ~500 contacts.
- **« Ajoutez FAQPage »** : déjà présent. Le double emploi est le piège classique de
  ces audits génériques.
- **« Visez la position zéro »** : non pilotable, et sans intérêt commercial — un
  featured snippet sur « poids beagle femelle 6 mois » ne vend rien.

## 3. Le point que les deux audits ont manqué

### a) Le tunnel anti-fugue ne rapporte que sur un produit sur quatre

Le quiz harnais et les longes pointent vers des URL Zooplus **sans tracking
d'affiliation** (`zooplus.fr/shop/...`, simples pages de catégorie) :

```
NEXT_PUBLIC_HARNESS_Y_AFFILIATE_URL / _ESCAPE_ / _HIKING_
NEXT_PUBLIC_LONG_LINE_5M_ / 10M_ / 15M_
```

Tant que le programme Zooplus/Awin n'est pas validé, ces six liens envoient du trafic
qualifié chez un marchand sans rien rapporter — et vers des catégories, qui convertissent
moins bien que des fiches produit. C'est le tunnel le plus chaud du site (intention
d'achat maximale, code promo, urgence) qui fuit.

Trois sorties possibles :
1. Zooplus validé → remplacer chaque catégorie par une **fiche produit** trackée.
2. Sinon → chercher les mêmes références chez Zoomalia (programme déjà actif) et
   basculer les six URL.
3. Si aucune des deux → désactiver proprement les cartes (`active: false`) plutôt que
   d'afficher un lien qui ne rapporte rien.

### b) La capture d'e-mail est factice

`EmailCaptureModal` affiche un formulaire, attend 400 ms, affiche « c'est noté », ouvre
le lien affilié… et jette l'adresse dans `console.log` (`// TODO: envoyer vers API`).
Aucune route `/api`. Deux conséquences : la promesse faite au visiteur n'est pas tenue,
et en cas de contrôle, on collecte une donnée personnelle sans destination ni base
légale opérationnelle.

C'est le seul vrai bug de conversion des deux audits, et le moins cher à corriger
(Brevo ou Resend + webhook vers un Google Sheet, une demi-journée). À faire avant toute
histoire d'agent IA : c'est le carburant de l'agent.

## 4. Ce qui est juste et actionnable : les 11 fiches sont des pages-hubs

Le site couvre des **thèmes** (alimentation, santé, éducation, budget) alors que les
requêtes à intention sont des **problèmes ponctuels**. C'est exactement le pattern déjà
observé en Search Console : une fiche-problème aiguë (solitude / aboiements /
destructions) est montée en position ~7,6 en un mois, quand les fiches encyclopédiques
plafonnent au-delà de la 15e place après deux mois.

Manquent aujourd'hui, avec la cible de conversion de chacune :

| # | Requête cible | Page à créer | Convertit vers |
|---|---|---|---|
| 1 | beagle qui fugue que faire | `/fiche/beagle-qui-fugue` | Weenect + quiz GPS |
| 2 | apprendre le rappel à un beagle | `/fiche/rappel-beagle` | longe 10 m + quiz harnais |
| 3 | beagle qui tire en laisse quel harnais | `/fiche/harnais-beagle` (le quiz existe sans fiche !) | quiz harnais → Zoomalia |
| 4 | otite beagle comment nettoyer | `/fiche/otite-beagle` | Douxo (déjà au catalogue) |
| 5 | poids beagle femelle 6 mois / courbe de poids chiot | `/fiche/poids-chiot-beagle` | calculateur de ration + croquettes |
| 6 | beagle en surpoids comment le faire maigrir | `/fiche/surpoids-beagle` | quiz obésité + gamelle anti-glouton |
| 7 | hernie discale beagle symptômes | `/fiche/hernie-discale-beagle` | prépare l'assurance (à publier quand un partenaire est validé) |
| 8 | quelle longe choisir pour beagle | section de la fiche harnais, pas une page | quiz harnais |

Ordre de production : 1, 3, 5, 6, 2, 4. Les quatre premières couvrent les deux
intentions les plus monétisables (fugue → Weenect, harnais → animalerie, poids →
alimentation) et se maillent entre elles.

Ce qu'il ne faut **pas** créer tout de suite : « prix mutuelle pour chien beagle ».
Requête commerciale chère, page impossible à monétiser avant validation d'un partenaire,
et elle entrerait en concurrence avec la fiche assurance déjà existante.

## 5. Ordre d'exécution

1. **Semaine 1** — 2 fiches-problèmes (fugue, harnais) + redistribution des liens
   Zooplus (produit tracké ou désactivation honnête).
2. **Semaine 1** — capture e-mail réelle (Brevo + Sheet) ou retrait du formulaire.
3. **Semaine 2** — 2 fiches (poids chiot, surpoids) + calculateur de ration sur la
   fiche alimentation.
4. **Semaine 2** — relance des candidatures assurance avec les chiffres de trafic du
   mois (c'est la seule action qui débloque le cluster santé).
5. **Ensuite** — mesures réelles en Search Console avant d'ouvrir un 9e chantier.

## 6. Règles à rappeler dans chaque brief Grok Build

- Aucune marque citée dans une fiche sans être au catalogue `content/products.json`
  avec un `affiliateUrl` vivant.
- Aucun prix affiché sans vérification sur la page marchand du jour.
- Ne jamais reprendre une note d'étoiles marchande.
- Ne jamais prétendre avoir testé un produit.
- Attention au contrat `parseFicheBody` : les libellés `**Attention**`,
  `**Bon à savoir**`, `**Point clé**`, `**Pour aller plus loin**` sont structurels ;
  le gras décoratif, lui, se supprime.
