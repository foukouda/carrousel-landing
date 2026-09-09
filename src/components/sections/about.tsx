import { about, media } from "@/lib/content";
import { AssetSlot } from "../asset-slot";
import { Reveal } from "../reveal";
import { Container, Section, SectionTitle } from "../ui";

export function About() {
  return (
    <Section band="background">
      <Container>
        <div className="grid items-end gap-14 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <AssetSlot
              src={media.founder.src}
              alt={media.founder.alt}
              brief={media.founder.brief}
              ratio="3 / 4"
            />
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-7">
            <SectionTitle>{about.title}</SectionTitle>

            <p className="mt-10 text-[20px] font-medium tracking-[-0.01em] text-foreground">
              {about.name}
            </p>
            <p className="mt-2 text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
              {about.role}
            </p>
            <p className="mt-8 max-w-[56ch] text-[17px] leading-[1.7] text-muted">
              {about.body}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
