# Prompt pour Grok Build — Visibilité du produit dans le résultat du quiz croquettes

## Problème constaté
Dans le résultat du quiz croquettes (`src/components/food/FoodQuizResult.tsx`), la carte produit avec le bouton d'affiliation (`ProductRecipeCard`) arrive trop bas dans le flux. L'utilisateur doit scroller après :
1. Le titre + description du résultat
2. Les critères qui ont influencé le résultat
3. Les tips "pourquoi ce profil"
4. Les alertes éventuelles
5. Le callout
6. Le résumé des réponses
7. **Puis** la carte "Notre suggestion pour ce profil" (intro marque + disclaimer)
8. **Enfin** le `ProductRecipeCard` avec le vrai bouton CTA

## Changements à apporter

### 1. Remonter le `ProductRecipeCard` en haut du résultat commercial

Dans la section `{result.showCommercial && (`, réordonner pour que le produit apparaisse immédiatement après le résultat :

**Avant (ordre actuel) :**
1. Card résultat (titre, description, critères, tips, recap...)
2. Carte « Notre suggestion » (intro marque + disclaimer)
3. ProductRecipeCard (produit + bouton CTA)
4. Calculateur ration
5. Transition
6. Habitudes

**Après (nouvel ordre) :**
1. Card résultat (titre, description, critères, tips...)
2. **ProductRecipeCard** (avec bouton CTA visible directement)
3. Carte « Notre suggestion » (intro marque + disclaimer) ← déplacé APRÈS
4. Alternative product (si applicable)
5. Calculateur ration
6. Transition
7. Habitudes

### 2. Rendre le bouton CTA plus visible

Dans `ProductRecipeCard` :
- Le bouton CTA (ligne 149-161) doit être plus gros : passer de `min-h-11` à `min-h-12` et `text-base`
- Utiliser la variante `affiliate` du Button (qui a la classe `bg-accent text-accent-foreground shadow-md hover:shadow-lg`) au lieu de `default`
- Le secondary button "Voir la composition" peut rester en `outline`

### 3. Fermer les détails par défaut

Dans `ProductRecipeCard`, le `useState(true)` pour `open` fait que les détails (liste des formats, disclaimer) sont dépliés par défaut, ce qui allonge la carte. Changer à `useState(false)`.

### 4. Rendre la carte produit plus compacte par défaut

Quand `open` est false, ne montrer que :
- Le type de croquettes (titre)
- Le nom du produit
- Les 2-3 fonctionnalités principales (pas 5)
- Le bouton CTA principal
- Le toggle "En savoir plus" pour le reste

### 5. Ajouter un encadré coloré pour la recommandation

Le `ProductRecipeCard` doit être visuellement plus distinct. Actuellement c'est un simple `Card` avec `border-primary/25 ring-1 ring-primary/10` — il se fond dans le reste.

**Modifications à apporter :**
- Ajouter un fond teinté : `bg-gradient-to-br from-primary/5 via-card to-accent/5` ou `bg-primary/[0.03]`
- Ajouter un badge « Recommandé pour ce profil » en haut de la carte, dans un style accrocheur (ex: `bg-primary text-primary-foreground` ou un bandeau coloré)
- Le bouton CTA principal doit utiliser la variante `accent` du Button (qui a une classe `bg-accent text-accent-foreground shadow-md`) pour vraiment ressortir — pas la variante `default` qui est plus sobre
- La bordure doit être plus marquée : `border-primary/40` au lieu de `border-primary/25`

### Résumé visuel de l'ordre souhaité

```
┌─────────────────────────────────┐
│   Profil : Beagle adulte...     │ ← Résultat (inchangé)
│   Critères, tips...             │
├─────────────────────────────────┤
│   🥣 Type de croquettes        │ ← REMONTÉ ici !
│   Ultra Premium Direct XXXX     │
│   [VOIR LE PRODUIT ➚]         │ ← Bouton CTA visible
│   [Voir composition]           │
├─────────────────────────────────┤
│   Notre suggestion              │ ← Déplacé après
│   Intro marque + disclaimer     │
├─────────────────────────────────┤
│   Calculateur ration            │
│   Transition                     │
│   Habitudes                      │
└─────────────────────────────────┘
```