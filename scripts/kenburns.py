#!/usr/bin/env python3
"""Smooth camera-push render of a still, piped to ffmpeg as H.264.

ffmpeg's zoompan rounds its crop to whole pixels, which judders. This renders
each frame with a sub-pixel affine transform instead.

  loop mode:  eased push in and back out, so the last frame meets the first
              (seamless for looping previews)
  push mode:  steady one-way push, for cutting into the showreel

usage: kenburns.py IN OUT WIDTH HEIGHT SECONDS {loop,push} [ZOOM] [DRIFT]
"""
import math
import subprocess
import sys

from PIL import Image

FPS = 24


def main() -> None:
    src, out, w, h, secs, mode = sys.argv[1:7]
    w, h, secs = int(w), int(h), float(secs)
    zoom = float(sys.argv[7]) if len(sys.argv) > 7 else 0.10
    drift = float(sys.argv[8]) if len(sys.argv) > 8 else 0.0  # fraction of width

    img = Image.open(src).convert("RGB")
    # Cover the frame once at 1.5x so every transformed frame samples real pixels.
    cover = max(w / img.width, h / img.height) * 1.5
    base = img.resize((round(img.width * cover), round(img.height * cover)), Image.LANCZOS)
    bw, bh = base.size

    frames = round(secs * FPS)
    ff = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}",
         "-r", str(FPS), "-i", "-", "-vf", "noise=alls=4:allf=t,format=yuv420p",
         "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-movflags", "+faststart", "-an", out],
        stdin=subprocess.PIPE,
    )
    for i in range(frames):
        t = i / frames
        if mode == "loop":
            p = (1 - math.cos(2 * math.pi * t)) / 2  # 0 → 1 → 0, zero velocity at the seam
        else:
            p = t
        z = 1 + zoom * p
        # Visible window in base-image pixels, centred, drifting sideways.
        vw, vh = bw / 1.5 / z, bh / 1.5 / z
        cx = bw / 2 + drift * bw * (p - 0.5)
        cy = bh / 2
        x0, y0 = cx - vw / 2, cy - vh / 2
        sx, sy = vw / w, vh / h
        frame = base.transform((w, h), Image.AFFINE, (sx, 0, x0, 0, sy, y0), resample=Image.BICUBIC)
        ff.stdin.write(frame.tobytes())
    ff.stdin.close()
    if ff.wait() != 0:
        sys.exit("ffmpeg failed")


if __name__ == "__main__":
    main()
