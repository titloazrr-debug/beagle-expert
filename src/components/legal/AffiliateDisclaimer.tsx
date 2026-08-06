import Link from "next/link";
import { Handshake } from "lucide-react";
import {
  AFFILIATE_DISCLAIMER_BOX,
  AFFILIATE_DISCLAIMER_FULL,
  AFFILIATE_DISCLAIMER_SHORT,
  AFFILIATE_DISCLAIMER_TITLE,
} from "@/lib/legal";
import { cn } from "@/lib/utils";

interface AffiliateDisclaimerProps {
  /** full = mentions légales ; short = footer ; box = pages produits */
  variant?: "full" | "short" | "box";
  className?: string;
  /** Affiche un lien vers les mentions (utile en box / short) */
  showLegalLink?: boolean;
}

export function AffiliateDisclaimer({
  variant = "box",
  className,
  showLegalLink = false,
}: AffiliateDisclaimerProps) {
  if (variant === "short") {
    return (
      <p
        className={cn(
          "text-xs leading-relaxed text-muted-foreground",
          className
        )}
        role="note"
      >
        <span className="font-bold text-foreground">
          Affiliation :{" "}
        </span>
        {AFFILIATE_DISCLAIMER_SHORT}
        {showLegalLink && (
          <>
            {" "}
            <Link
              href="/mentions-legales"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              En savoir plus
            </Link>
          </>
        )}
      </p>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("space-y-3", className)} role="note">
        <h3 className="text-base font-bold text-foreground">
          {AFFILIATE_DISCLAIMER_TITLE}
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Certains liens présents sur ce site sont des liens d’affiliation.
            Cela signifie que si vous effectuez un achat via ces liens, nous
            pouvons percevoir une commission, sans aucun surcoût pour vous.
          </p>
          <p>
            Cette rémunération nous aide à maintenir le site et à continuer de
            proposer des contenus gratuits et de qualité.
          </p>
          <p>
            Nos recommandations restent indépendantes et basées sur notre
            expertise.
          </p>
        </div>
        {/* Texte concaténé aussi disponible pour copier-coller légal exact */}
        <p className="sr-only">{AFFILIATE_DISCLAIMER_FULL}</p>
      </div>
    );
  }

  // box — discret sur pages produits
  return (
    <aside
      className={cn(
        "flex gap-2.5 rounded-xl border border-border bg-muted/60 px-3.5 py-2.5",
        className
      )}
      role="note"
      aria-label="Transparence affiliation"
    >
      <Handshake
        className="mt-0.5 size-3.5 shrink-0 text-foreground/70"
        aria-hidden
      />
      <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
        <span className="font-bold text-foreground">
          {AFFILIATE_DISCLAIMER_TITLE}.{" "}
        </span>
        {AFFILIATE_DISCLAIMER_BOX}
        {showLegalLink && (
          <>
            {" "}
            <Link
              href="/mentions-legales"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Mentions légales
            </Link>
          </>
        )}
      </p>
    </aside>
  );
}
