import { Info } from "lucide-react";
import { QUIZ_RECO_DISCLAIMER } from "@/lib/legal";
import { cn } from "@/lib/utils";

interface QuizRecoDisclaimerProps {
  className?: string;
  compact?: boolean;
}

export function QuizRecoDisclaimer({
  className,
  compact = false,
}: QuizRecoDisclaimerProps) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-2xl border border-sky-700/25 bg-sky-100 px-4 py-3",
        className
      )}
      role="note"
      aria-label="Avertissement recommandations"
    >
      <Info
        className="mt-0.5 size-4 shrink-0 text-sky-950"
        aria-hidden
      />
      <p
        className={cn(
          "leading-[1.65] text-sky-950 font-medium",
          compact ? "text-xs" : "text-sm"
        )}
      >
        <span className="font-extrabold">Recommandations : </span>
        {QUIZ_RECO_DISCLAIMER}
      </p>
    </aside>
  );
}
