import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, HeartHandshake, Scale, Sparkles } from "lucide-react";
import { aboutPageJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenant";
import { JsonLd } from "@/components/JsonLd";
import { SummaryBox } from "@/components/SummaryBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
  title: "À propos de Beagle Expert — méthode éditoriale",
  description:
    "Qui sommes-nous, comment nous rédigeons nos fiches et quiz, et comment nous gérons l’affiliation de façon transparente.",
  path: "/a-propos",
  image: "/images/beagle/og-default.jpg",
});

export default function AProposPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLd
        data={aboutPageJsonLd({
          path: "/a-propos",
          name: `À propos de ${tenant.name}`,
          description: tenant.description,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "À propos", path: "/a-propos" },
        ])}
      />
    <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
      <div className="container-page py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            Transparence
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
            À propos de {tenant.name}
          </h1>
          <SummaryBox
            className="mt-5"
            text={`${tenant.name} aide propriétaires et futurs adoptants de Beagle avec des fiches courtes et des quiz pratiques. Objectif : des choix plus éclairés sur la santé, l’alimentation, l’éducation et le budget — sans jargon inutile ni fausse promesse, et sans remplacer un professionnel.`}
          />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pour le détail des sources, des critères produits et des limites
            éditoriales, voir la page{" "}
            <Link
              href="/methodologie"
              className="font-semibold text-primary underline underline-offset-2 hover:no-underline"
            >
              Méthodologie et sources
            </Link>
            .
          </p>
        </header>

        <div className="mt-10 grid max-w-3xl gap-6">
          <Card className="border-border p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <HeartHandshake
                className="mt-0.5 size-6 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  Notre objectif
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Le Beagle a des besoins spécifiques (flair, gourmandise,
                  oreilles, énergie). {tenant.name} propose des{" "}
                  <strong className="font-semibold text-foreground">
                    fiches courtes
                  </strong>{" "}
                  et des{" "}
                  <strong className="font-semibold text-foreground">
                    quiz pratiques
                  </strong>{" "}
                  pour transformer ces points en actions concrètes au quotidien
                  — avant une adoption, ou dès qu&apos;une question se pose.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Nouveau sur le site ? Commencez par{" "}
                  <Link href="/par-ou-commencer" className="font-semibold text-primary underline underline-offset-2 hover:no-underline">
                    notre guide « Par où commencer ? »
                  </Link>{" "}
                  pour être redirigé vers le contenu adapté à votre situation.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-border p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <BookOpen
                className="mt-0.5 size-6 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  Méthode éditoriale
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Nous ne prétendons pas remplacer un vétérinaire ni un
                  éducateur. Nous{" "}
                  <strong className="font-semibold text-foreground">
                    synthétisons
                  </strong>{" "}
                  des informations issues de sources grand public et de
                  références reconnues (guides race, contenus vétérinaires
                  accessibles, retours d’élevage et de terrain), pour les rendre
                  plus claires et actionnables.
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                  <li>
                    Distinguer l’information générale du conseil personnalisé
                  </li>
                  <li>
                    Éviter les diagnostics en ligne et les formulations
                    alarmistes
                  </li>
                  <li>
                    Mettre à jour les contenus lorsque des points importants
                    évoluent
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="border-border p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Scale
                className="mt-0.5 size-6 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  Information ≠ conseil vétérinaire
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Les quiz et fiches aident à structurer une réflexion (âge,
                  silhouette, mode de vie, budget). Ils ne posent pas de
                  diagnostic, ne prescrivent pas d’alimentation thérapeutique et
                  ne se substituent pas à un examen clinique. En cas de doute
                  sur la santé de votre chien, consultez un professionnel.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-border p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Sparkles
                className="mt-0.5 size-6 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  Affiliation et sélection des produits
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Certains liens sont affiliés : si vous achetez via ces liens,
                  une commission peut nous être versée,{" "}
                  <strong className="font-semibold text-foreground">
                    sans surcoût pour vous
                  </strong>
                  . Cela contribue à financer le site.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Nous ne classons pas « toutes les marques du marché ». Nous
                  mettons en avant des options pertinentes pour le Beagle (par
                  exemple une gamme large et lisible en croquettes, des outils
                  d’occupation, un GPS de sécurité) lorsque le contexte du quiz
                  ou de la fiche le justifie. Les critères d’orientation des
                  quiz restent basés sur vos réponses, pas sur le montant d’une
                  commission.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Nous n’affichons pas de fausses notes « /5 » inventées, ni de
                  témoignages fictifs.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild>
              <Link href="/methodologie">Méthodologie et sources</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/quizzes">Découvrir les quiz</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/fiches">Lire les fiches</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/mentions-legales">Mentions légales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
