import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What happens to your email address if you join the Carrousel launch list.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={privacy.title}
      intro={privacy.intro}
      updated={privacy.updated}
      sections={privacy.sections}
    />
  );
}
