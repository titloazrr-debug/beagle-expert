import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getQuizBySlug, getAllQuizSlugs, quizzes } from "@/data/quizzes";
import { alternativeBreeds } from "@/data/alternative-breeds";
import { fiches } from "@/data/fiches";
import { QuizEngine } from "@/components/QuizEngine";
import { JsonLd } from "@/components/JsonLd";
import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";
import { QuizRecoDisclaimer } from "@/components/legal/QuizRecoDisclaimer";
import { Button } from "@/components/ui/button";
import {
  absoluteUrl,
  buildMetadata,
  breadcrumbJsonLd,
  productItemListJsonLd,
  quizJsonLd,
} from "@/lib/seo";
import { isMedicalQuizSlug } from "@/lib/legal";
import { isInsuranceQuizSlug } from "@/lib/compliance";
import { isFoodQuizSlug } from "@/lib/food-quiz";
import { isWalkingQuizSlug, WALKING_FAQ } from "@/lib/walking-quiz";
import { FOOD_PRODUCTS } from "@/data/foodProducts";
import type { Product } from "@/types";
import { InsuranceQuizFaq } from "@/components/insurance/InsuranceQuizFaq";
import { FoodQuizFaq } from "@/components/food/FoodQuizFaq";
import { WalkingQuizFaq } from "@/components/walking/WalkingQuizFaq";
import { cn } from "@/lib/utils";

/** Mappe les recettes croquettes vers le type Product (JSON-LD ItemList). */
function foodProductsAsCatalog(): Product[] {
  return FOOD_PRODUCTS.filter((p) => p.active).map((p) => ({
    id: p.id,
    name: p.name,
    shortDescription: p.features.slice(0, 2).join(". "),
    recommendation: p.features[0],
    category: "croquettes",
    priceCents: 0,
    affiliateUrl: "#",
    imageEmoji: "🥣",
    tags: p.tags,
    categories: ["alimentation", "croquettes"],
    advantages: p.features,
    disadvantages: p.cautions,
    bestFor: `Stade de vie : ${p.lifeStage}. Protéine : ${p.proteinSource}.`,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllQuizSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);
  if (!quiz) return {};
  return buildMetadata({
    title: quiz.seo.title,
    description: quiz.seo.description,
    path: `/quiz/${slug}`,
    image: "/images/beagle/og-default.jpg",
  });
}

export default async function QuizPage({ params }: PageProps) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);
  if (!quiz) notFound();

  const showMedicalDisclaimer = isMedicalQuizSlug(slug);
  const others = quizzes.filter((q) => q.slug !== slug);

  // Fiches qui pointent vers ce quiz, sinon fallback thématique
  let relatedFiches = fiches
    .filter((f) => f.relatedQuizSlugs?.includes(slug))
    .slice(0, 4)
    .map((f) => ({
      slug: f.slug,
      title: f.title,
      emoji: f.emoji,
      excerpt: f.excerpt,
    }));

  if (relatedFiches.length === 0) {
    const fallbackMap: Record<string, string[]> = {
      "pret-a-adopter": [
        "education-comportement",
        "budget-equipement",
        "histoire-standard",
      ],
      "collier-gps": ["education-comportement", "budget-equipement"],
      "harnais-beagle": ["education-comportement", "budget-equipement", "soins-entretien"],
      "risque-obesite": ["alimentation", "sante"],
      "alimentation-croquettes": ["alimentation", "sante", "budget-equipement"],
      "assurance-sante-beagle": ["sante", "budget-equipement", "soins-entretien"],
      "jouets-occupation": ["education-comportement", "budget-equipement"],
    };
    const slugs = fallbackMap[slug] ?? [];
    relatedFiches = fiches
      .filter((f) => slugs.includes(f.slug))
      .map((f) => ({
        slug: f.slug,
        title: f.title,
        emoji: f.emoji,
        excerpt: f.excerpt,
      }));
  }

  const insurance = isInsuranceQuizSlug(slug);
  const food = isFoodQuizSlug(slug);
  const walking = isWalkingQuizSlug(slug);
  const specialized = insurance || food || walking;
  const breadcrumbName = insurance
    ? "Assurance santé du Beagle"
    : food
      ? "Croquettes pour Beagle"
      : walking
        ? "Harnais pour Beagle"
        : quiz.title;

  const catalogProducts = food
    ? foodProductsAsCatalog()
    : (quiz.productCatalog ?? []);
  const productsLd =
    catalogProducts.length > 0
      ? productItemListJsonLd({
          name: `Produits du quiz — ${quiz.title}`,
          description: quiz.seo.description,
          path: `/quiz/${slug}`,
          products: catalogProducts,
        })
      : null;

  return (
    <>
      <JsonLd
        data={quizJsonLd({
          title: quiz.title,
          description: quiz.seo.description,
          path: `/quiz/${slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Quiz", path: "/quizzes" },
          {
            name: breadcrumbName,
            path: `/quiz/${slug}`,
          },
        ])}
      />
      {specialized && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: quiz.seo.title,
            description: quiz.seo.description,
            url: absoluteUrl(`/quiz/${slug}`),
            inLanguage: "fr-FR",
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["[data-agent-conclusion]", "h1", "h2"],
            },
          }}
        />
      )}
      {productsLd && <JsonLd data={productsLd} />}
      {walking && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: WALKING_FAQ.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }}
        />
      )}

      <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
        <div className="container-page py-6">
          <nav aria-label="Fil d'Ariane" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/quizzes" className="hover:text-primary">
                  Quiz
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground line-clamp-1">
                {breadcrumbName}
              </li>
            </ol>
          </nav>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/quizzes">
              <ArrowLeft className="size-4" aria-hidden />
              Tous les quiz
            </Link>
          </Button>
        </div>
      </div>

      <div className="container-page py-8 sm:py-12">
        {showMedicalDisclaimer && (
          <div className="mx-auto mb-6 max-w-2xl">
            <MedicalDisclaimer variant="full" />
          </div>
        )}
        {!insurance && !food && !walking && (
          <div className="mx-auto mb-6 max-w-2xl">
            <QuizRecoDisclaimer compact />
          </div>
        )}
        <QuizEngine
          quiz={quiz}
          relatedFiches={relatedFiches}
          alternativeBreeds={
            slug === "pret-a-adopter" ? alternativeBreeds : []
          }
        />

        {insurance && (
          <div className="mx-auto mt-12 max-w-3xl">
            <InsuranceQuizFaq />
          </div>
        )}

        {food && (
          <div className="mx-auto mt-12 max-w-3xl">
            <FoodQuizFaq />
          </div>
        )}

        {walking && (
          <div className="mx-auto mt-12 max-w-3xl">
            <WalkingQuizFaq />
          </div>
        )}

        {others.length > 0 && (
          <div
            className={cn(
              "mx-auto mt-16 border-t border-border pt-10",
              specialized ? "max-w-3xl" : "max-w-2xl"
            )}
          >
            <h2 className="text-lg font-bold">Autres quiz</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((q) => (
                <li key={q.slug}>
                  <Link
                    href={`/quiz/${q.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition hover:border-primary/30 hover:shadow-md"
                  >
                    <span className="text-2xl" aria-hidden>
                      {q.emoji}
                    </span>
                    <span>{q.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
