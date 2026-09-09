"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { nav } from "@/lib/content";

/**
 * The navigation, with the section currently on screen marked.
 *
 * On a page this long, five anchors that never change state leave the reader
 * with no idea where they are. An IntersectionObserver watches a narrow band
 * near the top of the viewport and reports whichever section crosses it, which
 * costs nothing per frame: no scroll listener, no measurement on every tick.
 */
export function SectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = nav.items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    /* Only a band between 22% and 40% down the viewport counts as "here", so
       the highlight changes once as a section arrives rather than flickering
       between two of them while both are partly visible. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-22% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className="hidden md:block">
      <ul className="flex items-center gap-7">
        {nav.items.map((item) => {
          const isActive = active === item.href.slice(1);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`group relative text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-300 ease-out hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
