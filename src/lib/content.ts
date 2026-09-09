/**
 * Every visible string on the page lives here.
 * Edit copy in this file, never inside a component.
 *
 * Anything still unverified is marked with a TODO comment rather than filled
 * with a plausible guess. See README.md for the open list.
 */

export const site = {
  brand: "Serein Design",
  product: "Carrousel",
  title: "Carrousel by Serein Design",
  description:
    "A lo-fi data display in walnut and aluminium. Open source, repairable, made in France. Join the list before the Kickstarter opens.",
  /**
   * The canonical domain, once there is one. Leave it empty until then: the
   * layout falls back to the domain Vercel is actually serving, so the social
   * card and the canonical URL point somewhere that exists. A hardcoded
   * domain nobody owns yet makes every shared link show a broken preview.
   */
  url: "",
} as const;

/** External destinations. Empty string hides the link instead of shipping a dead one. */
export const links = {
  discord: "", // TODO: paste the Discord invite URL.
  kickstarter: "", // TODO: paste the Kickstarter pre-launch URL once it exists.
  github: "", // TODO: paste the repository URL once the code is published.
  contact: "hello@sereindesign.com",
} as const;

/**
 * Photography. Drop the files in /public/media and set the path here, for
 * example "/media/carrousel-walnut.jpg". While a value is empty the page
 * renders a labelled slot describing the shot it is waiting for, rather than
 * filling the space with an unrelated stock image.
 */
export const media = {
  object: {
    src: "/media/carrousel.png",
    alt: "Carrousel, walnut base and raised screen, running the clock",
    brief:
      "Photograph: the object with the screen raised, walnut grain and the brass encoder both readable. Very wide landscape crop, at least 2400px, on a flat #f6f1e6 ground or a transparent PNG.",
    /* The render is 16:9, and cropping it wider clips the base. */
    ratio: "16 / 9",
    /**
     * The four corners of the active LED area, in percent of the image,
     * clockwise from the top left.
     *
     * Corners rather than a box, because this render is a three-quarter view:
     * the screen is a trapezoid and no rectangle will sit on it. The page
     * solves for the perspective transform that maps the panel onto these
     * four points, so any viewpoint works, including a real photograph later.
     *
     * These are eyeballed from the September 2026 render and want a pass on
     * a real screen. Move one corner at a time and let the page hot-reload.
     * Set to null to show the photograph untouched.
     *
     * Earlier versions inset these vertically, on the assumption that the
     * white diffuser was larger than the lit area. The render with the screen
     * switched on settles it: the dot grid fills the bezel with only a thin
     * even margin. So the corners now follow the bezel.
     */
    screen: {
      topLeft: { x: 23.9, y: 9.2 },
      topRight: { x: 73.4, y: 9.9 },
      bottomRight: { x: 73.4, y: 61.0 },
      bottomLeft: { x: 24.0, y: 57.1 },
    },
  },
  /**
   * The screen stood upright. Shown beside the landscape view so the two
   * orientations read as one capability rather than two products.
   *
   * `screen` is null on purpose. The panel is 32 by 68 this way round, and the
   * simulation draws 68 by 32. Rotating the landscape frame onto it would put
   * a sideways clock on the product, which is not what a portrait mode would
   * actually show. Better an honest dark screen than an invented one.
   */
  upright: {
    src: "/media/carrousel-upright.png",
    alt: "Carrousel with the screen stood upright, in portrait",
    brief:
      "Photograph: the object with the screen upright, framed tightly. Portrait crop, at least 1600px wide.",
    ratio: "5 / 6",
    screen: null,
  },

  /**
   * The second render, seen from the front left. The walnut figure, the brass
   * encoder and the black arm all read here, which is why it sits with the
   * specifications rather than next to the first one.
   *
   * Same corner convention as `object`, and the same caveat: eyeballed.
   */
  build: {
    src: "/media/carrousel-build.png",
    alt: "The walnut base, the brass encoder and the tilting arm",
    brief:
      "Photograph: a closer view where the wood figure and the encoder are legible.",
    ratio: "16 / 9",
    screen: {
      topLeft: { x: 24.5, y: 8.8 },
      topRight: { x: 76.4, y: 9.9 },
      bottomRight: { x: 76.1, y: 57.0 },
      bottomLeft: { x: 24.3, y: 61.2 },
    },
  },

  founder: {
    src: "",
    alt: "Dimitry Siebert in the workshop",
    brief:
      "Photograph: Dimitry at the bench or beside the machine. Portrait orientation, at least 1200px wide.",
  },
} as const;

/**
 * The consent the form asks for, in one place because two things need it: the
 * checkbox the visitor ticks, and the record stored as proof that they did.
 *
 * Article 7(1) puts the burden of proof on the controller, and proving consent
 * means proving what was consented to. So the exact wording is stored with
 * each sign-up, and `version` changes whenever `text` does. Never edit `text`
 * without bumping `version`, or old records will claim wording nobody saw.
 */
export const consent = {
  version: "2026-09-a",
  text: "I agree to Serein Design keeping my email address in order to tell me when the Carrousel campaign opens.",
} as const;

export const nav = {
  items: [
    { label: "The object", href: "#object" },
    { label: "Apps", href: "#apps" },
    { label: "Open source", href: "#open-source" },
    { label: "Specs", href: "#specs" },
    { label: "Timeline", href: "#timeline" },
  ],
  /** One label per intent, reused in the hero and the closing section. */
  cta: "Join the list",
} as const;

export const hero = {
  wordmark: "Carrousel",
  subtitle: "The data you care about, on a desk object.",
  formLabel: "Your email",
  formPlaceholder: "you@example.com",
  formHelp:
    "One email when the campaign opens. Early backers get first access to the discounted tiers.",
  /* Annotations on the panel, the way a drawing labels a part.
     `flag` puts the tricolour next to a claim of French manufacturing. */
  marks: [
    { text: "Walnut and aluminium" },
    { text: "68 x 32 LEDs" },
    { text: "Made in France", flag: true },
  ],
} as const;

export const materials = {
  eyebrow: "The object",
  title: "Milled from a single block of walnut",
  body: "The base is CNC machined out of one piece of solid walnut, not assembled from panels. The shell is aerospace grade aluminium. The screen tilts up on an ALPS encoder that doubles as the only control you need.",
  facts: [
    {
      title: "78% made in France",
      body: "The bio-sourced walnut is cut and machined locally, in a short production loop.",
      flag: true,
    },
    {
      title: "Aerospace grade aluminium",
      body: "The structural shell and the tilting arm, anodised and machined.",
    },
    {
      title: "One encoder, no menus",
      body: "An ALPS encoder turns to change app and presses to confirm. Nothing else.",
    },
  ],
} as const;

export const apps = {
  title: "Nine things worth a glance",
  lede: "Carrousel shows the data you choose, and only that. No feed, no badge, no notification.",
  items: [
    {
      name: "Clock",
      body: "The default screen. Time, date, and nothing competing for the space.",
      icon: "clock",
    },
    {
      name: "Game of Life",
      body: "Conway's automaton running across the full panel.",
      icon: "life",
    },
    {
      name: "GIF viewer",
      body: "Drop a GIF on the device and it plays at panel resolution.",
      icon: "gif",
    },
    {
      name: "Weather",
      body: "Current conditions and the day ahead, pulled on a schedule.",
      icon: "weather",
    },
    {
      name: "Notion tasks",
      body: "One list from your workspace. The next few items, not the whole board.",
      icon: "tasks",
    },
    {
      name: "Pomodoro",
      body: "Turn the encoder to set it, press to start. The panel is the timer.",
      icon: "timer",
    },
    {
      name: "Spotify",
      body: "What is playing right now, with cover art at 68 by 32.",
      icon: "music",
    },
    {
      name: "Markets",
      body: "The handful of stocks or tickers you actually follow.",
      icon: "markets",
    },
    {
      name: "Subscribers",
      body: "A live YouTube count, for the days it is worth watching.",
      icon: "subs",
    },
  ],
} as const;

export const openSource = {
  title: "The firmware, the PCB and the CAD are all published",
  body: "Carrousel is a direct descendant of an Allen Lab project we found on YouTube, which stayed our main reference throughout. Following the same principle, we publish everything: PCB files under the CERN Open Hardware Licence, code under GPL v3.",
  points: [
    {
      title: "Repairable in under twenty minutes",
      body: "Every component can be replaced with a Torx screwdriver and a soldering iron. Spare parts are sold directly on our site.",
    },
    {
      title: "No closed ecosystem",
      body: "On first boot the panel shows a QR code to join your Wi-Fi. The firmware itself is yours to change: clone it, build it in your own editor, flash it over USB-C.",
    },
    {
      title: "It outlives us",
      body: "If Serein Design ever stops supporting Carrousel, the licences mean the community can keep it running, and improve it.",
    },
  ],
  licences: ["CERN OHL, hardware", "GPL v3, software"],
} as const;

export const specs = {
  eyebrow: "Specifications",
  title: "What is actually inside",
  groups: [
    {
      title: "Display",
      figure: "68 x 32",
      figureLabel: "addressable LEDs",
      rows: [
        { label: "Control", value: "ALPS rotary encoder with push" },
        { label: "Screen", value: "Tilts up on its arm" },
      ],
    },
    {
      title: "Brain",
      figure: "ESP32",
      figureLabel: "on board, Wi-Fi included",
      rows: [
        { label: "Power", value: "USB-C, 5V / 5A" },
        { label: "Setup", value: "Wi-Fi by QR code on first boot" },
      ],
    },
    {
      title: "Body",
      figure: "143 x 68 x 163",
      figureLabel: "millimetres, screen lowered",
      rows: [
        { label: "Base", value: "Solid walnut, CNC machined" },
        { label: "Shell", value: "Aerospace grade aluminium" },
      ],
    },
  ],
  note: "The wood grain differs from one unit to the next, and from the photographs.",
} as const;

export const timeline = {
  title: "From the campaign to your desk",
  // TODO: confirm the year for each month before publishing.
  steps: [
    {
      when: "Early March",
      title: "Campaign opens",
      body: "One month on Kickstarter. Early backers unlock the discounted tiers and the Founders Collection marking.",
    },
    {
      when: "End of April",
      title: "Product finalisation",
      body: "Last hardware, firmware and design adjustments, based on final tests and community feedback.",
    },
    {
      when: "May to June",
      title: "CE certification and stress testing",
      body: "Compliance and durability testing. This step can need several rounds, which is the most likely source of delay.",
    },
    {
      when: "Late May to June",
      title: "First batch, 100 units",
      body: "Manufacturing reserved for early supporters, then assembly, quality control and shipping.",
    },
    {
      when: "December",
      title: "Larger batch delivered",
      body: "1,000 units or more depending on how the campaign goes, if everything holds to plan.",
    },
  ],
} as const;

export const about = {
  title: "Who is building this",
  name: "Dimitry Siebert",
  role: "Mechanical and industrial engineer, founder of Serein Design",
  body: "Ten years in the maker community, starting with 3D printers I built and used myself. Four years industrialising products for other companies, taking their designs from a working prototype to something a factory can actually make. Carrousel is the first object I am taking through that process for myself.",
} as const;

export const closing = {
  title: "Be there when it opens",
  /* The same words, broken for the dot font. Keep both in step. */
  titleLines: ["BE THERE", "WHEN IT OPENS"],
  body: "The first hundred backers get the largest discount and a laser engraved name on the base. Leave your email and you will hear from us once, the day the campaign goes live.",
  formLabel: "Your email",
  formPlaceholder: "you@example.com",
  formHelp: "No newsletter, no sharing your address. One email at launch.",
} as const;

export const footer = {
  note: "Carrousel is a project by Serein Design.",
  environment:
    "A share of the profits goes to an association working on ecosystem restoration.",
} as const;
