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
          priority={priority}
          {...rest}
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
      priority={priority}
      {...rest}
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
