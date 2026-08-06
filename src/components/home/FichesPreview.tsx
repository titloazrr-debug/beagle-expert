import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Fiche } from "@/types";
import { FicheCard } from "@/components/FicheCard";
import { Button } from "@/components/ui/button";

interface FichesPreviewProps {
  fiches: Fiche[];
}

export function FichesPreview({ fiches }: FichesPreviewProps) {
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
              L&apos;essentiel à connaître sur votre beagle
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Alimentation, santé, éducation, entretien ou budget : des fiches
              courtes et structurées pour comprendre rapidement les besoins
              spécifiques du Beagle — avant une adoption, ou dès qu&apos;une
              question se pose au quotidien.
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
          {fiches.map((fiche, i) => (
            <FicheCard key={fiche.slug} fiche={fiche} featured={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
