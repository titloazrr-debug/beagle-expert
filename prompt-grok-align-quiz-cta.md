# Prompt pour Grok Build — Aligner la visibilité des produits dans tous les quiz

## Objectif
Avant le déploiement sur Vercel, aligner les quiz génériques (collier GPS, jouets, surpoids, adoption) et le quiz assurance santé sur le même standard que le quiz croquettes : produit visible en premier, CTA prominent, disclaimers en dessous.

---

## 1. Quiz génériques — Inverser l'ordre résultat + ajout fond teinté

**Fichier :** `src/components/QuizEngine.tsx`

### 1a. Déplacer les produits AVANT les disclaimers

**Dans le bloc résultat générique (phase === "result" && result && !isInsurance && !isFood),** section "Produits" (lignes ~601-641) :

**Ordre actuel :**
1. Carte résultat (gradient, titre, description, raisons)
2. *QuizRecoDisclaimer + AffiliateDisclaimer* ← trop haut
3. Grille ProductCard
4. Fiches liées

**Ordre souhaité :**
1. Carte résultat (inchangé)
2. **Grille ProductCard** ← remonter ici
3. *QuizRecoDisclaimer + AffiliateDisclaimer* ← déplacer après les produits
4. Fiches liées

Déplacer les deux blocs `QuizRecoDisclaimer` et `AffiliateDisclaimer` (actuellement lignes 613-618, juste avant la grille) pour les mettre APRÈS la fermeture de la grille ProductCard (ligne 641), avant le bloc "Fiches liées".

### 1b. Ajouter un fond teinté aux ProductCards dans le résultat

Envelopper chaque `ProductCard` dans le résultat générique avec un `div` au fond légèrement teinté pour qu'elles ressemblent à la `PrimaryChoiceCard` du quiz croquettes.

Remplacer le `motion.div` qui wrap chaque ProductCard (lignes 627-631) :

```tsx
// AVANT :
<motion.div
  key={product.id}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.08 * i, duration: 0.25 }}
>
  <ProductCard
    product={product}
    reason={reason}
    rank={i + 1}
  />
</motion.div>

// APRÈS :
<motion.div
  key={product.id}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.08 * i, duration: 0.25 }}
  className="rounded-2xl bg-gradient-to-b from-primary/[0.02] to-card p-0.5"
>
  <div className="rounded-2xl border-2 border-primary/15 bg-card shadow-sm transition hover:shadow-md">
    <ProductCard
      product={product}
      reason={reason}
      rank={i + 1}
    />
  </div>
</motion.div>
```

---

## 2. Quiz assurance santé — Aligner les boutons CTA et l'ordre

**Fichier :** `src/components/insurance/InsuranceProvidersCompare.tsx`

### 2a. Déplacer le disclaimer APRÈS les cartes assureurs

Le bloc `INSURANCE_AFFILIATE_DISCLAIMER` (actuellement lignes 209-214, avant le tableau comparatif) doit être déplacé APRÈS la grille des `ProviderCard` (ligne 290), juste avant le `INSURANCE_RESULT_DISCLAIMER`.

### 2b. Bouton CTA en `variant="affiliate"`

Dans `ProviderCard`, le bouton "Demander un devis" (ligne 149) passe de `variant="default"` à `variant="affiliate"` :

```tsx
<Button asChild variant="affiliate" className="min-h-11 w-full shadow-md">
```

### 2c. Ajouter un badge "Recommandé pour votre profil" sur la carte highlightée

Dans `ProviderCard`, quand `hi` est `true` (provider recommandé), ajouter un badge coloré au-dessus du nom du provider :

```tsx
{hi && (
  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground shadow-sm mb-2">
    <Sparkles className="size-3" aria-hidden />
    Recommandé pour votre profil
  </span>
)}
```

Ajouter l'import de `Sparkles` depuis `lucide-react` en haut du fichier.

---

## 3. Résumé des changements requis

| Fichier | Changement | Priorité |
|---|---|---|
| `QuizEngine.tsx` | Déplacer les disclaimers après les produits | Haute |
| `QuizEngine.tsx` | Ajouter fond teinté + bordure aux ProductCards | Haute |
| `InsuranceProvidersCompare.tsx` | Déplacer le disclaimer après les cartes | Haute |
| `InsuranceProvidersCompare.tsx` | Bouton CTA en `variant="affiliate"` | Haute |
| `InsuranceProvidersCompare.tsx` | Badge "Recommandé" sur la carte highlightée | Moyenne |

Ces changements sont visuels et dans la structure de rendu — ils ne modifient pas la logique métier des quiz.