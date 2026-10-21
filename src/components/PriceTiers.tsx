import Link from "next/link";
import { tierCurrencyNote, tiers } from "@/content/pricing";
import styles from "./PriceTiers.module.css";

type Props = {
  /** The PDF sheet has no links or reveal animation. */
  print?: boolean;
};

/** The 3-package rate card, shared by the Pricing page and the printable sheet. */
export function PriceTiers({ print = false }: Props) {
  return (
    <div className={styles.wrap} data-print={print || undefined}>
      <ol className={styles.tiers}>
        {tiers.map((t, i) => (
          <li key={t.name} className={styles.tier} {...(!print && { "data-reveal": true, "data-reveal-delay": i * 0.08 })}>
            <p className={styles.package}>{t.label}</p>
            <h3 className={styles.name}>{t.name}</h3>
            <p className={styles.forWho}>{t.forWho}</p>
            <p className={styles.duration}>Duration: {t.duration}</p>

            <table className={styles.table}>
              <caption className="visually-hidden">{t.name} prices</caption>
              <thead>
                <tr>
                  <th scope="col">Resolution</th>
                  <th scope="col">Frame rate</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {t.prices.map((p) => (
                  <tr key={p.resolution}>
                    <th scope="row">{p.resolution}</th>
                    <td>{p.frameRate}</td>
                    <td className={styles.price}>{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className={styles.features}>
              {t.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className={styles.ideal}>
              <span>Ideal for</span> {t.idealFor}
            </p>
            {!print && (
              <Link href={`/contact?type=${t.enquiry}`} className={`btn btn-ghost ${styles.cta}`}>
                Choose {t.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <p className={styles.note}>{tierCurrencyNote}</p>
    </div>
  );
}
