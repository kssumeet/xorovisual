import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ClosingGate } from "@/components/ClosingGate";
import { site } from "@/content/site";
import layout from "@/components/layout.module.css";
import { MotionRoot } from "@/components/MotionRoot";

export const metadata: Metadata = {
  title: "About",
  description:
    "Xoro Visuals is a creative video production studio combining AI video generation with editing, motion design and filmmaking craft.",
  alternates: { canonical: "/about" },
};

const beliefs = [
  {
    title: "The work makes the argument",
    body: "We would rather show you a film than describe one. Everything on this site is labelled with how it was made and who it was for.",
  },
  {
    title: "AI is a camera, not a director",
    body: "Generative tools let us make images no budget could shoot. Taste, story, edit and grade are still human decisions, and we say plainly which parts of a film were generated.",
  },
  {
    title: "Every format is a frame to compose",
    body: "A vertical cut-down deserves the same attention as the widescreen master. We compose for each ratio rather than cropping the master.",
  },
  {
    title: "Clear scope, kept",
    body: "Fixed quotes, written deliverables and agreed revision rounds, so you can plan around us.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro label="About" title={["A film studio", "for the generative era."]}>
        <p>{site.name} makes films for brands, creators and agencies: generated, shot, designed and edited.</p>
        <p>
          We work remotely with clients across {site.markets.slice(0, -1).join(", ")} and the{" "}
          {site.markets.at(-1)}.
        </p>
      </PageIntro>

      <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
        {beliefs.map((b) => (
          <section key={b.title} className={layout.split} data-reveal>
            <div className={layout.splitHead}>
              <h2 className={layout.splitTitle}>{b.title}</h2>
            </div>
            <div className={layout.splitBody}>
              <p>{b.body}</p>
            </div>
          </section>
        ))}
      </div>

      <ClosingGate />
      <MotionRoot />
    </>
  );
}
