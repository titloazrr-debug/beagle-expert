import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryBoxProps {
  /** Texte « En résumé » (2–4 phrases factuelles) */
  text: string;
  className?: string;
}

/**
 * Bloc agent-first / GEO : résumé extractible en tête de fiche.
 * Contraste élevé, ton factuel, structure stable pour les agents.
 */
export function SummaryBox({ text, className }: SummaryBoxProps) {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <aside
      className={cn(
        "rounded-2xl border-2 border-primary/35 bg-primary/8 px-4 py-4 shadow-sm sm:px-5 sm:py-5",
        className
      )}
      aria-labelledby="en-resume-heading"
      data-agent-summary="true"
    >
      <div className="flex gap-3.5 sm:gap-4">
        <span
          className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground ring-2 ring-primary/25"
          aria-hidden
        >
          <ListChecks className="size-5" strokeWidth={2.25} />
        </span>
        <div className="min-w-0 measure-wide">
          <h2
            id="en-resume-heading"
            className="text-sm font-extrabold uppercase tracking-wide text-primary"
          >
            En résumé
          </h2>
          <div className="mt-2 space-y-2 text-base font-medium leading-[1.7] text-foreground">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
