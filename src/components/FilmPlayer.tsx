import type { Media } from "@/content/projects";
import { PreviewVideo } from "./PreviewVideo";

type Props = { media: Media; title: string };

/**
 * The full film, with native controls and sound, loads only when played.
 * Without a film file, falls back to the muted preview loop.
 */
export function FilmPlayer({ media, title }: Props) {
  if (!media.film) {
    return <PreviewVideo media={media} alt={`Still from ${title}`} sizes="100vw" preload />;
  }
  return (
    <video
      src={media.film}
      poster={media.poster}
      controls
      playsInline
      preload="none"
      aria-label={`${title}, full film`}
    />
  );
}
