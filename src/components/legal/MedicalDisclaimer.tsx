import { Stethoscope } from "lucide-react";
import {
  MEDICAL_DISCLAIMER_FULL,
  MEDICAL_DISCLAIMER_SHORT,
} from "@/lib/legal";
import { cn } from "@/lib/utils";

interface MedicalDisclaimerProps {
  /** full = texte légal exact ; short = footer / compact */
  variant?: "full" | "short" | "banner";
  className?: string;
}

export function MedicalDisclaimer({
  variant = "full",
  className,
}: MedicalDisclaimerProps) {
  if (variant === "short") {
    return (
      <p
        className={cn(
          "text-xs leading-relaxed text-muted-foreground",
          className
        )}
        role="note"
      >
        <span className="font-bold text-foreground">Disclaimer : </span>
        {MEDICAL_DISCLAIMER_SHORT}
      </p>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "border-b border-amber-700/25 bg-warning-bg",
          className
        )}
        role="note"
        aria-label="Avertissement médical"
      >
        <div className="container-page flex gap-3 py-3 sm:items-start sm:gap-3.5 sm:py-3.5">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-950 ring-2 ring-amber-300/80">
            <Stethoscope className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 measure-wide">
            <p className="text-xs font-extrabold uppercase tracking-wide text-warning-fg">
              Avertissement santé animale
            </p>
            <p className="mt-1 text-sm font-medium leading-[1.65] text-warning-fg">
              {MEDICAL_DISCLAIMER_FULL}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex gap-3 rounded-2xl border-2 border-amber-700/30 bg-warning-bg px-4 py-3.5 sm:gap-3.5 sm:px-5",
        className
      )}
      role="note"
      aria-label="Avertissement médical"
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-950">
        <Stethoscope className="size-4" aria-hidden />
      </span>
      <div className="measure-wide">
        <p className="text-xs font-extrabold uppercase tracking-wide text-warning-fg">
          Avertissement santé animale
        </p>
        <p className="mt-1 text-sm font-medium leading-[1.65] text-warning-fg">
          {MEDICAL_DISCLAIMER_FULL}
        </p>
      </div>
    </aside>
  );
}
