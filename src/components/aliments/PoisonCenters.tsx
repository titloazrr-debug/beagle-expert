import { Phone } from "lucide-react";
import { POISON_CENTERS } from "@/lib/aliments-shared";

export function PoisonCenters({ intro }: { intro: string }) {
  return (
    <section
      id="que-faire"
      className="scroll-mt-28 rounded-3xl border-2 border-destructive/30 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
      aria-labelledby="que-faire-heading"
    >
      <h2
        id="que-faire-heading"
        className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight sm:text-2xl"
      >
        Que faire s&apos;il en a mangé
      </h2>
      <p className="measure-wide mt-4 text-base leading-[1.75]">{intro}</p>
      <p className="measure-wide mt-3 text-base font-semibold leading-[1.75]">
        Ne faites pas vomir votre chien vous-même. Appelez votre vétérinaire
        ou un centre antipoison vétérinaire : c&apos;est lui qui décide de la
        suite.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {POISON_CENTERS.map((center) => (
          <li
            key={center.id}
            className="rounded-2xl border border-border bg-muted/30 p-4"
          >
            <p className="text-sm font-extrabold">
              {center.nom}
              <span className="font-semibold text-muted-foreground">
                {" "}
                · {center.organisme}
              </span>
            </p>
            <a
              href={center.telephoneHref}
              className="mt-2 inline-flex items-center gap-2 text-lg font-extrabold text-primary"
            >
              <Phone className="size-4" aria-hidden />
              {center.telephone}
            </a>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {center.horaires}
            </p>
            <a
              href={center.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-primary underline underline-offset-2"
            >
              Site officiel
            </a>
            {"horairesUrl" in center ? (
              <a
                href={center.horairesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-xs text-muted-foreground underline underline-offset-2"
              >
                Horaires confirmés sur la page Oniris
              </a>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Le CNITV demande de privilégier le téléphone plutôt que l&apos;e-mail
        en urgence. Ces numéros ont été relevés sur les sites officiels le
        31 octobre 2026.
      </p>
    </section>
  );
}
