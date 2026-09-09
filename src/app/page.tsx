import { Hero } from "@/components/hero";
import { About } from "@/components/sections/about";
import { Apps } from "@/components/sections/apps";
import { Closing } from "@/components/sections/closing";
import { Materials } from "@/components/sections/materials";
import { OpenSource } from "@/components/sections/open-source";
import { Specs } from "@/components/sections/specs";
import { Timeline } from "@/components/sections/timeline";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/* Bands alternate so no two neighbours share a colour:
   background, surface, surface-alt, background, surface, surface-alt,
   background, surface, surface-alt. */
export default function Page() {
  return (
    <>
      {/* Off screen until focused, then the first stop for anyone arriving by
          keyboard: without it, reaching the form means tabbing through the
          whole navigation on every page load. */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-[var(--radius-interactive)] focus:bg-accent focus:px-5 focus:py-3 focus:text-[13px] focus:font-semibold focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <SiteHeader />
      <main id="content">
        <Hero />
        <Materials />
        <Apps />
        <OpenSource />
        <Specs />
        <Timeline />
        <About />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
