import type { CSSProperties, ReactNode } from "react";
import type { AspectRatio } from "@/content/projects";
import styles from "./Frame.module.css";

const ratio: Record<AspectRatio, string> = {
  "2.39:1": "2.39 / 1",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "4:5": "4 / 5",
  "1:1": "1 / 1",
};

type Props = {
  aspect: AspectRatio;
  children: ReactNode;
  /** Ground-glass labels printed outside the image, like frame lines on a viewfinder. */
  topLeft?: ReactNode;
  topRight?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** A film gate: the image at its true delivery ratio, with crop marks at each corner. */
export function Frame({ aspect, children, topLeft, topRight, className, style }: Props) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} style={style}>
      {(topLeft || topRight) && (
        <div className={styles.labels}>
          <span className="label">{topLeft}</span>
          <span className="label">{topRight}</span>
        </div>
      )}
      <div className={styles.gate} style={{ aspectRatio: ratio[aspect] }}>
        {children}
        <span className={styles.marks} aria-hidden="true" />
      </div>
    </div>
  );
}
