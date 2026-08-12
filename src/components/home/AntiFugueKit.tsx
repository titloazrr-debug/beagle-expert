import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WeenectPartnerOffer } from "@/components/partners/WeenectPartnerOffer";
import { cn } from "@/lib/utils";

const LAYERS = [
  {
    emoji: "🦮",
    title: "1. Harnais anti-évasion",
    body: "Un Beagle peut reculer hors d’un harnais classique. Un modèle bien ajusté (souvent en Y ou multi-points) limite la traction sur le cou et les sorties de sangle.",
    href: "/quiz/harnais-beagle",
    cta: "Trouver le bon harnais",
  },
  {
    emoji: "🪢",
    title: "2. Longe de liberté",
    body: "5 à 15 m selon le terrain : il explore et flaire sans risquer la route, tout en gardant un lien physique quand le rappel n’est pas fiable.",
    href: "/quiz/harnais-beagle",
    cta: "Composer le setup promenade",
  },
  {
    emoji: "📡",
    title: "3. Traceur GPS (Weenect)",
    body: "Si malgré tout il part : localisation live, vibreur de rappel. Filet de sécurité — pas un substitut à la laisse. Offre lecteurs : code BEAGLEEXPERT (−40 % boîtier).",
    href: "/quiz/collier-gps",
    cta: "Faire le quiz GPS",
  },
] as const;

interface AntiFugueKitProps {
  className?: string;
  /** Affiche le bloc Partner+ Weenect sous les 3 couches */
  showWeenectOffer?: boolean;
}

/**
 * Tunnel « Kit anti-fugue » : 3 couches de sécurité + offre Weenect.
 * Aligné expérience réelle (fugue Beagle) + affiliation Partner+.
 */
export function AntiFugueKit({
  className,
  showWeenectOffer = true,
}: AntiFugueKitProps) {
  return (
    <section
      id="kit-anti-fugue"
      className={cn(
        "scroll-mt-20 border-t border-border/60 bg-gradient-to-b from-background to-amber-50/40 py-16 sm:py-20",
        className
      )}
      aria-labelledby="kit-anti-fugue-heading"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl shadow-sm ring-1 ring-amber-200/80"
            aria-hidden
          >
            🏃
          </span>
          <h2
            id="kit-anti-fugue-heading"
            className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-balance sm:text-3xl"
          >
            Votre Beagle vous a déjà fait une fugue ?
          </h2>
          <p className="measure-wide mx-auto mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Le Beagle suit son nez et peut disparaître en un éclair. Notre
            expérience de terrain nous a appris qu&apos;il faut{" "}
            <strong className="font-semibold text-foreground">
              3 couches de sécurité
            </strong>
            : un harnais adapté, une longe de liberté, et un GPS pour les
            moments où malgré tout il part.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {LAYERS.map((layer) => (
            <article
              key={layer.title}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-xl"
                aria-hidden
              >
                {layer.emoji}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight">
                {layer.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {layer.body}
              </p>
              <Link
                href={layer.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-1.5"
              >
                {layer.cta}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
          Médaille avec numéro de téléphone + puce : toujours utiles. Le GPS
          retrouve le chien ; la médaille aide la personne qui le ramasse à
          vous appeler tout de suite.
        </p>

        {showWeenectOffer && (
          <div className="mx-auto mt-8 max-w-3xl">
            <WeenectPartnerOffer />
          </div>
        )}
      </div>
    </section>
  );
}
