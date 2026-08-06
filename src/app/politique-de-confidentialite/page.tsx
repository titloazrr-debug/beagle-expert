import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LEGAL_PUBLISHER } from "@/lib/legal";
import { getTenant } from "@/lib/tenant";

export const metadata: Metadata = buildMetadata({
  title: "Politique de confidentialité",
  description: `Politique de confidentialité et cookies — ${LEGAL_PUBLISHER.siteName}.`,
  path: "/politique-de-confidentialite",
  image: "/images/beagle/og-default.jpg",
});

export default function PolitiqueConfidentialitePage() {
  const tenant = getTenant();
  const p = LEGAL_PUBLISHER;

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        RGPD & cookies
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
        Politique de confidentialité
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Dernière mise à jour : août 2025. Cette page décrit comment{" "}
        {tenant.name} traite les données personnelles conformément au RGPD.
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">1. Responsable du traitement</h2>
          <p className="mt-3 text-muted-foreground">
            Le responsable du traitement est l’éditeur du site {p.companyName}
            , joignable à{" "}
            <a
              href={`mailto:${p.email}`}
              className="font-semibold text-primary hover:underline"
            >
              {p.email}
            </a>
            . Les coordonnées complètes figurent dans les{" "}
            <Link
              href="/mentions-legales"
              className="font-semibold text-primary hover:underline"
            >
              mentions légales
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">2. Données collectées</h2>
          <p className="mt-3 text-muted-foreground">
            Selon votre usage du site, nous pouvons être amenés à traiter :
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              Données de navigation techniques (adresse IP, logs serveur, type
              de navigateur) — nécessaires à la sécurité et au fonctionnement
            </li>
            <li>
              Préférence de consentement cookies (stockée localement dans votre
              navigateur)
            </li>
            <li>
              Données que vous nous communiquez volontairement (ex. email de
              contact)
            </li>
            <li>
              Mesures d’audience ou de performance, uniquement si vous acceptez
              les cookies non essentiels
            </li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Les réponses aux quiz sont traitées localement dans votre navigateur
            pour afficher un résultat ; elles ne sont pas destinées à constituer
            un dossier médical.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">3. Finalités et bases légales</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">
                Fonctionnement du site
              </span>{" "}
              — intérêt légitime / exécution d’un service
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Sécurité et prévention des abus
              </span>{" "}
              — intérêt légitime
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Mesure d’audience (si acceptée)
              </span>{" "}
              — consentement
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Affiliation / suivi de performance commerciale (si acceptée)
              </span>{" "}
              — consentement et/ou intérêt légitime selon le dispositif
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Réponse aux messages
              </span>{" "}
              — mesures précontractuelles / intérêt légitime
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">4. Cookies</h2>
          <p className="mt-3 text-muted-foreground">
            Un bandeau vous permet d’accepter ou de refuser les cookies non
            strictement nécessaires. Vous pouvez modifier votre choix en
            effaçant les données du site dans les paramètres de votre navigateur
            (clé <code className="rounded bg-muted px-1 text-xs">beagle-expert-cookie-consent</code>
            ).
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Nécessaires :</strong>{" "}
              fonctionnement, sécurité, mémorisation du choix cookies
            </li>
            <li>
              <strong className="text-foreground">Optionnels :</strong>{" "}
              statistiques, personnalisation, affiliation — uniquement avec
              consentement
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">5. Destinataires</h2>
          <p className="mt-3 text-muted-foreground">
            Les données peuvent être traitées par l’éditeur et ses
            sous-traitants techniques (notamment l’hébergeur {p.hostName}),
            dans la limite nécessaire aux finalités. Aucune vente de données
            personnelles n’est pratiquée.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">6. Durées de conservation</h2>
          <p className="mt-3 text-muted-foreground">
            Les logs techniques sont conservés pour une durée limitée compatible
            avec la sécurité du site. Les messages de contact sont conservés le
            temps nécessaire au traitement de la demande, puis archivés ou
            supprimés selon les obligations légales applicables.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">7. Vos droits</h2>
          <p className="mt-3 text-muted-foreground">
            Conformément au RGPD, vous disposez d’un droit d’accès, de
            rectification, d’effacement, de limitation, d’opposition et de
            portabilité lorsque applicable, ainsi que du droit de définir des
            directives relatives au sort de vos données après votre décès. Vous
            pouvez exercer vos droits via{" "}
            <a
              href={`mailto:${p.email}`}
              className="font-semibold text-primary hover:underline"
            >
              {p.email}
            </a>
            . Vous pouvez également introduire une réclamation auprès de la
            CNIL (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              www.cnil.fr
            </a>
            ).
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">8. Sécurité</h2>
          <p className="mt-3 text-muted-foreground">
            Des mesures techniques et organisationnelles raisonnables sont mises
            en œuvre pour protéger les données. Aucun système n’étant
            infaillible, une sécurité absolue ne peut être garantie.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">9. Modifications</h2>
          <p className="mt-3 text-muted-foreground">
            Cette politique peut être mise à jour. La date de mise à jour figure
            en tête de page. En cas de changement substantiel, une information
            pourra être affichée sur le site.
          </p>
        </section>
      </div>
    </div>
  );
}
