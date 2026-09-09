import type { Metadata } from "next";
import Link from "next/link";

import { DotMatrixText } from "@/components/dot-matrix-text";
import { Container } from "@/components/ui";
import { nav } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * A dead end is still a page someone landed on, usually from an old link or a
 * typo. It gets the same ground, the same type and a way back, rather than the
 * framework's default black-on-white stack trace page.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-center bg-background py-24">
      <Container className="max-w-[680px]">
        <h1>
          <span className="sr-only">Page not found</span>
          <DotMatrixText
            lines={["404"]}
            gridOpacity={0.1}
            className="max-w-[200px] text-foreground"
          />
        </h1>

        <p className="mt-12 max-w-[42ch] text-[24px] leading-[1.2] font-medium tracking-[-0.02em] text-foreground">
          This page does not exist.
        </p>
        <p className="mt-5 max-w-[54ch] text-[16px] leading-[1.7] text-muted">
          The link may be out of date, or the address may have a typo in it.
          Everything about Carrousel lives on one page.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex h-12 min-h-[44px] items-center justify-center rounded-[var(--radius-interactive)] bg-accent px-8 text-[12px] font-semibold tracking-[0.12em] whitespace-nowrap text-accent-foreground uppercase transition-[background-color,box-shadow,transform] duration-300 ease-out hover:bg-accent-hover hover:shadow-[var(--shadow-accent-hover)] active:scale-[0.97]"
          >
            {nav.cta}
          </Link>
          <Link
            href="/"
            className="-my-2 inline-block py-2 text-[13px] text-muted underline underline-offset-4 transition-colors duration-300 ease-out hover:text-foreground"
          >
            Back to Carrousel
          </Link>
        </div>
      </Container>
    </main>
  );
}
