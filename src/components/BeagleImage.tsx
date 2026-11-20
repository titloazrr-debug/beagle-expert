import Image, { type ImageProps } from "next/image";
import type { BeagleImageAsset } from "@/lib/beagle-images";
import { cn } from "@/lib/utils";

type BeagleImageProps = Omit<
  ImageProps,
  "src" | "alt" | "width" | "height"
> & {
  asset: BeagleImageAsset;
  /** Surcharge alt (sinon alt du catalogue) */
  alt?: string;
  width?: number;
  height?: number;
  wrapperClassName?: string;
  framed?: boolean;
};

/**
 * Wrapper next/image pour public/images/beagle/.
 * Utilise uniquement le composant Image de Next.js.
 */
export function BeagleImage({
  asset,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  framed = false,
  sizes,
  priority,
  fill,
  quality = 85,
  ...rest
}: BeagleImageProps) {
  const resolvedAlt = alt ?? asset.alt;
  const w = width ?? asset.width;
  const h = height ?? asset.height;

  // Cette version de next/image précharge avec `priority`, mais n’écrit
  // fetchpriority="high" que si on le passe explicitement. Lighthouse
  // s’appuie sur cet attribut pour la photo LCP.
  const priorityProps = priority
    ? { priority: true as const, fetchPriority: "high" as const, loading: "eager" as const }
    : { priority: false as const };

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", wrapperClassName)}>
        <Image
          src={asset.src}
          alt={resolvedAlt}
          fill
          sizes={sizes ?? "100vw"}
          quality={quality}
          className={cn("object-cover", className)}
          {...rest}
          {...priorityProps}
        />
      </div>
    );
  }

  const image = (
    <Image
      src={asset.src}
      alt={resolvedAlt}
      width={w}
      height={h}
      sizes={sizes}
      quality={quality}
      className={cn("h-auto w-full object-cover", className)}
      {...rest}
      {...priorityProps}
    />
  );

  if (!framed) return image;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-muted shadow-[var(--shadow-card)]",
        wrapperClassName
      )}
    >
      {image}
    </div>
  );
}
