"use client";

import Link from "next/link";
import { useRef } from "react";
import type { AspectRatio, Project } from "@/content/projects";
import { site } from "@/content/site";
import { gsap, useGSAP, motionEnabled } from "@/lib/gsap";
import { PreviewVideo } from "../PreviewVideo";
import styles from "./HorizontalGallery.module.css";

const ratio: Record<AspectRatio, number> = {
  "2.39:1": 2.39,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "4:5": 4 / 5,
  "1:1": 1,
};

/**
 * Desktop with motion: the section pins and vertical scroll drives the reel
 * sideways. Touch, narrow screens and reduced motion get a native swipe row.
 */
export function HorizontalGallery({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (hover: hover) and (pointer: fine)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-progress-bar]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        });

        // A "View" disc follows the pointer over the reel. Purely decorative:
        // every card is an ordinary link with its own focus state.
        const disc = cursor.current!;
        const xTo = gsap.quickTo(disc, "x", { duration: 0.45, ease: "power3" });
        const yTo = gsap.quickTo(disc, "y", { duration: 0.45, ease: "power3" });
        const move = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };
        const enter = () => gsap.to(disc, { scale: 1, autoAlpha: 1, duration: 0.35 });
        const leave = () => gsap.to(disc, { scale: 0.3, autoAlpha: 0, duration: 0.25 });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} aria-labelledby="reel-title" data-motion-owner>
      <div className={`wrap ${styles.head}`}>
        <h2 id="reel-title" className={styles.heading}>
          Selected <span className="italic">work</span>
        </h2>
        <Link href="/work" className="link">
          All work ({projects.length})
        </Link>
      </div>

      <ul ref={track} className={styles.track}>
        {projects.map((p, i) => {
          const href = p.caseStudy ? `/work/${p.slug}` : "/work";
          return (
            <li key={p.slug} className={styles.card} style={{ "--ratio": ratio[p.aspect] } as React.CSSProperties}>
              <Link href={href} className={styles.link} data-preview-host>
                <div className={styles.frame}>
                  <PreviewVideo media={p.media} alt={`Still from ${p.title}`} sizes="(min-width: 900px) 60vw, 80vw" />
                </div>
                <div className={styles.meta}>
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={styles.title}>{p.title}</h3>
                  <span className="label">
                    {p.category}
                    {p.placeholder && site.showPlaceholderNotice ? " · Stock placeholder" : ""}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={`wrap ${styles.progress}`} aria-hidden="true">
        <span data-progress-bar />
      </div>
      <div ref={cursor} className={styles.cursor} aria-hidden="true">
        View
      </div>
    </section>
  );
}
