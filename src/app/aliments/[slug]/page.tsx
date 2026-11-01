import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";
import { PoisonCenters } from "@/components/aliments/PoisonCenters";
import { VerdictBanner } from "@/components/aliments/VerdictBadge";
import { SITE_AUTHOR } from "@/lib/author";
import {
  getAlimentBySlug,
  getAllAlimentSlugs,
  getAlimentsVerifiedAt,
} from "@/lib/aliments";
import { ALIMENTS_VERIFIED_LABEL } from "@/lib/aliments-shared";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllAlimentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const aliment = getAlimentBySlug(slug);
  if (!aliment) return {};
  const verified = getAlimentsVerifiedAt();
  return buildMetadata({
    title: aliment.seo.title,
    description: aliment.seo.description,
    path: `/aliments/${aliment.slug}`,
    keywords: aliment.keywords,
    type: "article",
    publishedTime: verified,
    modifiedTime: verified,
  });
}

export default async function AlimentPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug.includes(".")) notFound();
  const aliment = getAlimentBySlug(slug);
  if (!aliment) notFound();

  const path = `/aliments/${aliment.slug}`;
  const verified = getAlimentsVerifiedAt();
  const faq = faqPageJsonLd([
    { question: aliment.question, answer: aliment.reponse },
  ]);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: aliment.question,
          description: aliment.seo.description,
          path,
          datePublished: verified,
          dateModified: verified,
          keywords: aliment.keywords,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Aliments", path: "/aliments" },
          { name: aliment.nom, path },
        ])}
      />
      {faq ? <JsonLd data={faq} /> : null}

      <article
        className="pb-20"
        itemScope
        itemType="https://schema.org/Article"
      >
        <meta itemProp="headline" content={aliment.question} />
        <meta itemProp="description" content={aliment.seo.description} />
        <meta itemProp="author" content={SITE_AUTHOR.name} />
        <meta itemProp="datePublished" content={verified} />
        <meta itemProp="dateModified" content={verified} />

        <header className="border-b border-border/60 bg-gradient-to-br from-muted/40 via-background to-primary/5">
          <div className="container-page py-10 sm:py-14">
            <nav aria-label="Fil d'Ariane" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="transition hover:text-primary">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden className="opacity-50">
                  /
                </li>
                <li>
                  <Link href="/aliments" className="transition hover:text-primary">
                    Aliments
                  </Link>
                </li>
                <li aria-hidden className="opacity-50">
                  /
                </li>
                <li className="font-medium text-foreground">{aliment.nom}</li>
              </ol>
            </nav>

            <Link
              href="/aliments"
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Tous les aliments
            </Link>

            <p className="text-4xl" aria-hidden>
              {aliment.emoji}
            </p>
            <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {aliment.question}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Rédigé par{" "}
              <Link
                href={SITE_AUTHOR.urlPath}
                className="font-semibold text-primary underline underline-offset-2"
                itemProp="author"
              >
                {SITE_AUTHOR.name}
              </Link>
              <span aria-hidden> · </span>
              Vérifié le {ALIMENTS_VERIFIED_LABEL}
            </p>

            <div className="mt-6 max-w-3xl">
              <VerdictBanner verdict={aliment.verdict} />
            </div>
            <p
              className="measure-wide mt-5 text-base font-medium leading-[1.75] sm:text-lg"
              data-agent-summary="true"
              itemProp="description"
            >
              {aliment.reponse}
            </p>
            <MedicalDisclaimer variant="full" className="mt-8 max-w-3xl" />
          </div>
        </header>

        <div className="container-page mt-10 max-w-3xl space-y-8">
          <section
            id="pourquoi"
            className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight sm:text-2xl">
              Pourquoi
            </h2>
            <p className="mt-4 text-base leading-[1.75]">{aliment.pourquoi}</p>
          </section>

          <section
            id="signes"
            className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight sm:text-2xl">
              Signes à surveiller, et dans quel délai
            </h2>
            <p className="mt-4 text-base leading-[1.75]">{aliment.signes}</p>
          </section>

          <PoisonCenters intro={aliment.apresIngestion} />

          {aliment.preparation ? (
            <section
              id="comment-donner"
              className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
            >
              <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight sm:text-2xl">
                Comment en donner
              </h2>
              <p className="mt-4 text-base leading-[1.75]">
                {aliment.preparation}
              </p>
            </section>
          ) : null}

          <section aria-labelledby="liens-internes-heading">
            <h2
              id="liens-internes-heading"
              className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground"
            >
              Sur le site
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {aliment.liens.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold hover:border-primary/40 hover:text-primary"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-muted/20 p-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
              Sources vérifiées
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Pages consultées le {ALIMENTS_VERIFIED_LABEL}. Cette fiche ne
              remplace pas un avis vétérinaire. Voir aussi la{" "}
              <Link
                href="/methodologie"
                className="font-semibold text-primary underline underline-offset-2"
              >
                méthodologie éditoriale
              </Link>
              .
            </p>
            <ul className="mt-3 space-y-2">
              {aliment.sources.map((source) => (
                <li key={source.url} className="text-sm leading-relaxed">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    {source.titre}
                  </a>
                  <span className="text-muted-foreground">
                    {" "}
                    — {source.editeur}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}
