import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * The browser-tab mark.
 *
 * A letter set in the 5 x 7 panel font would be the obvious choice, but a
 * favicon is read at 16px, where five columns of dots collapse into a smudge.
 * So the mark is the panel itself reduced to what survives that size: four by
 * two lit pixels on the accent. Few dots, large, high contrast.
 */
export default function Icon() {
  const cols = 4;
  const rows = 2;
  const dot = 9;
  const gap = 5;
  const gridW = cols * dot + (cols - 1) * gap;
  const gridH = rows * dot + (rows - 1) * gap;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ac5634",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: gridW,
            height: gridH,
          }}
        >
          {Array.from({ length: rows }).flatMap((_, y) =>
            Array.from({ length: cols }).map((_, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  position: "absolute",
                  left: x * (dot + gap),
                  top: y * (dot + gap),
                  width: dot,
                  height: dot,
                  borderRadius: dot,
                  background: "#f6f1e6",
                  /* One pixel held dim, so the mark reads as a panel mid-frame
                     rather than a plain grid of holes. */
                  opacity: x === 3 && y === 0 ? 0.4 : 1,
                }}
              />
            )),
          )}
        </div>
      </div>
    ),
    size,
  );
}
