import Link from "next/link";
import { heroReel } from "@/content/projects";
import { ClosingGateMotion } from "./ClosingGateMotion";
import styles from "./ClosingGate.module.css";

type Props = {
  heading?: [string, string];
  text?: string;
  secondary?: { label: string; href: string };
};

/** The closing call to action: the reel returns behind a huge title. */
export function ClosingGate({
  heading = ["Let's make", "your film"],
  text = "Tell us what you're imagining. We'll shape it into a film.",
  secondary = { label: "Agency partnerships", href: "/agencies" },
}: Props) {
  return (
    <section className={styles.section} aria-labelledby="closing-title" data-motion-owner>
      <div className={styles.media} data-closing-media aria-hidden="true">
        <video
          className={styles.video}
          src={heroReel.preview}
          poster={heroReel.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={`wrap ${styles.copy}`}>
        <h2 id="closing-title" className={styles.heading} data-closing-title>
          <span className={styles.line}>
            <span>{heading[0]}</span>
          </span>
          <span className={styles.line}>
            <span className="italic">{heading[1]}</span>
          </span>
        </h2>
        <p className="lead">{text}</p>
        <div className={styles.ctas}>
          <Link href="/contact" className="btn btn-primary">
            Start a Project <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <Link href={secondary.href} className="btn btn-ghost">
            {secondary.label}
          </Link>
        </div>
      </div>
      <ClosingGateMotion />
    </section>
  );
}
