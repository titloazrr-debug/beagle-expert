import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { fiches } from "@/data/fiches";
import { quizzes } from "@/data/quizzes";
import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";
import { AffiliateDisclaimer } from "@/components/legal/AffiliateDisclaimer";

export function Footer() {
  const tenant = getTenant();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      {/* Disclaimers courts — toutes les pages */}
      <div className="border-b border-border/70 bg-amber-50/40">
        <div className="container-page space-y-2 py-3">
          <MedicalDisclaimer variant="short" />
          <AffiliateDisclaimer variant="short" showLegalLink />
        </div>
      </div>

      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-[family-name:var(--font-display)] text-lg font-bold">
            {tenant.name}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {tenant.tagline}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold">Fiches pratiques</p>
          <ul className="mt-3 space-y-2">
            {fiches.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/fiche/${f.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {f.emoji} {f.title.split(":")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Quiz interactifs</p>
          <ul className="mt-3 space-y-2">
            {quizzes.map((q) => (
              <li key={q.slug}>
                <Link
                  href={`/quiz/${q.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {q.emoji} {q.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Informations légales</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/a-propos"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                À propos
              </Link>
            </li>
            <li>
              <Link
                href="/methodologie"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Méthodologie &amp; sources
              </Link>
            </li>
            <li>
              <Link
                href="/mentions-legales"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Mentions légales
              </Link>
            </li>
            <li>
              <Link
                href="/politique-de-confidentialite"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link
                href="/mentions-legales"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Notre politique d&apos;affiliation
              </Link>
            </li>
            <li>
              <Link
                href="/fiches"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Toutes les fiches
              </Link>
            </li>
            <li>
              <Link
                href="/quizzes"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Tous les quiz
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/80 py-4">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {year} {tenant.name}. Tous droits réservés.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link href="/mentions-legales" className="hover:text-primary">
              Mentions légales
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/politique-de-confidentialite"
              className="hover:text-primary"
            >
              Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
