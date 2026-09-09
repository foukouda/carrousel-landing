import { closing, links } from "@/lib/content";
import { DotMatrixText } from "../dot-matrix-text";
import { Reveal } from "../reveal";
import { Container, Section } from "../ui";
import { WaitlistForm } from "../waitlist-form";

export function Closing() {
  return (
    <Section band="surface" id="join">
      <Container>
        {/* Centred on purpose: this is the one moment on the page where the
            message and the action are the whole composition. */}
        <Reveal className="mx-auto max-w-[46rem]">
          <h2>
            <span className="sr-only">{closing.title}</span>
            <DotMatrixText
              lines={closing.titleLines}
              gridOpacity={0.1}
              className="text-foreground"
            />
          </h2>
          <p className="mx-auto mt-12 max-w-[54ch] text-center text-[17px] leading-[1.7] text-muted">
            {closing.body}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-12 max-w-[34rem]">
          <WaitlistForm
            label={closing.formLabel}
            placeholder={closing.formPlaceholder}
            help={closing.formHelp}
            source="closing"
          />
        </Reveal>

        {links.discord ? (
          <Reveal delay={0.16} className="mt-14 text-center">
            <p className="text-[15px] text-muted">
              Want to help decide what ships?{" "}
              <a
                href={links.discord}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-accent-hover underline decoration-[color:var(--accent)]/40 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-[color:var(--accent)]"
              >
                Join the Discord
              </a>
              , where we run the polls on features, finishes and modules.
            </p>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
