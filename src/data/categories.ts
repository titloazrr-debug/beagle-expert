import type { FicheCategory } from "@/types";

/** Labels UI — safe côté client (pas de fs). */
export const categoryLabels: Record<
  FicheCategory,
  { label: string; emoji: string; color: string }
> = {
  sante: {
    label: "Santé",
    emoji: "🩺",
    color: "bg-rose-200 text-rose-950 border border-rose-300/60",
  },
  alimentation: {
    label: "Alimentation",
    emoji: "🍖",
    color: "bg-amber-200 text-amber-950 border border-amber-300/60",
  },
  education: {
    label: "Éducation & Comportement",
    emoji: "🎓",
    color: "bg-sky-200 text-sky-950 border border-sky-300/60",
  },
  soins: {
    label: "Soins & Entretien",
    emoji: "✨",
    color: "bg-violet-200 text-violet-950 border border-violet-300/60",
  },
  budget: {
    label: "Budget & Équipement",
    emoji: "💰",
    color: "bg-emerald-200 text-emerald-950 border border-emerald-300/60",
  },
  histoire: {
    label: "Histoire & Standard",
    emoji: "📜",
    color: "bg-stone-300 text-stone-950 border border-stone-400/50",
  },
};
