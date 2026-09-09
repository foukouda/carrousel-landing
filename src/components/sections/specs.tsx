import { media, specs } from "@/lib/content";
import { ProductShot } from "../product-shot";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { Container, Label, Section, SectionTitle } from "../ui";

/**
 * Three groups, three cells, no empty tile and no ten-row table with a
 * hairline under every line. Each group leads with the one figure worth
 * remembering; the rest sits underneath it.
 */
export function Specs() {
  return (
    <Section band="surface" id="specs">
      <Container>
        <Reveal className="max-w-[42rem]">
          <Label tone="accent">{specs.eyebrow}</Label>
          <SectionTitle className="mt-6">{specs.title}</SectionTitle>
        </Reveal>

        {/* The parts the table names, shown before it names them. */}
        <Reveal delay={0.08} className="mt-16">
          <ProductShot
            src={media.build.src}
            alt={media.build.alt}
            brief={media.build.brief}
            ratio={media.build.ratio}
            screen={media.build.screen}
          />
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          {specs.groups.map((group) => (
            <RevealItem
              key={group.title}
              className="bg-surface p-8 lg:p-10"
            >
              <Label>{group.title}</Label>

              <p className="tabular mt-10 text-[34px] leading-[1] font-medium tracking-[-0.035em] text-foreground lg:text-[46px]">
                {group.figure}
              </p>
              <p className="mt-3 text-[14px] text-muted">{group.figureLabel}</p>

              <dl className="mt-10 grid gap-y-5 border-t border-border pt-7">
                {group.rows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-[13px] text-muted">{row.label}</dt>
                    <dd className="mt-1 text-[15px] text-foreground">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.08}>
          <p className="mt-10 text-[14px] text-muted">{specs.note}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
