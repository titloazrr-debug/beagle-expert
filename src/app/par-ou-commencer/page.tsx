import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Footprints,
  Heart,
  Home,
  Radio,
  Scale,
  Shirt,
  ShoppingBag,
  Stethoscope,
  Utensils,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenant";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Par où commencer ? — guide pour nouveaux visiteurs",
  description:
    "Vous arrivez sur Beagle Expert ? Suivez le guide : quiz, fiches, conseils pratiques selon votre situation.",
  path: "/par-ou-commencer",
});

const paths = [
  {
    icon: Home,
    label: "Je songe à adopter un Beagle",
    desc: "Le Beagle est-il fait pour vous ? Faites le quiz.",
    href: "/quiz/pret-a-adopter",
    cta: "Faire le quiz « Suis-je prêt ? »",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Stethoscope,
    label: "Je veux tout savoir sur sa santé",
    desc: "Maladies fréquentes, espérance de vie, prévention.",
    href: "/fiche/sante",
    cta: "Lire la fiche santé",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    icon: Heart,
    label: "Je veux connaître l'espérance de vie du Beagle",
    desc: "Durée de vie, facteurs, conseils pour bien vieillir.",
    href: "/fiche/esperance-de-vie",
    cta: "Lire le guide",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Utensils,
    label: "Je cherche les meilleures croquettes",
    desc: "Quiz personnalisé selon l'âge, le poids et l'activité.",
    href: "/quiz/alimentation-croquettes",
    cta: "Lancer le quiz croquettes",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    icon: Footprints,
    label: "Je cherche le bon harnais / équipement de promenade",
    desc: "Harnais, laisse ou longe : setup adapté à son flair et son rappel.",
    href: "/quiz/harnais-beagle",
    cta: "Faire le quiz harnais",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: Radio,
    label: "Je veux un collier GPS pour mon Beagle",
    desc: "Fugue, grands espaces, rappel : trouvez le GPS adapté.",
    href: "/quiz/collier-gps",
    cta: "Faire le quiz GPS",
    color: "from-sky-500/20 to-sky-500/5",
  },
  {
    icon: Scale,
    label: "Mon Beagle a un problème de poids",
    desc: "Quiz risque d'obésité : évaluez sa silhouette.",
    href: "/quiz/risque-obesite",
    cta: "Évaluer le risque",
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: Shirt,
    label: "Je veux un budget pour mon Beagle",
    desc: "Frais, équipement, assurance : combien ça coûte ?",
    href: "/fiche/budget-equipement",
    cta: "Voir la fiche budget",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: ClipboardList,
    label: "Je veux choisir une assurance santé",
    desc: "Quiz personnalisé pour trouver la bonne couverture.",
    href: "/quiz/assurance-sante-beagle",
    cta: "Faire le quiz assurance",
    color: "from-teal-500/20 to-teal-500/5",
  },
  {
    icon: ShoppingBag,
    label: "Je cherche des produits pour mon Beagle",
    desc: "Croquettes, GPS, jouets : notre sélection.",
    href: "/fiches",
    cta: "Voir les fiches",
    color: "from-pink-500/20 to-pink-500/5",
  },
];

export default function ParOuCommencerPage() {
  const tenant = getTenant();

  return (
    <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
      <div className="container-page py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            Bienvenue
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
            Par où commencer ?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vous atterrissez sur {tenant.name} et vous ne savez pas par où
            aller ? Choisissez votre situation ci-dessous — on vous aiguille
            vers le bon quiz ou la bonne fiche.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {paths.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${p.color} p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30`}
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card text-xl shadow-sm ring-1 ring-border">
                  <p.icon className="size-5 text-primary" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-extrabold text-foreground">
                    {p.label}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-1.5">
                    {p.cta}
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 sm:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight sm:text-2xl">
            Vous ne savez toujours pas ?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Commencez par le quiz « Suis-je prêt à adopter un Beagle ? » — c&apos;est
            le point d&apos;entrée le plus complet. En 4 minutes, vous saurez si le
            Beagle correspond à votre mode de vie, et vous repartirez avec des
            pistes concrètes.
          </p>
          <Button asChild size="lg" className="mt-5">
            <Link href="/quiz/pret-a-adopter">
              Faire le quiz « Suis-je prêt ? »
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}