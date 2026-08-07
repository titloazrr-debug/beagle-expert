"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Trophy,
} from "lucide-react";
import type { AlternativeBreed, Fiche, Quiz } from "@/types";
import {
  aggregateScores,
  pickResultProfile,
  rankProductsForScores,
  getQuizProductsByIds,
  shouldShowAlternativeBreeds,
} from "@/lib/content/quiz-logic";
import { isInsuranceQuizSlug } from "@/lib/compliance";
import {
  FoodAnalytics,
  InsuranceAnalytics,
  WalkingAnalytics,
} from "@/lib/analytics";
import { pickInsuranceResultProfile } from "@/lib/insurance-quiz";
import {
  buildFoodResult,
  isFoodQuizSlug,
  type FoodAnswers,
} from "@/lib/food-quiz";
import {
  buildWalkingResult,
  isWalkingQuizSlug,
  type WalkingAnswers,
} from "@/lib/walking-quiz";
import { ProgressBar } from "@/components/ProgressBar";
import { ProductCard } from "@/components/ProductCard";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";
import { SocialProof } from "@/components/SocialProof";
import { AlternativeBreedsSection } from "@/components/AlternativeBreedsSection";
import { InsuranceQuizResult } from "@/components/insurance/InsuranceQuizResult";
import { FoodQuizResult } from "@/components/food/FoodQuizResult";
import { WalkingQuizResult } from "@/components/walking/WalkingQuizResult";
import { QuizRecoDisclaimer } from "@/components/legal/QuizRecoDisclaimer";
import { AffiliateDisclaimer } from "@/components/legal/AffiliateDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizEngineProps {
  quiz: Quiz;
  relatedFiches?: Pick<Fiche, "slug" | "title" | "emoji" | "excerpt">[];
  /** Races alternatives (placeholders multi-races) */
  alternativeBreeds?: AlternativeBreed[];
}

type Phase = "intro" | "questions" | "result";
type AnswerMap = Record<string, string | string[]>;

const MULTI_EXCLUSIVE = new Set(["health-none", "health-nsp", "eq-none"]);

function computeAffinityPercent(
  scores: Record<string, number>,
  profileTags: string[]
): number {
  const tagScore = profileTags.reduce((s, t) => s + (scores[t] ?? 0), 0);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  if (total <= 0) return 72;
  const ratio = tagScore / total;
  return Math.min(98, Math.max(42, Math.round(ratio * 100)));
}

function hasAnswer(value: string | string[] | undefined): boolean {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

/** Flatten multi answers to single strings for scoring helpers that expect Record<string,string> */
function flattenAnswers(answers: AnswerMap): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(answers)) {
    out[k] = Array.isArray(v) ? v[0] ?? "" : v;
  }
  return out;
}

export function QuizEngine({
  quiz,
  relatedFiches = [],
  alternativeBreeds = [],
}: QuizEngineProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [direction, setDirection] = useState(1);
  const [emailCapture, setEmailCapture] = useState<{
    url: string;
    productName: string;
  } | null>(null);
  const isInsurance = isInsuranceQuizSlug(quiz.slug);
  const isFood = isFoodQuizSlug(quiz.slug);
  const isWalking = isWalkingQuizSlug(quiz.slug);
  const isSpecialized = isInsurance || isFood || isWalking;

  useEffect(() => {
    if (isInsurance) InsuranceAnalytics.view();
    if (isFood) FoodAnalytics.view();
    if (isWalking) WalkingAnalytics.view();
  }, [isInsurance, isFood, isWalking]);

  const total = quiz.questions.length;
  const question = quiz.questions[step];
  const isMulti = question?.type === "multi";
  const selected = question ? answers[question.id] : undefined;
  const canProceed = hasAnswer(selected);
  const progressValue =
    phase === "result" ? total : phase === "intro" ? 0 : step + 1;
  const progressMax = total;

  const result = useMemo(() => {
    if (phase !== "result" || isFood || isWalking) return null;
    const flat = flattenAnswers(answers);
    const scores = aggregateScores(quiz, flat);
    const { profile, matchScore } = isInsurance
      ? pickInsuranceResultProfile(quiz, flat)
      : pickResultProfile(quiz, scores);
    const reasons: string[] = [...profile.reasons];
    const affinity = computeAffinityPercent(scores, profile.tags);

    let recommendedProducts;

    if (quiz.mode === "product-score") {
      const ranked = rankProductsForScores(
        quiz,
        scores,
        4,
        profile.productIds.length ? profile.productIds : undefined
      );
      recommendedProducts =
        ranked.length > 0
          ? ranked.map((r, i) => ({
              product: r.product,
              reason:
                r.product.recommendation ||
                reasons[i] ||
                `Correspond à votre profil (${r.score} pts de matching).`,
            }))
          : getQuizProductsByIds(quiz, profile.productIds).map((p, i) => ({
              product: p,
              reason:
                p.recommendation || reasons[i] || profile.description,
            }));
    } else {
      recommendedProducts = getQuizProductsByIds(quiz, profile.productIds).map(
        (p, i) => ({
          product: p,
          reason: p.recommendation || reasons[i] || profile.description,
        })
      );
    }

    recommendedProducts = recommendedProducts.slice(0, 4);
    if (recommendedProducts.length < 2 && profile.productIds.length) {
      recommendedProducts = getQuizProductsByIds(quiz, profile.productIds)
        .slice(0, 4)
        .map((p, i) => ({
          product: p,
          reason: p.recommendation || reasons[i] || profile.description,
        }));
    }

    const showAlternativeBreeds = shouldShowAlternativeBreeds(quiz, profile);

    return {
      profile,
      matchScore,
      scores,
      affinity,
      recommendedProducts,
      showAlternativeBreeds,
    };
  }, [phase, answers, quiz, isInsurance, isFood, isWalking]);

  function selectOption(optionId: string) {
    if (!question) return;

    if (question.type === "multi") {
      setAnswers((prev) => {
        const current = prev[question.id];
        const list = Array.isArray(current)
          ? [...current]
          : current
            ? [current]
            : [];

        // Exclusive options clear others
        if (MULTI_EXCLUSIVE.has(optionId)) {
          return { ...prev, [question.id]: [optionId] };
        }

        // Selecting a non-exclusive removes exclusive
        let next = list.filter((id) => !MULTI_EXCLUSIVE.has(id));
        if (next.includes(optionId)) {
          next = next.filter((id) => id !== optionId);
        } else {
          next.push(optionId);
        }
        return { ...prev, [question.id]: next };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    }

    if (isInsurance) InsuranceAnalytics.answer(question.id);
    if (isFood) FoodAnalytics.answer(question.id);
    if (isWalking) WalkingAnalytics.answer(question.id);
  }

  function isOptionSelected(optionId: string): boolean {
    if (!selected) return false;
    if (Array.isArray(selected)) return selected.includes(optionId);
    return selected === optionId;
  }

  function goNext() {
    if (phase === "intro") {
      setPhase("questions");
      setStep(0);
      setDirection(1);
      if (isInsurance) InsuranceAnalytics.start();
      if (isFood) FoodAnalytics.start();
      if (isWalking) WalkingAnalytics.start();
      return;
    }
    if (!canProceed) return;
    if (step < total - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      setPhase("result");
      if (isInsurance) {
        const { profile } = pickInsuranceResultProfile(
          quiz,
          flattenAnswers(answers)
        );
        InsuranceAnalytics.complete(profile.id);
      }
      if (isFood) {
        const food = buildFoodResult(answers as FoodAnswers);
        FoodAnalytics.complete(food.id);
        FoodAnalytics.resultView(food.id);
      }
      if (isWalking) {
        const walking = buildWalkingResult(answers as WalkingAnswers);
        WalkingAnalytics.complete(walking.profileId);
        WalkingAnalytics.resultView(walking.profileId);
      }
    }
  }

  function goBack() {
    if (phase === "questions" && step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    } else if (phase === "questions" && step === 0) {
      setPhase("intro");
    }
  }

  function restart() {
    if (isFood) FoodAnalytics.restart();
    if (isWalking) WalkingAnalytics.restart();
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setDirection(1);
  }

  return (
    <div
      className={cn(
        "mx-auto w-full",
        isSpecialized && phase === "result" ? "max-w-3xl" : "max-w-2xl"
      )}
    >
      {phase !== "intro" && (
        <div className="mb-6 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <ProgressBar
            value={progressValue}
            max={progressMax}
            label={
              phase === "result"
                ? "Quiz terminé 🎉"
                : `Question ${step + 1} sur ${total}`
            }
            size="lg"
          />
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border-primary/20 shadow-[var(--shadow-soft)]">
              <div className="bg-gradient-to-br from-primary/12 via-card to-accent/8 px-6 py-9 sm:px-9">
                <div
                  className="flex size-16 items-center justify-center rounded-3xl bg-card text-5xl shadow-md ring-1 ring-border"
                  aria-hidden
                >
                  {quiz.emoji}
                </div>
                {isInsurance && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">
                    Quiz Beagle Expert · Assurance santé
                  </p>
                )}
                {isFood && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">
                    Quiz Beagle Expert · Alimentation
                  </p>
                )}
                {isWalking && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">
                    Quiz Beagle Expert · Promenade &amp; sécurité
                  </p>
                )}
                <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
                  {isInsurance
                    ? "Quelle protection santé choisir pour mon Beagle ?"
                    : isWalking
                      ? "Quel harnais choisir pour mon Beagle ?"
                      : quiz.title}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {isWalking
                    ? "Harnais, laisse ou longe : trouvez une configuration adaptée en 8 questions."
                    : quiz.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                  {isInsurance
                    ? "L’âge du chien, votre capacité à avancer une facture vétérinaire et le niveau de remboursement recherché peuvent fortement changer les critères à privilégier. Répondez à 7 questions pour obtenir un profil de couverture clair avant de comparer les devis."
                    : isWalking
                      ? "Un bon équipement ne sert pas seulement à retenir votre chien. Il doit lui permettre de marcher, flairer et explorer confortablement tout en conservant un niveau de sécurité adapté à son rappel et à votre environnement."
                      : quiz.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                  <li className="rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
                    {total} questions
                  </li>
                  <li className="rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
                    ~{quiz.estimatedMinutes} min
                  </li>
                  <li className="rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
                    {isWalking
                      ? "Aucun email demandé"
                      : isInsurance || isFood
                        ? "Email facultatif"
                        : "Recos personnalisées"}
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="mt-8 min-h-11 w-full sm:w-auto"
                  onClick={goNext}
                >
                  <Sparkles className="size-4" aria-hidden />
                  Commencer le quiz
                </Button>
                {isInsurance && (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Le quiz ne réalise aucun diagnostic et ne remplace ni les
                    documents contractuels ni les explications de l&apos;assureur.
                  </p>
                )}
                {isFood && (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Le quiz ne réalise aucun diagnostic et ne remplace pas un
                    avis vétérinaire.
                  </p>
                )}
                {isWalking && (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Ce quiz fournit des repères généraux. Vérifiez toujours
                    l&apos;ajustement du matériel et son état avant une promenade.
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {phase === "questions" && question && (
          <motion.div
            key={question.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 32, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -24, scale: 0.98 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border-border shadow-[var(--shadow-soft)]">
              <CardHeader className="space-y-2 pb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Question {step + 1}/{total}
                </p>
                <CardTitle className="text-xl leading-snug sm:text-2xl text-balance">
                  {question.question}
                </CardTitle>
                {question.helper && (
                  <p className="text-sm text-muted-foreground">
                    {question.helper}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div
                  role={isMulti ? "group" : "radiogroup"}
                  aria-label={question.question}
                  className="space-y-2.5"
                >
                  {question.options.map((opt, optIndex) => {
                    const isSelected = isOptionSelected(opt.id);
                    return (
                      <motion.button
                        key={opt.id}
                        type="button"
                        role={isMulti ? "checkbox" : "radio"}
                        aria-checked={isSelected}
                        onClick={() => selectOption(opt.id)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: optIndex * 0.04, duration: 0.2 }}
                        className={cn(
                          "flex w-full min-h-11 items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-200",
                          "hover:border-primary/40 hover:bg-primary/5 active:scale-[0.995]",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                            : "border-border bg-card"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 transition-colors",
                            isMulti ? "rounded-md" : "rounded-full",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30"
                          )}
                          aria-hidden
                        >
                          {isSelected && <CheckCircle2 className="size-3.5" />}
                        </span>
                        <span className="text-sm font-medium leading-snug sm:text-[15px]">
                          {opt.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
                {isMulti && (
                  <p className="text-xs text-muted-foreground">
                    Plusieurs réponses possibles.
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-5">
                  <Button variant="ghost" onClick={goBack} type="button">
                    <ArrowLeft className="size-4" aria-hidden />
                    Retour
                  </Button>
                  <Button
                    onClick={goNext}
                    disabled={!canProceed}
                    type="button"
                    className="min-h-11"
                  >
                    {step === total - 1
                      ? quiz.ctaLabel ?? "Voir mon résultat"
                      : "Suivant"}
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === "result" && isFood && (
          <motion.div
            key="result-food"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto w-full max-w-3xl space-y-6"
          >
            <FoodQuizResult
              quiz={quiz}
              answers={answers as FoodAnswers}
              onRestart={restart}
            />
            {relatedFiches.length > 0 && (
              <div className="rounded-3xl border border-border bg-muted/30 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <BookOpen className="size-5 text-primary" aria-hidden />
                  Approfondir avec les fiches
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {relatedFiches.map((f) => (
                    <Link
                      key={f.slug}
                      href={`/fiche/${f.slug}`}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="text-2xl" aria-hidden>
                        {f.emoji}
                      </span>
                      <span className="text-sm font-bold leading-snug">
                        {f.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {phase === "result" && isWalking && (
          <motion.div
            key="result-walking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto w-full max-w-3xl space-y-6"
          >
            <WalkingQuizResult
              quiz={quiz}
              answers={answers as WalkingAnswers}
              onRestart={restart}
            />
            {relatedFiches.length > 0 && (
              <div className="rounded-3xl border border-border bg-muted/30 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <BookOpen className="size-5 text-primary" aria-hidden />
                  Approfondir avec les fiches
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {relatedFiches.map((f) => (
                    <Link
                      key={f.slug}
                      href={`/fiche/${f.slug}`}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="text-2xl" aria-hidden>
                        {f.emoji}
                      </span>
                      <span className="text-sm font-bold leading-snug">
                        {f.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {phase === "result" && result && isInsurance && (
          <motion.div
            key="result-insurance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto w-full max-w-3xl space-y-6"
          >
            <InsuranceQuizResult
              quiz={quiz}
              profile={result.profile}
              answers={flattenAnswers(answers)}
              onRestart={restart}
            />
            {relatedFiches.length > 0 && (
              <div className="rounded-3xl border border-border bg-muted/30 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <BookOpen className="size-5 text-primary" aria-hidden />
                  Approfondir avec les fiches
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {relatedFiches.map((f) => (
                    <Link
                      key={f.slug}
                      href={`/fiche/${f.slug}`}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="text-2xl" aria-hidden>
                        {f.emoji}
                      </span>
                      <span className="text-sm font-bold leading-snug">
                        {f.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {phase === "result" && result && !isInsurance && !isFood && !isWalking && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Score + message */}
            <Card className="overflow-hidden border-primary/25 shadow-[var(--shadow-soft)]">
              <div className="bg-gradient-to-br from-primary via-primary to-primary-hover px-6 py-8 sm:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      <Trophy className="size-3.5" aria-hidden />
                      Résultat personnalisé
                    </p>
                    <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-balance text-white sm:text-3xl">
                      {result.profile.title}
                    </h2>
                  </div>
                  <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-3xl bg-white/15 text-center shadow-inner ring-2 ring-white/20">
                    <span className="text-3xl font-extrabold tabular-nums text-white">
                      {result.affinity}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-white/90">
                      affinité
                    </span>
                  </div>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
                  {result.profile.description}
                </p>
              </div>

              <div className="space-y-4 bg-card px-6 py-6 sm:px-8">
                {result.profile.reasons.length > 0 && (
                  <ul className="space-y-2.5">
                    {result.profile.reasons.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2.5 text-sm text-foreground/85"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={restart}
                  type="button"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Recommencer le quiz
                </Button>
              </div>
            </Card>

            {/* Multi-races : score moyen / faible uniquement (compatibilité mode de vie) */}
            {result.showAlternativeBreeds && alternativeBreeds.length > 0 && (
              <AlternativeBreedsSection breeds={alternativeBreeds} />
            )}

            <SocialProof className="mt-4" />

            {/* Produits */}
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                {result.showAlternativeBreeds
                  ? "Si vous avancez malgré tout avec un Beagle"
                  : "Produits recommandés pour vous"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.showAlternativeBreeds
                  ? "Quelques repères utiles si vous gardez le Beagle en tête plus tard."
                  : "Sélection selon vos réponses — 2 à 4 idées concrètes."}
              </p>
              {result.recommendedProducts.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                  Aucun produit catalogue pour ce profil — explorez les fiches
                  Budget et Éducation.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {result.recommendedProducts.map(({ product, reason }, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.25 }}
                      className="rounded-2xl bg-gradient-to-b from-primary/[0.02] to-card p-0.5"
                    >
                      <div className="rounded-2xl border-2 border-primary/15 bg-card shadow-sm transition hover:shadow-md">
                        <ProductCard
                          product={product}
                          reason={reason}
                          rank={i + 1}
                          onBeforeNavigate={(url, name) =>
                            setEmailCapture({ url, productName: name })
                          }
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <QuizRecoDisclaimer className="mt-4" compact />
              <AffiliateDisclaimer
                variant="box"
                className="mt-2"
                showLegalLink
              />
            </div>

            {/* Fiches liées */}
            {relatedFiches.length > 0 && (
              <div className="rounded-3xl border border-border bg-muted/30 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <BookOpen className="size-5 text-primary" aria-hidden />
                  Approfondir avec les fiches
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lectures courtes pour aller plus loin sur le même sujet.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {relatedFiches.map((f) => (
                    <Link
                      key={f.slug}
                      href={`/fiche/${f.slug}`}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="text-2xl" aria-hidden>
                        {f.emoji}
                      </span>
                      <span>
                        <span className="block text-sm font-bold leading-snug">
                          {f.title}
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {f.excerpt}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Button asChild variant="secondary" className="mt-4">
                  <Link href="/fiches">
                    Voir toutes les fiches
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <EmailCaptureModal
        isOpen={emailCapture !== null}
        productName={emailCapture?.productName ?? ""}
        redirectUrl={emailCapture?.url ?? ""}
        onClose={() => setEmailCapture(null)}
        onSuccess={(email) => {
          console.log("Email capturé:", email);
          // TODO: envoyer vers API d'emailing
        }}
      />
    </div>
  );
}
