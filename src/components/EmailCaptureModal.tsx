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
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function EmailCaptureModal({
  isOpen,
  productName,
  redirectUrl,
  onClose,
  onSuccess,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function validate(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Email invalide. Vérifiez le format.");
      return;
    }
    setError("");
    setLoading(true);
    // Simuler envoi — à brancher sur un endpoint ou mailchimp plus tard
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      onSuccess(trimmed);
      // Redirection après un bref délai pour voir le message de confirmation
      setTimeout(() => {
        window.open(redirectUrl, "_blank", "noopener,noreferrer");
        onClose();
      }, 800);
    }, 400);
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
                    Recevez votre bilan personnalisé par email
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Avant de voir l&apos;offre <strong>{productName}</strong>,
                    laissez-nous votre email pour recevoir gratuitement vos
                    recommandations et astuces Beagle par la suite.
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
                    Pas de spam, désinscription en un clic. Vos données ne sont
                    jamais revendues.
                  </p>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-green-100 text-3xl mx-auto">
                    <Sparkles className="size-7 text-green-600" aria-hidden />
                  </div>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-foreground">
                    Merci {email.split("@")[0]} !
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Votre bilan vous sera envoyé sous quelques instants.
                    Redirection vers l&apos;offre…
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