"use client";

import { ExternalLink, Tag } from "lucide-react";
import {
  BEAGLE_EXPERT_TAG_ENABLED,
  getBeagleExpertTagUrl,
} from "@/data/walkingProducts";
import { WalkingAnalytics } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

interface BeagleExpertTagCardProps {
  resultProfile: string;
}

/**
 * Carte médaille Beagle Expert personnalisée.
 * Ne s’affiche que si BEAGLE_EXPERT_TAG_ENABLED === true.
 * Pas de formulaire de données personnelles pour l’instant.
 */
export function BeagleExpertTagCard({ resultProfile }: BeagleExpertTagCardProps) {
  if (!BEAGLE_EXPERT_TAG_ENABLED) return null;

  const url = getBeagleExpertTagUrl();

  return (
    <section
      aria-labelledby="beagle-expert-tag-heading"
      className="rounded-3xl border-2 border-primary/25 bg-gradient-to-br from-primary/8 via-card to-accent/8 p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary"
          aria-hidden
        >
          <Tag className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3
            id="beagle-expert-tag-heading"
            className="text-lg font-bold tracking-tight"
          >
            Médaille Beagle Expert personnalisée
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            Son nom devant, votre numéro derrière — pour vous contacter
            immédiatement s’il décide qu’une piste mérite une petite aventure.
          </p>
          {url ? (
            <Button asChild className="mt-4 min-h-11" variant="default">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  WalkingAnalytics.tagInterestClick({
                    resultProfile,
                    placement: "beagle_expert_tag_card",
                  })
                }
              >
                Personnaliser sa médaille
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </Button>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Bientôt disponible — configurez{" "}
              <code className="font-mono">NEXT_PUBLIC_BEAGLE_EXPERT_TAG_URL</code>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
