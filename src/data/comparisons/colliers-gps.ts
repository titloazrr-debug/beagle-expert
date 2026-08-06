import type { ComparisonTableSpec } from "@/types";

/**
 * Tableau Tractive GPS vs Weenect.
 * Valeurs indicatives — à revérifier avant mise en avant commerciale.
 */
export const COLLIER_GPS_COMPARISON: ComparisonTableSpec = {
  id: "table-tractive-vs-weenect",
  title: "Tractive GPS vs Weenect",
  emoji: "📡",
  intro:
    "Pour un Beagle au flair « interrupteur d’écoute », le GPS est un filet de sécurité — pas une baguette magique. Voici une lecture critère par critère des deux références grand public les plus comparées en France.",
  ficheSlugs: ["education-comportement", "budget-equipement"],
  products: [
    {
      id: "tractive",
      name: "Tractive GPS",
      emoji: "📡",
      badge: "App mature",
      recommended: true,
      affiliateUrl: "#",
      priceLabel: "~49,99€ + abo",
      criteria: {
        autonomie: "Jusqu’à 7 jours",
        portee: "Mondiale (4G/LTE)",
        abonnement: "~4,99€/mois",
        zone: "Oui (géofence illimité)",
        mode_sauvage: "Non",
        alertes: "Oui (instantanées)",
        suivi: "Oui (toutes les 2–3 s)",
        poids: "35 g",
        etancheite: "IPX7",
        app: "Oui (iOS + Android)",
        prix_tracker: "~49,99€",
        clarte: "Standard",
      },
    },
    {
      id: "weenect",
      name: "Weenect",
      emoji: "📍",
      badge: "Léger & FR",
      recommended: false,
      affiliateUrl: "#",
      priceLabel: "~39,99€ + abo",
      criteria: {
        autonomie: "Jusqu’à 5 jours",
        portee: "Mondiale (4G/LTE)",
        abonnement: "~3,99€/mois",
        zone: "Oui (géofence illimité)",
        mode_sauvage: "Oui (veille prolongée)",
        alertes: "Oui (instantanées)",
        suivi: "Oui (toutes les 5 s)",
        poids: "28 g",
        etancheite: "IP67",
        app: "Oui (iOS + Android)",
        prix_tracker: "~39,99€",
        clarte: "Standard",
      },
    },
  ],
  categories: [
    {
      id: "localisation",
      label: "Localisation & alertes",
      criteria: [
        {
          key: "suivi",
          label: "Suivi en temps réel",
          winnerId: "tractive",
          detail:
            "La fréquence de rafraîchissement dépend du mode et du forfait. Vérifiez les conditions actuelles dans chaque app.",
        },
        {
          key: "portee",
          label: "Portée / réseau",
          detail:
            "Les deux s’appuient sur le réseau cellulaire : des zones blanches restent possibles en forêt profonde.",
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
          winnerId: "tractive",
          detail:
            "Autonomie annoncée par les fabricants en usage standard — le mode LIVE réduit fortement l’endurance.",
        },
        {
          key: "poids",
          label: "Poids du collier",
          winnerId: "weenect",
        },
        {
          key: "etancheite",
          label: "Étanchéité",
          detail: "IPX7 et IP67 sont proches : utilisables sous la pluie et en baignade courte.",
        },
        {
          key: "mode_sauvage",
          label: "Mode vie sauvage / veille",
          winnerId: "weenect",
          detail:
            "Utile pour économiser la batterie sur de longues sorties sans suivi live permanent.",
        },
      ],
    },
    {
      id: "prix",
      label: "Prix & usage",
      criteria: [
        {
          key: "prix_tracker",
          label: "Prix du tracker",
          winnerId: "weenect",
        },
        {
          key: "abonnement",
          label: "Abonnement mensuel",
          winnerId: "weenect",
          detail:
            "Comparez le coût sur 12–24 mois (promos, engagement, multi-chiens).",
        },
        {
          key: "app",
          label: "Application mobile",
        },
        {
          key: "clarte",
          label: "Clarté des conditions",
        },
      ],
    },
  ],
  verdict:
    "Tractive se distingue souvent par l’expérience app et le suivi très réactif ; Weenect reste une alternative sérieuse, plus légère et souvent un peu moins chère. Comparez l’abonnement sur 12–24 mois, l’autonomie réelle et la couverture réseau dans vos zones de promenade. Aucun GPS ne remplace clôture, longe et travail de rappel.",
  disclaimer:
    "Tarifs, autonomies et forfaits évoluent. Vérifiez les fiches fabricant avant d’acheter. Liens affiliés possibles sans surcoût pour vous.",
};
