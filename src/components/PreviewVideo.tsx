"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/content/projects";

// Only one preview plays at a time across the whole page.
let current: HTMLVideoElement | null = null;

function playExclusive(video: HTMLVideoElement) {
  if (current && current !== video) current.pause();
  current = video;
  video.play().catch(() => {
    /* Autoplay can be refused (data saver, low power). The poster stays. */
  });
}

type Props = {
  media: Media;
  alt: string;
  sizes: string;
  preload?: boolean;
};

/**
 * Poster first; the muted loop is fetched only when the visitor shows intent.
 * Pointer devices: hover or keyboard focus on the nearest [data-preview-host].
 * Touch devices: whichever preview sits in the middle of the viewport.
 * Reduced motion: poster only.
 */
export function PreviewVideo({ media, alt, sizes, preload }: Props) {
  const preview = media.preview;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = (video.closest("[data-preview-host]") as HTMLElement | null) ?? video.parentElement!;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const start = () => {
      if (!video.getAttribute("src")) video.src = preview;
      playExclusive(video);
    };
    const stop = () => video.pause();

    if (finePointer) {
      host.addEventListener("pointerenter", start);
      host.addEventListener("pointerleave", stop);
      host.addEventListener("focusin", start);
      host.addEventListener("focusout", stop);
      return () => {
        host.removeEventListener("pointerenter", start);
        host.removeEventListener("pointerleave", stop);
        host.removeEventListener("focusin", start);
        host.removeEventListener("focusout", stop);
        stop();
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "-40% 0px -40% 0px" },
    );
    io.observe(host);
    return () => {
      io.disconnect();
      stop();
    };
  }, [preview]);

  return (
    <>
      <Image
        src={media.poster}
        alt={alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        preload={preload}
      />
      {!failed && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          style={{
            opacity: playing ? 1 : 0,
            transition: "opacity 600ms var(--ease-out)",
          }}
        />
      )}
    </>
  );
}
