import Link from "next/link";
import type { Service } from "@/content/services";
import { FormatGlyphs } from "../ui/FormatGlyphs";
import styles from "./ServiceIndex.module.css";

type Props = {
  services: Service[];
  /** Full pages show the detail paragraph and what's included. */
  detailed?: boolean;
  headingLevel?: "h2" | "h3";
};

export function ServiceIndex({ services, detailed = false, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  return (
    <ul className={styles.list}>
      {services.map((s) => (
        <li key={s.slug} id={s.slug} className={styles.row} data-reveal>
          <Heading className={styles.name}>{s.name}</Heading>
          <div className={styles.body}>
            <p className={styles.outcome}>{s.outcome}</p>
            {detailed && (
              <>
                <p className="muted">{s.detail}</p>
                <ul className={styles.includes}>
                  {s.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className={styles.meta}>
            <FormatGlyphs formats={s.formats} />
            <Link
              href={detailed ? `/contact?type=${s.enquiry}` : `/services#${s.slug}`}
              className="link"
              aria-label={detailed ? `Enquire about ${s.name}` : `More about ${s.name}`}
            >
              {detailed ? "Enquire" : "More"}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
