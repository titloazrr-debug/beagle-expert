import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Fiche } from "@/types";
import { FicheCard } from "@/components/FicheCard";
import { Button } from "@/components/ui/button";

interface FichesPreviewProps {
  fiches: Fiche[];
}

/** Fiches mises en avant sur l'accueil : Santé, Nutrition, Budget, Éducation */
const FICHE_PRIORITY = [
  "esperance-de-vie",
  "sante",
  "alimentation",
  "budget-equipement",
  "assurance-chien-beagle",
  "education-comportement",
  "solitude-aboiements-destruction",
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
              L&apos;essentiel : santé, alimentation, budget &amp; éducation
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Santé, longévité, nutrition, budget et comportement : des dossiers
              complets et vérifiés pour répondre à toutes les questions sur la race —
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
