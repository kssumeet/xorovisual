"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroReel } from "@/content/projects";
import { gsap, SplitText, useGSAP, EASE, motionEnabled } from "@/lib/gsap";
import { HeroParticles } from "./HeroParticles";
import styles from "./ShowreelHero.module.css";

const FPS = 24;
const INTRO_KEY = "xv-intro-played";

function timecode(seconds: number) {
  const f = Math.floor(seconds * FPS);
  const s = Math.floor(f / FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % FPS)}`;
}

function introPlayed() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Decided once per page load, not per effect run: React may run effects twice
 * in development, and Next re-runs them when a hidden route is shown again.
 */
let introState: "unknown" | "full" | "done" = "unknown";

function markIntroPlayed() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage can be unavailable; the full intro just plays again */
  }
}

/**
 * Full-screen showreel with a motion-graphics opening:
 * the logo's X blades draw across black, the black shatters along the X to
 * reveal the reel, the title flips and decodes in, and a camera HUD settles.
 * The full intro plays once per visit; reduced motion gets a static hero.
 */
export function ShowreelHero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.play().catch(() => setPlaying(false));
    }
  }, []);

  // HUD timecode follows the reel, ticking only while it plays.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      if (videoRef.current && tcRef.current) tcRef.current.textContent = timecode(videoRef.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const q = gsap.utils.selector(root);
      if (introState === "unknown") {
        introState = introPlayed() ? "done" : "full";
        markIntroPlayed();
      }
      const full = introState === "full";

      const split = SplitText.create(q("[data-line-one]"), { type: "words,chars", aria: "none" }); // words keep letters from wrapping mid-word
      const second = q("[data-line-two]")[0] as HTMLElement;
      const secondText = second.textContent ?? "";

      gsap.set(q("[data-hero-title]"), { autoAlpha: 1 });
      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        onComplete: () => {
          introState = "done";
        },
      });

      if (full) {
        // 1. The logo's X: two blades draw across the black.
        tl.set(q("[data-intro]"), { autoAlpha: 1 })
          .fromTo(q("[data-blade]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, ease: "power3.inOut", stagger: 0.12 })
          .to(q("[data-blades]"), { scale: 1.08, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, "+=0.05")
          // 2. The black shatters outward along the X.
          .to(q("[data-shard='top']"), { yPercent: -60, duration: 1, ease: "expo.inOut" }, "<0.1")
          .to(q("[data-shard='bottom']"), { yPercent: 60, duration: 1, ease: "expo.inOut" }, "<")
          .to(q("[data-shard='left']"), { xPercent: -60, duration: 1, ease: "expo.inOut" }, "<")
          .to(q("[data-shard='right']"), { xPercent: 60, duration: 1, ease: "expo.inOut" }, "<")
          .fromTo(q("[data-hero-media]"), { scale: 1.15, autoAlpha: 1 }, { scale: 1, duration: 1.6, ease: "expo.out" }, "<")
          .set(q("[data-intro]"), { autoAlpha: 0 });
      } else {
        tl.set(q("[data-intro]"), { autoAlpha: 0 }).fromTo(
          q("[data-hero-media]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: "power1.inOut" },
        );
      }

      // 3. Title: letters flip up in 3D, then the outlined line decodes.
      const titleAt = full ? "-=1.1" : 0.2;
      tl.fromTo(
        split.chars,
        { yPercent: 120, rotationX: -90, autoAlpha: 0 },
        { yPercent: 0, rotationX: 0, autoAlpha: 1, duration: 0.9, stagger: 0.025, transformOrigin: "50% 100% -20px" },
        titleAt,
      )
        .fromTo(second, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, "<0.35")
        .to(second, { duration: 1.1, scrambleText: { text: secondText, chars: "XOR01VISUAL▮▯", speed: 0.6, revealDelay: 0.25 } }, "<")
        .fromTo(q("[data-hero-fade]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 }, "<0.3")
        // 4. Camera HUD: brackets draw from each corner, labels decode.
        .fromTo(q("[data-bracket]"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.05 }, "<0.1")
        .fromTo(q("[data-hud] [data-decode]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: 0.1 }, "<")
        .call(() => {
          q("[data-hud] [data-decode]").forEach((el: HTMLElement) =>
            gsap.to(el, { duration: 0.8, scrambleText: { text: el.dataset.decode ?? "", chars: "01", speed: 0.5 } }),
          );
        });

      // Pointer: the title tilts toward the cursor (fine pointers only).
      let removePointer = () => {};
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const title = q("[data-hero-title]")[0];
        gsap.set(title, { transformPerspective: 1100 });
        const rx = gsap.quickTo(title, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(title, "rotationY", { duration: 0.8, ease: "power3" });
        const move = (e: PointerEvent) => {
          ry(((e.clientX / window.innerWidth) - 0.5) * 8);
          rx(-((e.clientY / window.innerHeight) - 0.5) * 6);
        };
        const el = root.current!;
        el.addEventListener("pointermove", move);
        removePointer = () => el.removeEventListener("pointermove", move);
      }

      // Scroll: the two title lines split apart; footage drifts.
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.3 };
      gsap.to(q("[data-line-one-wrap]"), { xPercent: -18, ease: "none", scrollTrigger: scrub });
      gsap.to(q("[data-line-two-wrap]"), { xPercent: 18, ease: "none", scrollTrigger: scrub });
      gsap.to(q("[data-hero-copy]"), {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "15% top", end: "60% top", scrub: true },
      });
      gsap.to(q("[data-hero-media]"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      return () => {
        removePointer();
        split.revert();
      };
    },
    { scope: root },
  );

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const openReel = () => {
    videoRef.current?.pause();
    dialogRef.current?.showModal();
    playerRef.current?.play().catch(() => {});
  };

  const closeReel = () => {
    playerRef.current?.pause();
    dialogRef.current?.close();
  };

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-title" data-motion-owner>
      <div className={styles.stage}>
        <div className={styles.media} data-hero-media>
          <Image src={heroReel.poster} alt="" fill sizes="100vw" preload className={styles.fill} />
          <video
            ref={videoRef}
            className={styles.fill}
            src={heroReel.preview}
            poster={heroReel.poster}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>
        <div className={styles.shade} aria-hidden="true" />
        <HeroParticles />

        {/* Camera HUD */}
        <div className={styles.hud} data-hud aria-hidden="true">
          <span className={styles.bracket} data-bracket data-corner="tl" />
          <span className={styles.bracket} data-bracket data-corner="tr" />
          <span className={styles.bracket} data-bracket data-corner="bl" />
          <span className={styles.bracket} data-bracket data-corner="br" />
          <span className={styles.rec} data-decode="REC">
            REC
          </span>
          <span className={styles.tc}>
            <span ref={tcRef}>00:00:00:00</span>
          </span>
          <span className={styles.spec} data-decode="4K · 24 FPS · AI + LIVE ACTION">
            4K · 24 FPS · AI + LIVE ACTION
          </span>
        </div>

        <div className={`wrap ${styles.copy}`} data-hero-copy>
          <p className={`label ${styles.kicker}`} data-hero-fade>
            AI-generated video · Commercials · Editing · Motion
          </p>
          <h1 id="hero-title" className={styles.title} data-hero-title>
            <span className="visually-hidden">Ideas into images. Images into films.</span>
            <span aria-hidden="true">
              <span className={styles.line} data-line-one-wrap>
                <span data-line-one>Ideas into images.</span>
              </span>
              <span className={styles.line} data-line-two-wrap>
                <span className={`italic ${styles.sweep}`} data-line-two>
                  Images into films.
                </span>
              </span>
            </span>
          </h1>
          <div className={styles.actions} data-hero-fade>
            <button type="button" className={styles.watch} onClick={openReel}>
              <span className={styles.play} aria-hidden="true" />
              Watch reel
            </button>
            <Link href="/contact" className="btn btn-primary">
              Start a Project <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className={styles.corner} data-hero-fade>
          <button type="button" className={styles.pause} onClick={toggle}>
            {playing ? "Pause" : "Play"} background
          </button>
          <span className="label">Scroll</span>
        </div>

        {/* Opening: the logo's X draws, then the black shatters along it. */}
        <div className={styles.intro} data-intro aria-hidden="true">
          <span className={styles.shard} data-shard="top" />
          <span className={styles.shard} data-shard="right" />
          <span className={styles.shard} data-shard="bottom" />
          <span className={styles.shard} data-shard="left" />
          <svg className={styles.blades} data-blades viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="xv-blade" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#22d3ff" />
                <stop offset="0.5" stopColor="#4f8bff" />
                <stop offset="1" stopColor="#9b7bff" />
              </linearGradient>
            </defs>
            <path data-blade d="M330 150 C 620 380, 980 560, 1300 760" stroke="url(#xv-blade)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path data-blade d="M1320 130 C 1000 380, 640 580, 260 790" stroke="url(#xv-blade)" strokeWidth="10" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      <dialog ref={dialogRef} className={styles.dialog} aria-label="Showreel" onClose={() => playerRef.current?.pause()}>
        <button type="button" className={styles.close} onClick={closeReel}>
          Close
        </button>
        <video
          ref={playerRef}
          className={styles.player}
          src={heroReel.film ?? heroReel.preview}
          poster={heroReel.poster}
          controls
          playsInline
          preload="none"
        />
      </dialog>
    </section>
  );
}
