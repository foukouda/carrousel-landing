import {
  CalendarCheck,
  ChartLine,
  Clock,
  CloudSun,
  FilmStrip,
  Grains,
  MusicNote,
  Timer,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
/* The ssr entry ships components only. The type comes from the root entry,
   and a type-only import is erased before it can reach the bundle. */
import type { Icon } from "@phosphor-icons/react";

import { apps } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { Container, Lede, Section, SectionTitle } from "../ui";

const ICONS: Record<string, Icon> = {
  clock: Clock,
  life: Grains,
  gif: FilmStrip,
  weather: CloudSun,
  tasks: CalendarCheck,
  timer: Timer,
  music: MusicNote,
  markets: ChartLine,
  subs: UsersThree,
};

/**
 * The one dark chapter on the page. Not a mood: a screen only reads against a
 * dark ground, and this section is about what the screen shows.
 *
 * Nine apps, nine cells, no empty tile. The hairlines come from a 1px grid gap
 * showing the container through, which keeps every rule exactly one pixel and
 * survives any wrap.
 */
export function Apps() {
  return (
    <Section band="ink" id="apps">
      <Container>
        <Reveal className="max-w-[42rem]">
          <SectionTitle className="text-on-ink">{apps.title}</SectionTitle>
          <Lede className="mt-7 text-on-ink-muted">{apps.lede}</Lede>
        </Reveal>

        {/* Nine tall cells stacked on a phone made this one section four
            screens long, so on small viewports the icon sits beside the name
            instead of above it. The airy version returns at sm. */}
        <RevealGroup
          as="ul"
          className="mt-12 grid gap-px border border-ink-border bg-ink-border sm:mt-20 sm:grid-cols-2 lg:grid-cols-3"
        >
          {apps.items.map((app) => {
            const AppIcon = ICONS[app.icon] ?? Clock;
            return (
              <RevealItem
                as="li"
                key={app.name}
                className="bg-ink p-6 transition-colors duration-300 ease-out hover:bg-ink-raised sm:p-8 lg:p-10"
              >
                <div className="flex items-center gap-3 sm:block">
                  <AppIcon
                    size={24}
                    weight="regular"
                    className="shrink-0 text-on-ink-accent"
                    aria-hidden
                  />
                  <h3 className="text-[19px] font-medium tracking-[-0.01em] text-on-ink sm:mt-8">
                    {app.name}
                  </h3>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-on-ink-muted sm:mt-3">
                  {app.body}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
