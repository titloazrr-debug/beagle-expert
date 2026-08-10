import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FlaskConical,
  Scale,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  aboutPageJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { getTenant } from "@/lib/tenant";
import { JsonLd } from "@/components/JsonLd";
import { SummaryBox } from "@/components/SummaryBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
  title: "Méthodologie et sources — Beagle Expert",
  description:
    "Comment Beagle Expert rédige fiches et quiz : sources, critères de recommandation produits, limites éditoriales et transparence d’affiliation.",
  path: "/methodologie",
  image: "/images/beagle/og-default.jpg",
  keywords: [
    "méthodologie Beagle Expert",
    "sources Beagle",
    "affiliation transparente",
    "quiz Beagle fiabilité",
  ],
});

const SOURCE_TYPES = [
  {
    title: "Standards et organismes de race",
    detail:
      "Standard FCI / clubs de race pour morphologie, usages historiques et traits de sélection (chien courant, flair, meute).",
  },
  {
    title: "Références santé accessibles",
    detail:
      "Guides vétérinaires grand public, synthèses PubMed / manuels (MSD), contenus d’organismes reconnus — jamais un diagnostic en ligne.",
  },
  {
    title: "Expérience terrain race Beagle",
    detail:
      "Retour propriétaire, besoins d’occupation olfactive, risque de fugue et gourmandise : utilisés pour prioriser les sujets, pas pour inventer des études.",
  },
  {
    title: "Données produits constructeurs",
    detail:
      "Compositions, formats, abonnements et arguments affichés par les marques — croisés avec les besoins du Beagle avant recommandation.",
  },
] as const;

const PRODUCT_CRITERIA = [
  "Pertinence pour un besoin Beagle concret (poids, oreilles, flair, fugue, budget)",
  "Transparence de l’offre (composition, abo, limites connues)",
  "Possibilité d’expliquer avantages ET inconvénients",
  "Alignement avec les réponses du quiz — pas avec le taux de commission",
] as const;

const LIMITS = [
  "Pas de diagnostic médical, ni de prescription d’alimentation thérapeutique",
  "Pas de conseil en assurance personnalisé au sens réglementaire",
  "Pas de classement exhaustif de « toutes les marques du marché »",
  "Les liens affiliés peuvent évoluer ; les URL vides (#) n’affichent pas de CTA marchand",
] as const;

export default function MethodologiePage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLd
        data={aboutPageJsonLd({
          path: "/methodologie",
          name: `Méthodologie et sources — ${tenant.name}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Méthodologie", path: "/methodologie" },
        ])}
      />

      <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
        <div className="container-page py-12 sm:py-16">
          <header className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Autorité éditoriale
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
              Méthodologie et sources
            </h1>
            <SummaryBox
              className="mt-6"
              text={`Beagle Expert publie des fiches et quiz d’information générale sur le Beagle. Les contenus synthétisent des sources accessibles (standard de race, santé grand public, expérience terrain) pour des actions concrètes — sans remplacer un vétérinaire ni un éducateur. Les recommandations produits s’expliquent par des critères explicites ; l’affiliation, lorsqu’elle existe, est déclarée et n’invente ni notes ni témoignages.`}
            />
          </header>

          <div className="mt-10 grid max-w-3xl gap-6">
            <Card className="border-border p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <FlaskConical
                  className="mt-0.5 size-6 shrink-0 text-primary"
                  aria-hidden
                />
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight">
                    Comment une fiche est rédigée
                  </h2>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <li>
                      <strong className="text-foreground">Sujet utile</strong>{" "}
                      : intention de recherche réelle (ex. maladies, budget,
                      espérance de vie) et angle Beagle.
                    </li>
                    <li>
                      <strong className="text-foreground">Synthèse</strong> :
                      points factuels, ordonnés, avec un bloc « En résumé »
                      extractible en tête de page.
                    </li>
                    <li>
                      <strong className="text-foreground">Limites</strong> :
                      disclaimers médicaux ou d’affiliation lorsque le sujet
                      l’exige.
                    </li>
                    <li>
                      <strong className="text-foreground">Maillage</strong> :
                      liens vers quiz et fiches connexes pour approfondir sans
                      sur-promettre.
                    </li>
                    <li>
                      <strong className="text-foreground">Sources</strong> :
                      liste en bas de fiche quand des références externes
                      stables sont citées.
                    </li>
                  </ol>
                </div>
              </div>
            </Card>

            <Card className="border-border p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <ClipboardList
                  className="mt-0.5 size-6 shrink-0 text-primary"
                  aria-hidden
                />
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight">
                    Comment un quiz fonctionne
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Un quiz mappe vos réponses à un{" "}
                    <strong className="text-foreground">profil</strong> (ou un
                    score produit), puis affiche une{" "}
                    <strong className="text-foreground">
                      conclusion structurée
                    </strong>{" "}
                    du type : « Selon ce quiz, votre profil correspond à… »,
                    suivie des points clés et des actions / produits
                    recommandés. Objectif : être lisible par un humain et
                    extractible par un agent.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      "Logique déterministe (règles ou scores) — pas de boîte noire opaque",
                      "Recommandations liées au profil, pas au montant de commission",
                      "Disclaimers d’information générale sur les sujets sensibles (santé, assurance)",
                    ].map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-sm text-muted-foreground sm:text-base"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
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
                    Types de sources utilisées
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {SOURCE_TYPES.map((s) => (
                      <li key={s.title}>
                        <p className="text-sm font-extrabold text-foreground">
                          {s.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {s.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Exemples de références externes citées sur le site (liste non
                    exhaustive) : standard FCI Beagle, AKC breed page, PubMed
                    (recherches « beagle health »), manuels santé animalière
                    grand public.
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
                    Critères de recommandation produits
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Nous ne prétendons pas tester tous les produits du marché.
                    Une option n’apparaît que si elle aide à répondre à un
                    besoin Beagle identifiable.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {PRODUCT_CRITERIA.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2 text-sm text-muted-foreground sm:text-base"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {c}
                      </li>
                    ))}
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
                    Affiliation (transparence)
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Certains liens sont affiliés : un achat via ces liens peut
                    générer une commission,{" "}
                    <strong className="text-foreground">
                      sans surcoût pour vous
                    </strong>
                    . Cela finance le site. Nous n’inventons pas de notes « /5 »
                    ni de témoignages fictifs. Tant qu’un programme n’est pas
                    validé, le bouton d’achat reste masqué ou inactif.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <Shield
                  className="mt-0.5 size-6 shrink-0 text-primary"
                  aria-hidden
                />
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight">
                    Limites assumées
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {LIMITS.map((l) => (
                      <li
                        key={l}
                        className="flex items-start gap-2 text-sm text-muted-foreground sm:text-base"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="border-border p-6 sm:p-8">
              <h2 className="text-lg font-extrabold tracking-tight">
                Mise à jour des contenus
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Chaque fiche affiche une date de modification lorsqu’elle est
                connue. Nous mettons à jour en priorité les pages à fort enjeu
                (santé, alimentation, budget) et les fiches liées à des
                programmes d’affiliation qui changent. Les agents et lecteurs
                peuvent s’appuyer sur le bloc « En résumé » et les FAQ pour une
                extraction rapide.
              </p>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild>
                <Link href="/a-propos">À propos de {tenant.name}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/fiches">Voir les fiches</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/quizzes">Voir les quiz</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/mentions-legales">
                  Mentions légales
                  <ExternalLink className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
