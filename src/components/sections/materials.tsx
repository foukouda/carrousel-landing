import { materials, media } from "@/lib/content";
import { FrenchMark } from "../french-mark";
import { ProductShot } from "../product-shot";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { Container, Label, Lede, Section, SectionTitle } from "../ui";

export function Materials() {
  return (
    <Section band="surface" id="object">
      <Container>
        <Reveal className="max-w-[48rem]">
          <Label tone="accent">{materials.eyebrow}</Label>
          <SectionTitle className="mt-6">{materials.title}</SectionTitle>
          <Lede className="mt-7 text-muted">{materials.body}</Lede>
        </Reveal>
      </Container>

      {/* The photograph runs the full width of the viewport, with the panel
          alive inside it. The object is the argument, so it gets more room
          than the words about it. */}
      <Reveal delay={0.08} className="mt-20">
        <ProductShot
          src={media.object.src}
          alt={media.object.alt}
          brief={media.object.brief}
          ratio={media.object.ratio}
          screen={media.object.screen}
        />
      </Reveal>

      <Container>
        {/* The upright view earns its place next to the facts rather than in
            a row of its own: a portrait image is tall, and three stacked facts
            are exactly what fills that height. Seeing both orientations
            together also says the screen turns without a line of copy
            claiming it. */}
        <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <ProductShot
              src={media.upright.src}
              alt={media.upright.alt}
              brief={media.upright.brief}
              ratio={media.upright.ratio}
              screen={media.upright.screen}
            />
            <Label className="mt-5">Landscape or upright</Label>
          </Reveal>

          <RevealGroup as="dl" className="grid gap-10 md:col-span-6 md:col-start-7">
            {materials.facts.map((fact) => (
              <RevealItem
                key={fact.title}
                className="border-t border-border pt-7"
              >
                <dt className="flex items-center gap-2.5 text-[20px] leading-snug font-medium tracking-[-0.01em] text-foreground">
                  {"flag" in fact && fact.flag ? <FrenchMark /> : null}
                  {fact.title}
                </dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-muted">
                  {fact.body}
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
