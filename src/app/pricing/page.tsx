import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { ClosingGate } from "@/components/ClosingGate";
import { confirmationNote, terms } from "@/content/pricing";
import { PriceTiers } from "@/components/PriceTiers";
import styles from "./pricing.module.css";
import { MotionRoot } from "@/components/MotionRoot";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Xoro Visuals rate card: Product Showcase, Brand Storytelling and Cinematic Film packages for AI-generated video, in 2K and 4K.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageIntro label="Rate card" title={["Three packages,", "one 15-second film."]}>
        <p>Choose a package and a resolution. Each price covers one 15-second AI video, delivered at 60 FPS.</p>
      </PageIntro>

      <section className={`wrap ${styles.tiers}`} aria-labelledby="tiers-title">
        <h2 id="tiers-title" className="visually-hidden">
          Price list
        </h2>
        <PriceTiers />
        <p className={styles.download} data-reveal>
          <a href="/xoro-visuals-price-list.pdf" className="btn btn-ghost" download>
            Download price list (PDF)
          </a>
        </p>
      </section>

      <section className="paper section" aria-labelledby="terms-title">
        <div className="wrap">
          <p className="label">Terms &amp; conditions</p>
          <h2 id="terms-title" className={styles.heading} data-mask>
            <span>How every</span>
            <span className="italic">project runs.</span>
          </h2>
          <ol className={styles.terms}>
            {terms.map((t, i) => (
              <li key={t.title} className={styles.term} data-reveal>
                <h3 className={styles.termTitle}>
                  <span className={styles.termIndex}>{String(i + 1).padStart(2, "0")}</span> {t.title}
                </h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ol>
          <p className={styles.confirm} data-reveal>
            {confirmationNote}
          </p>
          <div className={styles.ctas} data-reveal>
            <Link href="/contact" className="btn btn-primary">
              Start a Project <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <ClosingGate />
      <MotionRoot />
    </>
  );
}
