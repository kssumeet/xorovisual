import { ShowreelHero } from "@/components/home/ShowreelHero";
import { Statement } from "@/components/home/Statement";
import { PromptToFilm } from "@/components/home/PromptToFilm";
import { HorizontalGallery } from "@/components/home/HorizontalGallery";
import { ZoomFrame } from "@/components/home/ZoomFrame";
import { ServiceReel } from "@/components/home/ServiceReel";
import { Marquee } from "@/components/home/Marquee";
import { ClosingGate } from "@/components/ClosingGate";
import { MotionRoot } from "@/components/MotionRoot";
import { getProject, projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";

const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  slogan: site.tagline,
  description: site.description,
  areaServed: site.markets,
  ...(site.contactEmail ? { email: site.contactEmail } : {}),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
      />
      <ShowreelHero />
      <Statement />
      <PromptToFilm />
      <HorizontalGallery projects={projects} />
      <ZoomFrame project={getProject("night-rain") ?? projects[0]} />
      <ServiceReel services={services} images={projects} />
      <Marquee />
      <ClosingGate />
      <MotionRoot />
    </>
  );
}
