import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating: number;
  className?: string;
  size?: "sm" | "md";
  showValue?: boolean;
}

/** Note sur 5 avec étoiles (affichage subjectif / éditorial). */
export function ProductRating({
  rating,
  className,
  size = "sm",
  showValue = true,
}: ProductRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating));
  const starClass = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Note ${clamped.toFixed(1)} sur 5`}
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(1, Math.max(0, clamped - i));
          return (
            <span key={i} className="relative inline-flex">
              <Star
                className={cn(starClass, "text-border")}
                strokeWidth={1.75}
              />
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    className={cn(starClass, "fill-accent text-accent")}
                    strokeWidth={1.75}
                  />
                </span>
              )}
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs font-bold tabular-nums text-foreground">
          {clamped.toFixed(1)}
          <span className="font-medium text-muted-foreground">/5</span>
        </span>
      )}
    </div>
  );
}
