"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, useGSAP);

export const EASE = {
  out: "expo.out",
  inOut: "power3.inOut",
} as const;

/** True only when the inline boot script enabled motion (JS on, no reduced-motion preference). */
export function motionEnabled() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("motion");
}

/** Tells the failsafe in layout.tsx that the animation runtime started. */
export function markMotionReady() {
  (window as Window & { __xvMotionReady?: boolean }).__xvMotionReady = true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
