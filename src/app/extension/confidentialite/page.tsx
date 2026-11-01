import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LEGAL_PUBLISHER } from "@/lib/legal";

const PATH = "/extension/confidentialite";

export const metadata: Metadata = buildMetadata({
  title: "Confidentialité de l’extension",
  description:
    "Politique de confidentialité de l’extension Chrome « Toxique pour mon chien ? ». Aucune donnée n’est collectée.",
  path: PATH,
  image: "/images/beagle/og-default.jpg",
});

export default function ExtensionConfidentialitePage() {
  const email = LEGAL_PUBLISHER.email;

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        Extension Chrome
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
        Politique de confidentialité
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Extension « Toxique pour mon chien ? », proposée avec le site{" "}
        <Link href="/aliments" className="font-semibold text-primary hover:underline">
          expert-beagle.fr
        </Link>
        . Dernière mise à jour : 31 octobre 2026. Cette page décrit uniquement
        l’extension. Le site a sa{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-semibold text-primary hover:underline"
        >
          propre politique
        </Link>
        .
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Ce que fait l’extension</h2>
          <p className="mt-3 text-muted-foreground">
            Elle indique si un aliment figure dans la base publique Expert
            Beagle, et avec quel verdict. C’est son seul usage.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Données</h2>
          <p className="mt-3 text-muted-foreground">
            L’extension ne collecte pas de données personnelles. Elle n’a pas
            de compte, pas de formulaire, pas de cookie, pas d’analyse
            d’audience et pas de publicité.
          </p>
          <p className="mt-3 text-muted-foreground">
            Le texte que vous sélectionnez, ou que vous tapez dans la fenêtre,
            est comparé sur votre appareil à la liste des aliments. Il n’est
            pas envoyé à expert-beagle.fr, ni à un autre site. Il n’est pas
            enregistré comme historique de recherche.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Réseau</h2>
          <p className="mt-3 text-muted-foreground">
            Aucune requête n’est faite tant que vous n’autorisez pas l’accès à
            expert-beagle.fr.
          </p>
          <p className="mt-3 text-muted-foreground">
            Si vous cliquez sur « Mettre à jour la base » et que vous acceptez,
            l’extension télécharge uniquement cette adresse :
          </p>
          <p className="mt-3">
            <a
              href="https://expert-beagle.fr/aliments/index.json"
              className="font-semibold text-primary hover:underline"
            >
              https://expert-beagle.fr/aliments/index.json
            </a>
          </p>
          <p className="mt-3 text-muted-foreground">
            C’est la liste publique des aliments (nom, synonymes, verdict,
            résumé, lien de fiche). La requête ne contient pas votre recherche.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Stockage sur l’appareil</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              Le stockage de l’extension peut garder une copie de cette liste
              publique, et l’identifiant de la fenêtre de résultat.
            </li>
            <li>
              Rien de tout cela n’est synchronisé vers un serveur de
              l’extension : il n’y en a pas.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Autorisations</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              Menu contextuel : afficher « Toxique pour mon chien ? » sur une
              sélection de texte.
            </li>
            <li>
              Stockage : la copie locale de la liste et la fenêtre de résultat.
            </li>
            <li>
              Site expert-beagle.fr, facultatif : télécharger la liste
              ci-dessus.
            </li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            L’extension ne lit pas les pages que vous visitez, ne modifie pas
            la recherche, et ne remplace pas le nouvel onglet.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Pour une question sur cette politique :{" "}
            <a
              href={`mailto:${email}`}
              className="font-semibold text-primary hover:underline"
            >
              {email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
