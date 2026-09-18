import type { ComparisonTableSpec } from "@/types";

/**
 * Tableau Tractive GPS vs Weenect.
 * Sources : positionnement partenaires + FAQ Weenect (août 2026).
 * Tarifs / abo évoluent — liens affiliés via env quand disponibles.
 */
export const COLLIER_GPS_COMPARISON: ComparisonTableSpec = {
  id: "table-tractive-vs-weenect",
  title: "Tractive GPS vs Weenect (usage France)",
  emoji: "📡",
  intro:
    "Les deux localisent en France. Weenect (Lyon) : GPS « où est-il maintenant ? », vibreur, SAV français. Tractive (Autriche) : localisation + suite activité / bien-être. Filet de sécurité, pas une baguette magique.",
  ficheSlugs: [
    "collier-gps-beagle",
    "education-comportement",
    "budget-equipement",
    "histoire-standard",
  ],
  products: [
    {
      id: "tractive",
      name: "Tractive GPS",
      emoji: "📡",
      badge: "GPS + activité",
      recommended: false,
      affiliateUrl: "#",
      priceLabel: "~40–50€ + abo",
      criteria: {
        positionnement: "Où est-il + va-t-il bien ?",
        suivi: "Live (souvent ~2–3 s selon mode)",
        sante: "Oui (activité / bien-être selon offres)",
        vibreur: "Selon modèle / app",
        autonomie: "Jusqu’à ~7 jours (usage standard)",
        portee: "Mondiale (réseau cellulaire)",
        abonnement: "Obligatoire (~5–10€/mois ordre de grandeur)",
        zone: "Oui (géofence)",
        mode_sauvage: "Modes économie selon app",
        alertes: "Oui",
        poids: "~30–35 g (selon modèle)",
        etancheite: "IPX7 (ordre de grandeur)",
        app: "Oui (iOS + Android)",
        garantie: "Selon conditions fabricant",
        prix_tracker: "~40–50€",
        clarte: "Comparer forfaits sur 12–24 mois",
        origine: "Autriche (Tractive GmbH)",
        sav: "Support européen, pas un siège français",
        reseau_fr: "Oui (réseau mobile France / UE)",
      },
    },
    {
      id: "weenect",
      name: "Weenect XS / XT",
      emoji: "📍",
      badge: "−40 % code BEAGLEEXPERT",
      recommended: true,
      affiliateUrl: "https://www.weenect.com/r/?id=94&p=2",
      priceLabel: "XS dès 26,99 € + abo (code BEAGLEEXPERT)",
      criteria: {
        positionnement: "Où est-il maintenant ?",
        suivi: "Superlive jusqu’à 1 pos. / s",
        sante: "Non (choix volontaire — pas de cardio / sommeil type « véto »)",
        vibreur: "Oui (+ sonnerie + lumière)",
        autonomie:
          "XS : jusqu’à 7 j (éco) / ~2 j continu — XT : jusqu’à 3 sem. (éco) / ~1 sem. continu",
        portee: "170+ pays (SIM multi-réseaux)",
        abonnement: "Obligatoire (ex. ~14€/mois ou formules 1–5 ans)",
        zone: "Oui (géofence + zones éco-énergie)",
        mode_sauvage: "Zones d’économie d’énergie",
        alertes: "Oui (sortie de zone rapide)",
        poids: "XS 27 g / XT ~54 g",
        etancheite: "IP68 (1,5 m / 60 min)",
        app: "Oui (iOS, Android, web)",
        garantie: "À vie (défauts de fabrication — annonce fabricant)",
        prix_tracker: "Selon modèle XS / XT + promos",
        clarte: "Comparer formules abo + promo affilié si dispo",
        origine: "France (Lyon)",
        sav: "SAV et app en français, siège en France",
        reseau_fr: "Oui (SIM multi-réseaux, France incluse)",
      },
    },
  ],
  categories: [
    {
      id: "france",
      label: "Usage en France",
      criteria: [
        {
          key: "origine",
          label: "Origine de la marque",
          winnerId: "weenect",
          detail:
            "Weenect : entreprise française (Lyon). Tractive : société autrichienne. Les deux vendent et localisent en France ; le filtre « marque FR » ne retient que Weenect.",
        },
        {
          key: "sav",
          label: "SAV / interlocuteur",
          winnerId: "weenect",
          detail:
            "Un foyer qui veut un support en français, dans le fuseau et le droit français, penche vers Weenect. Tractive reste utilisable en France via son app.",
        },
        {
          key: "reseau_fr",
          label: "Réseau en France",
          detail:
            "Les deux s’appuient sur GPS + réseau cellulaire français / européen. Zones blanches possibles en forêt profonde, quelle que soit la marque.",
        },
      ],
    },
    {
      id: "angle",
      label: "Positionnement",
      criteria: [
        {
          key: "positionnement",
          label: "Question client",
          detail:
            "Tractive : localisation + suite activité / bien-être. Weenect : pure performance GPS (où est l’animal à l’instant T).",
        },
        {
          key: "sante",
          label: "Suivi santé / activité avancé",
          winnerId: "tractive",
          detail:
            "Weenect n’ajoute pas de capteurs type rythme cardiaque / sommeil : la marque privilégie le GPS et laisse l’interprétation médicale aux vétérinaires.",
        },
        {
          key: "vibreur",
          label: "Vibreur (rappel / recherche)",
          winnerId: "weenect",
          detail:
            "Utile pour un Beagle au rappel fragile : vibration + sonnerie + lumière à distance.",
        },
      ],
    },
    {
      id: "localisation",
      label: "Localisation & alertes",
      criteria: [
        {
          key: "suivi",
          label: "Fréquence de suivi live",
          winnerId: "weenect",
          detail:
            "Weenect Superlive : jusqu’à 1 position/seconde. Tractive : live très réactif (souvent de l’ordre de 2–3 s selon mode). Vérifiez les conditions actuelles de chaque app.",
        },
        {
          key: "portee",
          label: "Portée / réseau (hors France)",
          detail:
            "Couverture internationale via SIM multi-réseaux. Utile en voyage ; en France le critère réseau est déjà dans « Usage en France ».",
        },
        {
          key: "zone",
          label: "Zone de sécurité (géofence)",
        },
        {
          key: "alertes",
          label: "Alertes de fugue",
        },
      ],
    },
    {
      id: "autonomie",
      label: "Autonomie & boîtier",
      criteria: [
        {
          key: "autonomie",
          label: "Autonomie batterie",
          detail:
            "Annonces fabricant : le mode live / Superlive réduit fortement l’endurance. Weenect différencie modes éco et suivi continu (XS vs XT).",
        },
        {
          key: "poids",
          label: "Poids du boîtier",
          winnerId: "weenect",
          detail: "XS à 27 g : adapté aux Beagles de taille moyenne ; XT plus lourd pour usages intensifs.",
        },
        {
          key: "etancheite",
          label: "Étanchéité",
          winnerId: "weenect",
          detail: "Weenect annonce IP68 (1,5 m / 60 min). Tractive : souvent IPX7 — vérifier le modèle exact.",
        },
        {
          key: "mode_sauvage",
          label: "Économie d’énergie",
          winnerId: "weenect",
          detail:
            "Zones d’économie d’énergie Weenect : le traceur réduit les échanges quand l’animal est dans une zone « sûre » (ex. domicile).",
        },
      ],
    },
    {
      id: "prix",
      label: "Prix, app & garanties",
      criteria: [
        {
          key: "prix_tracker",
          label: "Prix du tracker",
          detail: "Promos fréquentes ; le coût réel se joue surtout sur 12–24 mois d’abonnement.",
        },
        {
          key: "abonnement",
          label: "Abonnement",
          detail:
            "Obligatoire des deux côtés (SIM / service). Weenect publie des formules mensuelle, 1 an, 2 ans, 5 ans — comparez le prix au mois.",
        },
        {
          key: "app",
          label: "Application",
        },
        {
          key: "garantie",
          label: "Garantie",
          winnerId: "weenect",
          detail: "Weenect annonce une garantie à vie sur défauts de fabrication — lire les conditions.",
        },
        {
          key: "clarte",
          label: "Clarté des conditions",
        },
      ],
    },
  ],
  verdict:
    "En France, Weenect est le choix le plus cohérent si vous voulez une marque française, un SAV francophone et un vibreur de rappel — le cas le plus fréquent chez le Beagle. Tractive reste valable si l’app activité / bien-être compte plus que l’origine de la marque. Aucun GPS ne remplace clôture, longe et travail de rappel.",
  disclaimer:
    "Tarifs, autonomies et forfaits évoluent. Données Weenect basées sur la FAQ fabricant (août 2026). Vérifiez les fiches constructeur avant d’acheter. Liens affiliés possibles sans surcoût pour vous.",
};
