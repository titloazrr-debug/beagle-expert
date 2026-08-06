"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import {
  type DogStage,
  type FoodType,
  type InsuranceTier,
  type VetLevel,
  computeBudget,
  formatEuro,
} from "@/lib/budget-calculator";
import { cn } from "@/lib/utils";

const STAGE_OPTIONS: { id: DogStage; label: string; hint: string }[] = [
  { id: "chiot", label: "Chiot", hint: "0–12 mois" },
  { id: "adulte", label: "Adulte", hint: "1–7 ans" },
  { id: "senior", label: "Senior", hint: "8 ans et +" },
];

const FOOD_OPTIONS: { id: FoodType; label: string }[] = [
  { id: "premium", label: "Croquettes premium" },
  { id: "standard", label: "Croquettes standards" },
  { id: "menagere", label: "Ration ménagère" },
  { id: "mixte", label: "Mixte (croquettes + humide)" },
];

const INSURANCE_OPTIONS: { id: InsuranceTier; label: string }[] = [
  { id: "none", label: "Aucune" },
  { id: "basic", label: "Basique (~15 €/mois)" },
  { id: "full", label: "Complète (~35 €/mois)" },
];

const VET_LABELS: Record<VetLevel, string> = {
  0: "Visites annuelles",
  1: "Visites + suivi",
  2: "Visites + suivi + urgences",
};

function RadioGroup<T extends string>({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string;
  label: string;
  value: T;
  options: { id: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-extrabold text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <label
              key={opt.id}
              className={cn(
                "cursor-pointer rounded-xl border-2 px-3 py-2 text-sm font-semibold transition",
                selected
                  ? "border-primary bg-primary/10 text-foreground shadow-sm"
                  : "border-border bg-card text-foreground/90 hover:border-primary/35"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={selected}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />
              <span className="block leading-snug">{opt.label}</span>
              {opt.hint && (
                <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                  {opt.hint}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function BudgetCalculator({ className }: { className?: string }) {
  const [stage, setStage] = useState<DogStage>("adulte");
  const [food, setFood] = useState<FoodType>("premium");
  const [insurance, setInsurance] = useState<InsuranceTier>("basic");
  const [gps, setGps] = useState(true);
  const [vet, setVet] = useState<VetLevel>(1);

  const budget = useMemo(
    () => computeBudget({ stage, food, insurance, gps, vet }),
    [stage, food, insurance, gps, vet]
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-5 shadow-[var(--shadow-soft)] sm:p-7",
        className
      )}
      aria-labelledby="budget-calculator-heading"
    >
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Calculator className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2
            id="budget-calculator-heading"
            className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            Mini-calculateur de budget
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            5 choix simples → estimation mensuelle et annuelle en temps réel.
            Ordres de grandeur, pas un devis.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Questions */}
        <div className="space-y-5">
          <RadioGroup
            name="stage"
            label="1. Âge de mon Beagle"
            value={stage}
            options={STAGE_OPTIONS}
            onChange={setStage}
          />
          <RadioGroup
            name="food"
            label="2. Type d’alimentation"
            value={food}
            options={FOOD_OPTIONS}
            onChange={setFood}
          />
          <RadioGroup
            name="insurance"
            label="3. Assurance santé"
            value={insurance}
            options={INSURANCE_OPTIONS}
            onChange={setInsurance}
          />

          <fieldset className="space-y-2">
            <legend className="text-sm font-extrabold text-foreground">
              4. Équipement GPS
            </legend>
            <p className="text-xs text-muted-foreground">
              Tracker ~50–80 € + abonnement ~5 €/mois
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: true, label: "Oui" },
                  { id: false, label: "Non" },
                ] as const
              ).map((opt) => (
                <label
                  key={String(opt.id)}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 px-3 py-2 text-sm font-semibold transition",
                    gps === opt.id
                      ? "border-primary bg-primary/10 text-foreground shadow-sm"
                      : "border-border bg-card hover:border-primary/35"
                  )}
                >
                  <input
                    type="radio"
                    name="gps"
                    checked={gps === opt.id}
                    onChange={() => setGps(opt.id)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-extrabold text-foreground">
              5. Fréquence des soins vétérinaires
            </legend>
            <label className="block">
              <span className="sr-only">Niveau de soins véto</span>
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                value={vet}
                onChange={(e) => setVet(Number(e.target.value) as VetLevel)}
                className="w-full accent-[var(--primary)]"
                aria-valuetext={VET_LABELS[vet]}
              />
            </label>
            <div className="flex justify-between gap-2 text-[11px] font-semibold text-muted-foreground">
              <span className={vet === 0 ? "text-primary" : undefined}>
                Visites
              </span>
              <span className={vet === 1 ? "text-primary" : undefined}>
                + suivi
              </span>
              <span className={vet === 2 ? "text-primary" : undefined}>
                + urgences
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {VET_LABELS[vet]}
            </p>
          </fieldset>
        </div>

        {/* Synthèse live */}
        <div
          className="rounded-2xl border-2 border-primary/25 bg-card p-5 shadow-md lg:sticky lg:top-24"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-primary">
            Estimation en direct
          </p>

          <div className="mt-3 space-y-1">
            <p className="text-sm font-semibold text-muted-foreground">
              Budget mensuel estimé
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={budget.monthly}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              >
                ~{formatEuro(budget.monthly)}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm text-muted-foreground">
              Annuel :{" "}
              <strong className="text-foreground">
                ~{formatEuro(budget.annual)}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Sur 15 ans :{" "}
              <strong className="text-foreground">
                ~{formatEuro(budget.lifetime15)}
              </strong>
            </p>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[260px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">Poste</th>
                  <th className="px-3 py-2 text-right">Mensuel</th>
                  <th className="px-3 py-2 text-right">Annuel</th>
                </tr>
              </thead>
              <tbody>
                {budget.lines.map((line) => (
                  <tr
                    key={line.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-3 py-2 font-semibold text-foreground">
                      {line.label}
                      {line.note && (
                        <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">
                          {line.note}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-foreground/90">
                      {formatEuro(line.monthly)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-foreground/90">
                      {formatEuro(line.monthly * 12)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary/10 font-extrabold">
                  <td className="px-3 py-2.5 text-foreground">TOTAL</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-primary">
                    {formatEuro(budget.monthly)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-primary">
                    {formatEuro(budget.annual)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Estimation indicative pour un Beagle en France. Les tarifs réels
            varient selon la région, le véto, les promos et l’état de santé.
          </p>
        </div>
      </div>
    </section>
  );
}
