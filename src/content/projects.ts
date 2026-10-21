/**
 * Portfolio content.
 *
 * Every entry below is a STOCK PLACEHOLDER: licensed footage from Mixkit
 * (Mixkit Free License), cut into loops by scripts/build-stock-media.sh. None
 * of it is Xoro Visuals work, so none of it has a case study. Replace each
 * entry with real work, set `kind` truthfully and `placeholder: false`.
 */

export type AspectRatio = "2.39:1" | "16:9" | "9:16" | "4:5" | "1:1";

/**
 * How the work came to exist. Shown publicly so visitors can tell them apart.
 * "stock" marks licensed stock footage standing in until real work is added.
 */
export type ProjectKind = "commissioned" | "spec" | "original" | "stock";

export type ProjectCategory =
  | "AI Product Film"
  | "Brand Commercial"
  | "Cinematic Experiment"
  | "Motion Design"
  | "Creative Campaign"
  | "Editing & Post-Production";

export type Media = {
  /** Muted preview loop. Keep under ~1.5 MB, H.264 MP4, no audio. */
  preview: string;
  poster: string;
  width: number;
  height: number;
  /** Optional full film with sound, played only on request. */
  film?: string;
};

export type CaseStudy = {
  challenge: string;
  concept: string;
  visualDirection: string;
  production: string;
  deliverables: string[];
  credits?: { role: string; name: string }[];
  /** Only include results that have been verified with the client. */
  verifiedResults?: string[];
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  kind: ProjectKind;
  aspect: AspectRatio;
  year: string;
  summary: string;
  role: string;
  media: Media;
  caseStudy?: CaseStudy;
  placeholder: boolean;
};

const media = (name: string, width: number, height: number): Media => ({
  preview: `/media/work/${name}.mp4`,
  poster: `/media/work/${name}.jpg`,
  width,
  height,
});

const stock = (
  slug: string,
  title: string,
  category: ProjectCategory,
  aspect: AspectRatio,
  summary: string,
  width: number,
  height: number,
): Project => ({
  slug,
  title,
  category,
  kind: "stock",
  aspect,
  year: "2026",
  summary,
  role: "Placeholder: stock footage",
  media: media(slug, width, height),
  placeholder: true,
});

export const projects: Project[] = [
  stock("golden-hour", "Golden Hour", "Brand Commercial", "16:9", "A sports car carving a coastal road at sunset.", 1280, 720),
  stock("afterglow", "Afterglow", "Creative Campaign", "16:9", "A stage washed in violet light above the crowd.", 1280, 720),
  stock("neon-vision", "Neon Vision", "Creative Campaign", "9:16", "Laser-lit eyewear, framed for vertical.", 720, 1280),
  stock("undertow", "Undertow", "Cinematic Experiment", "2.39:1", "Surf breaking over black rock, from above.", 1600, 670),
  stock("vapour", "Vapour", "Motion Design", "16:9", "Smoke turning slowly against black.", 1280, 720),
  stock("blue-study", "Blue Study", "Brand Commercial", "9:16", "A dancer in cool studio light.", 720, 1280),
  stock("night-rain", "Night Rain", "Editing & Post-Production", "16:9", "City lights on wet asphalt after dark.", 1280, 720),
  stock("combustion", "Combustion", "Cinematic Experiment", "16:9", "Pages catching fire in slow motion.", 1280, 720),
  stock("spectrum", "Spectrum", "Creative Campaign", "16:9", "A silhouette against shifting colour.", 1280, 720),
];

export const kindLabel: Record<ProjectKind, string> = {
  commissioned: "Commissioned",
  spec: "Spec",
  original: "Original",
  stock: "Stock placeholder",
};

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** The showreel montage built by scripts/build-media.sh. Replace with a real reel. */
export const heroReel: Media = {
  preview: "/media/reel.mp4",
  poster: "/media/reel.jpg",
  width: 1920,
  height: 1080,
  film: "/media/reel.mp4",
};
