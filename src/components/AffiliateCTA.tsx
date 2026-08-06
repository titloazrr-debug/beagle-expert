import { ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AffiliateCTAProps {
  href: string;
  label?: string;
  sublabel?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "affiliate" | "default" | "outline";
}

/**
 * CTA affiliation — rel noopener + sponsored pour conformité.
 */
export function AffiliateCTA({
  href,
  label = "Voir l’offre",
  sublabel = "Lien affilié",
  className,
  size = "default",
  variant = "affiliate",
}: AffiliateCTAProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Button variant={variant} size={size} asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          data-affiliate="true"
        >
          <ShoppingBag className="size-4 shrink-0" aria-hidden />
          {label}
          <ExternalLink className="size-3.5 opacity-70" aria-hidden />
        </a>
      </Button>
      {sublabel && (
        <p className="text-[11px] text-muted-foreground text-center sm:text-left">
          {sublabel} · peut générer une commission
        </p>
      )}
    </div>
  );
}
