/**
 * Grille de coûts indicative pour le mini-calculateur budget Beagle.
 * Ordres de grandeur — pas un devis.
 */

export type DogStage = "chiot" | "adulte" | "senior";
export type FoodType = "premium" | "standard" | "menagere" | "mixte";
export type InsuranceTier = "none" | "basic" | "full";
export type VetLevel = 0 | 1 | 2; // 0 = visites, 1 = +suivi, 2 = +urgences

export interface BudgetInputs {
  stage: DogStage;
  food: FoodType;
  insurance: InsuranceTier;
  gps: boolean;
  vet: VetLevel;
}

export interface BudgetLine {
  id: string;
  label: string;
  monthly: number;
  note?: string;
}

export interface BudgetBreakdown {
  lines: BudgetLine[];
  monthly: number;
  annual: number;
  lifetime15: number;
}

const PREMIUM: Record<DogStage, number> = {
  chiot: 45,
  adulte: 40,
  senior: 35,
};

const STANDARD: Record<DogStage, number> = {
  chiot: 25,
  adulte: 20,
  senior: 18,
};

/** Ration ménagère : fourchette 50–70 → milieu de fourchette */
const MENAGERE = 60;

const MIXTE: Record<DogStage, number> = {
  chiot: 58,
  adulte: 55,
  senior: 52,
};

const INSURANCE: Record<InsuranceTier, number> = {
  none: 0,
  basic: 15,
  full: 35,
};

/** GPS : abo 5€ + amortissement tracker 50€ / 12 mois ≈ 4€ */
const GPS_MONTHLY = 5 + Math.round(50 / 12);

const VET: Record<VetLevel, number> = {
  0: 8,
  1: 15,
  2: 25,
};

const ACCESSORIES = 10;

export function foodMonthly(stage: DogStage, food: FoodType): number {
  switch (food) {
    case "premium":
      return PREMIUM[stage];
    case "standard":
      return STANDARD[stage];
    case "menagere":
      return MENAGERE;
    case "mixte":
      return MIXTE[stage];
  }
}

export function computeBudget(inputs: BudgetInputs): BudgetBreakdown {
  const food = foodMonthly(inputs.stage, inputs.food);
  const insurance = INSURANCE[inputs.insurance];
  const gps = inputs.gps ? GPS_MONTHLY : 0;
  const vet = VET[inputs.vet];
  const accessories = ACCESSORIES;

  const lines: BudgetLine[] = [
    {
      id: "food",
      label: "Alimentation",
      monthly: food,
      note:
        inputs.food === "menagere"
          ? "Fourchette indicative (~50–70 €)"
          : undefined,
    },
    {
      id: "insurance",
      label: "Assurance",
      monthly: insurance,
    },
    {
      id: "gps",
      label: "GPS + abonnement",
      monthly: gps,
      note: inputs.gps
        ? "Abo ~5 € + tracker ~50 € amorti sur 12 mois"
        : undefined,
    },
    {
      id: "vet",
      label: "Soins vétérinaires",
      monthly: vet,
    },
    {
      id: "accessories",
      label: "Accessoires",
      monthly: accessories,
      note: "Collier, laisse, panier, jouets…",
    },
  ];

  const monthly = lines.reduce((s, l) => s + l.monthly, 0);
  const annual = monthly * 12;
  const lifetime15 = annual * 15;

  return { lines, monthly, annual, lifetime15 };
}

export function formatEuro(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
