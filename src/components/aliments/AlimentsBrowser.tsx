"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { VerdictBadge } from "@/components/aliments/VerdictBadge";
import {
  VERDICT_LABEL,
  VERDICT_ORDER,
  type AlimentVerdict,
} from "@/lib/aliments-shared";

export interface AlimentCardData {
  slug: string;
  nom: string;
  emoji: string;
  verdict: AlimentVerdict;
  resume: string;
  synonymes: string[];
  formes: string[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function AlimentsBrowser({ items }: { items: AlimentCardData[] }) {
  const [query, setQuery] = useState("");
  const needle = normalize(query.trim());

  const filtered = useMemo(() => {
    if (!needle) return items;
    return items.filter((item) => {
      const haystack = normalize(
        [item.nom, item.resume, ...item.synonymes, ...item.formes].join(" ")
      );
      return haystack.includes(needle);
    });
  }, [items, needle]);

  return (
    <div>
      <label className="block max-w-xl">
        <span className="sr-only">Rechercher un aliment</span>
        <span className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Raisin, chocolat noir, xylitol…"
            className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-base shadow-sm outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2"
            type="search"
          />
        </span>
      </label>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground" role="status">
          Aucun aliment ne correspond. En cas de doute sur un produit absent
          de cette base, appelez votre vétérinaire ou un centre antipoison.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {VERDICT_ORDER.map((verdict) => {
            const group = filtered.filter((item) => item.verdict === verdict);
            if (!group.length) return null;
            return (
              <section key={verdict} aria-labelledby={`groupe-${verdict}`}>
                <h2
                  id={`groupe-${verdict}`}
                  className="text-lg font-extrabold tracking-tight"
                >
                  {VERDICT_LABEL[verdict]}
                  <span className="ml-2 text-sm font-semibold text-muted-foreground">
                    {group.length}
                  </span>
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {group.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/aliments/${item.slug}`}
                        className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:border-primary/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-[family-name:var(--font-display)] text-lg font-extrabold">
                            <span aria-hidden className="mr-2">
                              {item.emoji}
                            </span>
                            {item.nom}
                          </p>
                          <VerdictBadge verdict={item.verdict} />
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {item.resume}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
