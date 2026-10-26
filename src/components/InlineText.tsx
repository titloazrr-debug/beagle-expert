import Link from "next/link";

/** Gras et liens markdown internes, pour le corps des fiches. */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      if (href.startsWith("/")) {
        return (
          <Link
            key={i}
            href={href}
            className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
          >
            {link[1]}
          </Link>
        );
      }
      return <span key={i}>{link[1]}</span>;
    }
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}
