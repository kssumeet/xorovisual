import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { process } from "@/content/process";
import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";
import { MotionRoot } from "@/components/MotionRoot";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell Xoro Visuals about your film, commercial, edit or agency partnership. We reply with an approach, timeline and fixed quote.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className={`paper ${styles.page}`}>
      <div className={`wrap ${styles.layout}`}>
        <header className={styles.aside}>
          <p className="label">Start a Project</p>
          <h1 className={styles.title} data-mask>
            <span>Tell us what</span>
            <span className="italic">you&rsquo;re imagining.</span>
          </h1>
          <p className="lead muted" data-reveal>
            A few lines is enough to begin. We&rsquo;ll come back with questions, an approach and a fixed quote.
          </p>
          <div className={styles.next} data-reveal>
            <p className="label">What happens next</p>
            <ol>
              <li>{process[0].summary}</li>
              <li>{process[0].youReceive}</li>
            </ol>
            <p className="muted">
              Agency with recurring work?{" "}
              <Link href="/agencies" className="link">
                See how partnerships work
              </Link>
              .
            </p>
            {site.contactEmail && (
              <p className="muted">
                Prefer email?{" "}
                <a href={`mailto:${site.contactEmail}`} className="link">
                  {site.contactEmail}
                </a>
              </p>
            )}
          </div>
        </header>
        <div className={styles.formCol}>
          <ContactForm />
        </div>
      </div>
      <MotionRoot />
    </div>
  );
}
