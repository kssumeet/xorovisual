#!/usr/bin/env bash
# Builds the site's media from licensed stock clips in raw/stock/ (Mixkit Free License).
# These are PLACEHOLDERS standing in for real Xoro Visuals work.
#   public/media/work/<name>.mp4|.jpg  seamless muted preview loop + poster
#   public/media/reel.mp4|.jpg         16:9 showreel montage
# Usage: npm run media:stock
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=raw/stock
OUT=public/media/work
mkdir -p "$OUT"
LOOP=8     # seconds of loop
XF=1       # seconds crossfaded from the tail back into the head

# name         clip   start  width height
PIECES=(
  "golden-hour  35540  2   1280 720"
  "afterglow    11942  4   1280 720"
  "spectrum     51280  3   1280 720"
  "neon-vision  50460  1   720  1280"
  "blue-study   51273  3   720  1280"
  "vapour       50951  2   1280 720"
  "combustion   52299  4   1280 720"
  "undertow     48525  5   1600 670"
  "night-rain   4331   2   1280 720"
)

fit() { # cover-crop to WxH
  echo "scale=${1}:${2}:force_original_aspect_ratio=increase:flags=lanczos,crop=${1}:${2},setsar=1,fps=24"
}

for row in "${PIECES[@]}"; do
  read -r name clip start w h <<<"$row"
  echo "→ $name"
  # Seamless loop: body = [start+XF, start+LOOP]; its last XF seconds fade into
  # head = [start, start+XF], whose final frame is exactly where body begins.
  ffmpeg -v error -y -i "$SRC/$clip.mp4" -filter_complex "\
[0:v]$(fit "$w" "$h"),split[a][b];\
[a]trim=start=$((start + XF)):end=$((start + LOOP)),setpts=PTS-STARTPTS[body];\
[b]trim=start=$start:end=$((start + XF)),setpts=PTS-STARTPTS[head];\
[body][head]xfade=transition=fade:duration=$XF:offset=$((LOOP - XF - XF)),format=yuv420p[v]" \
    -map "[v]" -an -c:v libx264 -preset slow -crf 25 -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -i "$OUT/$name.mp4" -frames:v 1 -q:v 3 "$OUT/$name.jpg"
done

# Showreel: quick cuts with short dissolves, fading up from and down to black.
echo "→ reel"
REEL=(
  "35540 3"
  "11942 6"
  "50951 3"
  "48525 8"
  "4331  3"
  "51280 4"
  "52299 6"
  "48509 3"
)
CUT=2.4
DIS=0.4
inputs=()
chains=""
i=0
for row in "${REEL[@]}"; do
  read -r clip start <<<"$row"
  inputs+=(-ss "$start" -t "$CUT" -i "$SRC/$clip.mp4")
  chains+="[$i:v]$(fit 1920 1080),setpts=PTS-STARTPTS[c$i];"
  i=$((i + 1))
done
prev="[c0]"
offset=0
for j in $(seq 1 $((${#REEL[@]} - 1))); do
  offset=$(echo "$offset + $CUT - $DIS" | bc)
  chains+="${prev}[c$j]xfade=transition=fade:duration=$DIS:offset=$offset[x$j];"
  prev="[x$j]"
done
total=$(echo "$offset + $CUT" | bc)
chains+="${prev}fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$total - 0.5" | bc):d=0.5,format=yuv420p[v]"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$chains" -map "[v]" -an \
  -c:v libx264 -preset slow -crf 23 -movflags +faststart public/media/reel.mp4
ffmpeg -v error -y -ss 1.2 -i public/media/reel.mp4 -frames:v 1 -q:v 3 public/media/reel.jpg

ls -la "$OUT" public/media/reel.*
