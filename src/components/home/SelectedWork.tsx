import type { CSSProperties } from "react";
import Link from "next/link";
import type { AspectRatio, Project } from "@/content/projects";
import { ProjectTile } from "../work/ProjectTile";
import styles from "./SelectedWork.module.css";

/**
 * Editorial placement: width follows the delivery format, side alternates.
 * Widescreen pieces run the full measure; verticals sit narrow and drop.
 */
const span: Record<AspectRatio, { cols: number; sizes: string }> = {
  "2.39:1": { cols: 12, sizes: "(min-width: 900px) 92vw, 100vw" },
  "16:9": { cols: 8, sizes: "(min-width: 900px) 62vw, 100vw" },
  "4:5": { cols: 5, sizes: "(min-width: 900px) 38vw, 100vw" },
  "1:1": { cols: 5, sizes: "(min-width: 900px) 38vw, 100vw" },
  "9:16": { cols: 3, sizes: "(min-width: 900px) 24vw, 70vw" },
};

export const workSizes = Object.fromEntries(
  Object.entries(span).map(([k, v]) => [k, v.sizes]),
) as Record<AspectRatio, string>;

export function placementStyle(project: Project, index: number) {
  const { cols } = span[project.aspect];
  const fromRight = index % 2 === 1;
  const start = cols === 12 ? 1 : fromRight ? 13 - cols : index % 4 === 2 ? 2 : 1;
  return {
    "--start": start,
    "--span": cols,
  } as CSSProperties;
}

export function SelectedWork({ projects }: { projects: Project[] }) {
  return (
    <section className="section" aria-labelledby="work-title">
      <div className="wrap">
        <header className={styles.head}>
          <p className="label">Selected work</p>
          <h2 id="work-title" className={styles.heading} data-mask>
            <span>Every piece shown</span>
            <span className="italic">in the format it was made for.</span>
          </h2>
        </header>

        <div className={`grid ${styles.reel}`}>
          {projects.map((project, i) => (
            <div key={project.slug} className={styles.slot} style={placementStyle(project, i)}>
              <ProjectTile
                project={project}
                sizes={span[project.aspect].sizes}
                className={project.aspect === "9:16" ? styles.drop : undefined}
              />
            </div>
          ))}
        </div>

        <div className={styles.more} data-reveal>
          <Link href="/work" className="btn btn-ghost">
            See all work <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
