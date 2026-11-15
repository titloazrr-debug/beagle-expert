import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Lien interne écrit en markdown dans un champ affiché comme du texte :
 * `[ancre](/chemin)`. Le reste de la chaîne (gras, code, code promo) est
 * laissé intact.
 */
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

const linkClassName =
  "font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary";

/** Chemin du site (`/fiche/…`, `/#ancre`). Refuse `//hôte` et les blancs. */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//") && !/[\s\\]/.test(href);
}

export function MarkdownLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  );
}

export function InlineMarkdown({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re = new RegExp(MARKDOWN_LINK.source, "g");
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(
        <span key={`t-${index}`}>{text.slice(last, match.index)}</span>
      );
      index += 1;
    }
    const label = match[1];
    const href = match[2];
    if (isInternalHref(href)) {
      nodes.push(
        <MarkdownLink key={`l-${index}`} href={href}>
          {label}
        </MarkdownLink>
      );
    } else {
      nodes.push(<span key={`r-${index}`}>{match[0]}</span>);
    }
    last = match.index + match[0].length;
    index += 1;
  }

  if (nodes.length === 0) return text;
  if (last < text.length) {
    nodes.push(<span key={`t-${index}`}>{text.slice(last)}</span>);
  }
  return <>{nodes}</>;
}
