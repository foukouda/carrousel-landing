import { hero } from "@/lib/content";
import { DotMatrixText } from "./dot-matrix-text";
import { FrenchMark } from "./french-mark";
import { MatrixDisplay } from "./matrix-display";
import { Container, Label } from "./ui";
import { WaitlistForm } from "./waitlist-form";

/**
 * The only section that animates in CSS rather than with the JavaScript
 * reveal: the wordmark is the largest paint on the page, so it has to be
 * painted by the document, not held at opacity 0 waiting for hydration.
 */
export function Hero() {
  return (
    <section id="top" className="bg-background pt-14 pb-28 lg:pt-20 lg:pb-36">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            {/* The wordmark is set in the panel's own font, at the panel's own
                resolution. The readable text sits alongside for anything that
                does not have eyes. */}
            <h1 className="enter">
              <span className="sr-only">{hero.wordmark}</span>
              <DotMatrixText
                lines={[hero.wordmark]}
                gridOpacity={0.11}
                className="text-foreground"
              />
            </h1>

            <p
              className="enter mt-8 max-w-[22ch] text-[28px] leading-[1.15] font-medium tracking-[-0.02em] text-foreground lg:text-[34px]"
              style={{ animationDelay: "80ms" }}
            >
              {hero.subtitle}
            </p>

            <div className="enter mt-10" style={{ animationDelay: "160ms" }}>
              <WaitlistForm
                label={hero.formLabel}
                placeholder={hero.formPlaceholder}
                help={hero.formHelp}
                source="hero"
              />
            </div>
          </div>

          <div
            className="enter lg:col-span-7"
            style={{ animationDelay: "120ms" }}
          >
            <MatrixDisplay className="border border-border" />

            {/* Annotations on the part, not copy about it. */}
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {hero.marks.map((mark) => (
                <li key={mark.text} className="flex items-center gap-2">
                  {"flag" in mark && mark.flag ? <FrenchMark /> : null}
                  <Label>{mark.text}</Label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
