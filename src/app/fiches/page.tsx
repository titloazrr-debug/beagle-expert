import type { Metadata } from "next";
import { FicheCard } from "@/components/FicheCard";
import { fiches } from "@/data/fiches";
import { categoryLabels } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import type { FicheCategory } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Fiches Beagle : santé, alimentation, éducation et plus",
  description:
    "Toutes les fiches Beagle Expert : santé, alimentation, éducation, soins, budget et histoire. Guides clairs pour mieux comprendre la race.",
  path: "/fiches",
  image: "/images/beagle/og-default.jpg",
  keywords: [
    "fiches Beagle",
    "guide Beagle",
    "santé Beagle",
    "alimentation Beagle",
    "éducation Beagle",
  ],
});

const order: FicheCategory[] = [
  "sante",
  "alimentation",
  "education",
  "soins",
  "budget",
  "histoire",
];

export default function FichesIndexPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          Bibliothèque
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
          Toutes les fiches
        </h1>
        <p className="mt-3 text-muted-foreground">
          Santé, alimentation, éducation, soins, budget et histoire — des
          repères concrets pour accompagner votre Beagle au quotidien.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {order.map((cat) => {
          const list = fiches.filter((f) => f.category === cat);
          if (!list.length) return null;
          const meta = categoryLabels[cat];
          return (
            <section key={cat}>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <span aria-hidden>{meta.emoji}</span>
                {meta.label}
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((f) => (
                  <FicheCard key={f.slug} fiche={f} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
