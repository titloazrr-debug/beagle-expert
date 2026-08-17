import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import { QuizShowcase } from "@/components/home/QuizShowcase";
import { FichesPreview } from "@/components/home/FichesPreview";
import { AntiFugueKit } from "@/components/home/AntiFugueKit";
import { Button } from "@/components/ui/button";
import { Calculator, Compass, TrendingUp } from "lucide-react";
import { fiches } from "@/data/fiches";
import { quizzes } from "@/data/quizzes";
import { organizationJsonLd } from "@/lib/seo";
import { getTenant } from "@/lib/tenant";
import { AffiliateDisclaimer } from "@/components/legal/AffiliateDisclaimer";
import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";

export default function HomePage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />

      <section className="border-b border-border/40 py-6">
        <div className="container-page">
          <Button asChild variant="outline" size="lg" className="w-full gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10 sm:w-auto">
            <Link href="/par-ou-commencer">
              <Compass className="size-4" aria-hidden />
              Par où commencer ? — un guide pour les nouveaux visiteurs
            </Link>
          </Button>
        </div>
      </section>

      {/* Kit anti-fugue (prompt Hermes) : 3 couches + Weenect Partner+ */}
      <AntiFugueKit />

      <QuizShowcase quizzes={quizzes} />
      <FichesPreview fiches={fiches} />

      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary to-primary-hover px-6 py-12 sm:px-12">
            <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-white text-balance sm:text-3xl">
                Avant d&apos;adopter un {tenant.breed} : flair, énergie… et
                fugue
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
                Un Beagle épanoui demande des sorties, de l&apos;occupation
                mentale et un plan anti-fugue réaliste. Le quiz d&apos;adoption
                croise mode de vie, absences, budget et environnement — pour
                éviter les mauvaises surprises.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 border-0 bg-[#fffcf7] text-primary shadow-md hover:bg-white hover:text-primary-hover"
              >
                <Link href="/quiz/pret-a-adopter">
                  Faire le quiz « Suis-je prêt ? »
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Calculateur budget interactif */}
      <section className="border-t border-border/60 bg-gradient-to-b from-background to-muted/30 py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl shadow-sm ring-1 ring-primary/20">
              <Calculator className="size-7 text-primary" aria-hidden />
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
              Combien coûte vraiment un {tenant.breed} ?
            </h2>
            <p className="measure-wide mx-auto mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Alimentation, assurance, GPS, soins vétérinaires… Notre
              calculateur interactif vous donne une estimation personnalisée
              en 30 secondes. Ajustez les paramètres et voyez le budget
              évoluer en temps réel.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="xl" className="min-h-14 gap-2 text-base shadow-lg sm:text-lg">
                <Link href="/fiche/budget-equipement#calculateur-budget">
                  <Calculator className="size-5" aria-hidden />
                  Estimer mon budget
                </Link>
              </Button>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <TrendingUp className="size-4 text-primary" aria-hidden />
                Gratuit, sans inscription
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparence — ton expert, non commercial */}
      <section className="border-t border-border/60 bg-muted/30 py-12 sm:py-14">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">
              Informations importantes
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Les contenus publiés sur {tenant.name} sont fournis à titre
              informatif. Ils ne remplacent ni l&apos;examen ni les
              recommandations personnalisées d&apos;un vétérinaire ou d&apos;un
              professionnel qualifié.
            </p>
            <div className="mt-4">
              <MedicalDisclaimer variant="short" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">
              Comment le site est-il financé ?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Certains liens sont affiliés : un achat via ces liens peut nous
              rapporter une commission, sans surcoût pour vous. Cela nous aide à
              faire vivre {tenant.name}. Nous recommandons uniquement ce que
              nous jugeons pertinent pour les besoins du Beagle.
            </p>
            <div className="mt-4">
              <AffiliateDisclaimer variant="short" showLegalLink />
            </div>
            <Link
              href="/mentions-legales"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              En savoir plus sur notre fonctionnement
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
