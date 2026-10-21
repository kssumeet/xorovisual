import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/services", "/agencies", "/pricing", "/about", "/contact"];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}`, changeFrequency: "monthly" as const })),
    ...projects
      .filter((p) => p.caseStudy && !p.placeholder)
      .map((p) => ({ url: `${site.url}/work/${p.slug}`, changeFrequency: "yearly" as const })),
  ];
}
