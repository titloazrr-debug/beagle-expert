import { CheckCircle2, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CitableActionItem {
  label: string;
  detail?: string;
}

interface QuizCitableConclusionProps {
  /**
   * Libellé court du profil (ex. « sécurité max / fugueur »,
   * « Beagle adulte — poids à surveiller »).
   */
  profileLabel: string;
  /**
   * Recommandation principale + justification courte (1–3 phrases).
   * Sans préfixe « Selon ce quiz… » — le composant l’ajoute.
   */
  recommendation: string;
  /** Raisons / critères / actions structurées */
  reasons?: string[];
  /** Produits ou actions concrètes recommandés */
  actions?: CitableActionItem[];
  className?: string;
  /** Variante sur fond sombre (header résultat) */
  onDark?: boolean;
}

/**
 * Conclusion de quiz formulée pour extraction par agents IA (GEO).
 * Structure stable : phrase de profil → reco → listes.
 */
export function QuizCitableConclusion({
  profileLabel,
  recommendation,
  reasons = [],
  actions = [],
  className,
  onDark = false,
}: QuizCitableConclusionProps) {
  const cleanLabel = profileLabel
    .replace(/^son profil\s*:\s*/i, "")
    .replace(/^profil\s*[«"']?\s*/i, "")
    .replace(/[»"']\s*$/i, "")
    .trim();

  return (
    <section
      className={cn(
        "rounded-2xl border-2 px-4 py-4 sm:px-5 sm:py-5",
        onDark
          ? "border-white/25 bg-white/10"
          : "border-primary/30 bg-primary/6",
        className
      )}
      aria-labelledby="quiz-citable-heading"
      data-agent-conclusion="true"
    >
      <h3
        id="quiz-citable-heading"
        className={cn(
          "text-xs font-extrabold uppercase tracking-wider",
          onDark ? "text-white/85" : "text-primary"
        )}
      >
        Conclusion
      </h3>

      <p
        className={cn(
          "mt-2 text-base font-semibold leading-[1.65]",
          onDark ? "text-white" : "text-foreground"
        )}
      >
        Selon ce quiz, votre profil correspond à{" "}
        <span className="font-extrabold">« {cleanLabel} »</span>.{" "}
        <span className={cn("font-medium", onDark ? "text-white/95" : "text-foreground/95")}>
          {recommendation}
        </span>
      </p>

      {reasons.length > 0 && (
        <div className="mt-4">
          <p
            className={cn(
              "flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide",
              onDark ? "text-white/80" : "text-primary"
            )}
          >
            <ListOrdered className="size-3.5" aria-hidden />
            Points clés
          </p>
          <ul className="mt-2 space-y-2">
            {reasons.map((r) => (
              <li
                key={r}
                className={cn(
                  "flex items-start gap-2.5 text-sm leading-relaxed",
                  onDark ? "text-white/95" : "text-foreground/90"
                )}
              >
                <CheckCircle2
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    onDark ? "text-white" : "text-primary"
                  )}
                  aria-hidden
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {actions.length > 0 && (
        <div className="mt-4">
          <p
            className={cn(
              "text-xs font-extrabold uppercase tracking-wide",
              onDark ? "text-white/80" : "text-primary"
            )}
          >
            Actions et produits recommandés
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            {actions.map((a) => (
              <li
                key={a.label}
                className={cn(
                  "text-sm leading-relaxed",
                  onDark ? "text-white/95" : "text-foreground/90"
                )}
              >
                <span className="font-semibold">{a.label}</span>
                {a.detail ? (
                  <span className={onDark ? "text-white/85" : "text-foreground/80"}>
                    {" "}
                    — {a.detail}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
