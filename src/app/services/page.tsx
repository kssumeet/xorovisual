import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ClosingGate } from "@/components/ClosingGate";
import { services } from "@/content/services";
import { MotionRoot } from "@/components/MotionRoot";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI video generation, editing and post-production, commercial and product films, motion graphics, creative filmmaking and agency production.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro label="Services" title={["What we make,", "and how it reaches you."]}>
        <p>
          Every service ends the same way: a finished film, cut for each place it will run. Choose one, or
          combine them under a single creative direction.
        </p>
      </PageIntro>
      <section className="wrap" aria-label="Services" style={{ paddingBottom: "var(--section)" }}>
        <ServiceIndex services={services} detailed headingLevel="h2" />
      </section>
      <ProcessSection />
      <ClosingGate />
      <MotionRoot />
    </>
  );
}
