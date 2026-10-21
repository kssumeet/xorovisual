import type { ReactNode } from "react";
import styles from "./layout.module.css";

type Props = {
  label: string;
  title: [string, string?];
  children?: ReactNode;
};

/** Interior page opening: catalogue label, a two-line masked title, a lead. */
export function PageIntro({ label, title, children }: Props) {
  return (
    <header className={`wrap ${styles.intro}`}>
      <p className="label">{label}</p>
      <h1 className={styles.introTitle} data-mask>
        <span>{title[0]}</span>
        {title[1] && <span className="italic">{title[1]}</span>}
      </h1>
      {children && (
        <div className={`lead ${styles.introLead}`} data-reveal data-reveal-delay="0.25">
          {children}
        </div>
      )}
    </header>
  );
}
