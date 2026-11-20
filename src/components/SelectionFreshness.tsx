import {
  formatIsoDateFr,
  INSURANCE_TARIFF_NOTICE,
  isAnnualSelection,
  selectionFreshnessNotice,
  selectionNeedsTariffNotice,
  SELECTION_UPDATED_ON,
} from "@/lib/selection-year";

interface SelectionFreshnessProps {
  slug: string;
  dateModified?: string;
}

/**
 * Date de mise à jour et mention de fraîcheur, visibles sur les fiches
 * « meilleur X ». L'année vient de SELECTION_YEAR.
 */
export function SelectionFreshness({
  slug,
  dateModified,
}: SelectionFreshnessProps) {
  if (!isAnnualSelection(slug)) return null;

  const updated = formatIsoDateFr(dateModified ?? SELECTION_UPDATED_ON);

  return (
    <aside
      className="mt-6 rounded-2xl border border-border bg-muted/50 p-4 sm:p-5"
      data-selection-freshness
      aria-label="Mise à jour de la sélection"
    >
      {updated ? (
        <p className="text-sm font-semibold text-foreground">
          Mis à jour le {updated}
        </p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {selectionFreshnessNotice()}
      </p>
      {selectionNeedsTariffNotice(slug) ? (
        <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
          {INSURANCE_TARIFF_NOTICE}
        </p>
      ) : null}
    </aside>
  );
}
