import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductProsConsProps {
  advantages?: string[];
  disadvantages?: string[];
  className?: string;
  compact?: boolean;
}

export function ProductProsCons({
  advantages = [],
  disadvantages = [],
  className,
  compact = false,
}: ProductProsConsProps) {
  if (!advantages.length && !disadvantages.length) return null;

  const maxItems = compact ? 3 : 5;

  return (
    <div
      className={cn(
        "grid gap-3",
        advantages.length && disadvantages.length
          ? "sm:grid-cols-2"
          : "grid-cols-1",
        className
      )}
    >
      {advantages.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-key-bg/70 p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-primary">
            Avantages
          </p>
          <ul className="mt-2 space-y-1.5">
            {advantages.slice(0, maxItems).map((item) => (
              <li
                key={item}
                className="flex gap-2 text-[0.875rem] leading-snug text-foreground"
              >
                <Check
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {disadvantages.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/50 p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
            Inconvénients
          </p>
          <ul className="mt-2 space-y-1.5">
            {disadvantages.slice(0, maxItems).map((item) => (
              <li
                key={item}
                className="flex gap-2 text-[0.875rem] leading-snug text-foreground"
              >
                <Minus
                  className="mt-0.5 size-3.5 shrink-0 text-accent"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
