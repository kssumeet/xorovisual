// Business details that are not yet confirmed are read from the environment
// so nothing is guessed in the source. See README → "Configuration".

export const site = {
  name: "Xoro Visuals",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
  tagline: "Ideas into images. Images into films.",
  description:
    "AI video generation, expert editing and cinematic production for brands, creators and agencies.",
  markets: ["United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates"],
  /**
   * While true, entries marked `placeholder` are labelled "AI sample".
   * Replace them in src/content/projects.ts before launch.
   */
  showPlaceholderNotice: true,
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "For Agencies", href: "/agencies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];
