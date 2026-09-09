import Image from "next/image";
import { ImageSquare } from "@phosphor-icons/react/dist/ssr";

/**
 * A photograph that does not exist yet.
 *
 * The design system's rule: anything unverified ships as a visible placeholder
 * rather than a plausible guess. Dropping a random stock image into a product
 * page is exactly the plausible guess it warns against, so an empty slot names
 * the shot it is waiting for instead.
 *
 * To fill one, put the file in /public/media and set its path in the `media`
 * map in src/lib/content.ts. Nothing else changes.
 */
export function AssetSlot({
  src,
  alt,
  brief,
  ratio = "4 / 3",
  priority = false,
  tone = "light",
  className = "",
}: {
  src: string;
  alt: string;
  brief: string;
  ratio?: string;
  priority?: boolean;
  tone?: "light" | "ink";
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 1360px"
          className="object-cover"
        />
      </div>
    );
  }

  const ink = tone === "ink";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 border border-dashed p-10 text-center ${
        ink
          ? "border-ink-border bg-ink-raised text-on-ink-muted"
          : "border-border bg-surface-alt text-muted"
      } ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <ImageSquare size={28} aria-hidden />
      <p className="max-w-[44ch] text-[13px] leading-relaxed">{brief}</p>
    </div>
  );
}
