import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { DotMatrixText } from "@/components/dot-matrix-text";
import { Container } from "@/components/ui";
import { UnsubscribeForm } from "@/components/unsubscribe-form";
import { links } from "@/lib/content";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Remove your address from the Carrousel launch list.",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email = "", token = "" } = await searchParams;
  const hasLink = email !== "" && token !== "";

  return (
    <main className="bg-background pt-16 pb-32 lg:pt-24 lg:pb-40">
      <Container className="max-w-[680px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-300 ease-out hover:text-foreground"
        >
          <ArrowLeft size={15} aria-hidden />
          Carrousel
        </Link>

        <h1 className="mt-12">
          <span className="sr-only">Unsubscribe</span>
          <DotMatrixText
            lines={["UNSUBSCRIBE"]}
            gridOpacity={0.1}
            className="max-w-[460px] text-foreground"
          />
        </h1>

        {hasLink ? (
          <>
            <p className="mt-10 max-w-[54ch] text-[19px] leading-[1.6] text-foreground">
              This will delete{" "}
              <span className="font-medium break-all">{email}</span> from the
              launch list.
            </p>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-muted">
              The record is removed outright, not marked as inactive. If you
              change your mind you are welcome to sign up again.
            </p>
            <UnsubscribeForm email={email} token={token} />
          </>
        ) : (
          <>
            <p className="mt-10 max-w-[54ch] text-[19px] leading-[1.6] text-foreground">
              This link is missing the part that proves it is yours.
            </p>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-muted">
              Use the unsubscribe link at the bottom of any email we sent you.
              That one carries a signature, which is what stops anyone else
              removing your address. If you no longer have the email, write to{" "}
              {links.contact ? (
                <a
                  href={`mailto:${links.contact}`}
                  className="text-accent-hover underline underline-offset-2"
                >
                  {links.contact}
                </a>
              ) : (
                "us"
              )}{" "}
              and we will delete it by hand within a month.
            </p>
          </>
        )}
      </Container>
    </main>
  );
}
