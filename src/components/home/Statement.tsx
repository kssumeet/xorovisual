import styles from "./Statement.module.css";

const text =
  "We make AI-generated films for brands, creators and agencies — from a single prompt to a finished cut.";

/** Each word lights up as it scrolls through the viewport (see data-words in MotionRoot). */
export function Statement() {
  return (
    <section className={`wrap ${styles.section}`} aria-label="About the studio">
      <p className={styles.text} data-words>
        {text.split(" ").map((w, i) => (
          <span key={i}>{w} </span>
        ))}
      </p>
    </section>
  );
}
