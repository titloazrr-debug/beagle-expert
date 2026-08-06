# Prompt pour Grok Build — Tableau comparatif interactif (Tractive vs Weenect)

**Contexte :** Site Next.js 15 (App Router) pour la race Beagle (beagle-expert.vercel.app). Stack : TypeScript, Tailwind CSS v4, framer-motion, lucide-react.

**Fichier existant :** `src/data/comparisons.json` — contient déjà des données de comparaison utilisées par `ComparisonBlock.tsx`. À inspecter pour comprendre le format.

## Objectif

Créer un **tableau comparatif interactif** côte à côte (2 à 3 colonnes produits) intégré dans les fiches produits. Exemple concret : comparer **Tractive GPS** vs **Weenect** dans la fiche collier GPS.

Le composant doit :
1. Afficher un tableau avec les produits en colonnes, les critères en lignes
2. Mettre en évidence le « gagnant » par critère (couleur de fond, coche)
3. Permettre de cliquer sur un produit pour voir le détail / accéder au lien affilié
4. S'intégrer dans le flux de `FichePage` (src/app/fiche/[slug]/page.tsx)

## Fonctionnalités attendues

### Composant `ComparisonTable`
- Props : `{ products: ComparisonProduct[]; categories: ComparisonCategory[] }`
- Layout responsive : 2 colonnes desktop, défilement horizontal mobile
- Lignes de critères regroupées par catégorie (Ex: "Localisation", "Autonomie", "Prix")
- Pour chaque critère, le meilleur produit est surligné (badge vert "Meilleur" ou icône ✓)
- Possibilité d'étendre une ligne pour voir plus de détails
- CTA "Voir le produit" en bas de chaque colonne → lien affilié

### Types à créer dans `src/types/index.ts`

```typescript
interface ComparisonProduct {
  id: string;
  name: string;
  emoji: string;
  badge?: string;
  affiliateUrl: string;
  priceLabel: string;
  criteria: Record<string, string | number | boolean>;
}

interface ComparisonCategory {
  id: string;
  label: string;
  criteria: string[]; // clés du Record
}
```

### Structure de données (créer `src/data/comparisons/colliers-gps.ts`)

Données Tractive GPS VS Weenect à inclure :

| Critère | Tractive GPS | Weenect |
|---|---|---|
| Autonomie batterie | Jusqu'à 7 jours | Jusqu'à 5 jours |
| Portée | Mondiale (4G/LTE) | Mondiale (4G/LTE) |
| Abonnement mensuel | ~4,99€/mois | ~3,99€/mois |
| Zone de sécurité | Oui (géofence illimité) | Oui (géofence illimité) |
| Mode vie sauvage | Non | Oui (veille prolongée) |
| Alertes fugue | Oui (instantanées) | Oui (instantanées) |
| Suivi en temps réel | Oui (toutes les 2-3s) | Oui (toutes les 5s) |
| Poids du collier | 35g | 28g |
| Étanchéité | IPX7 | IP67 |
| Application mobile | Oui (iOS + Android) | Oui (iOS + Android) |
| Prix tracker | ~49,99€ | ~39,99€ |
| Clarté des conditions | Standard | Standard |

### Styles
- Utiliser les classes Tailwind existantes du projet (cf `globals.css` pour les variables CSS)
- Design cohérent avec les fiches existantes (cards arrondies, ombres douces)
- Badge "⭐ Recommandé Beagle Expert" sur le produit globalement recommandé
- Version mobile : les colonnes deviennent une liste déroulante par produit

### Intégration
- Le composant doit être importable depuis `src/app/fiche/[slug]/page.tsx`
- Le slug de la fiche détermine quel tableau afficher (mapping dans un fichier de config)
- Commencer par le collier GPS : quand `slug === "soins-entretien"` ou un slug dédié collier

## À NE PAS FAIRE
- Ne pas toucher au système de build ou de configuration Next.js
- Ne pas ajouter de dépendances npm supplémentaires
- Ne pas modifier les composants existants sans demande explicite
- Ne pas casser l'accessibilité (aria-labels, rôles, focus)