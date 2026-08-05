import type { MediaInfo } from "@/mock/types";
import { cn } from "@/lib/utils";
import { FileImage, Play } from "lucide-react";
import { useState } from "react";

export function MediaPreview({
  media,
  className,
  size = "md",
}: {
  media: MediaInfo;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);

  const aspect =
    size === "sm"
      ? "aspect-[4/3]"
      : size === "lg"
        ? "aspect-video"
        : "aspect-[4/3] md:aspect-video";

  if (failed || (!media.url && !media.fileName)) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--secondary))/40]",
          aspect,
          className
        )}
      >
        <div className="text-center text-[hsl(var(--muted))]">
          <FileImage className="mx-auto size-8" strokeWidth={1.5} />
          <p className="mt-2 text-xs">Media preview unavailable</p>
        </div>
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))/40]",
          aspect,
          className
        )}
      >
        {media.url && !media.url.startsWith("data:") ? (
          <video
            src={media.url}
            poster={media.posterUrl}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-[hsl(var(--foreground))]">
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-14 items-center justify-center rounded-full border border-white/30 bg-white/10">
                <Play className="size-6 text-white" fill="white" />
              </span>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))/40]",
        aspect,
        className
      )}
    >
      <img
        src={media.url}
        alt={media.fileName ?? "Uploaded media"}
        onError={() => setFailed(true)}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
