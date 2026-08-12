import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Zap, Calculator } from "lucide-react";
import { getTenant } from "@/lib/tenant";
import { BEAGLE_IMAGES, getHeroImage } from "@/lib/beagle-images";
import { BeagleImage } from "@/components/BeagleImage";
import { Button } from "@/components/ui/button";
import { fiches } from "@/data/fiches";
import { quizzes } from "@/data/quizzes";

const featuredQuizzes = [
  {
    e: "📡",
    t: "Quel GPS anti-fugue ?",
    d: "Flair, rappel, Weenect ou Tractive",
    href: "/quiz/collier-gps",
    badge: "Priorité",
  },
  {
    e: "🦮",
    t: "Quel harnais / setup ?",
    d: "Traction, longe, sécurité promenade",
    href: "/quiz/harnais-beagle",
    badge: "Promenade",
  },
  {
    e: "🏠",
    t: "Suis-je prêt à adopter ?",
    d: "Compatibilité mode de vie",
    href: "/quiz/pret-a-adopter",
    badge: "Essentiel",
  },
  {
    e: "🎓",
    t: "Fugue & éducation",
    d: "Rappel, flair, cadre anti-évasion",
    href: "/fiche/education-comportement",
    badge: "Fiche",
  },
];

export function Hero() {
  const tenant = getTenant();
  const heroImage = getHeroImage();
  const sideLeft = BEAGLE_IMAGES.education;
  const sideRight = BEAGLE_IMAGES.alimentation;
  const quizCount = quizzes.length;
  const ficheCount = fiches.length;

  return (
    <section className="gradient-hero relative border-b border-border/60">
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-page relative py-8 sm:py-12 lg:py-14">
        {/*
          Mobile : 1 photo (hero).
          Desktop : tryptique 3 colonnes égales (éducation | portrait | alimentation).
        */}
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)] sm:mb-6 sm:rounded-[1.75rem]">
          {/* Mobile */}
          <div className="sm:hidden">
            <BeagleImage
              asset={heroImage}
              alt="Beagle regardant la caméra"
              priority
              sizes="100vw"
              className="aspect-[4/3] max-h-[220px] w-full object-cover object-center"
              width={heroImage.width}
              height={heroImage.height}
            />
          </div>
          {/* Desktop / tablette : 3 photos */}
          <div
            className="hidden h-[240px] w-full grid-cols-3 gap-0 sm:grid lg:h-[270px]"
            role="img"
            aria-label="Beagle en promenade, portrait, et moment gourmand"
          >
            <div className="relative min-h-0 overflow-hidden">
              <BeagleImage
                asset={sideLeft}
                alt=""
                fill
                priority
                sizes="(max-width: 1280px) 30vw, 360px"
                className="object-cover object-center"
                wrapperClassName="absolute inset-0"
              />
            </div>
            <div className="relative min-h-0 overflow-hidden border-x border-white/30">
              <BeagleImage
                asset={heroImage}
                alt="Beagle regardant la caméra"
                fill
                priority
                sizes="(max-width: 1280px) 30vw, 360px"
                className="object-cover object-[center_35%]"
                wrapperClassName="absolute inset-0"
              />
            </div>
            <div className="relative min-h-0 overflow-hidden">
              <BeagleImage
                asset={sideRight}
                alt=""
                fill
                priority
                sizes="(max-width: 1280px) 30vw, 360px"
                className="object-cover object-center"
                wrapperClassName="absolute inset-0"
              />
            </div>
          </div>
        </div>

        {/* Badge fort contraste : fond clair, texte très sombre, extra gras */}
        <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-foreground shadow-sm sm:text-xs">
          <Sparkles
            className="size-3.5 shrink-0 text-accent"
            aria-hidden
          />
          <span className="min-w-0 leading-snug">
            {tenant.name} · Guide interactif Beagle
          </span>
        </p>

        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-[1.65rem] font-extrabold leading-[1.2] tracking-tight text-foreground text-balance sm:text-4xl sm:leading-[1.15] lg:text-[2.5rem]">
          Le Beagle suit son flair.
          <span className="mt-1 block text-primary sm:mt-0 sm:inline">
            {" "}
            Anticiper la fugue, c&apos;est le protéger.
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base sm:leading-[1.7]">
          Race de piste : une odeur, et le monde disparaît. Quiz et fiches pour
          sécuriser les sorties (harnais, longe, GPS), comprendre le rappel et
          faire les bons choix — sans panique ni fausse promesse.
        </p>

        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:gap-3">
          <Button asChild size="lg" className="min-h-11 shadow-md shadow-primary/20 sm:min-h-12">
            <Link href="/quiz/collier-gps">
              <Zap className="size-4 sm:size-5" aria-hidden />
              Quel GPS pour mon Beagle ?
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11 sm:min-h-12">
            <Link href="/fiche/education-comportement">
              <BookOpen className="size-4 sm:size-5" aria-hidden />
              Comprendre fugue &amp; rappel
            </Link>
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
          {[
            { v: String(ficheCount), l: "fiches" },
            { v: String(quizCount), l: "quiz" },
            { v: "2–4 min", l: "par résultat" },
          ].map((stat) => (
            <div
              key={stat.l}
              className="rounded-xl border border-border/70 bg-card/90 px-2 py-2.5 text-center shadow-sm sm:rounded-2xl sm:px-4 sm:py-3"
            >
              <dt className="text-lg font-extrabold text-primary sm:text-2xl">
                {stat.v}
              </dt>
              <dd className="mt-0.5 text-[10px] leading-snug text-muted-foreground sm:text-sm">
                {stat.l}
              </dd>
            </div>
          ))}
        </dl>

        {/* Quiz en grille 2×2 — format horizontal compact, pas une colonne haute */}
        <div className="mt-8 sm:mt-10">
          <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Les plus utiles
              </p>
              <p className="mt-0.5 text-sm font-extrabold text-foreground sm:text-base">
                Par où commencer ?
              </p>
            </div>
            <Link
              href="/#quiz"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm"
            >
              Tous les quiz
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {featuredQuizzes.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm transition hover:border-primary/35 hover:shadow-md sm:flex-col sm:gap-2 sm:p-4"
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl sm:size-11 sm:text-2xl"
                    aria-hidden
                  >
                    {item.e}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                      {item.badge}
                    </span>
                    <span className="mt-1.5 block text-sm font-bold leading-snug text-foreground group-hover:text-primary">
                      {item.t}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {item.d}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-primary opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:hidden"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA calculateur budget sous la grille */}
          <Link
            href="/fiche/budget-equipement#calculateur-budget"
            className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/25 bg-primary/[0.03] px-4 py-3.5 transition hover:border-primary/50 hover:bg-primary/[0.06] hover:shadow-sm sm:mt-4 sm:px-5 sm:py-4"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl sm:size-11">
              <Calculator className="size-5 text-primary" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-foreground sm:text-base">
                💰 Calculer mon budget Beagle
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                Alimentation, assurance, GPS : une estimation personnalisée en 30 secondes
              </span>
            </span>
            <ArrowRight
              className="size-5 shrink-0 text-primary opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
