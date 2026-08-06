"use client";

import { useId, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { FaqItem } from "@/types";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export function FaqAccordion({
  items,
  title = "Questions fréquentes",
  className,
}: FaqAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8",
        className
      )}
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          aria-hidden
        >
          <HelpCircle className="size-5" />
        </span>
        <div>
          <h2
            id={`${baseId}-heading`}
            className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Réponses courtes et concrètes — pour aller droit à l’essentiel.
          </p>
        </div>
      </div>

      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-background/60">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;

          return (
            <div key={item.question} className="bg-card first:rounded-t-2xl last:rounded-b-2xl">
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenIndex((prev) => (prev === index ? null : index))
                  }
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-4 text-left transition-colors sm:px-5",
                    "hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    isOpen && "bg-key-bg/50"
                  )}
                >
                  <span className="min-w-0 flex-1 text-[0.95rem] font-bold leading-snug text-foreground sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-0.5 size-5 shrink-0 text-primary transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={cn(
                  "border-t border-border/70 px-4 pb-4 pt-0 sm:px-5",
                  !isOpen && "hidden"
                )}
              >
                {isOpen && (
                  <p className="pt-3 text-[0.95rem] leading-[1.7] text-foreground/95">
                    {item.answer}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
