import Link from "next/link";

import { footer, links, site } from "@/lib/content";
import { Container } from "./ui";

/* Required on a French site, and required to be reachable from every page. */
const legal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Legal notice", href: "/legal" },
];

const external = [
  { label: "Discord", href: links.discord },
  { label: "Source", href: links.github },
  { label: "Kickstarter", href: links.kickstarter },
].filter((link) => link.href !== "");

export function SiteFooter() {
  return (
    <footer className="bg-surface-alt py-20">
      <Container>
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[36rem]">
            <p className="text-[12px] font-semibold tracking-[0.28em] text-foreground uppercase">
              {site.brand}
            </p>
            <p className="mt-5 text-[14px] leading-relaxed text-muted">
              {footer.note} {footer.environment}
            </p>
          </div>

          <div className="flex flex-col gap-4 text-[13px] md:items-end">
            <a
              href={`mailto:${links.contact}`}
              className="-my-2 inline-block py-2 tracking-[0.06em] text-muted transition-colors duration-300 ease-out hover:text-foreground"
            >
              {links.contact}
            </a>
            {external.length > 0 ? (
              <ul className="flex gap-6">
                {external.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="-my-2 inline-block py-2 text-[11px] font-semibold tracking-[0.22em] text-muted uppercase transition-colors duration-300 ease-out hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
            &copy; {new Date().getFullYear()} {site.brand}
          </p>

          <ul className="flex gap-6">
            {legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="-my-2 inline-block py-2 text-[11px] font-semibold tracking-[0.22em] text-muted uppercase transition-colors duration-300 ease-out hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
