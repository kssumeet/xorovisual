"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/content/projects";
import { gsap, useGSAP, motionEnabled } from "@/lib/gsap";
import styles from "./ZoomFrame.module.css";

const formats = ["2.39:1 Cinema", "16:9 Web & TV", "9:16 Reels & Shorts", "4:5 Feed", "1:1 Square"];

/**
 * A small frame in the dark grows until it fills the screen, scrubbed to scroll.
 * Without motion it is simply a full-width frame.
 */
export function ZoomFrame({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const video = root.current!.querySelector("video")!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", pin: true, scrub: 0.25 },
      });
      // The loop plays only while the section is on screen.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? video.play().catch(() => {}) : video.pause()),
        },
      });
      tl.fromTo(
        "[data-zoom-frame]",
        { clipPath: "inset(30% 34% 30% 34% round 8px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut" },
      )
        .fromTo("[data-zoom-media]", { scale: 1.15 }, { scale: 1, ease: "power2.inOut" }, 0)
        .fromTo("[data-zoom-copy]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.4 }, 0.6);
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} aria-labelledby="zoom-title" data-motion-owner>
      <div className={styles.frame} data-zoom-frame>
        <div className={styles.media} data-zoom-media>
          <Image src={project.media.poster} alt="" fill sizes="100vw" className={styles.fill} />
          <video
            className={styles.fill}
            src={project.media.preview}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <div className={styles.shade} aria-hidden="true" />
      </div>
      <div className={`wrap ${styles.copy}`} data-zoom-copy>
        <h2 id="zoom-title" className={styles.heading}>
          One idea.
          <br />
          <span className="italic">Every screen.</span>
        </h2>
        <ul className={styles.formats}>
          {formats.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
