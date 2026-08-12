import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import type { Quiz } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizShowcaseProps {
  quizzes: Quiz[];
}

/** Ordre d’affichage sur l’accueil — fugue / sécurité d’abord */
const PRIORITY = [
  "collier-gps",
  "harnais-beagle",
  "pret-a-adopter",
  "jouets-occupation",
  "alimentation-croquettes",
  "risque-obesite",
  "assurance-sante-beagle",
];

/** Copy accueil centré sur la question du visiteur (sans casser les titres SEO des pages quiz) */
const HOME_COPY: Record<
  string,
  { badge: string; pitch: string; cta: string }
> = {
  "collier-gps": {
    badge: "Priorité fugue",
    pitch:
      "Une odeur, et le Beagle peut disparaître. Quiz GPS : filet de sécurité selon rappel, terrain et priorité (localisation pure type Weenect vs suite app).",
    cta: "Trouver le GPS anti-fugue",
  },
  "harnais-beagle": {
    badge: "Setup promenade",
    pitch:
      "Harnais, laisse, longe & identification : composez un setup qui tient quand le flair tire plus fort que la voix.",
    cta: "Trouver son équipement",
  },
  "pret-a-adopter": {
    badge: "À faire avant d’adopter",
    pitch:
      "Temps, absences, promenades, bruit, budget — et capacité à gérer la fugue : le Beagle est-il compatible avec votre vie ?",
    cta: "Tester ma compatibilité",
  },
  "assurance-sante-beagle": {
    badge: "~3 min",
    pitch:
      "Accident, maladie, prévention, franchise ou plafond : quels critères comptent vraiment dans votre situation ?",
    cta: "Définir mes priorités",
  },
  "alimentation-croquettes": {
    badge: "~3 min",
    pitch:
      "Âge, silhouette, activité et digestion : quel type de croquettes correspond le mieux à votre Beagle ?",
    cta: "Trouver son profil",
  },
  "risque-obesite": {
    badge: "Environ 3 min",
    pitch:
      "Portions, friandises, activité et silhouette : repérez les habitudes qui favorisent la prise de poids.",
    cta: "Évaluer son risque",
  },
  "jouets-occupation": {
    badge: "Flair & énergie",
    pitch:
      "Canaliser le nez à la maison limite l’ennui… et parfois l’envie de filer dès la porte ouverte.",
    cta: "Trouver son activité",
  },
};

export function QuizShowcase({ quizzes }: QuizShowcaseProps) {
  const sorted = [...quizzes].sort((a, b) => {
    const ia = PRIORITY.indexOf(a.slug);
    const ib = PRIORITY.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  const featured = sorted;

  return (
    <section id="quiz" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="size-3.5" aria-hidden />
              Quiz interactifs
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
              Des réponses adaptées à votre Beagle
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Quelques questions, un résultat adapté à{" "}
              <em className="not-italic font-medium text-foreground">
                votre
              </em>{" "}
              situation, et des pistes concrètes pour votre Beagle.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/quizzes">
              Découvrir tous les quiz
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((quiz, i) => {
            const copy = HOME_COPY[quiz.slug];
            return (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]",
                  "transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]",
                  i === 0 && "sm:ring-2 sm:ring-primary/20"
                )}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-80" />
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex size-14 items-center justify-center rounded-2xl bg-muted text-3xl shadow-inner"
                    aria-hidden
                  >
                    {quiz.emoji}
                  </span>
                  <Badge variant={i === 0 ? "default" : "secondary"}>
                    {copy?.badge ?? `~${quiz.estimatedMinutes} min`}
                  </Badge>
                </div>
                <h3 className="mt-5 text-xl font-bold leading-snug transition-colors group-hover:text-primary">
                  {quiz.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                  {copy?.pitch ?? quiz.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />
                    {quiz.questions.length} questions
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-primary">
                    {copy?.cta ?? "Commencer"}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
