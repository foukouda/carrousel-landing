/**
 * Privacy notice and legal notice.
 *
 * The privacy notice covers what Article 13 GDPR requires a controller to tell
 * people at the moment their data is collected. The legal notice covers what
 * article 6-III of the French LCEN requires any published website to state.
 *
 * Serein Design is not incorporated yet, so the publisher is a natural person
 * and there is no company number, share capital or VAT number to give. That is
 * stated plainly rather than left blank: a legal page with holes in it reads as
 * neglect, while an honest line about where the project stands does not.
 *
 * One {{TODO}} remains, and it is real: the email provider has not been chosen.
 * It is left visible on purpose. See README.md.
 */

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

/** Kept here so the two pages and the footer cannot drift apart. */
const PUBLISHER = "Dimitry Siebert";
const CONTACT = "hello@sereindesign.com";

export const privacy = {
  title: "Privacy",
  intro:
    "This page explains what happens to your email address if you join the launch list. It is short because we collect almost nothing.",
  updated: "September 2026",
  sections: [
    {
      title: "Who is responsible",
      paragraphs: [
        `The data controller is ${PUBLISHER}, acting as an individual under the name Serein Design. Serein Design is not incorporated yet; it will be before the campaign opens, and this page will name the company then.`,
        `Write to ${CONTACT} for anything on this page. We have not appointed a Data Protection Officer, which the GDPR does not require at this size and for this kind of processing.`,
      ],
    },
    {
      title: "What we collect",
      paragraphs: [
        "Only what the sign-up form asks for, plus what is needed to prove you agreed to it:",
      ],
      list: [
        "Your email address.",
        "Which form you used, so we know where sign-ups come from.",
        "The date you signed up, the exact wording you agreed to, and its version.",
      ],
    },
    {
      title: "What we do not collect",
      paragraphs: [
        "No name, no postal address, no company, no phone number. We do not store your IP address: it is held in memory for under a minute to stop the form being hammered, and never written down.",
        "There are no cookies on this site, no analytics, and no third-party scripts or trackers of any kind. Fonts are served from our own domain rather than Google's. That is why you were not asked to accept anything when you arrived.",
      ],
    },
    {
      title: "Why we have it, and on what basis",
      paragraphs: [
        "One purpose only: to send you one email on the day the Carrousel Kickstarter campaign opens. We will not send you anything else, and we will not sell, rent or share your address with anyone for their own use.",
        "The lawful basis is your consent, under Article 6(1)(a) GDPR. That is what the tick box on the form is for. You may withdraw it at any time, and withdrawing is as easy as giving it was.",
      ],
    },
    {
      title: "Who else sees it",
      paragraphs: [
        "Serein Design, and two service providers acting on our instructions as processors:",
      ],
      list: [
        "Supabase, which runs the Postgres database the list is stored in. The database is located in the European Union, in the Frankfurt region.",
        "{{TODO: the email provider you choose to send the launch email, for example Brevo or Mailchimp, and where it stores data}}.",
      ],
    },
    {
      title: "Where it goes",
      paragraphs: [
        "The list is stored in an EU region. Supabase Inc. is a United States company, so some access from outside the EU cannot be ruled out for support and maintenance. Those transfers rely on the European Commission's Standard Contractual Clauses and on the EU-US Data Privacy Framework adequacy decision of 10 July 2023.",
        "The site itself is served by Vercel, which sees the request but never the contents of the list.",
      ],
    },
    {
      title: "How long we keep it",
      paragraphs: [
        "Until the campaign opens and we have sent the email it was collected for. After that, and in any case no more than three years from your last interaction with us, the record is deleted. If you withdraw consent before then, it is deleted at that point.",
        "Deletion means the record is removed, not flagged.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "Under the GDPR you may ask us to give you a copy of your data, correct it, delete it, restrict what we do with it, or hand it to you in a portable format. You may object to the processing, and you may withdraw your consent at any time without giving a reason.",
        `The fastest route off the list is the unsubscribe link in any email we send. You can also write to ${CONTACT} and we will act within one month.`,
        "If you think we have handled your data badly, you can complain to the CNIL, the French supervisory authority: 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, or at cnil.fr. You can also complain to the authority where you live.",
      ],
    },
  ] satisfies LegalSection[],
} as const;

export const legalNotice = {
  title: "Legal notice",
  intro:
    "Published in application of article 6-III of the French law on confidence in the digital economy.",
  updated: "September 2026",
  sections: [
    {
      title: "Publisher",
      paragraphs: [
        `This site is published by ${PUBLISHER}, acting as an individual under the name Serein Design.`,
        "Serein Design is a project name, not a company: there is no registration number, share capital or VAT number to give at this stage. VAT is not charged, and no sale is made through this site. It collects email addresses and nothing else.",
        `Contact: ${CONTACT}.`,
      ],
    },
    {
      title: "Before the campaign opens",
      paragraphs: [
        "Carrousel will be sold through a crowdfunding campaign, which is a commercial activity and requires a registered business. Serein Design will be registered before the campaign opens, and this page will then carry the company name, legal form, registered address, company number and VAT number.",
        "Until then this site takes no money and sells nothing.",
      ],
    },
    {
      title: "Director of publication",
      paragraphs: [PUBLISHER + "."],
    },
    {
      title: "Hosting",
      paragraphs: [
        "This site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States. Vercel publishes no public telephone number; it is reachable at vercel.com/contact.",
        "The waitlist database is held separately, by Supabase, in an EU region. See the privacy page for what is stored in it.",
      ],
    },
    {
      title: "Intellectual property",
      paragraphs: [
        "The text, images and design of this site belong to Serein Design. The Carrousel hardware and software are published separately under open licences: the board files under the CERN Open Hardware Licence, the code under the GNU GPL v3.",
      ],
    },
  ] satisfies LegalSection[],
} as const;
