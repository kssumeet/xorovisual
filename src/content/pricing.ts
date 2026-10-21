/**
 * The Xoro Visuals rate card (INR), taken from the studio's
 * "XV - 3 Tier - PriceList" document. Shown on /pricing and printed to
 * public/xoro-visuals-price-list.pdf (npm run pricelist).
 */

export type TierPrice = { resolution: string; frameRate: string; price: string };

export type Tier = {
  /** e.g. "Package 01 — Basic" */
  label: string;
  name: string;
  forWho: string;
  duration: string;
  prices: TierPrice[];
  features: string[];
  idealFor: string;
  /** Pre-selects the project type on the contact form. */
  enquiry: string;
};

export const tierCurrencyNote =
  "Prices in Indian rupees (₹). Each package covers one 15-second video at the selected resolution.";

export const tiers: Tier[] = [
  {
    label: "Package 01 — Basic",
    name: "Product Showcase",
    forWho: "Clean, engaging product visuals for social media and promotional content.",
    duration: "15 seconds",
    prices: [
      { resolution: "2K", frameRate: "60 FPS", price: "₹1,000" },
      { resolution: "4K", frameRate: "60 FPS", price: "₹2,000" },
    ],
    features: [
      "Basic transitions and clean product reveal shots",
      "CGI-inspired visual effects and simple scene transitions",
      "Standard camera movements and product-focused framing",
      "Reference-guided product appearance",
      "Basic colour grading and sound design",
      "Character facial similarity where applicable; consistency varies by scene",
    ],
    idealFor: "Simple product ads, promotional reels and social media content.",
    enquiry: "commercial",
  },
  {
    label: "Package 02 — Professional",
    name: "Brand Storytelling",
    forWho: "Structured, cinematic advertising creatives built around your product and brand identity.",
    duration: "15 seconds",
    prices: [
      { resolution: "2K", frameRate: "60 FPS", price: "₹5,000" },
      { resolution: "4K", frameRate: "60 FPS", price: "₹7,000" },
    ],
    features: [
      "Creative storytelling and structured shot sequences",
      "Cinematic camera movements and dynamic framing",
      "Advanced transitions and controlled scene continuity",
      "CGI-inspired graphics and visual effects",
      "Reference-guided character and product consistency",
      "Detailed lighting, textures and reflections",
      "Professional colour grading and sound design",
      "Brand-focused creative direction",
    ],
    idealFor: "Fashion, beauty, lifestyle and product advertising campaigns.",
    enquiry: "brand-film",
  },
  {
    label: "Package 03 — Pro Cinematics",
    name: "Cinematic Film & Narrative",
    forWho: "AI-powered cinematic storytelling for trailers, music videos and immersive visual experiences.",
    duration: "15 seconds",
    prices: [
      { resolution: "2K", frameRate: "60 FPS", price: "₹7,000" },
      { resolution: "4K", frameRate: "60 FPS", price: "₹10,000" },
    ],
    features: [
      "Concept-driven storytelling and cinematic visual direction",
      "Dramatic sequences and dynamic camera choreography",
      "AI-generated characters, environments and fictional worlds",
      "Advanced visual effects and CGI-inspired sequences",
      "Cinematic lighting, atmosphere and film-style composition",
      "Character and scene continuity guided by references",
      "Professional colour grading, sound design and cinematic pacing",
      "High-impact transitions and polished final editing",
    ],
    idealFor: "AI movie trailers, music videos, short films, fantasy, sci-fi and story-driven visuals.",
    enquiry: "ai-video",
  },
];

/** Terms & conditions from the rate card. */
export const terms: { title: string; body: string }[] = [
  {
    title: "Payment structure",
    body: "A 50% advance payment is required before work begins. The remaining 50% must be paid before final delivery.",
  },
  {
    title: "Draft & watermark",
    body: "A watermarked video preview is shared as a draft for review. The watermark is removed only after the full outstanding balance has been cleared.",
  },
  {
    title: "Revisions",
    body: "One round of minor revisions is included. Major changes to the approved concept, storyline, product, character or scenes may incur additional charges.",
  },
  {
    title: "Scope of work",
    body: "The quoted price covers one 15-second video at the selected resolution. Additional duration, aspect ratios, versions, voiceovers, source files and other deliverables are quoted separately.",
  },
  {
    title: "AI consistency & limitations",
    body: "Character likeness, product appearance, logos, packaging text, physics and scene continuity are guided by supplied references. Perfect frame-by-frame consistency cannot be guaranteed. Additional correction work may be chargeable.",
  },
  {
    title: "Client input & timelines",
    body: "The client must provide accurate references, brand assets and instructions. Delays in feedback or missing assets may affect the delivery timeline.",
  },
  {
    title: "Cancellation",
    body: "If a project is cancelled after work begins, completed work and committed production costs remain payable. The advance payment is adjusted against those costs.",
  },
  {
    title: "Final delivery",
    body: "The final, unwatermarked video is delivered after full payment is received. Delivery at 60 FPS is subject to technical feasibility and final quality checks.",
  },
];

export const confirmationNote =
  "By making the advance payment, the client confirms acceptance of the scope, pricing and terms listed in this rate card.";
