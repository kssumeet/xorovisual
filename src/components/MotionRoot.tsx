"use client";

import { gsap, ScrollTrigger, useGSAP, EASE, motionEnabled, markMotionReady } from "@/lib/gsap";

/**
 * The site's single scroll-reveal system. Server-rendered markup opts in with:
 *   data-reveal        fade and rise once when it enters the viewport
 *   data-mask          each child line slides up from behind a mask
 *   data-reveal-clip   imagery wipes up from the bottom edge of its frame
 *   data-words         each child word brightens as the line scrolls through
 *   data-progress      a rule that draws itself down its parent as you scroll through it
 *   data-reveal-delay  optional delay in seconds
 * Render it inside each page (not a layout or template): it then hydrates in the
 * same pass as the markup it animates, so GSAP never touches unhydrated nodes.
 * Unmounting on navigation reverts every tween and ScrollTrigger it created.
 */
export function MotionRoot() {
  useGSAP(() => {
      markMotionReady();
      if (!motionEnabled()) return;

      // Skip owned regions and routes Next keeps mounted but hidden (display: none).
      const skip = (el: Element) => !!el.closest("[data-motion-owner]") || el.getClientRects().length === 0;
      const delayOf = (el: Element) => Number((el as HTMLElement).dataset.revealDelay ?? 0);

      gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
        if (skip(el)) return;
        gsap.fromTo(
          el.children,
          // y is reset too: GSAP would otherwise read the CSS pre-state as a pixel offset.
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            y: 0,
            duration: 1.1,
            ease: EASE.out,
            stagger: 0.08,
            delay: delayOf(el),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (skip(el)) return;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: EASE.out,
            delay: delayOf(el),
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-clip]").forEach((el) => {
        if (skip(el)) return;
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: EASE.inOut,
            delay: delayOf(el),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
        if (skip(el)) return;
        gsap.fromTo(
          el.children,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-progress]").forEach((el) => {
        if (skip(el)) return;
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
      });

      // Web fonts change line heights; re-measure trigger positions once they land.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
  );

  return null;
}
