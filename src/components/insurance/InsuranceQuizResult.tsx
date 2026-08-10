"use client";

import {
  AlertTriangle,
  ArrowDown,
  RotateCcw,
  Shield,
} from "lucide-react";
import type { Quiz, QuizResultProfile } from "@/types";
import {
  buildAnswerRecap,
  getProfileCriteria,
  hasPreExistingFlag,
  INSURANCE_PITFALLS,
  priorityHighlightKey,
} from "@/lib/insurance-quiz";
import { InsuranceProvidersCompare } from "@/components/insurance/InsuranceProvidersCompare";
import { QuizCitableConclusion } from "@/components/QuizCitableConclusion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InsuranceQuizResultProps {
  quiz: Quiz;
  profile: QuizResultProfile;
  answers: Record<string, string>;
  onRestart: () => void;
}

function scrollToOffers() {
  const el = document.getElementById("insurance-offers");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Focus heading for accessibilité
    const heading = document.getElementById("offers-heading");
    heading?.focus({ preventScroll: true });
  }
}

export function InsuranceQuizResult({
  quiz,
  profile,
  answers,
  onRestart,
}: InsuranceQuizResultProps) {
  const criteria = getProfileCriteria(profile.id);
  const recap = buildAnswerRecap(quiz, answers);
  const highlight = priorityHighlightKey(answers);
  const preExisting = hasPreExistingFlag(answers);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/25 shadow-[var(--shadow-soft)]">
        <div className="bg-gradient-to-br from-primary via-primary to-primary-hover px-6 py-8 sm:px-8">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            <Shield className="size-3.5" aria-hidden />
            Profil de couverture
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-balance text-white sm:text-3xl">
            {profile.title}
          </h2>

          <Button
            type="button"
            variant="affiliate"
            size="lg"
            className="mt-6 min-h-12 w-full text-base shadow-lg shadow-black/20 sm:w-auto"
            onClick={scrollToOffers}
          >
            Voir notre recommandation
            <ArrowDown className="size-4" aria-hidden />
          </Button>
        </div>

        <div className="space-y-5 bg-card px-6 py-6 sm:px-8">
          <QuizCitableConclusion
            profileLabel={profile.title}
            recommendation={profile.description}
            reasons={[
              ...criteria.map((c) => `Critère prioritaire : ${c}`),
              ...profile.reasons,
            ].slice(0, 6)}
            actions={[
              {
                label: "Comparer des offres d’assurance adaptées",
                detail:
                  "Vérifiez plafonds, franchise, délai de carence et exclusions avant de souscrire.",
              },
              ...(preExisting
                ? [
                    {
                      label: "Signaler les antécédents à l’assureur",
                      detail:
                        "Les soins liés à un problème déjà connu sont en général exclus.",
                    },
                  ]
                : []),
            ]}
          />

          {preExisting && (
            <div
              className="rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
              role="alert"
            >
              <p className="flex items-start gap-2 font-extrabold">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                Attention aux antécédents
              </p>
              <p className="mt-1.5">
                La souscription peut rester utile pour de futurs problèmes sans
                rapport, mais les soins liés à une maladie, une blessure ou des
                symptômes antérieurs sont généralement exclus. Demandez une
                confirmation écrite à l&apos;assureur.
              </p>
            </div>
          )}

          {/* Raccourci aussi sous les critères si l’utilisateur lit le détail */}
          <Button
            type="button"
            variant="affiliate"
            className="min-h-11 w-full shadow-md sm:w-auto"
            onClick={scrollToOffers}
          >
            Voir notre recommandation
            <ArrowDown className="size-4" aria-hidden />
          </Button>

          <details className="rounded-2xl border border-border/80 bg-muted/20 px-4 py-3">
            <summary className="cursor-pointer text-sm font-bold text-foreground">
              Récapitulatif de vos réponses
            </summary>
            <ul className="mt-3 space-y-2">
              {recap.map((r) => (
                <li
                  key={r.question}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                >
                  <span className="block text-xs font-semibold text-muted-foreground">
                    {r.question}
                  </span>
                  <span className="text-foreground">{r.answer}</span>
                </li>
              ))}
            </ul>
          </details>

          <Button variant="outline" type="button" onClick={onRestart}>
            <RotateCcw className="size-4" aria-hidden />
            Refaire le quiz
          </Button>
        </div>
      </Card>

      <InsuranceProvidersCompare
        highlightKey={highlight}
        resultProfile={profile.id}
      />

      <section aria-labelledby="pitfalls-heading">
        <h3
          id="pitfalls-heading"
          className="text-lg font-extrabold tracking-tight"
        >
          Les pièges à éviter
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INSURANCE_PITFALLS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <p className="text-sm font-extrabold text-foreground">
                {p.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
