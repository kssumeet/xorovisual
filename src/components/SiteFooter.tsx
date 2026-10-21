import Link from "next/link";
import { nav, site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <p className={styles.mark}>
          Ideas into images.
          <br />
          <span className="italic">Images into films.</span>
        </p>

        <nav aria-label="Footer" className={styles.col}>
          <h2 className="label">Studio</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className="label">Working with</h2>
          <ul>
            {site.markets.map((m) => (
              <li key={m} className="muted">
                {m}
              </li>
            ))}
            <li className="muted">and clients worldwide, remotely</li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className="label">Begin</h2>
          <p className="muted">Tell us what you&rsquo;re imagining.</p>
          <Link href="/contact" className="link">
            Start a Project
          </Link>
          {site.contactEmail && (
            <a href={`mailto:${site.contactEmail}`} className="link">
              {site.contactEmail}
            </a>
          )}
        </div>
      </div>
      <div className={`wrap ${styles.base}`}>
        <p className="label">© {site.name}</p>
        <a href="#main" className="label">Back to top</a>
      </div>
    </footer>
  );
}
