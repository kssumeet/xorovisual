import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame } from "@/components/Frame";
import { FilmPlayer } from "@/components/FilmPlayer";
import { ClosingGate } from "@/components/ClosingGate";
import { getProject, kindLabel, projects } from "@/content/projects";
import { site } from "@/content/site";
import layout from "@/components/layout.module.css";
import styles from "./case.module.css";
import { MotionRoot } from "@/components/MotionRoot";

const withCaseStudy = projects.filter((p) => p.caseStudy);

export function generateStaticParams() {
  // Cache Components requires at least one param; with no case studies yet,
  // a placeholder slug is prerendered and resolves to notFound().
  const params = withCaseStudy.map((p) => ({ slug: p.slug }));
  return params.length > 0 ? params : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.category}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { images: [{ url: project.media.poster, width: project.media.width, height: project.media.height }] },
  };
}

/**
 * Blocking on purpose: every real slug is prerendered by generateStaticParams,
 * and resolving params up front lets unknown slugs return a true 404 status
 * instead of a streamed not-found page served with 200.
 */
export const instant = false;

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;

  const index = withCaseStudy.findIndex((p) => p.slug === project.slug);
  const next = withCaseStudy[(index + 1) % withCaseStudy.length];

  const chapters = [
    { title: "Challenge", body: cs.challenge },
    { title: "Concept", body: cs.concept },
    { title: "Visual direction", body: cs.visualDirection },
    { title: "Production", body: cs.production },
  ];

  return (
    <article>
      <header className={`wrap ${layout.intro}`}>
        <p className="label">
          <Link href="/work" className="link">
            Work
          </Link>{" "}
          / {project.category}
        </p>
        <h1 className={layout.introTitle} data-mask>
          <span>{project.title}</span>
        </h1>
        {project.placeholder && site.showPlaceholderNotice && (
          <p className="placeholder-tag" data-reveal>
            AI sample study · not client work
          </p>
        )}
      </header>

      <div className={`wrap ${styles.film}`} data-aspect={project.aspect}>
        <div data-reveal-clip>
          <Frame aspect={project.aspect} topLeft={project.aspect} topRight={kindLabel[project.kind]}>
            <FilmPlayer media={project.media} title={project.title} />
          </Frame>
        </div>
      </div>

      <section className="wrap" aria-label="Overview">
        <dl className={styles.facts} data-reveal>
          <div>
            <dt className="label">Made as</dt>
            <dd>{kindLabel[project.kind]}</dd>
          </div>
          <div>
            <dt className="label">Category</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt className="label">Our role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="label">Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>
        <p className={`lead ${styles.summary}`} data-reveal>
          {project.summary}
        </p>
      </section>

      <div className="wrap section">
        {chapters.map((c) => (
          <section key={c.title} className={layout.split} data-reveal>
            <div className={layout.splitHead}>
              <h2 className={layout.splitTitle}>{c.title}</h2>
            </div>
            <div className={layout.splitBody}>
              <p>{c.body}</p>
            </div>
          </section>
        ))}

        <section className={layout.split} data-reveal>
          <div className={layout.splitHead}>
            <h2 className={layout.splitTitle}>Deliverables</h2>
          </div>
          <ul className={`${layout.splitBody} ${layout.ruled}`}>
            {cs.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>

        {cs.verifiedResults && cs.verifiedResults.length > 0 && (
          <section className={layout.split} data-reveal>
            <div className={layout.splitHead}>
              <h2 className={layout.splitTitle}>Results</h2>
              <p className="label">Confirmed with the client</p>
            </div>
            <ul className={`${layout.splitBody} ${layout.ruled}`}>
              {cs.verifiedResults.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {cs.credits && cs.credits.length > 0 && (
          <section className={layout.split} data-reveal>
            <div className={layout.splitHead}>
              <h2 className={layout.splitTitle}>Credits</h2>
            </div>
            <dl className={`${layout.splitBody} ${styles.credits}`}>
              {cs.credits.map((c) => (
                <div key={c.role + c.name}>
                  <dt className="label">{c.role}</dt>
                  <dd>{c.name}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {next && next.slug !== project.slug && (
        <nav className={`wrap ${styles.next}`} aria-label="Next project">
          <Link href={`/work/${next.slug}`} className={styles.nextLink}>
            <span className="label">Next film</span>
            <span className={styles.nextTitle}>{next.title}</span>
          </Link>
        </nav>
      )}

      <ClosingGate />
      <MotionRoot />
    </article>
  );
}
