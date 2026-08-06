# Prompt pour Grok Build — Corrections layout Hero

**Fichier :** `src/components/home/Hero.tsx`

## Bug 1 — Mobile : texte tronqué dans le badge

**Problème :** Le badge « Beagle Expert · Le guide interactif consacré au Beagle » est tronqué en haut sur mobile. Le texte est coupé par les coins arrondis du conteneur parent (`overflow-hidden` + `rounded-[1.75rem]`).

**Solution :** Ajouter du padding supplémentaire en bas du conteneur du texte sur mobile, ou ajuster la position du texte pour qu'il ne touche pas le bord arrondi.

**Modification dans le code :**

Dans la div absolute du texte (ligne 68), augmenter le padding-bottom sur mobile :

```tsx
// AVANT (ligne 68) :
<div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">

// APRÈS :
<div className="absolute inset-x-0 bottom-0 p-6 pb-7 sm:p-8 lg:p-10">
```

Si cela ne suffit pas, on peut aussi réduire le `rounded-full` du badge sur mobile ou remplacer par `rounded-xl` pour éviter la troncature dans les angles.

## Bug 2 — Desktop : colonne « Les plus utiles » trop longue

**Problème :** La colonne de droite avec les 4 quiz (la carte « Les plus utiles ») est trop haute. Sur desktop, elle prend presque tout l'écran et cache la suite de la page.

**Solution :** Réduire la hauteur de la carte en limitant sa hauteur max sur desktop, avec défilement si nécessaire.

**Modification dans le code :**

Ajouter des classes de hauteur max sur la carte (ligne 137) :

```tsx
// AVANT (ligne 137) :
<div className="relative rounded-[1.75rem] border border-border bg-card/95 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-7">

// APRÈS :
<div className="relative rounded-[1.75rem] border border-border bg-card/95 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-7 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
```

Avec `lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto`, la carte ne dépassera pas la hauteur de la fenêtre sur desktop, et le contenu dépassant sera scrollable.

Alternative : réduire simplement la hauteur des items sur desktop en rendant le texte plus compact :

```tsx
// Dans chaque item de la liste, ajouter :
className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-gradient-to-r from-muted/40 to-card px-3.5 py-2.5 transition-all hover:border-primary/30 hover:shadow-md sm:py-3 lg:py-2.5"

// Plus bas, pour les titres et descriptions :
<span className="text-sm font-bold leading-snug group-hover:text-primary sm:text-sm lg:text-xs">
  {item.t}
</span>
<span className="mt-0.5 block text-xs text-muted-foreground sm:text-xs lg:text-[11px]">
  {item.d}
</span>
```

Ou combiner les deux approches : hauteur max + items plus compacts.