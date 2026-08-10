import type { ComparisonTableSpec } from "@/types";

/**
 * Tableau Tractive GPS vs Weenect.
 * Sources : positionnement partenaires + FAQ Weenect (août 2026).
 * Tarifs / abo évoluent — liens affiliés via env quand disponibles.
 */
export const COLLIER_GPS_COMPARISON: ComparisonTableSpec = {
  id: "table-tractive-vs-weenect",
  title: "Tractive GPS vs Weenect",
  emoji: "📡",
  intro:
    "Pour un Beagle au flair « interrupteur d’écoute », le GPS est un filet de sécurité — pas une baguette magique. Deux angles : Tractive (localisation + écosystème activité / bien-être) et Weenect (performance GPS « où est mon chien maintenant ? »).",
  ficheSlugs: ["education-comportement", "budget-equipement"],
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
      },
    },
    {
      id: "weenect",
      name: "Weenect (XS / XT)",
      emoji: "📍",
      badge: "GPS performance",
      recommended: true,
      affiliateUrl: "#",
      priceLabel: "Boîtier + abo (formules longues + douces)",
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
      },
    },
  ],
  categories: [
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
          label: "Portée / réseau",
          detail:
            "Les deux s’appuient sur GPS + réseau cellulaire : des zones blanches restent possibles en forêt profonde.",
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
    "Choisissez Weenect si votre priorité est la localisation précise et l’aide au rappel (vibreur), sans besoin de suite « santé connectée ». Orientez-vous vers Tractive si vous voulez aussi un écosystème app riche (activité / bien-être). Pour un Beagle fugueur, les deux restent des filets de sécurité : aucun GPS ne remplace clôture, longe et travail de rappel.",
  disclaimer:
    "Tarifs, autonomies et forfaits évoluent. Données Weenect basées sur la FAQ fabricant (août 2026). Vérifiez les fiches constructeur avant d’acheter. Liens affiliés possibles sans surcoût pour vous.",
};
