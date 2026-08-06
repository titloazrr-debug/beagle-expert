# Prompt pour Grok Build — Corrections post-audit ChatGPT

## 1. Supprimer les notes arbitraires (4,5/5 etc.)

**Fichier :** `src/data/foodProducts.ts` et `content/fiches/*.mdx`

Les fiches affichent des notes comme **4,5/5** pour UPD, **4,7/5** pour Kong, **4,5/5** pour tapis de fouille — sans expliquer qui a noté, sur quels critères, ni quand.

**Action :**
- Supprimer TOUTES les notes numériques (4,5/5, 4,7/5, etc.) des fiches et des produits
- Remplacer par des badges factuels comme :
  - « Fabriqué en France »
  - « Vente directe »
  - « Recette sans céréales »
  - « Formule light disponible »
  - « Lien affilié »
- Dans les `ProductCard` et `PrimaryChoiceCard`, ne plus afficher de note/rating

**Fichiers concernés :**
- `src/data/foodProducts.ts` — retirer les champs `rating` ou notes
- `src/components/food/FoodQuizResult.tsx` — `ProductRecipeCard` / `PrimaryChoiceCard` → ne pas afficher de note
- `content/fiches/*.mdx` — retirer les mentions de notes dans le corps des fiches
- `src/components/food/FoodQuizResult.tsx` — vérifier que le `Badge` n'affiche plus 4.5/5

---

## 2. Réduire les répétitions commerciales UPD dans les fiches

**Fichier :** `content/fiches/alimentation.mdx`

Actuellement, Ultra Premium Direct apparaît 3 fois dans la fiche alimentation : section rations, section chiot/adulte/senior, + sélection finale.

**Action :**
- Garder **une seule** recommandation produit UPD à la fin (sélection produits)
- Dans le corps de la fiche, remplacer les encarts produits par des renvois vers le **quiz croquettes** :
  - Exemple : « Votre Beagle est-il chiot, senior, stérilisé ou sensible ? Faites le quiz → pour identifier le type de recette adapté. »
- Supprimer les blocs « Recommandé pour cette section » intermédiaires
- Ne garder que le bloc « Sélection produits pour cette fiche » à la fin

**Même logique pour les autres fiches** (santé, éducation, budget) — vérifier qu'elles ne répètent pas les mêmes produits 2-3 fois dans la même page.

---

## 3. Corriger le titre du quiz croquettes

**Fichier :** `content/quizzes/alimentation-croquettes.json`

Changer le title et le subtitle :

```json
{
  "title": "Quelles croquettes choisir pour mon Beagle ?",
  "subtitle": "Âge, silhouette, activité et digestion : trouvez le type de croquettes adapté à votre Beagle"
}
```

Vérifier aussi le `seo.title` et la description.

---

## 4. Corriger l'intitulé du quiz assurance dans la sélection rapide

**Fichier :** `src/components/home/Hero.tsx`

Dans `featuredQuizzes`, remplacer :
- `"Quelle protection santé ?"` → `"Quelle assurance santé ?"` (ou `"Assurance santé"`)

---

## 5. Page « À propos et méthode éditoriale »

**Nouveau fichier :** `src/app/a-propos/page.tsx`

Créer une nouvelle page expliquant :

**Titre :** « À propos de Beagle Expert »

**Contenu :**
- Objectif du site : aider les propriétaires de Beagle à mieux comprendre leur chien et faire des choix éclairés
- Méthode : les fiches synthétisent des informations issues de sources vétérinaires, d'éleveurs et de guides reconnus, rendues plus claires et actionnables
- Distinction claire entre information générale et conseil vétérinaire
- Transparence sur l'affiliation : comment les produits sont sélectionnés, pourquoi telle marque plutôt qu'une autre
- Mention que les contenus sont régulièrement vérifiés et mis à jour
- Pas besoin d'inventer une fausse expertise vétérinaire — le ton honnête « nous synthétisons des sources fiables » est meilleur

Ajouter un lien vers cette page dans le footer (section « Informations légales ») et dans le Header si pertinent.

Créer aussi le fichier `src/data/a-propos.ts` avec le contenu structuré (type TenantConfig), ou simplement un fichier MDX à `content/a-propos.mdx`.

---

## 6. Revoir les formulations « VOTRE » en capitales

Dans le Hero ou les cartes quiz, remplacer les « VOTRE Beagle » écrits en capitales par un simple « votre Beagle » ou un **votre Beagle** en gras, plus naturel en français.

---

## 7. Correction de la phrase d'accroche assurance

Sur la page d'intro du quiz assurance, remplacer :
```
"Budget, âge et niveau de couverture."
```
Par :
```
"Définissez le niveau de couverture adapté à vos priorités et à votre budget."
```

**Fichier :** `content/quizzes/assurance-sante-beagle.json` — champ `subtitle`

---

## Résumé des fichiers à modifier

| Fichier | Changement |
|---|---|
| `src/data/foodProducts.ts` | Supprimer notes/ratings |
| `src/components/food/FoodQuizResult.tsx` | Supprimer affichage des notes |
| `src/components/ProductCard.tsx` | Supprimer notes si présentes |
| `content/fiches/alimentation.mdx` | Réduire répétitions UPD → renvois vers quiz |
| `content/fiches/sante.mdx` | Vérifier et réduire répétitions produits |
| `content/fiches/education-comportement.mdx` | Idem |
| `content/fiches/budget-equipement.mdx` | Idem |
| `content/quizzes/alimentation-croquettes.json` | Titre → « Quelles croquettes choisir » |
| `content/quizzes/assurance-sante-beagle.json` | Subtitle → phrase complète |
| `src/components/home/Hero.tsx` | « Protection santé » → « Assurance santé » |
| `src/app/a-propos/page.tsx` | **NOUVEAU** — page À propos / Méthode |
| `src/components/Footer.tsx` | Ajouter lien vers /a-propos |