"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll reveal: opacity 0 to 1 and translateY 22px to 0, on a critically
 * damped spring so it settles with weight and never overshoots. Fires once,
 * 80px before entering the viewport.
 */

const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </Component>
  );
}

/** Same reveal, sequenced 80ms apart across the children of a list. */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
      }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={{
        hidden: reduce ? {} : { opacity: 0, y: 22 },
        shown: { opacity: 1, y: 0 },
      }}
      transition={SPRING}
    >
      {children}
    </Component>
  );
}
