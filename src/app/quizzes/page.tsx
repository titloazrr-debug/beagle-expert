import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { quizzes } from "@/data/quizzes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Quiz Beagle : adoption, assurance, croquettes et plus",
  description:
    "Quiz Beagle gratuits : adoption, croquettes, assurance santé, surpoids, GPS et jouets. Résultats clairs en quelques minutes.",
  path: "/quizzes",
  image: "/images/beagle/og-default.jpg",
  keywords: [
    "quiz Beagle",
    "assurance santé Beagle",
    "croquettes Beagle",
    "adoption Beagle",
    "collier GPS Beagle",
    "surpoids Beagle",
  ],
});

export default function QuizzesIndexPage() {
  const count = quizzes.length;
  return (
    <div className="container-page py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {count} quiz pour des réponses concrètes
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
          Tous les quiz
        </h1>
        <p className="mt-3 text-muted-foreground">
          Quelques questions, un profil clair et des pistes concrètes pour{" "}
          <em>votre</em> Beagle. Recommencez autant que vous voulez.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.slug}
            href={`/quiz/${quiz.slug}`}
            className="group block h-full"
          >
            <Card className="card-hover h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-4xl" aria-hidden>
                    {quiz.emoji}
                  </span>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="size-3" aria-hidden />~
                    {quiz.estimatedMinutes} min
                  </Badge>
                </div>
                <h2 className="mt-2 text-xl font-bold group-hover:text-primary transition-colors">
                  {quiz.title}
                </h2>
                <p className="text-sm text-muted-foreground">{quiz.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {quiz.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Lancer le quiz
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
