import { Layers, Link2, Shield } from "lucide-react";
import { WALKING_EDU } from "@/lib/walking-quiz";

export function WalkingEducational() {
  return (
    <section
      aria-labelledby="walking-edu-heading"
      className="space-y-6 rounded-3xl border border-border bg-muted/25 p-6 sm:p-8"
    >
      <h2
        id="walking-edu-heading"
        className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight sm:text-2xl"
      >
        Pour aller plus loin
      </h2>

      <article className="space-y-2">
        <h3 className="flex items-center gap-2 text-base font-bold">
          <Link2 className="size-4 text-primary" aria-hidden />
          {WALKING_EDU.harnessOrCollar.title}
        </h3>
        <p className="text-sm leading-relaxed text-foreground/85">
          {WALKING_EDU.harnessOrCollar.body}
        </p>
      </article>

      <article className="space-y-2">
        <h3 className="flex items-center gap-2 text-base font-bold">
          <Shield className="size-4 text-primary" aria-hidden />
          {WALKING_EDU.whyLongLine.title}
        </h3>
        <p className="text-sm leading-relaxed text-foreground/85">
          {WALKING_EDU.whyLongLine.body}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {WALKING_EDU.whyLongLine.note}
        </p>
      </article>

      <article className="space-y-3">
        <h3 className="flex items-center gap-2 text-base font-bold">
          <Layers className="size-4 text-primary" aria-hidden />
          {WALKING_EDU.layeredSafety.title}
        </h3>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-foreground/90">
          {WALKING_EDU.layeredSafety.layers.map((layer) => (
            <li key={layer}>{layer}</li>
          ))}
        </ol>
        <p className="text-sm leading-relaxed text-foreground/85">
          {WALKING_EDU.layeredSafety.body}
        </p>
      </article>
    </section>
  );
}
