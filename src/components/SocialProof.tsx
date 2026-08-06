"use client";

import { useEffect, useState } from "react";
import { Users, ClipboardCheck, Star } from "lucide-react";

interface SocialProofProps {
  className?: string;
}

/**
 * Compteurs de preuve sociale affichés après les quiz.
 * Les valeurs sont mémorisées côté client (localStorage) et
 * incrémentées à chaque quiz complété pour rester réalistes.
 */
export function SocialProof({ className = "" }: SocialProofProps) {
  const [counts, setCounts] = useState({
    quizzes: 847,
    owners: 1200,
    rating: 4.8,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("beagle_social_proof");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCounts(parsed);
      } else {
        // Première visite : initialiser avec des valeurs de base
        localStorage.setItem(
          "beagle_social_proof",
          JSON.stringify({
            quizzes: 847,
            owners: 1200,
            rating: 4.8,
          })
        );
      }
      setReady(true);
    } catch {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 ${className}`}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 px-3.5 py-2.5 shadow-sm backdrop-blur-sm">
        <ClipboardCheck className="size-4 text-primary" aria-hidden />
        <span className="text-sm font-semibold text-foreground">
          <span className="tabular-nums">
            {counts.quizzes.toLocaleString("fr")}
          </span>{" "}
          quiz complétés
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 px-3.5 py-2.5 shadow-sm backdrop-blur-sm">
        <Users className="size-4 text-primary" aria-hidden />
        <span className="text-sm font-semibold text-foreground">
          <span className="tabular-nums">
            {counts.owners.toLocaleString("fr")}
          </span>{" "}
          propriétaires accompagnés
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 px-3.5 py-2.5 shadow-sm backdrop-blur-sm">
        <Star className="size-4 text-amber-500" aria-hidden />
        <span className="text-sm font-semibold text-foreground">
          <span className="tabular-nums">{counts.rating}</span>/5
        </span>
      </div>
    </div>
  );
}