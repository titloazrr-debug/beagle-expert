"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Utensils,
} from "lucide-react";
import type { Quiz } from "@/types";
import {
  FOOD_AFFILIATE_DISCLAIMER,
  FOOD_BRAND_INTRO,
  FOOD_RECIPE_TYPE_LABELS,
  FOOD_RESULT_DISCLAIMER,
  type FoodProduct,
  grainStatusLabel,
  resolveProductCtaUrl,
  resolveRationCalculatorUrl,
} from "@/data/foodProducts";
import {
  buildAnswerRecap,
  buildFoodResult,
  type FoodAnswers,
  resolveDisplayProduct,
} from "@/lib/food-quiz";
import { FoodAnalytics } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FoodQuizResultProps {
  quiz: Quiz;
  answers: FoodAnswers;
  onRestart: () => void;
}

function grainBadge(product: FoodProduct): string {
  if (product.grainStatus === "grain_free") return "Sans céréales";
  if (product.grainStatus === "low_grain") return "Faible teneur en céréales";
  if (product.id === "upd-senior-care")
    return "Contient des céréales (riz, maïs)";
  return grainStatusLabel(product.grainStatus);
}

/** Carte conversion principale — le « choix du quiz » */
function PrimaryChoiceCard({
  product,
  profileId,
  status,
}: {
  product: FoodProduct;
  profileId: string;
  status: "ok" | "inactive" | "out_of_stock" | "missing";
}) {
  const [open, setOpen] = useState(false);
  const recipeType =
    FOOD_RECIPE_TYPE_LABELS[product.id] ?? product.lifeStage;
  const { url, isAffiliate } = resolveProductCtaUrl(product);
  const isDev = process.env.NODE_ENV === "development";
  const previewFeatures = product.features.slice(0, 3);
  const moreFeatures = product.features.slice(3);
  const ctaDisabled = status === "out_of_stock";

  function onCtaClick() {
    FoodAnalytics.affiliateClick({
      productId: product.id,
      placement: "primary_hero",
      resultProfile: profileId,
    });
  }

  return (
    <section
      aria-labelledby="food-choice-heading"
      className="overflow-hidden rounded-3xl border-2 border-accent shadow-[0_8px_32px_-8px_rgb(107_63_26_/_0.35)]"
    >
      {/* Bandeau résultat */}
      <div className="bg-accent px-5 py-3 sm:px-6">
        <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-accent-foreground">
          <Sparkles className="size-3.5" aria-hidden />
          Votre résultat — croquettes recommandées
        </p>
      </div>

      <div className="bg-gradient-to-b from-[#fff8f0] to-card px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-accent">
              Choix du quiz
            </p>
            <h2
              id="food-choice-heading"
              className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight tracking-tight text-foreground text-balance sm:text-3xl"
            >
              {recipeType}
            </h2>
            <p className="mt-2 text-base font-semibold text-foreground/90">
              {product.name}
            </p>
            <p className="mt-1 text-sm font-medium text-accent">
              Ultra Premium Direct
              {product.proteinSource ? ` · ${product.proteinSource}` : ""}
            </p>
          </div>
          <Badge className="shrink-0 border-0 bg-primary text-primary-foreground">
            {grainBadge(product)}
          </Badge>
        </div>

        <ul className="mt-5 space-y-2">
          {previewFeatures.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-sm text-foreground/90"
            >
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-accent"
                aria-hidden
              />
              {f}
            </li>
          ))}
        </ul>

        {status === "out_of_stock" && (
          <p
            className="mt-4 rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2 text-sm text-amber-950"
            role="status"
          >
            Cette recette est actuellement indiquée comme indisponible.
          </p>
        )}

        {/* CTA principal toujours visible */}
        <div className="mt-6 space-y-3">
          {!ctaDisabled && (
            <Button
              asChild
              variant="affiliate"
              size="xl"
              className="h-14 w-full text-base shadow-lg shadow-accent/30 sm:text-lg"
            >
              <a
                href={url}
                target="_blank"
                rel={
                  isAffiliate
                    ? "sponsored noopener noreferrer"
                    : "noopener noreferrer"
                }
                onClick={onCtaClick}
              >
                Voir la recette et la promo
                <ExternalLink className="size-5" aria-hidden />
              </a>
            </Button>
          )}
          {!ctaDisabled && (
            <Button
              asChild
              variant="outline"
              className="min-h-11 w-full border-2 border-accent/40 text-accent hover:border-accent hover:bg-accent/5"
            >
              <a
                href={url}
                target="_blank"
                rel={
                  isAffiliate
                    ? "sponsored noopener noreferrer"
                    : "noopener noreferrer"
                }
                onClick={onCtaClick}
              >
                Voir la composition et les formats
              </a>
            </Button>
          )}
          {isDev && !isAffiliate && (
            <p className="text-center text-xs text-muted-foreground">
              Lien de secours (site UDP) · configurez{" "}
              <code className="font-mono">{product.affiliateUrlEnv}</code> pour
              l’affiliation.
            </p>
          )}
        </div>

        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          Une offre est souvent proposée aux nouveaux clients sur le site Ultra
          Premium Direct (conditions et montant variables).
        </p>
        <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
          {isAffiliate
            ? "Lien affilié : commission possible sans surcoût pour vous."
            : "Redirection vers Ultra Premium Direct."}
        </p>

        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            if (!open) FoodAnalytics.productExpand(product.id);
          }}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1 text-sm font-semibold text-primary"
          aria-expanded={open}
        >
          {open ? "Masquer les détails" : "En savoir plus sur cette recette"}
          <ChevronDown
            className={cn("size-4 transition", open && "rotate-180")}
            aria-hidden
          />
        </button>
        {open && (
          <div className="mt-3 space-y-3 border-t border-border/60 pt-3 text-sm text-muted-foreground">
            {moreFeatures.length > 0 && (
              <ul className="space-y-1.5">
                {moreFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-foreground/90"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {product.cautions.length > 0 && (
              <p className="text-xs leading-relaxed">
                {product.cautions.join(" ")}
              </p>
            )}
            <p className="text-xs">
              Formats catalogue : {product.packageSizes.join(", ")}. Vérifié le{" "}
              {product.verifiedAt}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function AlternativeCard({
  product,
  profileId,
  status,
}: {
  product: FoodProduct;
  profileId: string;
  status: "ok" | "inactive" | "out_of_stock" | "missing";
}) {
  const recipeType =
    FOOD_RECIPE_TYPE_LABELS[product.id] ?? product.lifeStage;
  const { url, isAffiliate } = resolveProductCtaUrl(product);
  if (status === "out_of_stock") return null;

  return (
    <Card className="border-dashed border-border p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Autre type à envisager
      </p>
      <h3 className="mt-1 text-lg font-extrabold tracking-tight">{recipeType}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      <Button asChild variant="outline" className="mt-4 min-h-11">
        <a
          href={url}
          target="_blank"
          rel={
            isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"
          }
          onClick={() =>
            FoodAnalytics.affiliateClick({
              productId: product.id,
              placement: "alternative",
              resultProfile: profileId,
            })
          }
        >
          Voir cette recette
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </Button>
    </Card>
  );
}

export function FoodQuizResult({
  quiz,
  answers,
  onRestart,
}: FoodQuizResultProps) {
  const result = buildFoodResult(answers);
  const recap = buildAnswerRecap(quiz, answers);
  const primary = resolveDisplayProduct(result.primaryProductId);
  const alternative = resolveDisplayProduct(result.alternativeProductId);
  const rationUrl = resolveRationCalculatorUrl();
  const isDev = process.env.NODE_ENV === "development";
  const recipeType = primary.product
    ? FOOD_RECIPE_TYPE_LABELS[primary.product.id]
    : null;
  const primaryCta = primary.product
    ? resolveProductCtaUrl(primary.product)
    : null;

  return (
    <div className="space-y-6">
      {/* 1. En-tête profil — court */}
      <Card className="overflow-hidden border-primary/30 shadow-[var(--shadow-soft)]">
        <div
          className={cn(
            "px-6 py-6 sm:px-8 sm:py-7",
            result.showCommercial
              ? "bg-gradient-to-br from-primary via-primary to-primary-hover"
              : "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900"
          )}
        >
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {result.showCommercial ? (
              <Utensils className="size-3.5" aria-hidden />
            ) : (
              <Stethoscope className="size-3.5" aria-hidden />
            )}
            {result.showCommercial
              ? "Résultat du quiz"
              : "Avis vétérinaire prioritaire"}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-balance text-white sm:text-3xl">
            {result.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
            {result.description}
          </p>

          {/* Type retenu = lien cliquable orange, bien distinct */}
          {result.showCommercial &&
            recipeType &&
            primary.product &&
            primaryCta && (
              <a
                href={primaryCta.url}
                target="_blank"
                rel={
                  primaryCta.isAffiliate
                    ? "sponsored noopener noreferrer"
                    : "noopener noreferrer"
                }
                onClick={() =>
                  FoodAnalytics.affiliateClick({
                    productId: primary.product!.id,
                    placement: "hero_type_retenu",
                    resultProfile: result.id,
                  })
                }
                className={cn(
                  "group mt-5 block rounded-2xl border-2 border-[#ea580c] bg-[#ff6b1a] px-4 py-4 shadow-lg shadow-orange-900/30",
                  "transition-all duration-200 hover:bg-[#f97316] hover:border-[#fb923c] hover:shadow-xl hover:shadow-orange-900/40",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  "active:scale-[0.99]"
                )}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                  Type retenu pour votre Beagle
                </p>
                <p className="mt-1 flex items-start justify-between gap-3 text-lg font-extrabold leading-snug text-white sm:text-xl">
                  <span>{recipeType}</span>
                  <ExternalLink
                    className="mt-0.5 size-5 shrink-0 opacity-90 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white/95">
                  Ultra Premium Direct — {primary.product.name}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-white/85 underline decoration-white/50 underline-offset-2 group-hover:decoration-white">
                  Voir le produit et la promo →
                </p>
              </a>
            )}
        </div>
      </Card>

      {/* 2. Carte conversion = cœur du résultat commercial */}
      {result.showCommercial && primary.product && (
        <PrimaryChoiceCard
          product={primary.product}
          profileId={result.id}
          status={primary.reason}
        />
      )}

      {result.showCommercial && !primary.product && (
        <p className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          Aucune recette n’est disponible pour ce profil pour le moment.
          {isDev &&
            " Vérifiez active: true et les IDs dans src/data/foodProducts.ts."}
        </p>
      )}

      {/* 3. Transparence marque (après le CTA) */}
      {result.showCommercial && (
        <Card className="border-border bg-muted/20 p-5 sm:p-6">
          <h3 className="text-sm font-extrabold tracking-tight text-foreground">
            Pourquoi cette marque
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {FOOD_BRAND_INTRO}
          </p>
          <p
            className="mt-3 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground"
            role="note"
          >
            {FOOD_AFFILIATE_DISCLAIMER}
          </p>
        </Card>
      )}

      {/* 4. Détails profil (secondaires, repliables pour ne pas noyer le CTA) */}
      <Card className="border-border p-5 sm:p-6">
        {(result.criteria.length > 0 || result.tips.length > 0) && (
          <details className="group" open={!result.showCommercial}>
            <summary className="cursor-pointer list-none text-sm font-extrabold text-foreground [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                Comprendre ce résultat
                <ChevronDown
                  className="size-4 transition group-open:rotate-180"
                  aria-hidden
                />
              </span>
            </summary>
            <div className="mt-4 space-y-5">
              {result.criteria.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-primary">
                    Critères retenus
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {result.criteria.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.tips.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-primary">
                    Pourquoi ce profil
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {result.tips.map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        )}

        {result.alerts.map((a) => (
          <div
            key={a}
            className="mt-4 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
            role="status"
          >
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {a}
            </p>
          </div>
        ))}

        {result.callout && (
          <div className="mt-4 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
            <p className="font-extrabold text-foreground">
              {result.callout.title}
            </p>
            <p className="mt-1.5 text-muted-foreground">{result.callout.body}</p>
          </div>
        )}

        {result.vetChecklist && result.vetChecklist.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary">
              Questions à poser au vétérinaire
            </h3>
            <ul className="mt-3 space-y-2">
              {result.vetChecklist.map((q) => (
                <li
                  key={q}
                  className="flex items-start gap-2 text-sm text-foreground/90"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recap.length > 0 && (
          <details className="mt-4 rounded-2xl border border-border/80 bg-muted/20 px-4 py-3">
            <summary className="cursor-pointer text-sm font-bold">
              Vos réponses en résumé
            </summary>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {recap.map((r) => (
                <li key={r.question}>
                  <span className="font-medium text-foreground">
                    {r.question}
                  </span>
                  <br />
                  {r.answer}
                </li>
              ))}
            </ul>
          </details>
        )}

        <Button
          variant="outline"
          className="mt-5 min-h-11"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw className="size-4" aria-hidden />
          Refaire le quiz
        </Button>
      </Card>

      {result.showCommercial &&
        alternative.product &&
        alternative.product.id !== primary.product?.id && (
          <AlternativeCard
            product={alternative.product}
            profileId={result.id}
            status={alternative.reason}
          />
        )}

      {result.showCommercial && (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {FOOD_RESULT_DISCLAIMER}
          </p>

          <Card className="border-border p-5 sm:p-6">
            <h3 className="text-base font-extrabold tracking-tight">
              Calculer sa ration
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Consultez le calculateur de ration Ultra Premium Direct et ajustez
              la quantité en surveillant régulièrement le poids et la silhouette
              de votre Beagle.
            </p>
            {rationUrl ? (
              <Button asChild variant="secondary" className="mt-4 min-h-11">
                <a
                  href={rationUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  onClick={() =>
                    FoodAnalytics.affiliateClick({
                      productId: "ration-calculator",
                      placement: "ration",
                      resultProfile: result.id,
                    })
                  }
                >
                  Calculer sa ration chez Ultra Premium Direct
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              </Button>
            ) : (
              isDev && (
                <p className="mt-3 text-xs text-amber-800">
                  Lien calculateur non configuré (
                  NEXT_PUBLIC_UPD_RATION_CALCULATOR_URL )
                </p>
              )
            )}
          </Card>

          <Card className="border-border p-5 sm:p-6">
            <h3 className="text-base font-extrabold tracking-tight">
              Changer progressivement ses croquettes
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Une transition alimentaire doit être progressive et adaptée à la
              tolérance du chien. Suivez les indications du fabricant ou celles
              de votre vétérinaire. En cas de vomissements, de diarrhées
              persistantes, de douleur ou d’abattement, interrompez la transition
              et demandez conseil.
            </p>
          </Card>

          <Card className="border-border p-5 sm:p-6">
            <h3 className="text-base font-extrabold tracking-tight">
              Trois habitudes souvent plus importantes que la marque
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              <li>
                <strong className="text-foreground">Mesurer la ration.</strong>{" "}
                <span className="text-muted-foreground">
                  Une gamelle remplie à l’œil peut rapidement dériver, surtout
                  chez un chien très gourmand.
                </span>
              </li>
              <li>
                <strong className="text-foreground">
                  Compter les friandises.
                </strong>{" "}
                <span className="text-muted-foreground">
                  Les récompenses utilisées pour l’éducation font partie de son
                  apport quotidien.
                </span>
              </li>
              <li>
                <strong className="text-foreground">
                  Surveiller la silhouette.
                </strong>{" "}
                <span className="text-muted-foreground">
                  Le poids seul ne suffit pas. Observez régulièrement sa taille
                  et la facilité avec laquelle vous sentez ses côtes.
                </span>
              </li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
