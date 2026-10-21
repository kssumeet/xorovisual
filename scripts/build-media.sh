#!/usr/bin/env bash
# Turns stills in raw/ into the site's moving media (requires ffmpeg and Python with Pillow):
#   public/media/work/<name>.mp4|.jpg  seamless camera-move loop + poster, per piece
#   public/media/reel.mp4|.jpg         16:9 showreel montage with crossfades
# Usage: npm run media   (re-run whenever raw/ changes)
set -euo pipefail
cd "$(dirname "$0")/.."

RAW=raw
OUT=public/media/work
KB="python3 scripts/kenburns.py"
mkdir -p "$OUT"

# name  width height  zoom  drift
PIECES=(
  "cliffs   1920 960  0.08  0.03"
  "perfume  1920 1080 0.10  0"
  "car      1920 1080 0.08 -0.04"
  "concert  1920 1080 0.10  0"
  "sneaker  1080 1080 0.10  0"
  "fashion  720  1280 0.08  0"
  "coffee   960  1200 0.10  0"
)

for row in "${PIECES[@]}"; do
  read -r name w h zoom drift <<<"$row"
  src="$RAW/$name.jpg"
  [ -f "$src" ] || { echo "missing $src — skipped"; continue; }
  echo "→ $name"
  # 10 s eased loop: the last frame meets the first, so hover previews never jump.
  $KB "$src" "$OUT/$name.mp4" "$w" "$h" 10 loop "$zoom" "$drift"
  ffmpeg -v error -y -i "$OUT/$name.mp4" -frames:v 1 -q:v 3 "$OUT/$name.jpg"
done

# Showreel: each piece reframed to 16:9 with a steady push, 3.2 s each, 0.8 s crossfades.
echo "→ reel"
TMP=$(mktemp -d)
order=(cliffs perfume car concert sneaker fashion coffee)
CLIP=3.2
FADE=0.8
inputs=()
for name in "${order[@]}"; do
  read -r _ _ _ zoom drift <<<"$(printf '%s\n' "${PIECES[@]}" | grep "^$name ")"
  $KB "$RAW/$name.jpg" "$TMP/$name.mp4" 1920 1080 "$CLIP" push "$zoom" "$drift"
  inputs+=(-i "$TMP/$name.mp4")
done
filter=""
prev="[0]"
offset=0
for i in $(seq 1 $((${#order[@]} - 1))); do
  offset=$(echo "$offset + $CLIP - $FADE" | bc)
  filter+="${prev}[$i]xfade=transition=fade:duration=${FADE}:offset=${offset}[v$i];"
  prev="[v$i]"
done
# Fade the last shot to black so the loop restarts from black, like a reel.
total=$(echo "$offset + $CLIP" | bc)
filter+="${prev}fade=t=out:st=$(echo "$total - 0.6" | bc):d=0.6,fade=t=in:st=0:d=0.6[out]"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$filter" -map "[out]" \
  -c:v libx264 -preset slow -crf 23 -movflags +faststart -an -pix_fmt yuv420p public/media/reel.mp4
ffmpeg -v error -y -ss 1 -i public/media/reel.mp4 -frames:v 1 -q:v 3 public/media/reel.jpg
rm -rf "$TMP"
ls -la "$OUT" public/media/reel.*
