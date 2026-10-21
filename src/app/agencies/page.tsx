import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { ClosingGate } from "@/components/ClosingGate";
import layout from "@/components/layout.module.css";
import styles from "./agencies.module.css";
import { MotionRoot } from "@/components/MotionRoot";

export const metadata: Metadata = {
  title: "For Agencies",
  description:
    "White-label video production, overflow editing and recurring production retainers for marketing and creative agencies.",
  alternates: { canonical: "/agencies" },
};

const models = [
  {
    name: "White-label production",
    body: "We produce; you present. Files carry your naming and nothing of ours. Client contact stays with you unless you'd rather bring us into the room.",
  },
  {
    name: "Overflow editing",
    body: "When a launch lands on top of a pitch, send the rushes and the brief. We match your house style and hand back project files your editors can open.",
  },
  {
    name: "Recurring production",
    body: "A monthly allocation of edits, ad variations or films, booked ahead so your clients see consistent turnaround.",
  },
  {
    name: "Campaign creative",
    body: "Concept, treatment, hero film and every cut-down from one creative direction, built to slot into your media plan.",
  },
  {
    name: "AI-assisted production",
    body: "Mood films for pitches, previsualisation and generated sequences where a shoot isn't practical. Always finished by a human edit and grade.",
  },
];

const start = [
  {
    step: "A call",
    body: "Thirty minutes on your clients, volumes, formats and how you review work.",
  },
  {
    step: "A first project",
    body: "One real brief, quoted and delivered at normal rates, so you can judge the work and the workflow.",
  },
  {
    step: "A monthly allocation",
    body: "If it fits, we agree a recurring scope, turnaround and review rhythm, reviewed each quarter.",
  },
];

export default function AgenciesPage() {
  return (
    <>
      <PageIntro label="For agencies" title={["A production partner", "that works under your name."]}>
        <p>
          For marketing and creative agencies that need reliable video capacity: for one campaign, for overflow,
          or every month.
        </p>
      </PageIntro>

      <div className="wrap">
        <section className={layout.split} aria-labelledby="models-title">
          <div className={layout.splitHead}>
            <h2 id="models-title" className={layout.splitTitle} data-reveal>
              Ways to work together
            </h2>
          </div>
          <ul className={`${layout.splitBody} ${layout.ruled}`}>
            {models.map((m) => (
              <li key={m.name} data-reveal>
                <strong>{m.name}</strong>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="paper section" aria-labelledby="start-title">
        <div className="wrap">
          <p className="label">Getting started</p>
          <h2 id="start-title" className={styles.heading} data-mask>
            <span>Three steps</span>
            <span className="italic">to a retained partnership.</span>
          </h2>
          <ol className={styles.steps}>
            {start.map((s, i) => (
              <li key={s.step} data-reveal data-reveal-delay={i * 0.08}>
                <p className="label">
                  Step {i + 1} of {start.length}
                </p>
                <h3 className={styles.stepName}>{s.step}</h3>
                <p className="muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className={styles.ctas} data-reveal>
            <Link href="/contact?type=agency" className="btn btn-primary">
              Request an agency quote <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/pricing" className="btn btn-ghost">
              How quotes are scoped
            </Link>
          </div>
        </div>
      </section>

      <ClosingGate
        heading={["Have a client brief", "that needs a film?"]}
        text="Send it over. We'll reply with an approach, timeline and quote."
        secondary={{ label: "See the work", href: "/work" }}
      />
      <MotionRoot />
    </>
  );
}
