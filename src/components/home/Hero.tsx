import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Zap } from "lucide-react";
import { getTenant } from "@/lib/tenant";
import { getHeroImage } from "@/lib/beagle-images";
import { BeagleImage } from "@/components/BeagleImage";
import { Button } from "@/components/ui/button";
import { fiches } from "@/data/fiches";
import { quizzes } from "@/data/quizzes";

const featuredQuizzes = [
  {
    e: "🏠",
    t: "Suis-je prêt à adopter un Beagle ?",
    d: "Votre mode de vie est-il compatible avec ses besoins ?",
    href: "/quiz/pret-a-adopter",
    badge: "Essentiel",
  },
  {
    e: "🥣",
    t: "Quelles croquettes choisir pour mon Beagle ?",
    d: "Âge, silhouette, activité et digestion",
    href: "/quiz/alimentation-croquettes",
    badge: "Nouveau",
  },
  {
    e: "🛡️",
    t: "Quelle assurance santé ?",
    d: "Priorités, budget et niveau de couverture",
    href: "/quiz/assurance-sante-beagle",
    badge: "Assurance",
  },
  {
    e: "⚖️",
    t: "Mon Beagle risque-t-il le surpoids ?",
    d: "Portions, activité et silhouette en 2 min",
    href: "/quiz/risque-obesite",
    badge: "2 min",
  },
];

export function Hero() {
  const tenant = getTenant();
  const heroImage = getHeroImage();
  const quizCount = quizzes.length;
  const ficheCount = fiches.length;

  return (
    <section className="gradient-hero relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-page relative py-12 sm:py-16 lg:py-20">
        {/* Grande image hero */}
        <div className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-border shadow-[var(--shadow-soft)] sm:mb-12">
          <BeagleImage
            asset={heroImage}
            alt="Beagle regardant la caméra"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1120px"
            className="aspect-[16/9] w-full object-cover object-center sm:aspect-[21/9] lg:aspect-[2.4/1]"
            width={heroImage.width}
            height={heroImage.height}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent sm:from-background/80"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-primary/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
              <Sparkles className="size-3.5" aria-hidden />
              {tenant.name} · Le guide interactif consacré au Beagle
            </p>
            <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground text-balance sm:text-4xl lg:text-[2.75rem]">
              Mieux comprendre votre Beagle.
              <br className="hidden sm:block" />{" "}
              <span className="text-primary">
                Faire les bons choix pour lui.
              </span>
            </h1>
          </div>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="max-w-xl text-base leading-[1.75] text-foreground/90 sm:text-lg">
              Le Beagle est affectueux, intelligent et plein d&apos;énergie…
              mais son flair, sa gourmandise et son besoin d&apos;activité
              peuvent aussi surprendre.
            </p>
            <p className="mt-3 max-w-xl text-base leading-[1.75] text-muted-foreground sm:text-[1.05rem]">
              Découvrez des{" "}
              <strong className="font-semibold text-foreground">
                quiz rapides
              </strong>{" "}
              et des{" "}
              <strong className="font-semibold text-foreground">
                fiches pratiques
              </strong>{" "}
              pour anticiper ses besoins et choisir ce qui lui convient.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="xl" className="shadow-md shadow-primary/20">
                <Link href="/quiz/pret-a-adopter">
                  <Zap className="size-5" aria-hidden />
                  Tester ma compatibilité avec le Beagle
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/#fiches">
                  <BookOpen className="size-5" aria-hidden />
                  Découvrir les fiches pratiques
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-6">
              {[
                { v: String(ficheCount), l: "fiches essentielles" },
                { v: String(quizCount), l: "quiz personnalisés" },
                { v: "2–4 min", l: "pour un résultat clair" },
              ].map((stat) => (
                <div
                  key={stat.l}
                  className="rounded-2xl border border-border/70 bg-card/80 px-3 py-3 text-center shadow-sm backdrop-blur-sm sm:px-4 sm:py-4 sm:text-left"
                >
                  <dt className="text-2xl font-extrabold text-primary sm:text-3xl">
                    {stat.v}
                  </dt>
                  <dd className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-sm">
                    {stat.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-[1.75rem] border border-border bg-card/95 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-7">
              <div className="absolute -right-2 -top-3 rounded-2xl bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-md">
                🐶 Les plus utiles
              </div>
              <p className="text-sm font-bold text-primary">
                Par où commencer ?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Choisissez la question qui vous concerne — quelques minutes
                pour un résultat personnalisé.
              </p>
              <ul className="mt-5 space-y-3">
                {featuredQuizzes.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-gradient-to-r from-muted/40 to-card px-3.5 py-3.5 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card text-2xl shadow-sm ring-1 ring-border"
                        aria-hidden
                      >
                        {item.e}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold leading-snug group-hover:text-primary">
                            {item.t}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                            {item.badge}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {item.d}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-primary opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/#quiz"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Voir tous les quiz
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
