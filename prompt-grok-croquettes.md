# Prompt pour Grok Build — Amélioration quiz croquettes

## Objectif
Alléger et remplir le quiz `content/quizzes/alimentation-croquettes.json` :
- Réduire le nombre d'options
- Remplir les résultats avec de vraies recommandations Ultra Premium Direct
- Garder la crédibilité sans bloquer l'utilisateur

## Modifications à apporter

### 1. Question « Poids » — GARDER (ne score rien, valeur rassurante)
Laisser les 6 options actuelles, toutes avec `"weight_context": 1`. Pas de changement.

### 2. Réduire Appétit + Digestion en UNE question
Au lieu de 2 questions séparées (appétit 6 options + digestion 6 options), faire une seule question avec 4 options max :
- « Normal, il mange bien et digère bien »
- « Il réclame / mange vite, mais digestion correcte »
- « Digestion parfois fragile (selles molles, gaz) »
- « Digestion régulièrement sensible ou démangeaisons cutanées suspectées »

### 3. Simplifier la question santé
Une seule question, une seule option pour les pathologies lourdes :
- « **Aucun problème particulier** » (scores: {})
- « **Démangeaisons, otites ou peau sensible** (sans diagnostic) » (scores: `{ "skin_caution": 1 }`)
- « **Maladie sous suivi vétérinaire** (rénale, hépatique, cardiaque, pancréatique, diabète, allergie alimentaire diagnostiquée) » (scores: `{ "medical_review": 10 }`)
- « **Je ne sais pas** » (scores: {})

### 4. RETIRER la question « Appétit a récemment augmenté/diminué »
Ces cas sont soit couverts par la nouvelle question fusionnée, soit trop spécifiques.

### 5. RETIRER les options « vomissements, diarrhées récurrentes » et « maladie digestive diagnostiquée »
Ces cas sont couverts par la question santé simplifiée ci-dessus.

### 6. REMPLIR tous les résultats

Chaque résultat doit avoir :
- **`description`** : phrase complète, ton conseil, pas juste un libellé
- **`reasons`** : 2-3 lignes expliquant pourquoi ce profil
- **`productIds`** : pointer vers le produit UPD adapté

Voici le détail profil par profil :

#### a) `medical_review` — Pathologie sous suivi véto
- title: "Avis vétérinaire recommandé"
- description: "Vous avez indiqué une pathologie suivie par un vétérinaire. Dans ce cas, l'alimentation fait partie du traitement. Ne changez rien sans l'accord de votre vétérinaire — il peut recommander une alimentation thérapeutique spécifique."
- productIds: []
- reasons: ["Un changement d'alimentation peut interagir avec un traitement en cours", "Votre vétérinaire est le mieux placé pour adapter la ration à la pathologie"]

#### b) `puppy_standard` — Chiot en croissance
- title: "Chiot Beagle en croissance"
- description: "Votre Beagle a besoin d'une recette riche en protéines et nutriments adaptés à sa croissance, avec des portions fractionnées (3 repas/jour jusqu'à 6 mois, puis 2)."
- productIds: ["ultra-premium-direct"]
- reasons: ["Ultra Premium Direct propose une formule chiot adaptée aux races moyennes, avec un bon rapport protéines/calcium pour une croissance régulière", "Fractionnez la ration en 3 repas jusqu'à 6 mois pour éviter les gloutonneries et favoriser la digestion"]

#### c) `puppy_sensitive` — Chiot digestion sensible
- title: "Chiot Beagle à digestion sensible"
- description: "Votre chiot a un système digestif délicat. Une formule sans céréales ou à base de riz peut mieux convenir. Transition alimentaire sur 7 à 10 jours."
- productIds: ["ultra-premium-direct"]
- reasons: ["Ultra Premium Direct propose des recettes sans céréales adaptées aux sensibilités digestives, même pour les jeunes chiens", "Une transition progressive (7-10 jours) est essentielle pour ne pas aggraver les fragilités", "Si les symptômes persistent malgré le changement, consultez votre vétérinaire"]

#### d) `adult_standard` — Adulte au poids stable
- title: "Beagle adulte au poids stable"
- description: "Votre Beagle a un bon équilibre poids/activité. Une croquette adulte classique, avec des portions ajustées à son activité, suffit à le maintenir en forme."
- productIds: ["ultra-premium-direct"]
- reasons: ["Ultra Premium Direct propose des formules adultes équilibrées, avec un bon taux de protéines animales pour un Beagle actif", "Pesez la ration et comptez les friandises dans le total du jour pour prévenir la prise de poids"]

#### e) `adult_weight_control` — Poids à surveiller / stérilisé
- title: "Beagle adulte — poids à surveiller"
- description: "Plusieurs signaux (appétit marqué, silhouette qui s'arrondit, stérilisation) suggèrent de choisir une recette au contrôle calorique. Le Beagle est gourmand par nature, ce n'est pas un problème de volonté."
- productIds: ["ultra-premium-direct"]
- reasons: ["Ultra Premium Direct propose des formules light ou à teneur calorique maîtrisée, idéales pour un Beagle stérilisé ou gourmand", "Associez croquettes adaptées + occupation mentale (Kong, tapis de fouille) pour détourner l'attention de la gamelle"]

#### f) `adult_sensitive` — Digestion sensible / démangeaisons
- title: "Beagle à digestion sensible ou peau réactive"
- description: "Sensibilité digestive ou démangeaisons sans diagnostic : une formule sans céréales ou hypoallergénique peut améliorer le confort. Testez sur 3 à 4 semaines et observez."
- productIds: ["ultra-premium-direct"]
- reasons: ["Ultra Premium Direct a des recettes sans céréales, adaptées aux sensibilités alimentaires légères à modérées", "Un test de 3-4 semaines permet de voir si les symptômes régressent avant d'envisager un régime plus strict", "Si les démangeaisons ou selles molles persistent, consultez un vétérinaire pour écarter une allergie"]
- Note : le `skin_caution` des scores peut être mentionné dans le résultat si pertinent

#### g) `senior` — Senior 7+ ou 10+
- title: "Beagle senior"
- description: "Avec l'âge, les besoins énergétiques baissent et le confort articulaire devient prioritaire. Une recette senior ou light, associée à un poids stable, protège le dos et les articulations."
- productIds: ["ultra-premium-direct"]
- reasons: ["Ultra Premium Direct propose des formules adaptées aux seniors, avec un apport calorique modéré et des nutriments pour les articulations", "Un bilan vétérinaire annuel (ou semestriel après 10 ans) permet d'ajuster la ration et de détecter les signes précoces"]

### 7. Résumé des changements de structure

| État actuel | État modifié |
|---|---|
| 8 questions | 7 questions |
| Question poids (6 opt, neutre) | ✅ Gardée |
| Question silhouette (5 opt) | ✅ Gardée |
| Question stérilisation (4 opt) | ✅ Gardée |
| Question activité (4 opt) | ✅ Gardée |
| Question appétit (6 opt) | ❌ Supprimée |
| Question digestion (6 opt) | ❌ Supprimée |
| **Nouvelle : appétit + digestion** | ✅ Ajoutée (4 opt max) |
| Question santé (7 opt, multi) | ✅ Simplifiée (4 opt, simple) |
| 7 résultats squelettiques | 7 résultats remplis |