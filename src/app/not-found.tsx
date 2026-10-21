import Link from "next/link";
import layout from "@/components/layout.module.css";
import { MotionRoot } from "@/components/MotionRoot";

export default function NotFound() {
  return (
    <section className={`wrap ${layout.intro}`} style={{ minHeight: "70vh" }}>
      <p className="label">404 · Frame not found</p>
      <h1 className={layout.introTitle}>
        This shot didn&rsquo;t
        <br />
        <span className="italic">make the final cut.</span>
      </h1>
      <p className="lead muted">The page may have moved. The work and the way in are below.</p>
      <p style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/work" className="btn btn-primary">
          See the work
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back to home
        </Link>
      </p>
      <MotionRoot />
    </section>
  );
}
