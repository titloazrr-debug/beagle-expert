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
import { buildMetadata, breadcrumbJsonLd, quizJsonLd } from "@/lib/seo";
import { isMedicalQuizSlug } from "@/lib/legal";
import { isInsuranceQuizSlug } from "@/lib/compliance";
import { isFoodQuizSlug } from "@/lib/food-quiz";
import { InsuranceQuizFaq } from "@/components/insurance/InsuranceQuizFaq";
import { FoodQuizFaq } from "@/components/food/FoodQuizFaq";
import { cn } from "@/lib/utils";

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
  const breadcrumbName = insurance
    ? "Assurance santé du Beagle"
    : food
      ? "Croquettes pour Beagle"
      : quiz.title;

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
      {(insurance || food) && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: quiz.seo.title,
            description: quiz.seo.description,
            url: `https://beagle-expert.fr/quiz/${slug}`,
            inLanguage: "fr-FR",
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
        {!insurance && !food && (
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

        {others.length > 0 && (
          <div
            className={cn(
              "mx-auto mt-16 border-t border-border pt-10",
              insurance || food ? "max-w-3xl" : "max-w-2xl"
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
