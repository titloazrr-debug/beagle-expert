"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Info,
  Radio,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Tag,
} from "lucide-react";
import type { Quiz } from "@/types";
import {
  resolveWalkingAffiliateUrl,
  type WalkingProduct,
} from "@/data/walkingProducts";
import {
  buildWalkingResult,
  WALKING_AFFILIATE_DISCLAIMER,
  type WalkingAnswers,
} from "@/lib/walking-quiz";
import { WalkingAnalytics } from "@/lib/analytics";
import { BeagleExpertTagCard } from "@/components/walking/BeagleExpertTagCard";
import { WalkingEducational } from "@/components/walking/WalkingEducational";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WalkingQuizResultProps {
  quiz: Quiz;
  answers: WalkingAnswers;
  onRestart: () => void;
}

function ProductRow({
  product,
  profileId,
}: {
  product: WalkingProduct;
  profileId: string;
}) {
  const url = resolveWalkingAffiliateUrl(product);
  if (!product.active) return null;

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-bold leading-snug">{product.name}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.retailer}
          </p>
        </div>
      </div>
      {product.strengths.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {product.strengths.slice(0, 3).map((s) => (
            <li
              key={s}
              className="flex items-start gap-2 text-sm text-foreground/85"
            >
              <CheckCircle2
                className="mt-0.5 size-3.5 shrink-0 text-primary"
                aria-hidden
              />
              {s}
            </li>
          ))}
        </ul>
      )}
      {url ? (
        <Button asChild variant="affiliate" className="mt-4 min-h-11 w-full sm:w-auto">
          <a
            href={url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() =>
              WalkingAnalytics.productClick({
                productId: product.id,
                placement: "result_equipment",
                resultProfile: profileId,
              })
            }
          >
            {product.ctaLabel}
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>
      ) : (
        process.env.NODE_ENV === "development" && (
          <p className="mt-3 text-xs text-muted-foreground">
            URL absente — configurez{" "}
            <code className="font-mono">{product.affiliateUrlEnv}</code>
          </p>
        )
      )}
    </article>
  );
}

export function WalkingQuizResult({
  answers,
  onRestart,
}: WalkingQuizResultProps) {
  const result = buildWalkingResult(answers);

  return (
    <div className="space-y-6">
      {/* Header setup */}
      <section
        aria-labelledby="walking-setup-heading"
        className="overflow-hidden rounded-3xl border-2 border-primary/25 shadow-[var(--shadow-soft)]"
      >
        <div className="bg-gradient-to-br from-primary via-primary to-primary-hover px-6 py-8 sm:px-8">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            <Sparkles className="size-3.5" aria-hidden />
            Votre setup promenade Beagle
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h2
              id="walking-setup-heading"
              className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-white text-balance sm:text-3xl"
            >
              {result.title}
            </h2>
            {result.badge && (
              <Badge className="border-0 bg-white/20 text-white">
                {result.badge}
              </Badge>
            )}
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            {result.description}
          </p>
        </div>

        {/* 4 lignes setup */}
        <div className="grid gap-3 bg-card p-5 sm:grid-cols-2 sm:p-7">
          <SetupLine
            emoji="🦮"
            label="Harnais"
            value={result.setup.harnessType}
            detail={result.setup.harnessDetail}
          />
          <SetupLine
            emoji="🪢"
            label="Laisse / longe"
            value={result.setup.leadLabel}
            detail={`Repère : ${result.setup.leadLengthHint}`}
          />
          <SetupLine
            emoji="🏷️"
            label="Identification"
            value={result.setup.identificationLabel}
          />
          <SetupLine
            emoji="📡"
            label="GPS"
            value={result.setup.gpsLabel}
          />
        </div>
      </section>

      {/* Pourquoi */}
      {result.influencers.length > 0 && (
        <section
          aria-labelledby="walking-why-heading"
          className="rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <h3
            id="walking-why-heading"
            className="text-lg font-bold tracking-tight"
          >
            Pourquoi ce résultat ?
          </h3>
          <ul className="mt-4 space-y-2.5">
            {result.influencers.map((inf) => (
              <li
                key={inf.questionId}
                className="flex items-start gap-2.5 text-sm text-foreground/90"
              >
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                {inf.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Priorité */}
      <section
        aria-labelledby="walking-priority-heading"
        className="rounded-3xl border border-primary/20 bg-primary/5 px-6 py-5"
      >
        <h3
          id="walking-priority-heading"
          className="text-xs font-bold uppercase tracking-wider text-primary"
        >
          Votre priorité
        </h3>
        <p className="mt-2 text-base font-semibold leading-snug text-foreground sm:text-lg">
          {result.priority}
        </p>
      </section>

      {/* Callouts */}
      {result.callouts.map((c) => (
        <div
          key={c.title + c.body.slice(0, 24)}
          role="note"
          className={cn(
            "flex gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed",
            c.tone === "warn"
              ? "border-amber-300/80 bg-amber-50 text-amber-950"
              : "border-border bg-muted/40 text-foreground/90"
          )}
        >
          {c.tone === "warn" ? (
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          ) : (
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          )}
          <div>
            <p className="font-bold">{c.title}</p>
            <p className="mt-1">{c.body}</p>
          </div>
        </div>
      ))}

      {/* Module identification */}
      {result.identificationStatus === "missing_tag" && (
        <section
          aria-labelledby="walking-tag-heading"
          className="rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <h3
            id="walking-tag-heading"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <Tag className="size-5 text-primary" aria-hidden />
            Identification rapide : pensez à une médaille
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            Une médaille indiquant au minimum un numéro de téléphone permet à
            une personne qui retrouve votre Beagle de vous contacter
            immédiatement. Elle complète l’identification officielle mais ne la
            remplace pas (puce, tatouage, I-CAD).
          </p>
        </section>
      )}

      {result.hasTagAlready && (
        <p
          className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground/90"
          role="status"
        >
          Vous disposez déjà d’une médaille — pensez simplement à vérifier que
          le numéro est toujours le bon.
        </p>
      )}

      <BeagleExpertTagCard resultProfile={result.profileId} />

      {/* Checklist équipement */}
      {result.checklist.length > 0 && (
        <section
          aria-labelledby="walking-checklist-heading"
          className="rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <h3 id="walking-checklist-heading" className="text-lg font-bold">
            Checklist personnalisée
          </h3>
          <ul className="mt-4 space-y-2.5">
            {result.checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-foreground/90"
              >
                <span
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-primary/40 text-[10px] font-bold text-primary"
                  aria-hidden
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Produits partenaires */}
      {result.products.length > 0 && (
        <section
          aria-labelledby="walking-products-heading"
          className="space-y-4"
        >
          <div>
            <h3 id="walking-products-heading" className="text-lg font-bold">
              Équipement à examiner
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {WALKING_AFFILIATE_DISCLAIMER}
            </p>
          </div>
          <div className="grid gap-3">
            {result.products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                profileId={result.profileId}
              />
            ))}
          </div>
        </section>
      )}

      {/* GPS cross-link */}
      {(result.showGpsCrosslink || result.secondaryGpsCta) && (
        <section className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 to-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <Radio className="size-5 text-primary" aria-hidden />
            {result.hasGpsAlready
              ? "GPS déjà en place"
              : result.gpsRelevance === "high"
                ? "GPS : fortement pertinent"
                : "GPS : pertinent dans votre situation"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {result.hasGpsAlready
              ? "Vous disposez déjà de cette couche de sécurité. Le GPS localise un chien qui s’est éloigné — il ne remplace ni le rappel ni la longe."
              : "Un GPS permet de localiser un chien qui s’est éloigné. Il complète harnais et longe, il ne les remplace pas."}
          </p>
          {!result.hasGpsAlready && (
            <Button asChild className="mt-4 min-h-11" variant="default">
              <Link
                href="/quiz/collier-gps"
                onClick={() =>
                  WalkingAnalytics.gpsCrosslinkClick({
                    resultProfile: result.profileId,
                    placement: "result_gps_block",
                  })
                }
              >
                Voir aussi : Quel GPS pour mon Beagle ?
              </Link>
            </Button>
          )}
        </section>
      )}

      {/* À retenir */}
      <section
        aria-labelledby="walking-tips-heading"
        className="rounded-3xl border border-border bg-card p-6 shadow-sm"
      >
        <h3 id="walking-tips-heading" className="text-lg font-bold">
          À retenir en promenade
        </h3>
        <ul className="mt-4 space-y-2.5">
          {result.tips.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
            >
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-accent"
                aria-hidden
              />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <WalkingEducational />

      {/* Cross-links */}
      <section
        aria-labelledby="walking-more-heading"
        className="rounded-3xl border border-border bg-muted/30 p-6"
      >
        <h3 id="walking-more-heading" className="text-lg font-bold">
          À découvrir aussi
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              href: "/quiz/collier-gps",
              emoji: "📡",
              title: "Quel GPS pour mon Beagle ?",
            },
            {
              href: "/quiz/jouets-occupation",
              emoji: "🧸",
              title: "Quel jouet d’occupation pour mon Beagle ?",
            },
            {
              href: "/quiz/pret-a-adopter",
              emoji: "🏡",
              title: "Suis-je prêt à adopter un Beagle ?",
            },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-11 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium transition hover:border-primary/30 hover:shadow-md"
                onClick={() => {
                  if (item.href.includes("collier-gps")) {
                    WalkingAnalytics.gpsCrosslinkClick({
                      resultProfile: result.profileId,
                      placement: "discover_more",
                    });
                  }
                }}
              >
                <span className="text-2xl" aria-hidden>
                  {item.emoji}
                </span>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="min-h-11"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw className="size-4" aria-hidden />
          Refaire le quiz
        </Button>
      </div>
    </div>
  );
}

function SetupLine({
  emoji,
  label,
  value,
  detail,
}: {
  emoji: string;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/20 px-4 py-3.5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <span aria-hidden>{emoji} </span>
        {label}
      </p>
      <p className="mt-1 text-sm font-bold leading-snug text-foreground sm:text-[15px]">
        {value}
      </p>
      {detail && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {detail}
        </p>
      )}
    </div>
  );
}
