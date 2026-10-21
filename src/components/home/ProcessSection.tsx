import { process } from "@/content/process";
import styles from "./ProcessSection.module.css";

export function ProcessSection() {
  return (
    <section id="process" className={`paper section ${styles.section}`} aria-labelledby="process-title">
      <div className="wrap">
        <header className={styles.head}>
          <p className="label">Process</p>
          <h2 id="process-title" className={styles.heading} data-mask>
            <span>From first call</span>
            <span className="italic">to final files.</span>
          </h2>
          <p className="lead muted" data-reveal>
            Five stages, the same for a single spot or a year of retained work. You always know what we
            need from you, and what you&rsquo;ll get back.
          </p>
        </header>

        <div className={styles.steps}>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} data-progress />
          </span>
          <ol>
          {process.map((step, i) => (
            <li key={step.name} className={styles.step} data-reveal>
              <p className={`label ${styles.index}`}>
                Stage {i + 1} of {process.length}
              </p>
              <h3 className={styles.name}>{step.name}</h3>
              <p className={styles.summary}>{step.summary}</p>
              <dl className={styles.exchange}>
                <div>
                  <dt className="label">You provide</dt>
                  <dd>{step.youProvide}</dd>
                </div>
                <div>
                  <dt className="label">You receive</dt>
                  <dd>{step.youReceive}</dd>
                </div>
              </dl>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
