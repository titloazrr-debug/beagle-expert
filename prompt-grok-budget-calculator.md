# Prompt pour Grok Build — Mini-calculateur de budget Beagle

**Contexte :** Site Next.js 15 (App Router) pour la race Beagle (beagle-expert.vercel.app). Stack : TypeScript, Tailwind CSS v4, framer-motion, lucide-react.

**Fichier à modifier :** `src/app/fiche/[slug]/page.tsx` — fiche budget (slug: "budget-equipement")
**Données existantes :** `content/fiches/budget-equipement.mdx` — frontmatter avec produits liés

## Objectif

Créer un **mini-calculateur de budget interactif** intégré dans la fiche budget. L'utilisateur répond à 4-5 questions simples (via des sliders ou des boutons radio) et voit le budget mensuel/annuel estimé se mettre à jour en temps réel.

## Fonctionnalités

### Questions (client-side, pas d'API)

1. **Taille de mon Beagle** → Radio : Chiot (0-12 mois) / Adulte (1-7 ans) / Senior (8+ ans)
2. **Type d'alimentation** → Radio : Croquettes premium / Croquettes standards / Ration ménagère / Mixte
3. **Assurance santé** → Radio : Aucune / Formule basique (~15€/mois) / Formule complète (~35€/mois)
4. **Équipement GPS** → Radio : Oui / Non (coût unique ~50-80€ + abonnement ~5€/mois)
5. **Fréquence soins vétérinaires** → Slider : Visites annuelles / Visites + suivi / Visites + suivi + urgences

### Calcul en temps réel

Le composant affiche une carte de synthèse qui se met à jour instantanément :

```
┌──────────────────────────────────────────┐
│ 📊 Budget mensuel estimé : ~XX €         │
│ Budget annuel : ~XXX €                   │
│ Sur 15 ans : ~XX XXX €                   │
│                                          │
| Poste              | Mensuel | Annuel   |
│────────────────────│─────────│──────────│
│ Alimentation       │   XX €  │   XXX €  │
│ Assurance          │   XX €  │   XXX €  |
│ GPS + abonnement   │   XX €  │   XXX €  |
│ Soins vétérinaires │   XX €  │   XXX €  |
│ Accessoires        │   XX €  │   XXX €  |
│────────────────────│─────────│──────────│
│ TOTAL              │   XX €  │  X XXX € │
└──────────────────────────────────────────┘
```

### Grille de coûts à utiliser

```
CROQUETTES PREMIUM (Ultra Premium Direct) :
- Chiot : ~45€/mois
- Adulte : ~40€/mois
- Senior : ~35€/mois

CROQUETTES STANDARDS (marques supermarché) :
- Chiot : ~25€/mois
- Adulte : ~20€/mois
- Senior : ~18€/mois

RATION MÉNAGÈRE :
- Tous âges : ~50-70€/mois (variable selon viande/légumes)

MIXTE (croquettes + humide) :
- Adulte : ~55€/mois

ASSURANCE :
- Formule basique : 15€/mois
- Formule complète : 35€/mois
- Aucune : 0€

GPS (si oui) :
- Achat unique tracker : ~50€ (amorti sur 1 an : ~4€/mois)
- Abonnement : ~5€/mois

SOINS VÉTÉRINAIRES :
- Visites annuelles seules : ~8€/mois (2 visites × 50€ / an)
- Visites + suivi : ~15€/mois
- Visites + suivi + urgences : ~25€/mois

ACCESSOIRES :
- Forfait annuel : ~10€/mois (collier, laisse, panier, jouets, renouvellement)
```

### Contrainte technique

- Le composant est un **client component** (`"use client"`)
- Pas de dépendance à des librairies de formulaires — tout en React state + handlers
- Animations framer-motion pour les transitions de montants
- Accessible (aria-live="polite" sur le total qui change)

### Où placer le composant

Dans le flux de la fiche budget, en dessous du contenu MDX (après la section "Budget santé : anticiper sereinement" qui parle déjà des coûts). S'intègre comme un bloc optionnel dans la grille de droite (sidebar) ou dans le contenu principal.

### Styles
- Utiliser les classes Tailwind existantes (cf `src/app/globals.css`)
- Design carte / boîte avec fond de gradient
- Mêmes breakpoints que le reste du site (sm: 640px, lg: 1024px)

## À NE PAS FAIRE
- Ne pas modifier les autres fichiers du projet
- Ne pas ajouter de dépendances npm
- Ne pas casser l'accessibilité existante
- Pas de SSR pour ce composant (c'est un client component)