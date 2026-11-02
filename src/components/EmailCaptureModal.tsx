"use client";

import { type FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailCaptureModalProps {
  isOpen: boolean;
  productName: string;
  /** URL à ouvrir après capture (oufermeture) */
  redirectUrl: string;
  /** Slug du quiz d'où vient le visiteur (traçabilité de la base). */
  quizSlug?: string;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function EmailCaptureModal({
  isOpen,
  productName,
  redirectUrl,
  quizSlug,
  onClose,
  onSuccess,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function validate(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Email invalide. Vérifiez le format.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          quiz: quizSlug,
          product: productName,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setDone(true);
      onSuccess(trimmed);
      setTimeout(() => {
        window.open(redirectUrl, "_blank", "noopener,noreferrer");
        onClose();
      }, 900);
    } catch {
      setError(
        "L'enregistrement n'a pas abouti. Vous pouvez continuer vers l'offre sans laisser votre email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={done ? undefined : onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-0 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Recevez votre bilan personnalisé"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              disabled={done}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>

            <div className="px-6 pt-8 pb-6 sm:px-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                <Mail className="size-6 text-primary" aria-hidden />
              </div>

              {!done ? (
                <>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-foreground">
                    Recevez nos conseils Beagle par email
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Votre recommandation <strong>{productName}</strong> s&apos;affiche
                    juste après. Laissez votre email si vous voulez recevoir les
                    prochains guides : oreilles, poids, fugue, saison des tiques.
                    Un email par mois environ, sans publicité.
                  </p>

                  <form onSubmit={validate} className="mt-5 space-y-3">
                    <div>
                      <label htmlFor="capture-email" className="sr-only">
                        Votre adresse email
                      </label>
                      <input
                        id="capture-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="votre@email.fr"
                        required
                        autoFocus
                        className="block w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      {error && (
                        <p className="mt-1 text-xs text-red-500" role="alert">
                          {error}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="min-h-11 w-full text-sm"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Envoi en cours…
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          Voir l&apos;offre
                          <ArrowRight className="size-4" aria-hidden />
                        </span>
                      )}
                    </Button>
                  </form>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Désinscription en un clic dans chaque email. Vos données ne
                    sont jamais revendues.{" "}
                    <a
                      href="/politique-de-confidentialite"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      Politique de confidentialité
                    </a>
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      window.open(redirectUrl, "_blank", "noopener,noreferrer");
                      onClose();
                    }}
                    className="mt-3 w-full text-center text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    Continuer vers l&apos;offre sans laisser mon email
                  </button>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-green-100 text-3xl mx-auto">
                    <Sparkles className="size-7 text-green-600" aria-hidden />
                  </div>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-foreground">
                    C&apos;est noté.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Votre recommandation s&apos;ouvre dans un instant.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}