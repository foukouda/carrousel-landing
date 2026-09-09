/**
 * Privacy notice and legal notice.
 *
 * The privacy notice covers what Article 13 GDPR requires a controller to tell
 * people at the moment their data is collected. The legal notice covers what
 * article 6-III of the French LCEN requires any published website to state.
 *
 * Every {{TODO}} below is a fact only Serein Design holds. They are left
 * visible on purpose: an invented company number or a guessed address on a
 * legal page is worse than an obvious gap, and both pages must be complete
 * before the site goes live. See README.md.
 */

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export const privacy = {
  title: "Privacy",
  intro:
    "This page explains what happens to your email address if you join the launch list. It is short because we collect almost nothing.",
  updated: "September 2026",
  sections: [
    {
      title: "Who is responsible",
      paragraphs: [
        "The data controller is {{TODO: legal name of the company behind Serein Design}}, {{TODO: legal form and share capital}}, registered at {{TODO: registered address}} under company number {{TODO: SIREN / RCS}}.",
        "For anything on this page, write to {{TODO: privacy contact address}}. We have not appointed a Data Protection Officer, which the GDPR does not require at our size and for this kind of processing.",
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
      // The trailing paragraphs matter as much as the list: what is NOT kept.
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
        "Google Cloud, which runs the Firestore database the list is stored in. The database is located in the European Union.",
        "{{TODO: the email provider you choose to send the launch email, for example Brevo or Mailchimp, and where it stores data}}.",
      ],
    },
    {
      title: "Where it goes",
      paragraphs: [
        "The list is stored in an EU region of Google Cloud. Google LLC is a United States company, so some access from outside the EU cannot be ruled out for support and maintenance. Those transfers rely on the European Commission's Standard Contractual Clauses and on the EU-US Data Privacy Framework adequacy decision of 10 July 2023.",
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
        "The fastest route off the list is the unsubscribe link in any email we send. You can also write to {{TODO: privacy contact address}} and we will act within one month.",
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
        "{{TODO: legal name}}, {{TODO: legal form, for example SAS or micro-entreprise}}, share capital {{TODO: amount, or remove this line if not applicable}}.",
        "Registered office: {{TODO: full postal address}}.",
        "Registered under {{TODO: SIREN number and the RCS registry town}}. VAT number {{TODO: intra-community VAT number, or state that the business is not VAT registered}}.",
        "Contact: {{TODO: public contact email}}.",
      ],
    },
    {
      title: "Director of publication",
      paragraphs: ["{{TODO: full name of the person responsible for publication}}."],
    },
    {
      title: "Hosting",
      paragraphs: [
        "{{TODO: host name}}, {{TODO: host postal address}}, {{TODO: host telephone number}}.",
        "If you deploy on Vercel, that is Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States.",
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
