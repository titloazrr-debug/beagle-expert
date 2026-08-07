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
  ArrowRight,
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
  featured,
}: {
  product: WalkingProduct;
  profileId: string;
  featured?: boolean;
}) {
  const url = resolveWalkingAffiliateUrl(product);
  if (!product.active) return null;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border-2 shadow-lg transition hover:-translate-y-0.5",
        featured
          ? "border-accent shadow-accent/20"
          : "border-accent/40 shadow-accent/10"
      )}
    >
      <div
        className={cn(
          "px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider",
          featured
            ? "bg-accent text-accent-foreground"
            : "bg-accent/15 text-accent"
        )}
      >
        {featured ? (
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" aria-hidden />
            Recommandation principale
          </span>
        ) : (
          "À examiner"
        )}
      </div>

      <div className="bg-gradient-to-b from-[#fff8f0] to-card px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-accent">
              {product.retailer}
            </p>
            <h4 className="mt-1 text-lg font-extrabold leading-snug text-foreground sm:text-xl">
              {product.name}
            </h4>
          </div>
          {featured && (
            <Badge className="shrink-0 border-0 bg-primary text-primary-foreground">
              ⭐ Choix du quiz
            </Badge>
          )}
        </div>

        {product.strengths.length > 0 && (
          <ul className="mt-4 space-y-2">
            {product.strengths.slice(0, 3).map((s) => (
              <li
                key={s}
                className="flex items-start gap-2.5 text-sm font-medium text-foreground/90"
              >
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden
                />
                {s}
              </li>
            ))}
          </ul>
        )}

        {url ? (
          <div className="mt-5 space-y-2">
            <Button
              asChild
              variant="affiliate"
              size="xl"
              className="h-14 w-full text-base shadow-lg shadow-accent/30 sm:text-lg"
            >
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
                <ExternalLink className="size-5" aria-hidden />
              </a>
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Lien affilié · sans surcoût pour vous
            </p>
          </div>
        ) : (
          process.env.NODE_ENV === "development" && (
            <p className="mt-4 text-xs text-muted-foreground">
              URL absente — configurez{" "}
              <code className="font-mono">{product.affiliateUrlEnv}</code>
            </p>
          )
        )}
      </div>
    </article>
  );
}

export function WalkingQuizResult({
  answers,
  onRestart,
}: WalkingQuizResultProps) {
  const result = buildWalkingResult(answers);
  const hasProducts = result.products.length > 0;

  return (
    <div className="space-y-6">
      {/* Header setup */}
      <section
        aria-labelledby="walking-setup-heading"
        className="overflow-hidden rounded-3xl border-2 border-accent/40 shadow-[0_12px_40px_-12px_rgb(107_63_26_/_0.35)]"
      >
        <div className="bg-gradient-to-br from-accent via-[#7a4a22] to-primary px-6 py-8 sm:px-8">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
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
              <Badge className="border-0 bg-white/25 text-white">
                {result.badge}
              </Badge>
            )}
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">
            {result.description}
          </p>
        </div>

        {/* 4 lignes setup — fort contraste */}
        <div className="grid gap-3 bg-[#1a120c] p-4 sm:grid-cols-2 sm:p-6">
          <SetupLine
            emoji="🦮"
            label="Harnais"
            value={result.setup.harnessType}
            detail={result.setup.harnessDetail}
            tone="accent"
          />
          <SetupLine
            emoji="🪢"
            label="Laisse / longe"
            value={result.setup.leadLabel}
            detail={`Repère : ${result.setup.leadLengthHint}`}
            tone="primary"
          />
          <SetupLine
            emoji="🏷️"
            label="Identification"
            value={result.setup.identificationLabel}
            tone="soft"
          />
          <SetupLine
            emoji="📡"
            label="GPS"
            value={result.setup.gpsLabel}
            tone={
              result.gpsRelevance === "high"
                ? "accent"
                : result.gpsRelevance === "medium"
                  ? "primary"
                  : "soft"
            }
          />
        </div>
      </section>

      {/* Priorité — bandeau visible */}
      <section
        aria-labelledby="walking-priority-heading"
        className="rounded-2xl border-2 border-primary bg-primary px-5 py-4 text-primary-foreground sm:px-6"
      >
        <h3
          id="walking-priority-heading"
          className="text-xs font-extrabold uppercase tracking-wider text-white/80"
        >
          Votre priorité
        </h3>
        <p className="mt-1.5 text-base font-bold leading-snug sm:text-lg">
          {result.priority}
        </p>
      </section>

      {/* Produits partenaires — bloc conversion prioritaire */}
      {hasProducts && (
        <section
          aria-labelledby="walking-products-heading"
          className="space-y-4"
        >
          <div className="rounded-2xl border-2 border-accent/30 bg-accent/10 px-5 py-4">
            <h3
              id="walking-products-heading"
              className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-accent"
            >
              <Sparkles className="size-5" aria-hidden />
              Équipement à examiner
            </h3>
            <p className="mt-1.5 text-sm font-medium text-foreground/90">
              Sélection alignée sur votre profil — cliquez pour voir l’offre.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {WALKING_AFFILIATE_DISCLAIMER}
            </p>
          </div>
          <div className="grid gap-4">
            {result.products.map((p, i) => (
              <ProductRow
                key={p.id}
                product={p}
                profileId={result.profileId}
                featured={i === 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* GPS cross-link — CTA fort */}
      {(result.showGpsCrosslink || result.secondaryGpsCta) &&
        !result.hasGpsAlready && (
          <section className="overflow-hidden rounded-3xl border-2 border-primary shadow-lg shadow-primary/15">
            <div className="bg-primary px-5 py-3 sm:px-6">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary-foreground">
                <Radio className="size-3.5" aria-hidden />
                {result.gpsRelevance === "high"
                  ? "GPS : fortement pertinent"
                  : "GPS : pertinent dans votre situation"}
              </p>
            </div>
            <div className="bg-gradient-to-b from-primary/10 to-card px-5 py-5 sm:px-6">
              <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                Un GPS permet de localiser un chien qui s’est éloigné. Il
                complète harnais et longe — il ne les remplace pas.
              </p>
              <Button
                asChild
                size="xl"
                className="mt-4 h-14 w-full text-base shadow-lg sm:text-lg"
              >
                <Link
                  href="/quiz/collier-gps"
                  onClick={() =>
                    WalkingAnalytics.gpsCrosslinkClick({
                      resultProfile: result.profileId,
                      placement: "result_gps_block",
                    })
                  }
                >
                  Quel GPS pour mon Beagle ?
                  <ArrowRight className="size-5" aria-hidden />
                </Link>
              </Button>
            </div>
          </section>
        )}

      {result.hasGpsAlready && (
        <p
          className="rounded-2xl border-2 border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground"
          role="status"
        >
          📡 GPS déjà en place — vérifiez batterie et abonnement. C’est une
          couche de sécurité utile en plus du harnais et de la longe.
        </p>
      )}

      {/* Pourquoi */}
      {result.influencers.length > 0 && (
        <section
          aria-labelledby="walking-why-heading"
          className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm"
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

      {/* Callouts */}
      {result.callouts.map((c) => (
        <div
          key={c.title + c.body.slice(0, 24)}
          role="note"
          className={cn(
            "flex gap-3 rounded-2xl border-2 px-4 py-3.5 text-sm leading-relaxed",
            c.tone === "warn"
              ? "border-amber-400 bg-amber-50 text-amber-950"
              : "border-primary/25 bg-key-bg text-key-fg"
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
          className="rounded-3xl border-2 border-accent/35 bg-gradient-to-br from-[#fff8f0] to-card p-6 shadow-md"
        >
          <h3
            id="walking-tag-heading"
            className="flex items-center gap-2 text-lg font-extrabold text-accent"
          >
            <Tag className="size-5" aria-hidden />
            Identification rapide : pensez à une médaille
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Une médaille indiquant au minimum un numéro de téléphone permet à
            une personne qui retrouve votre Beagle de vous contacter
            immédiatement. Elle complète l’identification officielle mais ne la
            remplace pas (puce, tatouage, I-CAD).
          </p>
        </section>
      )}

      {result.hasTagAlready && (
        <p
          className="rounded-2xl border-2 border-primary/25 bg-primary/8 px-4 py-3 text-sm font-medium text-foreground"
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
          className="rounded-3xl border-2 border-primary/20 bg-card p-6 shadow-sm"
        >
          <h3
            id="walking-checklist-heading"
            className="text-lg font-extrabold"
          >
            Checklist personnalisée
          </h3>
          <ul className="mt-4 space-y-2.5">
            {result.checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm font-medium text-foreground/90"
              >
                <span
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-extrabold text-primary-foreground"
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
        className="rounded-3xl border-2 border-border bg-muted/40 p-6"
      >
        <h3 id="walking-more-heading" className="text-lg font-extrabold">
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
                className="flex min-h-12 items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-sm font-bold transition hover:border-accent hover:bg-accent/5 hover:shadow-md"
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
                <span className="flex-1">{item.title}</span>
                <ArrowRight className="size-4 shrink-0 text-accent" aria-hidden />
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
  tone = "soft",
}: {
  emoji: string;
  label: string;
  value: string;
  detail?: string;
  tone?: "accent" | "primary" | "soft";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 px-4 py-4 shadow-md",
        tone === "accent" &&
          "border-accent/50 bg-gradient-to-br from-accent to-[#5a3415] text-white",
        tone === "primary" &&
          "border-primary/40 bg-gradient-to-br from-primary to-primary-hover text-white",
        tone === "soft" &&
          "border-white/20 bg-white/10 text-white backdrop-blur-sm"
      )}
    >
      <p
        className={cn(
          "text-xs font-extrabold uppercase tracking-wide",
          tone === "soft" ? "text-white/75" : "text-white/85"
        )}
      >
        <span aria-hidden>{emoji} </span>
        {label}
      </p>
      <p className="mt-1.5 text-[15px] font-extrabold leading-snug sm:text-base">
        {value}
      </p>
      {detail && (
        <p
          className={cn(
            "mt-1.5 text-xs leading-relaxed",
            tone === "soft" ? "text-white/70" : "text-white/80"
          )}
        >
          {detail}
        </p>
      )}
    </div>
  );
}
