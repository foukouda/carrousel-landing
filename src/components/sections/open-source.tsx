import { openSource } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { Container, Lede, Section } from "../ui";

export function OpenSource() {
  return (
    <Section band="background" id="open-source">
      <Container>
        <Reveal className="max-w-[56rem]">
          {/* Larger than a section title: this is the claim the whole project
              rests on, so it carries the weight of a statement. */}
          <h2 className="text-[42px] leading-[1.02] font-medium tracking-[-0.035em] text-foreground lg:text-[68px]">
            {openSource.title}
          </h2>
          <Lede className="mt-9 text-muted">{openSource.body}</Lede>

          <ul className="mt-9 flex flex-wrap gap-2">
            {openSource.licences.map((licence) => (
              <li
                key={licence}
                className="rounded-[var(--radius-interactive)] border border-[color:var(--accent)]/25 px-4 py-2 text-[11px] font-semibold tracking-[0.16em] text-accent-hover uppercase"
              >
                {licence}
              </li>
            ))}
          </ul>
        </Reveal>

        <RevealGroup as="ol" className="mt-24">
          {openSource.points.map((point, index) => (
            <RevealItem
              as="li"
              key={point.title}
              className="grid gap-4 border-t border-border py-10 md:grid-cols-12 md:gap-10"
            >
              <p className="tabular text-[11px] font-semibold tracking-[0.22em] text-accent-hover uppercase md:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-[22px] leading-snug font-medium tracking-[-0.015em] text-foreground md:col-span-5">
                {point.title}
              </h3>
              <p className="text-[16px] leading-relaxed text-muted md:col-span-6">
                {point.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
