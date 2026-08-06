import { AlertTriangle, Lightbulb, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttentionBoxProps {
  title?: string;
  text: string;
  className?: string;
}

function variantFromTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("attention")) {
    return {
      box: "border-amber-700/40 bg-warning-bg shadow-sm",
      iconWrap: "bg-amber-200 text-amber-950 ring-2 ring-amber-300/80",
      title: "text-warning-fg",
      body: "text-warning-fg",
      Icon: AlertTriangle,
    };
  }
  if (t.includes("point clé") || t.includes("point cle")) {
    return {
      box: "border-key-border/50 bg-key-bg shadow-sm",
      iconWrap: "bg-primary text-primary-foreground ring-2 ring-primary/25",
      title: "text-key-fg",
      body: "text-key-fg",
      Icon: Lightbulb,
    };
  }
  return {
    box: "border-sky-700/30 bg-sky-100 shadow-sm",
    iconWrap: "bg-sky-200 text-sky-950 ring-2 ring-sky-300/70",
    title: "text-sky-950",
    body: "text-sky-950",
    Icon: Info,
  };
}

export function AttentionBox({
  title = "Attention",
  text,
  className,
}: AttentionBoxProps) {
  const v = variantFromTitle(title);
  const Icon = v.Icon;

  return (
    <aside
      className={cn(
        "flex gap-3.5 rounded-2xl border-2 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5",
        v.box,
        className
      )}
      role="note"
    >
      <span
        className={cn(
          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl",
          v.iconWrap
        )}
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 measure-wide">
        <p
          className={cn(
            "text-sm font-extrabold tracking-wide uppercase",
            v.title
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "mt-2 text-base leading-[1.7] font-medium",
            v.body
          )}
        >
          {text}
        </p>
      </div>
    </aside>
  );
}
