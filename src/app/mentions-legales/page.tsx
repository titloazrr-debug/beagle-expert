import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LEGAL_PUBLISHER, MEDICAL_DISCLAIMER_FULL } from "@/lib/legal";
import { AffiliateDisclaimer } from "@/components/legal/AffiliateDisclaimer";
import { getTenant } from "@/lib/tenant";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales",
  description: `Mentions légales du site ${LEGAL_PUBLISHER.siteName}.`,
  path: "/mentions-legales",
  image: "/images/beagle/og-default.jpg",
});

export default function MentionsLegalesPage() {
  const tenant = getTenant();
  const p = LEGAL_PUBLISHER;

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        Informations légales
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
        Mentions légales
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour
        la confiance dans l’économie numérique.
      </p>

      <div className="prose-legal mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/90">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">1. Éditeur du site</h2>
          <ul className="mt-3 space-y-1.5 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">Nom : </span>
              {p.companyName}
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Forme / statut :{" "}
              </span>
              {p.legalForm}
            </li>
            <li>
              <span className="font-semibold text-foreground">Siège : </span>
              {p.address}
            </li>
            <li>
              <span className="font-semibold text-foreground">Email : </span>
              <a
                href={`mailto:${p.email}`}
                className="text-primary hover:underline"
              >
                {p.email}
              </a>
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Directeur de la publication :{" "}
              </span>
              {p.publicationDirector}
            </li>
            <li>
              <span className="font-semibold text-foreground">Site : </span>
              {tenant.siteUrl}
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">2. Hébergement</h2>
          <ul className="mt-3 space-y-1.5 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">Hébergeur : </span>
              {p.hostName}
            </li>
            <li>
              <span className="font-semibold text-foreground">Adresse : </span>
              {p.hostAddress}
            </li>
            <li>
              <span className="font-semibold text-foreground">Site : </span>
              <a
                href={p.hostWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {p.hostWebsite}
              </a>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">3. Objet du site</h2>
          <p className="mt-3 text-muted-foreground">
            {tenant.name} propose des contenus d’information, des fiches
            pratiques et des quiz relatifs à la race {tenant.breed}, ainsi que
            des liens vers des produits ou services susceptibles d’être proposés
            en affiliation.
          </p>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-bold text-amber-950">
            4. Avertissement santé animale
          </h2>
          <p className="mt-3 text-amber-950/90">{MEDICAL_DISCLAIMER_FULL}</p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">5. Propriété intellectuelle</h2>
          <p className="mt-3 text-muted-foreground">
            L’ensemble des contenus présents sur le site (textes, structure,
            éléments graphiques, logos, sauf mentions contraires) est protégé
            par le droit de la propriété intellectuelle. Toute reproduction non
            autorisée est interdite.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">6. Liens d’affiliation</h2>
          <div className="mt-3">
            <AffiliateDisclaimer variant="full" />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">7. Données personnelles</h2>
          <p className="mt-3 text-muted-foreground">
            Pour plus d’informations sur le traitement des données personnelles
            et les cookies, consultez la{" "}
            <Link
              href="/politique-de-confidentialite"
              className="font-semibold text-primary hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">8. Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Pour toute question relative aux présentes mentions :{" "}
            <a
              href={`mailto:${p.email}`}
              className="font-semibold text-primary hover:underline"
            >
              {p.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
