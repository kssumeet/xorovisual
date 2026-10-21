import styles from "./Marquee.module.css";

const words = ["AI video", "Commercials", "Product films", "Editing", "Motion design", "Music videos", "Social ads"];

/** A slow, continuous ticker of what the studio makes. Static under reduced motion. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <li key={w}>
          {w}
          <span className={styles.dot} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
