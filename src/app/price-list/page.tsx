import type { Metadata } from "next";
import { PriceTiers } from "@/components/PriceTiers";
import { site } from "@/content/site";
import styles from "./sheet.module.css";

// One A4 page, printed to public/xoro-visuals-price-list.pdf by `npm run pricelist`.
export const metadata: Metadata = {
  title: "Price list",
  robots: { index: false, follow: false },
};

export default function PriceListSheet() {
  const host = site.url.replace(/^https?:\/\//, "");
  // Until NEXT_PUBLIC_SITE_URL is set, don't print a localhost address on a client-facing PDF.
  const publicHost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? null : host;
  return (
    <article className={styles.sheet}>
      <header className={styles.top}>
        {/* eslint-disable-next-line @next/next/no-img-element -- printed asset */}
        <img src="/brand/xoro-visuals-logo.png" alt="Xoro Visuals" width={110} height={110} className={styles.logo} />
        <div className={styles.titleBlock}>
          <p className={styles.kicker}>AI creative production</p>
          <h1 className={styles.title}>
            Rate <span className="grad-text">card</span>
          </h1>
          <p className={styles.sub}>Ideas into images. Images into films.</p>
        </div>
      </header>

      <PriceTiers print />

      <footer className={styles.foot}>
        <p>
          50% advance to begin, balance before final delivery. One round of minor revisions included. Full terms on
          the Pricing page{publicHost ? ` at ${publicHost}/pricing` : ""}.
        </p>
        <p className={styles.contact}>
          {publicHost && <span className="grad-text">{publicHost}</span>}
          {site.contactEmail && <span>{site.contactEmail}</span>}
        </p>
      </footer>
    </article>
  );
}
