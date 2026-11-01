import { cn } from "@/lib/utils";
import {
  VERDICT_HINT,
  VERDICT_LABEL,
  type AlimentVerdict,
} from "@/lib/aliments-shared";

const TONE: Record<AlimentVerdict, string> = {
  toxique: "border-destructive bg-destructive text-white",
  "a-eviter": "border-amber-800/50 bg-warning-bg text-warning-fg",
  "avec-moderation": "border-amber-700/40 bg-[#fff6dc] text-warning-fg",
  "sans-danger": "border-primary/40 bg-key-bg text-key-fg",
};

export function VerdictBadge({
  verdict,
  size = "md",
}: {
  verdict: AlimentVerdict;
  size?: "md" | "lg";
}) {
  const large = size === "lg";
  return (
    <p
      className={cn(
        "inline-flex items-center rounded-full border-2 font-extrabold tracking-wide uppercase",
        TONE[verdict],
        large
          ? "px-4 py-2 text-base sm:text-lg"
          : "px-3 py-1 text-xs"
      )}
    >
      {VERDICT_LABEL[verdict]}
    </p>
  );
}

export function VerdictBanner({ verdict }: { verdict: AlimentVerdict }) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 px-5 py-5 sm:px-6",
        TONE[verdict]
      )}
      data-verdict={verdict}
    >
      <p className="text-xs font-extrabold uppercase tracking-wider opacity-80">
        Verdict
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
        {VERDICT_LABEL[verdict]}
      </p>
      <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed sm:text-base">
        {VERDICT_HINT[verdict]}
      </p>
    </div>
  );
}
