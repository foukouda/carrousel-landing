/**
 * The tricolour, used wherever the page claims French manufacturing.
 *
 * The palette allows no third accent and no blue. This
 * does not break that rule, because it is not an accent: it is an emblem,
 * scoped to the one claim it belongs to, and it never colours type, borders
 * or interactive states. Treat it the way you would a certification stamp.
 *
 * Colours are the current official ones, navy restored in 2020: #000091,
 * #FFFFFF, #E1000F. The hairline is what lets the white stripe read against
 * a cream ground.
 */
export function FrenchMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-[11px] w-[17px] shrink-0 overflow-hidden border border-[color:var(--foreground)]/20 align-[-1px] ${className}`}
    >
      <span className="w-1/3 bg-[#000091]" />
      <span className="w-1/3 bg-white" />
      <span className="w-1/3 bg-[#E1000F]" />
    </span>
  );
}
