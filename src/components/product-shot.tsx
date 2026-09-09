import Image from "next/image";

import type { Quad } from "@/lib/homography";
import { AssetSlot } from "./asset-slot";
import { ScreenOverlay } from "./screen-overlay";

/**
 * The product photograph, with its screen switched on.
 *
 * A CAD render leaves the panel blank, which sells the object short: the whole
 * argument for Carrousel is what the screen shows. So the simulated panel is
 * laid over the screen area of the photograph, running the same clock and the
 * same Game of Life as everywhere else on the page. It is not a mock-up of the
 * display, it is the display.
 *
 * `screen` gives the four corners of the active LED area as percentages of the
 * image, clockwise from the top left. Corners rather than a box because the
 * render is a three-quarter view: the screen is a trapezoid, and a rectangle
 * will not sit on it at any offset or size. See README.md for how to line
 * them up.
 */
export function ProductShot({
  src,
  alt,
  brief,
  ratio,
  screen,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  brief: string;
  ratio: string;
  screen?: Quad | null;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <AssetSlot
        src=""
        alt={alt}
        brief={brief}
        ratio={ratio}
        className={className}
      />
    );
  }

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
        sizes="100vw"
        className="object-cover"
      />

      {screen ? <ScreenOverlay corners={screen} /> : null}
    </div>
  );
}
