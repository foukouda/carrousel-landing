import Link from "next/link";

import { nav, site } from "@/lib/content";
import { SectionNav } from "./section-nav";
import { Container } from "./ui";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)]/70 bg-[color:var(--background)]/85 backdrop-blur-md">
      <Container className="flex h-[64px] items-center justify-between gap-8">
        <Link
          href="#top"
          className="-my-3 inline-block py-3 text-[12px] font-semibold tracking-[0.28em] text-foreground uppercase"
        >
          {site.brand}
        </Link>

        {/* One line at desktop, and the only client island in the header.
            Below md the page is a single scroll, so the links give way to the
            only action that matters. */}
        <SectionNav />

        <Link
          href="#join"
          className="inline-flex h-10 min-h-[44px] items-center justify-center rounded-[var(--radius-interactive)] bg-accent px-6 text-[12px] font-semibold tracking-[0.12em] whitespace-nowrap text-accent-foreground uppercase transition-[background-color,box-shadow,transform] duration-300 ease-out hover:bg-accent-hover hover:shadow-[var(--shadow-accent-hover)] active:scale-[0.97] md:min-h-0"
        >
          {nav.cta}
        </Link>
      </Container>
    </header>
  );
}
