"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "beagle-expert-cookie-consent";

type Consent = "accepted" | "refused" | null;

/**
 * Bandeau cookies RGPD simple (consentement stocké en localStorage).
 * Pas de cookies tiers tant que non accepté (hors strictement nécessaires).
 */
export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Consent | null;
      if (stored === "accepted" || stored === "refused") {
        setConsent(stored);
      }
    } catch {
      // private mode
    }
    setReady(true);
  }, []);

  function save(value: "accepted" | "refused") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setConsent(value);
  }

  if (!ready || consent) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4",
        "pointer-events-none"
      )}
      role="dialog"
      aria-label="Consentement cookies"
      aria-describedby="cookie-banner-desc"
    >
      <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Cookie className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">Cookies & vie privée</p>
          <p
            id="cookie-banner-desc"
            className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm"
          >
            Nous utilisons des cookies strictement nécessaires au fonctionnement
            du site, et éventuellement des cookies de mesure d’audience ou
            d’affiliation si vous acceptez. Voir la{" "}
            <Link
              href="/politique-de-confidentialite"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => save("refused")}
          >
            Refuser
          </Button>
          <Button type="button" size="sm" onClick={() => save("accepted")}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
