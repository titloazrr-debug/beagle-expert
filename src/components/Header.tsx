"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getTenant } from "@/lib/tenant";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/par-ou-commencer", label: "Par où commencer" },
  { href: "/#quiz", label: "Quiz" },
  { href: "/#fiches", label: "Fiches" },
  { href: "/fiches", label: "Toutes les fiches" },
  { href: "/quizzes", label: "Tous les quiz" },
  { href: "/fiche/budget-equipement", label: "💰 Budget" },
  { href: "/a-propos", label: "À propos" },
];

export function Header() {
  const tenant = getTenant();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground"
        >
          <Image
            src="/logo-beagle.svg"
            alt={`Logo ${tenant.name}`}
            width={40}
            height={40}
            className="size-9 rounded-xl shadow-sm ring-1 ring-border/60"
            priority
          />
          <span className="font-[family-name:var(--font-display)] text-lg">
            {tenant.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principale">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/quiz/pret-a-adopter">Faire le quiz d&apos;adoption</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-background md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-3" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-2">
            <Link href="/quiz/pret-a-adopter" onClick={() => setOpen(false)}>
              Faire le quiz d&apos;adoption
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
