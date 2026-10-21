import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ProjectTile } from "@/components/work/ProjectTile";
import { ClosingGate } from "@/components/ClosingGate";
import { placementStyle, workSizes } from "@/components/home/SelectedWork";
import { kindLabel, projects, type ProjectKind } from "@/content/projects";
import grid from "@/components/home/SelectedWork.module.css";
import styles from "./work.module.css";
import { MotionRoot } from "@/components/MotionRoot";

export const metadata: Metadata = {
  title: "Work",
  description:
    "AI product films, brand commercials, motion design and edits by Xoro Visuals, each shown in the format it was delivered in.",
  alternates: { canonical: "/work" },
};

const kindNote: Record<ProjectKind, string> = {
  commissioned: "Made for a client, on a brief.",
  spec: "Made unsolicited for a real brand or product, to show an approach. Not commissioned.",
  original: "The studio's own experiments and films.",
  stock: "Licensed stock footage standing in until real work is added. Not made by Xoro Visuals.",
};

export default function WorkPage() {
  return (
    <>
      <PageIntro label="Work" title={["Selected films,", "at their true ratio."]}>
        <p>
          Widescreen films run wide, vertical edits stay vertical. Every piece is labelled with how it came to
          exist, so you always know what was commissioned and what is a placeholder.
        </p>
      </PageIntro>

      <section className="wrap" aria-label="How work is labelled">
        <dl className={styles.legend}>
          {(Object.keys(kindNote) as ProjectKind[]).map((k) => (
            <div key={k}>
              <dt className="label">{kindLabel[k]}</dt>
              <dd>{kindNote[k]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section wrap" aria-label="Projects">
        <div className={`grid ${grid.reel}`}>
          {projects.map((project, i) => (
            <div key={project.slug} className={grid.slot} style={placementStyle(project, i)}>
              <ProjectTile
                project={project}
                sizes={workSizes[project.aspect]}
                headingLevel="h2"
                className={project.aspect === "9:16" ? grid.drop : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      <ClosingGate />
      <MotionRoot />
    </>
  );
}
