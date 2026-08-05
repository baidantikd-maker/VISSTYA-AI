import { cn } from "@/lib/utils";
import { FileUp, ImagePlus, Link2, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import type { MediaInfo } from "@/mock/types";
import { MediaPreview } from "./MediaPreview";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime";

function isVideoFile(name: string): boolean {
  return /\.(mp4|mov|webm|mkv)$/i.test(name);
}

export function UploadDropzone({
  value,
  onChange,
}: {
  value: MediaInfo | null;
  onChange: (media: MediaInfo | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const readFile = (file: File) => {
    const kind = isVideoFile(file.name) ? "video" : "image";
    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        url: String(reader.result),
        kind,
        fileName: file.name,
        mime: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const looksVideo = /\.(mp4|mov|webm|m3u8)(\?|$)/i.test(trimmed);
    onChange({ url: trimmed, kind: looksVideo ? "video" : "image" });
    setUrlInput("");
    setShowUrl(false);
  };

  if (value) {
    return (
      <div className="relative">
        <MediaPreview media={value} size="lg" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="truncate text-xs text-[hsl(var(--muted))]">
            {value.fileName ?? "Media from URL"} · {value.kind}
          </p>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[hsl(var(--border))] px-2.5 py-1 text-xs text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--secondary))]"
          >
            <X className="size-3.5" />
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload media"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors",
          dragOver
            ? "border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))]"
            : "border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))/40] hover:bg-[hsl(var(--secondary))/30]"
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <ImagePlus className="size-5 text-[hsl(var(--foreground))]" strokeWidth={1.5} />
        </span>
        <p className="mt-4 text-sm font-medium text-[hsl(var(--foreground))]">
          Drop media here, or <span className="underline underline-offset-4">browse</span>
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--muted))]">
          JPG, PNG, WEBP, GIF, MP4, MOV · up to 100 MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
          e.target.value = "";
        }}
      />

      <div className="mt-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-[hsl(var(--border))]" />
        <span className="text-xs text-[hsl(var(--muted))]">or</span>
        <div className="h-px flex-1 bg-[hsl(var(--border))]" />
      </div>

      <div className="mt-3">
        {showUrl ? (
          <div className="flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyUrl();
              }}
              placeholder="Paste a media URL…"
              className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm outline-none focus:border-[hsl(var(--foreground))]"
              autoFocus
            />
            <button
              type="button"
              onClick={applyUrl}
              className="shrink-0 rounded-md bg-[hsl(var(--primary))] px-4 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrl(true)}
            className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--foreground))]"
          >
            <Link2 className="size-4" />
            Paste a media URL instead
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
        <FileUp className="size-3.5" />
        Uploaded media is analyzed in your session and is not stored permanently.
      </div>
    </div>
  );
}
