"use client";

import { useEffect, useRef, useState } from "react";

import { quadTransform, type Quad } from "@/lib/homography";
import { MatrixDisplay } from "./matrix-display";

const COLS = 68;
const ROWS = 32;

/**
 * Lays the live panel onto the screen in a photograph, at whatever angle the
 * photograph was taken.
 *
 * The corners arrive as percentages of the image so they survive any display
 * size, but a CSS transform works in pixels. So the element measures itself,
 * converts, and rebuilds the matrix whenever the layout changes.
 *
 * The panel is rendered at the on-screen size of the widest edge of the quad,
 * which keeps the canvas at its native resolution: sizing it smaller and
 * letting the matrix scale it up would show as soft, blurry LEDs.
 */
export function ScreenOverlay({ corners }: { corners: Quad }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{
    width: number;
    height: number;
    transform: string;
  } | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const measure = () => {
      const { width: bw, height: bh } = box.getBoundingClientRect();
      if (bw === 0 || bh === 0) return;

      const toPixels = (c: { x: number; y: number }) => ({
        x: (c.x / 100) * bw,
        y: (c.y / 100) * bh,
      });

      const quad: Quad = {
        topLeft: toPixels(corners.topLeft),
        topRight: toPixels(corners.topRight),
        bottomRight: toPixels(corners.bottomRight),
        bottomLeft: toPixels(corners.bottomLeft),
      };

      const span = (a: { x: number; y: number }, b: { x: number; y: number }) =>
        Math.hypot(b.x - a.x, b.y - a.y);
      const width = Math.round(
        Math.max(
          span(quad.topLeft, quad.topRight),
          span(quad.bottomLeft, quad.bottomRight),
        ),
      );
      const height = Math.round((width * ROWS) / COLS);

      /* On a phone the photograph is only a few hundred pixels wide, which
         leaves the screen inside it around 2.5px per LED. At that size the
         clock is not small, it is illegible mush sitting on the product. Below
         the threshold the photograph is better off shown as it is. */
      if (width / COLS < 3.6) {
        setFit(null);
        return;
      }

      const transform = quadTransform(width, height, quad);
      if (transform) setFit({ width, height, transform });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [corners]);

  return (
    <div ref={boxRef} className="pointer-events-none absolute inset-0">
      {fit ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${fit.width}px`,
            height: `${fit.height}px`,
            transformOrigin: "0 0",
            transform: fit.transform,
          }}
        >
          <MatrixDisplay />
        </div>
      ) : null}
    </div>
  );
}
