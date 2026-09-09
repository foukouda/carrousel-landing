import { GLYPH_H, litDots, textWidth } from "@/lib/dot-font";

/**
 * Display type, set in the panel's own 5 x 7 font and drawn as real dots.
 *
 * Pure SVG, so it costs no JavaScript, scales to any size without blurring,
 * and inherits its colour from the surrounding text. The unlit dots are left
 * visible, which is what makes it read as a panel rather than a stencil.
 *
 * Both layers are drawn as single nodes rather than one element per dot: the
 * unlit grid is a tiled pattern, the lit dots are one path. A headline like
 * "BE THERE / WHEN IT OPENS" is 77 x 17 dots, so the naive version would put
 * over 1,300 elements in the document for one heading.
 *
 * The text here is decorative by design. The readable copy belongs in the
 * heading that wraps this, marked sr-only, so screen readers and search
 * engines get plain words.
 */

/** One dot as a closed path, so a whole grid of them can share a node. */
function dotPath(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
}

export function DotMatrixText({
  lines,
  tracking = 1,
  lineGap = 3,
  showGrid = true,
  gridOpacity = 0.14,
  className = "",
}: {
  lines: readonly string[];
  tracking?: number;
  lineGap?: number;
  showGrid?: boolean;
  gridOpacity?: number;
  className?: string;
}) {
  const cols = Math.max(...lines.map((line) => textWidth(line, tracking)));
  const rows = lines.length * GLYPH_H + (lines.length - 1) * lineGap;

  const lit = lines.flatMap((line, index) =>
    litDots(line, tracking).map(
      ([x, y]) => [x, y + index * (GLYPH_H + lineGap)] as const,
    ),
  );

  const litPath = lit.map(([x, y]) => dotPath(x + 0.5, y + 0.5, 0.4)).join("");

  /* Deterministic, so the markup is identical on the server and the client.
     The pattern itself is text-independent; the id only has to be unique
     between instances on the page. */
  const patternId = `dot-grid-${lines.join("-").toLowerCase().replace(/[^a-z0-9]+/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      className={`block h-auto w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {showGrid ? (
        <>
          <defs>
            <pattern
              id={patternId}
              width={1}
              height={1}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={0.5} cy={0.5} r={0.34} fill="currentColor" />
            </pattern>
          </defs>
          {/* Hidden on small screens. Below roughly 640px a dot is about
              three pixels across, and the unlit grid stops reading as a panel
              and starts competing with the letters, which makes the wordmark
              hard to read on a phone. */}
          <rect
            className="hidden sm:block"
            width={cols}
            height={rows}
            fill={`url(#${patternId})`}
            opacity={gridOpacity}
          />
        </>
      ) : null}

      <path d={litPath} fill="currentColor" />
    </svg>
  );
}
