import Link from "next/link";
import { kindLabel, type Project } from "@/content/projects";
import { site } from "@/content/site";
import { Frame } from "../Frame";
import { PreviewVideo } from "../PreviewVideo";
import styles from "./ProjectTile.module.css";

type Props = {
  project: Project;
  sizes: string;
  className?: string;
  headingLevel?: "h2" | "h3";
};

export function ProjectTile({ project, sizes, className, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const href = project.caseStudy ? `/work/${project.slug}` : undefined;

  const body = (
    <>
      <div data-reveal-clip>
        <Frame aspect={project.aspect} topLeft={project.aspect} topRight={kindLabel[project.kind]}>
          <PreviewVideo media={project.media} alt={`Still from ${project.title}`} sizes={sizes} />
        </Frame>
      </div>
      <div className={styles.caption} data-reveal>
        <Heading className={styles.title}>{project.title}</Heading>
        <p className="label">
          {project.category} · {project.year}
        </p>
        <p className={styles.summary}>{project.summary}</p>
        {project.placeholder && site.showPlaceholderNotice && (
          <span className="placeholder-tag">Stock placeholder · not Xoro work</span>
        )}
      </div>
    </>
  );

  return (
    <article className={`${styles.tile} ${className ?? ""}`}>
      {href ? (
        <Link href={href} className={styles.link} data-preview-host>
          {body}
        </Link>
      ) : (
        <div className={styles.link} data-preview-host>
          {body}
        </div>
      )}
    </article>
  );
}
