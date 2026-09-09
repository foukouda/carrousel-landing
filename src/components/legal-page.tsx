import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import type { LegalSection } from "@/lib/legal";
import { DotMatrixText } from "./dot-matrix-text";
import { Container, Label } from "./ui";

/**
 * The shared shell for the privacy and legal notices.
 *
 * Deliberately plainer than the rest of the site: one column, no motion, no
 * decoration. A legal page is read to find one specific answer, so the job is
 * scanning, not atmosphere.
 *
 * Unfilled facts appear as {{TODO}} in the source and are rendered in the
 * accent colour, so nobody can publish the page without noticing them.
 */
function Prose({ text }: { text: string }) {
  const parts = text.split(/(\{\{TODO:[^}]*\}\})/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("{{TODO:") ? (
          <mark
            key={index}
            className="bg-accent-soft px-1 text-accent-hover"
            title="This has to be filled in before the site goes live"
          >
            {part.replace(/^\{\{TODO:\s*/, "").replace(/\}\}$/, "")}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: readonly LegalSection[];
}) {
  return (
    <main className="bg-background pt-16 pb-32 lg:pt-24 lg:pb-40">
      <Container className="max-w-[760px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-300 ease-out hover:text-foreground"
        >
          <ArrowLeft size={15} aria-hidden />
          Carrousel
        </Link>

        <h1 className="mt-12">
          <span className="sr-only">{title}</span>
          <DotMatrixText
            lines={[title.toUpperCase()]}
            gridOpacity={0.1}
            className="max-w-[420px] text-foreground"
          />
        </h1>

        <p className="mt-10 max-w-[58ch] text-[19px] leading-[1.6] text-foreground">
          {intro}
        </p>
        <Label className="mt-4">Last updated {updated}</Label>

        <div className="mt-16 space-y-14">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-[21px] leading-tight font-medium tracking-[-0.02em] text-foreground">
                {section.title}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 max-w-[64ch] text-[15px] leading-[1.7] text-muted"
                >
                  <Prose text={paragraph} />
                </p>
              ))}

              {section.list ? (
                <ul className="mt-4 max-w-[64ch] space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="border-l border-border pl-4 text-[15px] leading-[1.7] text-muted"
                    >
                      <Prose text={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
