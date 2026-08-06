import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  ListChecks,
  Scale,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { fiches, getFicheBySlug, getAllFicheSlugs } from "@/data/fiches";
import { categoryLabels } from "@/data/categories";
import { getQuizBySlug } from "@/data/quizzes";
import { getProductsByIds } from "@/data/products";
import { getComparisonsForFiche } from "@/lib/content/load-comparisons";
import { AttentionBox } from "@/components/AttentionBox";
import { ProductCard } from "@/components/ProductCard";
import { ComparisonBlock } from "@/components/ComparisonBlock";
import { FicheRelatedLinks } from "@/components/FicheRelatedLinks";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildFicheMetadata,
  faqPageJsonLd,
} from "@/lib/seo";
import {
  getFicheCoverImage,
  getFicheOgImageSrc,
} from "@/lib/beagle-images";
import { BeagleImage } from "@/components/BeagleImage";
import { isMedicalFicheCategory } from "@/lib/legal";
import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";
import { QuizRecoDisclaimer } from "@/components/legal/QuizRecoDisclaimer";
import { AffiliateDisclaimer } from "@/components/legal/AffiliateDisclaimer";
import { cn } from "@/lib/utils";
import { getTenant } from "@/lib/tenant";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFicheSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fiche = getFicheBySlug(slug);
  if (!fiche) return {};
  return buildFicheMetadata(fiche);
}

export default async function FichePage({ params }: PageProps) {
  const { slug } = await params;
  const fiche = getFicheBySlug(slug);
  if (!fiche) notFound();

  const tenant = getTenant();
  const cat = categoryLabels[fiche.category];
  const showMedicalDisclaimer = isMedicalFicheCategory(fiche.category);
  const relatedProducts = getProductsByIds(fiche.relatedProductIds ?? []);
  const comparisons = getComparisonsForFiche(slug);
  const relatedQuizzes = (fiche.relatedQuizSlugs ?? [])
    .map((s) => getQuizBySlug(s))
    .filter(Boolean);

  const relatedFiches = (fiche.relatedFicheSlugs ?? [])
    .map((s) => getFicheBySlug(s))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  const otherFiches = fiches
    .filter(
      (f) =>
        f.slug !== slug &&
        !relatedFiches.some((r) => r.slug === f.slug)
    )
    .slice(0, 3);

  const introText = fiche.intro || fiche.excerpt;
  const faqItems = fiche.faq ?? [];
  const faqLd = faqItems.length ? faqPageJsonLd(faqItems) : null;
  const cover = getFicheCoverImage({
    slug: fiche.slug,
    category: fiche.category,
  });
  const ogSrc = getFicheOgImageSrc({
    slug: fiche.slug,
    category: fiche.category,
    ogImage: fiche.ogImage,
  });

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: fiche.title,
          description: fiche.seo.description,
          path: `/fiche/${slug}`,
          datePublished: fiche.datePublished,
          dateModified: fiche.dateModified,
          keywords: fiche.keywords,
          image: ogSrc,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Fiches", path: "/fiches" },
          { name: fiche.title, path: `/fiche/${slug}` },
        ])}
      />
      {faqLd && <JsonLd data={faqLd} />}

      <article
        className="pb-20"
        itemScope
        itemType="https://schema.org/Article"
      >
        <meta itemProp="headline" content={fiche.title} />
        <meta itemProp="description" content={fiche.seo.description} />
        <meta itemProp="author" content={tenant.name} />
        {fiche.datePublished && (
          <meta itemProp="datePublished" content={fiche.datePublished} />
        )}
        {(fiche.dateModified || fiche.datePublished) && (
          <meta
            itemProp="dateModified"
            content={fiche.dateModified ?? fiche.datePublished}
          />
        )}

        {showMedicalDisclaimer && <MedicalDisclaimer variant="banner" />}

        {/* Hero fiche */}
        <header className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-muted/40 via-background to-primary/5">
          <div className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="container-page relative py-10 sm:py-14">
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
                  <Link href="/fiches" className="transition hover:text-primary">
                    Fiches
                  </Link>
                </li>
                <li aria-hidden className="opacity-50">
                  /
                </li>
                <li className="font-medium text-foreground line-clamp-1">
                  {cat.label}
                </li>
              </ol>
            </nav>

            <Button asChild variant="ghost" size="sm" className="-ml-2 mb-5">
              <Link href="/fiches">
                <ArrowLeft className="size-4" aria-hidden />
                Toutes les fiches
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  cat.color
                )}
              >
                <span role="img" aria-label={cat.label}>
                  {cat.emoji}
                </span>{" "}
                {cat.label}
              </span>
              <Badge variant="muted" className="gap-1 font-normal">
                <Clock className="size-3" aria-hidden />
                {fiche.readingTime} min de lecture
              </Badge>
            </div>

            <div className="mt-5 max-w-3xl">
              <h1
                className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
                itemProp="headline"
              >
                {fiche.title}
              </h1>
              <p
                className="measure-wide mt-4 text-base leading-[1.7] text-foreground/90 sm:text-lg"
                itemProp="description"
              >
                {introText}
              </p>
              {fiche.intro && fiche.excerpt !== fiche.intro && (
                <p className="measure-wide mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {fiche.excerpt}
                </p>
              )}
            </div>

            {/* Image thématique sous le titre (next/image) */}
            {cover ? (
              <figure className="mt-8 overflow-hidden rounded-3xl border border-border bg-muted shadow-[var(--shadow-card)]">
                <BeagleImage
                  asset={cover}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 960px"
                  className="aspect-[16/10] w-full object-cover object-center sm:aspect-[2/1]"
                  width={cover.width}
                  height={cover.height}
                />
                <figcaption className="sr-only">{cover.alt}</figcaption>
              </figure>
            ) : (
              <div
                className="mt-6 flex size-16 items-center justify-center rounded-3xl bg-card text-4xl shadow-[var(--shadow-card)] ring-1 ring-border sm:size-20 sm:text-5xl"
                role="img"
                aria-label={`${tenant.breed} — ${cat.label}`}
              >
                {fiche.emoji}
              </div>
            )}

            {showMedicalDisclaimer && (
              <MedicalDisclaimer variant="full" className="mt-8 max-w-3xl" />
            )}
          </div>
        </header>

        <div className="container-page mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* Contenu */}
          <div className="min-w-0 space-y-8" itemProp="articleBody">
            {fiche.sections.map((section, index) => {
              const sectionProducts = getProductsByIds(
                section.productIds ?? []
              );
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
                  aria-labelledby={`section-heading-${section.id}`}
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground shadow-sm"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <h2
                      id={`section-heading-${section.id}`}
                      className="measure-wide pt-1.5 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
                    >
                      {section.title}
                    </h2>
                  </div>

                  <ul className="prose-readable measure-wide mt-6 space-y-3.5">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-base leading-[1.7] text-foreground"
                      >
                        <span
                          className="mt-2.5 size-2 shrink-0 rounded-full bg-primary"
                          aria-hidden
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {section.attention && (
                    <AttentionBox
                      className="mt-6"
                      title={section.attention.title}
                      text={section.attention.text}
                    />
                  )}

                  {sectionProducts.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent">
                        <ShoppingBag className="size-3.5" aria-hidden />
                        Recommandé pour cette section
                      </h3>
                      <AffiliateDisclaimer
                        variant="box"
                        className="mb-3"
                        showLegalLink
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        {sectionProducts.map((p) => (
                          <ProductCard
                            key={p.id}
                            product={p}
                            reason={p.recommendation || p.shortDescription}
                            compact
                            showProsCons
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {!sectionProducts.length && section.ctaLines?.length ? (
                    <div className="mt-6 rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/5 to-card p-5">
                      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent">
                        <ShoppingBag className="size-3.5" aria-hidden />
                        Produits utiles
                      </h3>
                      <ul className="mt-3 space-y-2.5">
                        {section.ctaLines.map((line) => (
                          <li
                            key={line}
                            className="text-sm leading-relaxed text-foreground/90"
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              );
            })}

            {relatedProducts.length > 0 && (
              <section
                className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 sm:p-8"
                aria-labelledby="related-products-heading"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" aria-hidden />
                  <h2
                    id="related-products-heading"
                    className="text-xl font-bold tracking-tight"
                  >
                    Sélection produits pour cette fiche
                  </h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Avantages, limites et public cible. Liens affiliés sans surcoût
                  pour vous.
                </p>
                <QuizRecoDisclaimer className="mt-4" compact />
                <AffiliateDisclaimer
                  variant="box"
                  className="mt-3"
                  showLegalLink
                />
                <div className="mt-6 grid gap-4 lg:grid-cols-1 xl:grid-cols-1">
                  {relatedProducts.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      reason={p.recommendation || p.shortDescription}
                      rank={i + 1}
                      showProsCons
                    />
                  ))}
                </div>
              </section>
            )}

            {comparisons.length > 0 && (
              <section
                className="space-y-5"
                aria-labelledby="comparisons-heading"
              >
                <div className="flex items-center gap-2 px-1">
                  <Scale className="size-5 text-primary" aria-hidden />
                  <h2
                    id="comparisons-heading"
                    className="text-xl font-bold tracking-tight"
                  >
                    Comparatifs pour décider
                  </h2>
                </div>
                <p className="measure-wide px-1 text-sm leading-relaxed text-muted-foreground">
                  Lectures croisées neutres : forces, limites, et quand choisir
                  l’une ou l’autre option.
                </p>
                {comparisons.map((c) => (
                  <ComparisonBlock key={c.id} comparison={c} />
                ))}
              </section>
            )}

            {faqItems.length > 0 && (
              <FaqAccordion items={faqItems} />
            )}

            {relatedFiches.length > 0 && (
              <FicheRelatedLinks
                currentSlug={slug}
                related={relatedFiches}
              />
            )}
          </div>

          {/* TOC sticky + side */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="hidden rounded-2xl border border-border bg-card/95 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm lg:block">
              <p className="flex items-center gap-2 text-sm font-bold">
                <ListChecks className="size-4 text-primary" aria-hidden />
                Dans cette fiche
              </p>
              <nav
                className="mt-3 max-h-[min(60vh,28rem)] space-y-1 overflow-y-auto pr-1"
                aria-label="Sommaire"
              >
                {fiche.sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex gap-2 rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
                  >
                    <span className="font-bold text-primary/60 tabular-nums">
                      {i + 1}.
                    </span>
                    <span className="leading-snug">{s.title}</span>
                  </a>
                ))}
              </nav>
            </div>

            <details className="rounded-2xl border border-border bg-card p-4 lg:hidden">
              <summary className="cursor-pointer list-none text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  <ListChecks className="size-4 text-primary" />
                  Sommaire ({fiche.sections.length} sections)
                </span>
              </summary>
              <nav className="mt-3 space-y-1" aria-label="Sommaire mobile">
                {fiche.sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {i + 1}. {s.title}
                  </a>
                ))}
              </nav>
            </details>

            {relatedQuizzes.length > 0 && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h2 className="text-sm font-bold">Quiz liés</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Personnalisez vos recommandations en 2–4 min.
                </p>
                <ul className="mt-3 space-y-2">
                  {relatedQuizzes.map(
                    (q) =>
                      q && (
                        <li key={q.slug}>
                          <Link
                            href={`/quiz/${q.slug}`}
                            className="flex items-center gap-2.5 rounded-xl border border-transparent bg-card px-3 py-2.5 text-sm font-medium shadow-sm transition hover:border-primary/25 hover:shadow-md"
                          >
                            <span
                              className="text-xl"
                              role="img"
                              aria-label={q.title}
                            >
                              {q.emoji}
                            </span>
                            <span className="leading-snug">{q.title}</span>
                          </Link>
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}

            {relatedFiches.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-bold">Fiches liées</h2>
                <ul className="mt-3 space-y-2">
                  {relatedFiches.map((f) => (
                    <li key={f.slug}>
                      <Link
                        href={`/fiche/${f.slug}`}
                        className="text-sm text-muted-foreground transition hover:text-primary"
                      >
                        <span role="img" aria-hidden>
                          {f.emoji}
                        </span>{" "}
                        {f.title.split(":")[0]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {otherFiches.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-bold">Autres fiches</h2>
                <ul className="mt-3 space-y-2">
                  {otherFiches.map((f) => (
                    <li key={f.slug}>
                      <Link
                        href={`/fiche/${f.slug}`}
                        className="text-sm text-muted-foreground transition hover:text-primary"
                      >
                        <span role="img" aria-hidden>
                          {f.emoji}
                        </span>{" "}
                        {f.title.split(":")[0]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  );
}
