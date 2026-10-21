import type { AspectRatio } from "./projects";

export type Service = {
  slug: string;
  name: string;
  outcome: string;
  detail: string;
  includes: string[];
  formats: AspectRatio[];
  /** Pre-selects the project type on the contact form. */
  enquiry: string;
};

export const services: Service[] = [
  {
    slug: "ai-video-generation",
    name: "AI Video Generation",
    outcome: "Films that would be too costly or impossible to shoot.",
    detail:
      "We direct generative models the way a cinematographer directs a crew: references, shot lists, look development and many passes, then a human edit and grade so the result holds up beside live-action work.",
    includes: ["Look development", "Shot-by-shot generation", "Upscaling and clean-up", "Edit, grade and sound"],
    formats: ["2.39:1", "16:9", "9:16"],
    enquiry: "ai-video",
  },
  {
    slug: "editing-post-production",
    name: "Editing & Post-Production",
    outcome: "Your footage, cut with intent and finished to broadcast standard.",
    detail:
      "Story edits, pacing, colour grading, sound design and mix, titles and versioning. We work from your rushes, a rough cut or a single interview.",
    includes: ["Story and rhythm edits", "Colour grading", "Sound design and mix", "Versioning and captions"],
    formats: ["16:9", "9:16", "4:5", "1:1"],
    enquiry: "editing",
  },
  {
    slug: "commercial-product-films",
    name: "Commercial & Product Films",
    outcome: "A product shown the way you see it: precise, tactile, desirable.",
    detail:
      "Hero spots, launch films and product loops built around the details that sell. Delivered as a master with cut-downs for every placement.",
    includes: ["Creative concept", "Hero film", "Cut-downs for paid social", "Product loops for ecommerce"],
    formats: ["16:9", "4:5", "9:16", "1:1"],
    enquiry: "commercial",
  },
  {
    slug: "motion-graphics-animation",
    name: "Motion Graphics & Animation",
    outcome: "Ideas and data made clear, in your brand's own movement.",
    detail:
      "Typographic animation, explainers, logo animations, title sequences and motion systems your team can reuse.",
    includes: ["Motion systems", "Title sequences", "Explainers", "Animated brand assets"],
    formats: ["16:9", "1:1", "9:16"],
    enquiry: "motion",
  },
  {
    slug: "creative-filmmaking",
    name: "Creative Filmmaking",
    outcome: "Brand films, music videos and short-form narrative with a point of view.",
    detail:
      "From treatment to final grade. We combine shot footage, generated imagery and design to make films that feel authored, not assembled.",
    includes: ["Treatment and storyboards", "Brand films", "Music videos", "Cinematic sequences"],
    formats: ["2.39:1", "16:9"],
    enquiry: "brand-film",
  },
  {
    slug: "creator-agency-production",
    name: "Creator & Agency Production",
    outcome: "A dependable production partner behind your channel or your clients.",
    detail:
      "Recurring edits for creators, and white-label production for agencies, run on agreed turnarounds and a shared workflow.",
    includes: ["Recurring edit packages", "White-label delivery", "Overflow capacity", "Campaign creative"],
    formats: ["9:16", "16:9", "4:5"],
    enquiry: "agency",
  },
];

export const projectTypes = [
  { value: "ai-video", label: "AI video generation" },
  { value: "commercial", label: "Commercial or product film" },
  { value: "brand-film", label: "Brand film or music video" },
  { value: "editing", label: "Editing and post-production" },
  { value: "motion", label: "Motion graphics and animation" },
  { value: "social", label: "Social ad creatives" },
  { value: "agency", label: "Agency partnership" },
  { value: "retainer", label: "Recurring production retainer" },
  { value: "other", label: "Something else" },
] as const;
