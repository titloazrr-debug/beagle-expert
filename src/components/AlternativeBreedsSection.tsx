import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import type { AlternativeBreed } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlternativeBreedsSectionProps {
  breeds: AlternativeBreed[];
  className?: string;
}

/**
 * Redirection bienveillante vers d’autres races (placeholders)
 * quand le quiz de compatibilité mode de vie est moyen ou faible.
 */
export function AlternativeBreedsSection({
  breeds,
  className,
}: AlternativeBreedsSectionProps) {
  if (!breeds.length) return null;

  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-gradient-to-br from-muted/50 via-card to-accent/5 p-6 shadow-[var(--shadow-card)] sm:p-8",
        className
      )}
      aria-labelledby="alt-breeds-heading"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          aria-hidden
        >
          <HeartHandshake className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-accent">
            Autres pistes
          </p>
          <h3
            id="alt-breeds-heading"
            className="mt-1 font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-foreground sm:text-xl"
          >
            Le Beagle ne semble pas être la race la plus adaptée à votre mode de
            vie actuel
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            Ce n’est ni un échec ni un jugement — seulement un signal pour
            chercher un compagnon plus aligné. Voici d’autres races qui
            pourraient mieux vous correspondre :
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {breeds.map((breed) => {
          const isPlaceholder = !breed.href || breed.href === "#";
          return (
            <li key={breed.id}>
              <article
                data-breed={breed.id}
                className="flex h-full flex-col rounded-2xl border-2 border-border bg-card p-4 shadow-sm transition hover:border-primary/35 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted text-2xl"
                    aria-hidden
                  >
                    {breed.emoji}
                  </span>
                  <h4 className="text-sm font-extrabold leading-snug text-foreground sm:text-[0.95rem]">
                    {breed.name}
                  </h4>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                  {breed.justification}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full border-primary/30 font-semibold text-primary hover:bg-primary/8"
                >
                  <Link
                    href={breed.href || "#"}
                    data-breed={breed.id}
                    onClick={
                      isPlaceholder
                        ? (e) => e.preventDefault()
                        : undefined
                    }
                    aria-disabled={isPlaceholder || undefined}
                  >
                    Découvrir cette race
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </Button>
              </article>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Ces suggestions sont des pistes de réflexion. Chaque chien est unique :
        un éleveur responsable ou un refuge pourra affiner avec vous.
      </p>
    </section>
  );
}
