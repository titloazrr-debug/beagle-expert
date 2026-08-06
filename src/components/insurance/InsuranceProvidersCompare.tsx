"use client";

import { useState } from "react";
import { ExternalLink, Info, Sparkles } from "lucide-react";
import {
  canShowAffiliateButton,
  getInsuranceProviders,
  getProviderAffiliateUrl,
  type InsuranceProvider,
} from "@/data/insuranceProviders";
import { COMPLIANCE_MODE } from "@/lib/compliance";
import {
  INSURANCE_AFFILIATE_DISCLAIMER,
  INSURANCE_RESULT_DISCLAIMER,
} from "@/lib/compliance";
import { complianceLabel } from "@/lib/insurance-quiz";
import { InsuranceAnalytics } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

interface InsuranceProvidersCompareProps {
  highlightKey?: string | null;
  resultProfile: string;
}

function highlightMatch(
  provider: InsuranceProvider,
  highlightKey: string | null | undefined
): boolean {
  if (!highlightKey) return false;
  return provider.highlightKeys.includes(highlightKey);
}

function ProviderCard({
  provider,
  highlightKey,
  resultProfile,
}: {
  provider: InsuranceProvider;
  highlightKey?: string | null;
  resultProfile: string;
}) {
  const [open, setOpen] = useState(false);
  const url = getProviderAffiliateUrl(provider);
  const showBtn = canShowAffiliateButton(provider);
  const hi = highlightMatch(provider, highlightKey);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border-2 bg-card p-5 shadow-sm",
        hi
          ? "border-emerald-400/70 bg-gradient-to-b from-emerald-50/80 to-card ring-2 ring-emerald-400/30 shadow-md shadow-emerald-900/5"
          : "border-border"
      )}
    >
      {hi && (
        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md shadow-emerald-600/25">
          <Sparkles className="size-3" aria-hidden />
          Recommandé pour votre profil
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-lg font-extrabold text-foreground">
          {provider.name}
        </h4>
        {hi && COMPLIANCE_MODE && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
            Priorité
          </span>
        )}
      </div>

      {hi && (
        <p className="mt-2 text-xs font-medium text-primary">
          {complianceLabel()}
        </p>
      )}

      <ul className="mt-3 space-y-1.5">
        {provider.strengths.slice(0, 3).map((s) => (
          <li key={s} className="text-sm leading-snug text-foreground/90">
            <span className="font-bold text-primary">+</span> {s}
          </li>
        ))}
      </ul>
      <ul className="mt-2 space-y-1.5">
        {provider.watchouts.slice(0, 3).map((s) => (
          <li key={s} className="text-sm leading-snug text-muted-foreground">
            <span className="font-bold text-accent">·</span> {s}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-3 text-left text-xs font-semibold text-primary underline-offset-2 hover:underline"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) InsuranceAnalytics.providerExpand(provider.id);
        }}
        aria-expanded={open}
      >
        {open ? "Masquer le détail" : "Voir le détail comparatif"}
      </button>

      {open && (
        <dl className="mt-3 space-y-2 rounded-xl border border-border bg-muted/40 p-3 text-xs leading-relaxed">
          <div>
            <dt className="font-bold text-foreground">Remboursement</dt>
            <dd className="text-muted-foreground">
              {provider.reimbursementRates}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Plafond</dt>
            <dd className="text-muted-foreground">{provider.annualLimits}</dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Franchise</dt>
            <dd className="text-muted-foreground">{provider.deductible}</dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Carences</dt>
            <dd className="text-muted-foreground">
              {provider.waitingPeriods.join(" · ")}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Prévention</dt>
            <dd className="text-muted-foreground">{provider.prevention}</dd>
          </div>
          {provider.id === "patolo" && (
            <div className="rounded-lg border border-border bg-card p-2">
              <p className="flex gap-1.5 font-bold text-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Plafonds des 2 premières années
              </p>
              <p className="mt-1 text-muted-foreground">
                Les plafonds initiaux fonctionnent de manière cumulative : le
                montant non consommé peut influencer la période suivante selon
                le contrat. Vérifiez toujours la fiche contractuelle à jour.
              </p>
            </div>
          )}
        </dl>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-4">
        {showBtn && url ? (
          <Button
            asChild
            variant="affiliate"
            className="min-h-11 w-full shadow-md"
          >
            <a
              href={url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              data-affiliate="true"
              data-provider={provider.id}
              onClick={() =>
                InsuranceAnalytics.affiliateClick({
                  providerId: provider.id,
                  placement: "result_card",
                  resultProfile,
                })
              }
            >
              Demander un devis
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </Button>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2.5 text-center text-xs text-muted-foreground">
            {isDev
              ? "Partenariat en cours de validation (dev)"
              : "Devis : partenariat en cours de validation"}
          </p>
        )}
        <a
          href={provider.sourceDocumentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-xs font-semibold text-primary hover:underline"
        >
          Consulter les conditions
        </a>
      </div>
    </article>
  );
}

export function InsuranceProvidersCompare({
  highlightKey,
  resultProfile,
}: InsuranceProvidersCompareProps) {
  const providers = getInsuranceProviders();

  return (
    <section
      id="insurance-offers"
      className="scroll-mt-24 space-y-4"
      aria-labelledby="offers-heading"
    >
      <div>
        <h3
          id="offers-heading"
          tabIndex={-1}
          className="text-lg font-extrabold tracking-tight text-foreground outline-none"
        >
          Offres à comparer
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Présentation neutre — l’ordre n’est pas lié aux commissions. Aucun
          assureur n’est désigné comme gagnant.
        </p>
      </div>

      {/* Desktop table summary */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border lg:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/60 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">Critère</th>
              {providers.map((p) => (
                <th key={p.id} className="px-3 py-3 text-foreground">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {(
              [
                ["Âge d’admission", (p: InsuranceProvider) => p.eligibility.notes ?? "Voir devis"],
                ["Remboursement", (p: InsuranceProvider) => p.reimbursementRates],
                ["Plafond annuel", (p: InsuranceProvider) => p.annualLimits],
                ["Franchise", (p: InsuranceProvider) => p.deductible],
                [
                  "Carence accident / maladie",
                  (p: InsuranceProvider) => p.waitingPeriods.slice(0, 2).join(" · "),
                ],
                ["Prévention", (p: InsuranceProvider) => p.prevention],
                [
                  "Avance des frais",
                  (p: InsuranceProvider) =>
                    p.specialServices.find((s) =>
                      s.toLowerCase().includes("avance")
                    ) ?? "Voir contrat",
                ],
                [
                  "Téléconseil",
                  (p: InsuranceProvider) =>
                    p.specialServices.find((s) =>
                      s.toLowerCase().includes("télé") ||
                      s.toLowerCase().includes("tele")
                    ) ?? "Voir contrat",
                ],
              ] as [string, (p: InsuranceProvider) => string][]
            ).map(([label, fn]) => (
              <tr key={label}>
                <th className="px-3 py-2.5 text-xs font-bold text-foreground">
                  {label}
                </th>
                {providers.map((p) => (
                  <td
                    key={p.id}
                    className={cn(
                      "px-3 py-2.5 text-xs leading-snug text-muted-foreground",
                      highlightKey &&
                        p.highlightKeys.includes(highlightKey) &&
                        "bg-primary/5 font-medium text-foreground"
                    )}
                  >
                    {fn(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <ProviderCard
            key={p.id}
            provider={p}
            highlightKey={highlightKey}
            resultProfile={resultProfile}
          />
        ))}
      </div>

      <p
        className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs leading-relaxed text-foreground/90"
        role="note"
      >
        {INSURANCE_AFFILIATE_DISCLAIMER}
      </p>

      <p
        className="rounded-xl border border-primary/20 bg-key-bg/60 px-4 py-3 text-xs leading-relaxed text-foreground"
        role="note"
      >
        {INSURANCE_RESULT_DISCLAIMER}
      </p>
    </section>
  );
}
