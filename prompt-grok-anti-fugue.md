# Prompt Grok Build — Kit anti-fugue Beagle

**Contexte :** Site expert-beagle.fr (Next.js 15, App Router, Tailwind v4, framer-motion). Le fondateur a personnellement perdu son Beagle pendant plusieurs heures à cause de l'instinct de fugue. On veut capitaliser sur cette expérience authentique pour créer un **« Kit anti-fugue Beagle »** — une section/funnel qui regroupe : harnais anti-évasion + longe + médaille + GPS Weenect.

**Pourquoi :** Le Beagle est une race au flair puissant, programmée pour suivre une odeur sans se retourner. La fugue est LE problème numéro 1 des propriétaires. Weenect vient d'accepter l'affiliation (code BEAGLEEXPERT -40%, 10€/vente). On veut :
1. Créer un tunnel anti-fugue visible sur l'accueil
2. Renforcer la section fugue dans la fiche éducation
3. Ajouter une bannière promo Weenect avec le code BEAGLEEXPERT

---

## 1. Section « Kit anti-fugue » sur la page d'accueil

Dans `src/app/page.tsx`, entre le bloc calculateur budget et la section transparence, ajouter :

```tsx
<section className="border-t border-border/60 bg-gradient-to-b from-background to-amber-50/30 py-16 sm:py-20">
  <div className="container-page">
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl shadow-sm ring-1 ring-amber-200">
        🏃
      </span>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
        Votre Beagle vous a déjà fait une fugue ?
      </h2>
      <p className="measure-wide mx-auto mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
        Le Beagle suit son nez et peut disparaître en un éclair. Notre
        expérience nous a appris qu'il faut <strong>3 couches de sécurité</strong> :
        un harnais adapté, une longe de liberté, et un GPS pour les moments
        où malgré tout il part.
      </p>
    </div>

    <!-- Les 3 couches en cartes visuelles -->
    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-xl">🦮</span>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-extrabold">1. Harnais anti-évasion</h3>
        <p class="mt-1.5 text-sm text-muted-foreground">Un Beagle peut reculer d'un harnais classique. Le harnais 3 points l'en empêche.</p>
        <Link href="/quiz/harnais-beagle" class="...">Trouver le bon harnais →</Link>
      </div>
      <div class="...">
        <!-- Carte Longe -->
        <span class="...">🪢</span>
        <h3 class="...">2. Longe de liberté</h3>
        <p class="...">5 à 15 m selon le terrain : il explore sans risquer la route.</p>
        <Link href="/fiche/budget-equipement#calculateur-budget" class="...">Voir les longes →</Link>
      </div>
      <div class="...">
        <!-- Carte GPS Weenect -->
        <span class="...">📡</span>
        <h3 class="...">3. Traceur GPS Weenect</h3>
        <p class="...">Localisation 1 seconde, vibreur de rappel, -40% avec le code BEAGLEEXPERT.</p>
        <Link href="/quiz/collier-gps" class="...">Faire le quiz GPS →</Link>
      </div>
    </div>

    <!-- Bannière promo Weenect -->
    <div class="mt-8 rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-card p-6 sm:p-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-wide text-amber-700">Partenaire Weenect</p>
          <h3 class="mt-1 font-[family-name:var(--font-display)] text-xl font-extrabold sm:text-2xl">Code BEAGLEEXPERT : -40%</h3>
          <p class="mt-1 text-sm text-muted-foreground">Sur tous les traceurs Weenect — offre exclusive lecteurs Beagle Expert.</p>
          <Button asChild variant="affiliate" size="lg" class="mt-4">
            <Link href="[URL_AFFILIEE_WEENECT]" target="_blank" rel="sponsored">
              Voir les traceurs Weenect
              <ExternalLink class="size-4" />
            </Link>
          </Button>
        </div>
        <!-- Affiche QR Weenect si disponible -->
      </div>
    </div>
  </div>
</section>
```

Utilise les classes et composants existants du projet (Button, Link, etc.). Style cohérent avec le reste du site.

---

## 2. Renforcer la section fugue dans la fiche éducation

Dans `content/fiches/education-comportement.mdx`, ajouter une section dédiée à la fugue après la section existante :

```mdx
## Fugue : le risque numéro 1 du Beagle

Le Beagle est un **chien de piste** avant tout. Son flair peut le mener à
plusieurs kilomètres sans qu'il réalise qu'il s'éloigne. Ce n'est pas de la
désobéissance — c'est son instinct.

### Pourquoi il fugue
- Une odeur intéressante croisée en promenade
- Une porte ouverte, un jardin mal clos
- L'ennui ou le manque de stimulation
- Un bruit soudain qui déclenche l'instinct de chasse

### Les 3 barrières anti-fugue

**1. Harnais anti-évasion**
Un Beagle peut reculer hors d'un harnais classique. Un harnais trois points
de maintien limite ce risque.

**2. Longe de liberté (5 à 15 m)**
Plutôt que de le laisser détaché (risque de disparition) ou en laisse courte
(frustration), la longe lui offre de l'espace tout en gardant le contrôle.

**3. GPS Weenect**
Si malgré tout il part, un traceur GPS permet de le localiser en temps réel.
Le vibreur Weenect peut aussi servir de rappel à distance.
```

---

## 3. Ajouter le code promo Weenect dans le résultat du quiz GPS

Dans le quiz GPS, à la fin du résultat, ajouter un bloc :

> **Offre exclusive Beagle Expert**
> Code **BEAGLEEXPERT** → -40% sur tous les traceurs Weenect
> [Voir les traceurs Weenect →](lien_affilie)

---

## Ressources disponibles

- **Affiche promo Weenect :** `public/partners/weenect/affiche-beagle-expert.jpg`
- **Comparatif existant :** `src/data/comparisons/colliers-gps.ts`
- **Quiz GPS :** `content/quizzes/collier-gps.json`
- **Produit Weenect :** déjà ajouté à `content/products.json`
- **Code promo :** `BEAGLEEXPERT`

## À NE PAS FAIRE
- Ne pas casser les pages existantes
- Ne pas modifier les composants quiz sans demande explicite
- Ne pas ajouter de dépendances npm