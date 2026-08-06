import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { QuizShowcase } from "@/components/home/QuizShowcase";
import { FichesPreview } from "@/components/home/FichesPreview";
import { Button } from "@/components/ui/button";
import { fiches } from "@/data/fiches";
import { quizzes } from "@/data/quizzes";
import { getTenant } from "@/lib/tenant";
import { AffiliateDisclaimer } from "@/components/legal/AffiliateDisclaimer";
import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";

export default function HomePage() {
  const tenant = getTenant();

  return (
    <>
      <Hero />
      <QuizShowcase quizzes={quizzes} />
      <FichesPreview fiches={fiches} />

      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary to-primary-hover px-6 py-12 sm:px-12">
            <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-white text-balance sm:text-3xl">
                Avant d&apos;adopter un {tenant.breed}, accordez-vous quatre
                minutes de réflexion
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
                Le Beagle peut être un formidable compagnon, à condition que son
                énergie, son flair et son caractère correspondent à votre mode
                de vie. Notre quiz vous aide à faire le point sur vos absences,
                votre budget, votre environnement et vos attentes.
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
