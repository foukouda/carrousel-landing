import { ImageResponse } from "next/og";

import { site } from "@/lib/content";
import { GLYPH_H, litDots, textWidth } from "@/lib/dot-font";

/* Broken by hand rather than wrapped: at the width this card allows, the whole
   sentence on one line lands at four pixels per dot, which is unreadable. */
const TAGLINE = ["THE DATA YOU CARE ABOUT", "ON A DESK OBJECT"];

export const alt = `${site.product} by ${site.brand}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card people see when the link is pasted into Discord, Reddit or a group
 * chat, which for a pre-launch page is most of how it travels.
 *
 * Set entirely in the panel's own dot font, drawn as positioned squares. No
 * webfont is loaded and no text is rendered: the image cannot fall back to a
 * default typeface and lose the identity, because there is no type in it.
 */
function DotWord({
  text,
  pitch,
  color,
  opacity = 1,
}: {
  text: string;
  pitch: number;
  color: string;
  opacity?: number;
}) {
  const dot = Math.round(pitch * 0.78);
  const dots = litDots(text);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: textWidth(text) * pitch,
        height: GLYPH_H * pitch,
        opacity,
      }}
    >
      {dots.map(([x, y]) => (
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x * pitch,
            top: y * pitch,
            width: dot,
            height: dot,
            borderRadius: dot,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f1e6",
          padding: 76,
        }}
      >
        <div style={{ display: "flex" }}>
          <DotWord text={site.brand} pitch={9} color="#6f6757" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <DotWord text={site.product} pitch={19} color="#26201a" />
          <div
            style={{
              display: "flex",
              marginTop: 44,
              width: 210,
              height: 5,
              background: "#ac5634",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 40,
              gap: 14,
            }}
          >
            {TAGLINE.map((line) => (
              <DotWord key={line} text={line} pitch={7} color="#6f6757" />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
