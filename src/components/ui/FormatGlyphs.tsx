import type { AspectRatio } from "@/content/projects";
import styles from "./FormatGlyphs.module.css";

const ratio: Record<AspectRatio, number> = {
  "2.39:1": 2.39,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "4:5": 4 / 5,
  "1:1": 1,
};

/** Delivery formats drawn at their true proportions. */
export function FormatGlyphs({ formats }: { formats: AspectRatio[] }) {
  return (
    <p className={styles.glyphs}>
      <span className="visually-hidden">Delivered in {formats.join(", ")}</span>
      {formats.map((f) => (
        <span key={f} className={styles.glyph} aria-hidden="true">
          <span className={styles.box} style={{ aspectRatio: ratio[f] }} />
          <span className="label">{f}</span>
        </span>
      ))}
    </p>
  );
}
