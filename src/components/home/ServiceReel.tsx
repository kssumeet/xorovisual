"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Project } from "@/content/projects";
import type { Service } from "@/content/services";
import { gsap, useGSAP, motionEnabled } from "@/lib/gsap";
import styles from "./ServiceReel.module.css";

type Props = { services: Service[]; images: Project[] };

/** Big service names; on desktop a still floats with the pointer as you hover each one. */
export function ServiceReel({ services, images }: Props) {
  const root = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!motionEnabled() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const el = float.current!;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`wrap ${styles.section}`} aria-labelledby="services-title">
      <div className={styles.head}>
        <h2 id="services-title" className={styles.heading} data-mask>
          <span>What we</span>
          <span className="italic">make</span>
        </h2>
        <Link href="/services" className="link">
          Services &amp; formats
        </Link>
      </div>

      <ul className={styles.list} onPointerLeave={() => setActive(null)}>
        {services.map((s, i) => (
          <li key={s.slug} data-reveal>
            <Link
              href={`/services#${s.slug}`}
              className={styles.row}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className={styles.name}>{s.name}</span>
              <span className={styles.outcome}>{s.outcome}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div ref={float} className={styles.float} data-on={active !== null} aria-hidden="true">
        {images.map((p, i) => (
          <Image
            key={p.slug}
            src={p.media.poster}
            alt=""
            width={p.media.width}
            height={p.media.height}
            sizes="320px"
            className={styles.floatImg}
            data-on={active !== null && i === active % images.length}
          />
        ))}
      </div>
    </section>
  );
}
