import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1360px] px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

const BANDS = {
  background: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  "surface-alt": "bg-surface-alt text-foreground",
  ink: "bg-ink text-on-ink",
} as const;

/**
 * Sections alternate background / surface / surface-alt so no two adjacent
 * bands share a colour. The ink band is used exactly once on the page.
 *
 * Padding runs generous by design. This is the difference between a page that
 * shows a product and a page that presents one.
 */
export function Section({
  children,
  band,
  id,
  className = "",
}: {
  children: ReactNode;
  band: keyof typeof BANDS;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`${BANDS[band]} py-20 md:py-28 lg:py-48 ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * A technical annotation, the way a drawing labels a part. Used to mark data
 * on the product, not as a decorative eyebrow above every section heading.
 */
export function Label({
  children,
  tone = "muted",
  className = "",
}: {
  children: ReactNode;
  tone?: "muted" | "accent" | "on-ink";
  className?: string;
}) {
  const colour =
    tone === "accent"
      ? "text-accent-hover"
      : tone === "on-ink"
        ? "text-on-ink-muted"
        : "text-muted";

  return (
    <p
      className={`tabular text-[11px] font-semibold tracking-[0.22em] uppercase ${colour} ${className}`}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`max-w-[20ch] text-[38px] leading-[1.05] font-medium tracking-[-0.03em] lg:text-[54px] ${className}`}
    >
      {children}
    </h2>
  );
}

export function Lede({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-[54ch] text-[18px] leading-[1.6] ${className}`}>
      {children}
    </p>
  );
}

/** A full-width hairline, used to structure the page the way a grid does. */
export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-border ${className}`} />;
}
