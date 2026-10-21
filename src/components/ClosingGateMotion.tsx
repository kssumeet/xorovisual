"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionEnabled } from "@/lib/gsap";

/** The background reel plays only while on screen; the title rises into place once. */
export function ClosingGateMotion() {
  // A ref, not an id: Next keeps visited routes mounted but hidden.
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!motionEnabled()) return;
    const section = anchor.current?.closest("section");
    const video = section?.querySelector("video");
    const title = section?.querySelector("[data-closing-title]");
    if (!section || !video || !title) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? video.play().catch(() => {}) : video.pause()),
      },
    });
    // Title lines rise once from behind a mask; no scaling text against the scroll.
    gsap.fromTo(
      title.querySelectorAll(":scope > span"),
      { yPercent: 105 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      },
    );
  });

  return <span ref={anchor} hidden />;
}
