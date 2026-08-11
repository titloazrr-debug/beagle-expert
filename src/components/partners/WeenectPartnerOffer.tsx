import Image from "next/image";
import { Download, ExternalLink, Tag } from "lucide-react";
import {
  WEENECT_AFFICHE_IMG,
  WEENECT_AFFICHE_PDF,
  WEENECT_PROMO_CODE,
  WEENECT_PROMO_LABEL,
  WEENECT_XS_DOG_URL,
} from "@/lib/partners/weenect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeenectPartnerOfferProps {
  className?: string;
  /** Affiche l’affiche QR (plus lourd) — défaut true */
  showPoster?: boolean;
}

/**
 * Bloc Partner+ Weenect : code promo, CTA affilié, affiche QR téléchargeable.
 */
export function WeenectPartnerOffer({
  className,
  showPoster = true,
}: WeenectPartnerOfferProps) {
  return (
    <aside
      className={cn(
        "overflow-hidden rounded-3xl border-2 border-primary/25 bg-card shadow-[var(--shadow-card)]",
        className
      )}
      aria-labelledby="weenect-partner-heading"
      data-partner="weenect"
    >
      <div className="bg-gradient-to-br from-primary via-primary to-primary-hover px-5 py-4 sm:px-6">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/85">
          Offre partenaire Beagle Expert
        </p>
        <h2
          id="weenect-partner-heading"
          className="mt-1 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-white sm:text-2xl"
        >
          Weenect GPS — {WEENECT_PROMO_LABEL}
        </h2>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/90">
          Localisation précise pour un Beagle au flair « interrupteur ». Code
          unique à saisir dans le panier Weenect, ou scan du QR sur l’affiche.
        </p>
      </div>

      <div
        className={cn(
          "grid gap-5 p-5 sm:p-6",
          showPoster && "lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start"
        )}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/8 px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-primary">
              <Tag className="size-3.5" aria-hidden />
              Code promo lecteurs
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold tracking-wide text-foreground">
              {WEENECT_PROMO_CODE}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              −40&nbsp;% sur le boîtier (offre partenaire). L’abonnement reste à
              la charge de l’utilisateur — vérifiez les conditions sur Weenect.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Button asChild variant="affiliate" size="lg" className="min-h-12">
              <a
                href={WEENECT_XS_DOG_URL}
                target="_blank"
                rel="sponsored noopener noreferrer"
                data-affiliate="true"
              >
                Voir Weenect XS (chien)
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12">
              <a
                href={WEENECT_AFFICHE_PDF}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="size-4" aria-hidden />
                Télécharger l’affiche QR (PDF)
              </a>
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Lien affilié Partner+ : une commission peut nous être versée si vous
            achetez via ce lien,{" "}
            <strong className="font-semibold text-foreground">
              sans surcoût pour vous
            </strong>
            . Le GPS complète laisse, harnais et rappel — il ne les remplace
            pas.
          </p>
        </div>

        {showPoster && (
          <figure className="mx-auto w-full max-w-[220px]">
            <a
              href={WEENECT_AFFICHE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl border border-border shadow-md transition hover:ring-2 hover:ring-primary/40"
            >
              <Image
                src={WEENECT_AFFICHE_IMG}
                alt="Affiche Weenect partenaire Beagle Expert : −40 % avec le code BEAGLEEXPERT et QR code d’affiliation"
                width={706}
                height={1000}
                className="h-auto w-full object-cover"
                sizes="220px"
              />
            </a>
            <figcaption className="mt-2 text-center text-[11px] text-muted-foreground">
              Affiche personnalisée + QR → offre partenaire
            </figcaption>
          </figure>
        )}
      </div>
    </aside>
  );
}
