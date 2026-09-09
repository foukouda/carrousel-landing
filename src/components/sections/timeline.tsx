import { timeline } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { Container, Section, SectionTitle } from "../ui";

export function Timeline() {
  return (
    <Section band="surface-alt" id="timeline">
      <Container>
        <Reveal className="max-w-[38rem]">
          <SectionTitle>{timeline.title}</SectionTitle>
        </Reveal>

        <RevealGroup as="ol" className="mt-20">
          {timeline.steps.map((step) => (
            <RevealItem
              as="li"
              key={step.title}
              className="grid gap-3 border-t border-border py-10 md:grid-cols-12 md:gap-10"
            >
              <p className="tabular text-[11px] font-semibold tracking-[0.22em] text-accent-hover uppercase md:col-span-3">
                {step.when}
              </p>
              <h3 className="text-[22px] leading-snug font-medium tracking-[-0.015em] text-foreground md:col-span-4">
                {step.title}
              </h3>
              <p className="text-[16px] leading-relaxed text-muted md:col-span-5">
                {step.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
