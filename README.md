# Beagle Expert

Mini-site expert **Beagle** ultra-interactif (affiliation) — Next.js 15 App Router, TypeScript, Tailwind CSS v4, composants style shadcn/ui.

## Stack

- Next.js 15 + React 19
- TypeScript strict
- Tailwind CSS v4
- Radix Slot / CVA / lucide-react
- Framer Motion (quiz)
- Architecture multi-tenant prête (`src/lib/tenant.ts`)

## Démarrage

```bash
cd beagle-expert
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/                  # Routes App Router
│   ├── page.tsx          # Accueil
│   ├── fiche/[slug]/     # Fiches dynamiques
│   ├── quiz/[slug]/      # Quiz dynamiques
│   ├── fiches/           # Index fiches
│   ├── quizzes/          # Index quiz
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/               # Button, Card, Badge…
│   ├── FicheCard.tsx
│   ├── QuizEngine.tsx
│   ├── ProductCard.tsx
│   ├── ProgressBar.tsx
│   ├── AffiliateCTA.tsx
│   └── ChatbotWidget.tsx # Aminos.ai ready
├── data/                 # Contenu (fiches, quiz, produits)
├── lib/                  # utils, tenant, seo
└── types/
```

## Contenu de départ

**6 fiches** : Santé, Alimentation, Éducation, Soins, Budget, Histoire  
**4 quiz** : GPS, Surpoids, Jouet occupation, Compatibilité adoption

## Affiliation

Les URLs dans `src/data/products.ts` sont des placeholders. Remplacez `affiliateUrl` par vos liens trackés. Les CTA utilisent `rel="noopener noreferrer sponsored"`.

## Chatbot Aminos.ai

1. Créer le widget sur Aminos.ai  
2. Mettre l’URL du script dans `NEXT_PUBLIC_AMINOS_SCRIPT_URL`  
3. Sans variable : bouton floating de démo

## Multi-tenant (autres races)

- Dupliquer / paramétrer `src/lib/tenant.ts`
- Cloner `src/data/*` pour une autre race
- Brancher `NEXT_PUBLIC_TENANT` plus tard pour charger la config dynamiquement

## Scripts

| Commande        | Description        |
|-----------------|--------------------|
| `npm run dev`   | Serveur de dev     |
| `npm run build` | Build production   |
| `npm run start` | Serveur production |
| `npm run lint`  | ESLint             |

## SEO

- Metadata + Open Graph par page
- JSON-LD WebSite / Article / Quiz
- `sitemap.xml` et `robots.txt` générés
