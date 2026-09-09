import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { legalNotice } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Legal notice",
  description: "Publisher, hosting and intellectual property for this site.",
  robots: { index: true, follow: true },
};

export default function LegalNoticePage() {
  return (
    <LegalPage
      title={legalNotice.title}
      intro={legalNotice.intro}
      updated={legalNotice.updated}
      sections={legalNotice.sections}
    />
  );
}
