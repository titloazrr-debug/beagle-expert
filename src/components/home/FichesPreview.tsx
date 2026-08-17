import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Fiche } from "@/types";
import { FicheCard } from "@/components/FicheCard";
import { Button } from "@/components/ui/button";

interface FichesPreviewProps {
  fiches: Fiche[];
}

/** Éducation (fugue) en tête de liste sur l’accueil */
const FICHE_PRIORITY = [
  "education-comportement",
  "solitude-aboiements-destruction",
  "budget-equipement",
  "sante",
  "alimentation",
  "esperance-de-vie",
  "soins-entretien",
  "histoire-standard",
];

export function FichesPreview({ fiches }: FichesPreviewProps) {
  const sorted = [...fiches].sort((a, b) => {
    const ia = FICHE_PRIORITY.indexOf(a.slug);
    const ib = FICHE_PRIORITY.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <section
      id="fiches"
      className="scroll-mt-20 border-t border-border/60 bg-gradient-to-b from-muted/40 to-background py-16 sm:py-20"
    >
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Les fiches Beagle Expert
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
              L&apos;essentiel : fugue, santé, budget…
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Éducation et anti-fugue d&apos;abord, puis santé, alimentation et
              budget : des fiches courtes pour les vrais sujets de la race —
              avant d&apos;adopter, ou dès qu&apos;une question se pose.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/fiches">
              Voir toutes les fiches
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((fiche, i) => (
            <FicheCard key={fiche.slug} fiche={fiche} featured={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
