"use client";

import { useEffect, useRef, useState } from "react";
import { getProject, type Project } from "@/content/projects";
import { gsap, motionEnabled } from "@/lib/gsap";
import styles from "./PromptToFilm.module.css";

const STEPS = 50;

const demos: { slug: string; prompt: string }[] = [
  { slug: "golden-hour", prompt: "white sports car on a coastal road at golden hour, low tracking shot, anamorphic, 4K" },
  { slug: "afterglow", prompt: "concert stage drenched in violet light, haze, crowd silhouettes, wide shot" },
  { slug: "undertow", prompt: "aerial top-down of surf breaking over black volcanic rock, slow motion" },
  { slug: "night-rain", prompt: "city street after rain at night, neon reflections on wet asphalt, cinematic" },
];

/**
 * Demonstrates the workflow: a prompt types out, then the frame resolves from
 * pixelated noise into footage, step by step, like a diffusion model denoising.
 * Runs only while on screen. Reduced motion shows the first result, still.
 */
export function PromptToFilm() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const promptRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "generating" | "done">("done");

  const items = demos
    .map((d) => ({ ...d, project: getProject(d.slug) }))
    .filter((d): d is typeof d & { project: Project } => Boolean(d.project));

  useEffect(() => {
    const section = root.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!section || !canvas || !video || items.length === 0) return;
    if (!motionEnabled()) return; // static first result, rendered below

    const ctx = canvas.getContext("2d")!;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d")!;
    // A tile of grain, reused at random offsets each frame.
    const noise = document.createElement("canvas");
    noise.width = noise.height = 192;
    const nctx = noise.getContext("2d")!;
    const img = nctx.createImageData(192, 192);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v * 0.55;
      img.data[i + 1] = v * 0.75;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    nctx.putImageData(img, 0, 0);

    const state = { p: 0 };
    let raf = 0;
    let active = false;
    let cycle: gsap.core.Timeline | null = null;
    let current = 0;

    const draw = () => {
      const w = (canvas.width = canvas.clientWidth);
      const h = (canvas.height = canvas.clientHeight);
      const p = state.p;
      // Resolution climbs from coarse blocks to full detail as denoising proceeds.
      const block = Math.max(1, Math.round(56 * Math.pow(1 - p, 2.2)));
      small.width = Math.max(1, Math.round(w / block));
      small.height = Math.max(1, Math.round(h / block));
      if (video.readyState >= 2) sctx.drawImage(video, 0, 0, small.width, small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, w, h);
      // Latent tint and grain fade out together.
      ctx.globalAlpha = (1 - p) * 0.55;
      ctx.fillStyle = "#1b2a6b";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = (1 - p) * 0.85;
      const ox = Math.random() * 192;
      const oy = Math.random() * 192;
      ctx.globalCompositeOperation = "screen";
      for (let x = -ox; x < w; x += 192) for (let y = -oy; y < h; y += 192) ctx.drawImage(noise, x, y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (stepRef.current) stepRef.current.textContent = String(Math.round(p * STEPS)).padStart(2, "0");
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const runDemo = (i: number) => {
      current = i;
      setIndex(i);
      const item = items[i];
      video.src = item.project.media.preview;
      video.play().catch(() => {});
      state.p = 0;
      canvas.style.opacity = "1";
      // The frame sits in pure latent noise while the prompt is read.
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
      const typed = { n: 0 };
      cycle?.kill();
      cycle = gsap
        .timeline({ onComplete: () => runDemo((current + 1) % items.length) })
        .call(() => setPhase("typing"))
        .to(typed, {
          n: item.prompt.length,
          duration: item.prompt.length * 0.028,
          ease: "none",
          onUpdate: () => {
            if (promptRef.current) promptRef.current.textContent = item.prompt.slice(0, Math.round(typed.n));
          },
        })
        .call(() => setPhase("generating"))
        .to(state, { p: 1, duration: 2.6, ease: "power2.inOut" })
        .call(() => {
          cancelAnimationFrame(raf); // the finished film plays as plain video
          canvas.style.opacity = "0";
          setPhase("done");
        })
        .to({}, { duration: 3.2 });
    };

    const start = () => {
      if (active) return;
      active = true;
      if (cycle) {
        cycle.resume();
        if (canvas.style.opacity !== "0") raf = requestAnimationFrame(loop);
      } else runDemo(0);
      video.play().catch(() => {});
    };
    const stop = () => {
      active = false;
      cycle?.pause();
      cancelAnimationFrame(raf);
      video.pause();
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.35 });
    io.observe(section);
    return () => {
      io.disconnect();
      stop();
      cycle?.kill();
    };
    // items derive from static content; run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = items[index] ?? items[0];
  if (!shown) return null;

  return (
    <section ref={root} className={`wrap ${styles.section}`} aria-labelledby="ptf-title">
      <div className={styles.head}>
        <p className="label">How AI films are made here</p>
        <h2 id="ptf-title" className={styles.heading} data-mask>
          <span>Type an idea.</span>
          <span className="italic">Get a film.</span>
        </h2>
        <p className={`lead ${styles.lead}`} data-reveal>
          We direct generative models shot by shot, then edit, grade and finish every frame by hand.
        </p>
      </div>

      <div className={styles.console} data-reveal>
        <div className={styles.prompt} aria-hidden="true">
          <span className={styles.promptLabel}>Prompt</span>
          <span className={styles.promptText}>
            <span ref={promptRef}>{shown.prompt}</span>
            <span className={styles.caret} data-on={phase === "typing"} />
          </span>
        </div>

        <div className={styles.frame}>
          <video
            ref={videoRef}
            className={styles.video}
            src={shown.project.media.preview}
            poster={shown.project.media.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          <div className={styles.status} aria-hidden="true">
            <span className={styles.state} data-phase={phase}>
              {phase === "typing" ? "Reading prompt" : phase === "generating" ? "Generating" : "Rendered"}
            </span>
            <span>
              Step <span ref={stepRef}>{STEPS}</span>/{STEPS}
            </span>
          </div>
          <span className={styles.bar} aria-hidden="true">
            <span ref={barRef} />
          </span>
        </div>

        <p className={styles.meta}>
          <span>
            {shown.project.title} · {shown.project.aspect} · 4K
          </span>
          <span className={styles.note}>Workflow demonstration. Footage shown is licensed stock, not Xoro work.</span>
        </p>
      </div>
    </section>
  );
}
