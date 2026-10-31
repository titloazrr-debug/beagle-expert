import type { Metadata } from "next";
import Link from "next/link";
import { AlimentsBrowser } from "@/components/aliments/AlimentsBrowser";
import { JsonLd } from "@/components/JsonLd";
import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";
import { PoisonCenters } from "@/components/aliments/PoisonCenters";
import { getAllAliments } from "@/lib/aliments";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mon chien peut-il manger… ?",
  description:
    "Chocolat, raisin, oignon, xylitol, fruits : ce qui est toxique ou sans danger pour le chien. Verdicts sourcés, signes, et qui appeler.",
  path: "/aliments",
  keywords: [
    "mon chien peut-il manger",
    "aliments toxiques chien",
    "raisin chien",
    "chocolat chien",
    "xylitol chien",
  ],
});

export default function AlimentsPage() {
  const aliments = getAllAliments();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Aliments", path: "/aliments" },
        ])}
      />
      <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
        <div className="container-page py-12 sm:py-16">
          <header className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Base aliments
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Mon chien peut-il manger… ?
            </h1>
            <p
              className="mt-4 text-base leading-[1.7] text-foreground/90 sm:text-lg"
              data-agent-summary="true"
            >
              Un Beagle gourmand vole plus vite qu&apos;il ne réfléchit. Cette
              base répond pour les chiens en général : ce qui est toxique, ce
              qui se partage en petit morceau, et qui appeler si la table a
              déjà été visitée. {aliments.length} fiches, sans produit et sans
              lien affilié.
            </p>
          </header>
          <MedicalDisclaimer variant="full" className="mt-8 max-w-3xl" />
        </div>
      </div>

      <div className="container-page py-12 sm:py-16">
        <AlimentsBrowser
          items={aliments.map((aliment) => ({
            slug: aliment.slug,
            nom: aliment.nom,
            emoji: aliment.emoji,
            verdict: aliment.verdict,
            resume: aliment.resume,
            synonymes: aliment.synonymes,
            formes: aliment.formes,
          }))}
        />

        <div className="mt-14 max-w-3xl">
          <PoisonCenters intro="Vous ne trouvez pas l'aliment, ou le chien a déjà mangé ? N'attendez pas un avis sur internet." />
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Pour le poids, les croquettes et les restes de table au quotidien,{" "}
          <Link
            href="/fiche/alimentation"
            className="font-semibold text-primary underline underline-offset-2"
          >
            la fiche alimentation
          </Link>{" "}
          et{" "}
          <Link
            href="/fiche/sante"
            className="font-semibold text-primary underline underline-offset-2"
          >
            la fiche santé
          </Link>
          .
        </p>
      </div>
    </>
  );
}
