"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { getTenant } from "@/lib/tenant";
import { cn } from "@/lib/utils";

/**
 * Bouton flottant « Parler à l'expert Beagle »
 * Placeholder UX pour futur widget Aminos.ai.
 */
export function ChatbotWidget() {
  const tenant = getTenant();
  const [open, setOpen] = useState(false);
  const scriptUrl = tenant.chatbot?.scriptUrl;

  useEffect(() => {
    if (!tenant.chatbot?.enabled || !scriptUrl) return;

    const existing = document.querySelector(`script[data-chatbot="aminos"]`);
    if (existing) return;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.dataset.chatbot = "aminos";
    document.body.appendChild(script);
  }, [scriptUrl, tenant.chatbot?.enabled]);

  if (!tenant.chatbot?.enabled) return null;

  // Script externe = le provider gère son propre UI
  if (scriptUrl) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          className="w-[min(100vw-1.5rem,22rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] animate-in fade-in slide-in-from-bottom-2"
          role="dialog"
          aria-label="Expert Beagle"
        >
          <div className="flex items-start justify-between gap-3 bg-gradient-to-br from-primary to-primary-hover px-4 py-3.5 text-primary-foreground">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold">
                <Sparkles className="size-3.5" aria-hidden />
                Expert {tenant.breed}
              </p>
              <p className="mt-0.5 text-[11px] text-primary-foreground/80">
                Bientôt propulsé par Aminos.ai
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <p className="rounded-2xl rounded-tl-md bg-muted px-3.5 py-2.5 leading-relaxed text-foreground/90">
              Bonjour ! Je suis le futur assistant expert {tenant.breed}. En
              attendant le chatbot, les quiz et fiches répondent déjà à la
              plupart des questions.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/quiz/pret-a-adopter"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-muted/50"
              >
                🏠 Suis-je prêt à adopter ?
              </Link>
              <Link
                href="/#quiz"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-muted/50"
              >
                ✨ Voir tous les quiz
              </Link>
              <Link
                href="/#fiches"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:bg-muted/50"
              >
                📖 Parcourir les fiches
              </Link>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Brancher Aminos : variable{" "}
              <code className="rounded bg-muted px-1">NEXT_PUBLIC_AMINOS_SCRIPT_URL</code>
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex items-center gap-2.5 rounded-full bg-accent text-accent-foreground shadow-lg",
          "pl-4 pr-2 py-2 sm:pl-5 sm:pr-2.5 sm:py-2.5",
          "ring-4 ring-accent/20 transition-all hover:scale-[1.03] hover:brightness-105 active:scale-[0.98]"
        )}
        aria-expanded={open}
        aria-label={
          open ? "Fermer l’expert Beagle" : "Parler à l’expert Beagle"
        }
      >
        <span className="hidden text-sm font-bold sm:inline">
          {open ? "Fermer" : "Parler à l’expert Beagle"}
        </span>
        <span className="text-sm font-bold sm:hidden">
          {open ? "Fermer" : "Expert"}
        </span>
        <span className="flex size-11 items-center justify-center rounded-full bg-accent-foreground/10">
          {open ? (
            <X className="size-5" />
          ) : (
            <MessageCircle className="size-5" />
          )}
        </span>
      </button>
    </div>
  );
}
